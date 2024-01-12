const fs = require('fs');
const crypto = require('crypto');
const sharp = require('sharp');
const { ExifImage } = require('exif');
const { getAverageColor } = require('fast-average-color-node');
const db = require('../database');
const userScripts = require('../users/sql');
const photoScripts = require('./sql');
const { photoPath, maxImageHeight, maxImageWidth } = require('../config');
const { ensureExists, formatCoords, formatDate } = require('../utils');
const { uploadStatus } = require('../utils/enums');
const { photosSchema } = require('./models');

const getUserPhotoPath = (userId) => `${photoPath}/${userId}`;
// eslint-disable-next-line arrow-body-style
const getPhotoMetaData = (path) => {
  return new Promise((resolve) => {
    try {
      ExifImage({ image: path }, (error, exifData) => {
        if (error) resolve(null);
        else resolve(exifData);
      });
    } catch (error) {
      resolve(null);
    }
  });
};

const getAverageColorSafe = async (path) => {
  try {
    const color = await getAverageColor(path);
    return color;
  } catch (err) {
    return null;
  }
};

const createPhotosDirectory = async (userId) => {
  try {
    const connection = await db();
    const user = await new Promise((resolve, reject) => {
      connection.get(userScripts.getUserById, [userId], async (err, row) => {
        if (err) {
          reject(err);
        }

        if (row && row?.userId) {
          return resolve(row);
        }

        return resolve(false);
      });
    });
    // Initialize files directory
    ensureExists(getUserPhotoPath(user.userId));

    return { error: false };
  } catch (err) {
    console.error(err);
    return { error: true, message: err.message, status: 500 };
  }
};

const createPhotoRecords = async (files, userId) => {
  const connection = await db();
  const batchId = crypto.randomUUID();

  // Run this insertion and photo upload async in the background
  files.forEach((file) => {
    const photoType = file.mimetype;
    const name = file.originalname;
    const photoId = crypto.randomUUID();
    const { pending } = uploadStatus;

    const currentPath = `${file.destination}/${file.filename}`;
    const newPath = `${getUserPhotoPath(userId)}/${photoId}`;

    connection.run(photoScripts.insertPhoto, [photoId, userId, name, photoType, pending, batchId], async (insertErr) => {
      if (insertErr) {
        console.error(insertErr);
        // THINK: How to handle insertion into db errors
        return;
      }
      const photoData = {};
      const image = sharp(currentPath);
      const metaData = await image.metadata();

      const exifMetaData = await getPhotoMetaData(currentPath);
      if (exifMetaData) {
        photoData.dateOriginal = formatDate(exifMetaData?.exif?.DateTimeOriginal);
        photoData.width = exifMetaData?.exif?.ExifImageWidth;
        photoData.height = exifMetaData?.exif?.ExifImageHeight;
      }

      if (!photoData.width || !photoData.height) {
        photoData.width = metaData.width;
        photoData.height = metaData.height;
      }

      if (exifMetaData?.gps) {
        const { GPSLatitudeRef, GPSLatitude, GPSLongitudeRef, GPSLongitude } = exifMetaData.gps;
        const [latitude, longitude] = formatCoords(GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef);
        photoData.latitude = latitude;
        photoData.longitude = longitude;
      }
      const hex = await getAverageColorSafe(currentPath);
      if (hex) {
        photoData.hex = hex.hex;
      }

      let scaledWidth;
      let scaledHeight;
      let scale;
      if (photoData.width > photoData.height) {
        // Landscape - make width smaller and scale height accordingly
        scale = maxImageWidth / photoData.width;
        scaledWidth = maxImageWidth;
        scaledHeight = Math.round(photoData.height * scale);
      } else if (photoData.width < photoData.height) {
        // Portrait - make height smaller and scale width accordingly
        scale = maxImageHeight / photoData.height;
        scaledHeight = maxImageHeight;
        scaledWidth = Math.round(photoData.width * scale);
      } else {
        // Square - make width, height smaller at same time
        scale = maxImageHeight / photoData.height;
        scaledHeight = maxImageHeight;
        scaledWidth = Math.round(photoData.width * scale);
      }

      image
        .resize(scaledWidth, scaledHeight, { withoutEnlargement: true })
        .jpeg({ progressive: true, force: false, quality: 80 })
        .png({ progressive: true, force: false, quality: 80 })
        .toFile(newPath)
        .then(() => {
          const status = uploadStatus.complete;
          photoData.statusId = status;
          const fields = Object.keys(photoData).map((key) => photosSchema[key]);

          fs.unlink(currentPath, (deleteErr) => {
            if (deleteErr) {
              console.error(deleteErr);
            }
          });

          connection.run(photoScripts.updatePhoto(fields), [...Object.values(photoData), photoId], (updateErr) => {
            if (updateErr) {
              console.error(updateErr);
            }
          });
        })
        .catch((photoErr) => {
          console.error(photoErr);
          connection.run(photoScripts.updatePhoto([photosSchema.statusId]), [uploadStatus.error, photoId], (updateErr) => {
            if (updateErr) {
              console.error(updateErr);
            }
          });
        });
    });
  });

  return batchId;
};

const getPhotoBatchStatus = async (batchId) => {
  try {
    const connection = await db();
    const photoBatch = await new Promise((resolve, reject) => {
      connection.all(photoScripts.getPhotosByBatchId, [batchId], (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
    return photoBatch;
  } catch (err) {
    console.error(err);
    return { error: true, message: err.code || err.message || err, status: 500 };
  }
};

const getPhotoList = async (userId, limit = 10, offset = 0, sort = 'asc', order = 'photoId') => {
  try {
    const connection = await db();
    const sortValidated = sort.toLowerCase() === 'asc' ? 'asc' : 'desc';
    const orderValidated = photosSchema[order] || 'photo_id';

    const photoList = await new Promise((resolve, reject) => {
      connection.all(photoScripts.getPhotoListByParams(sortValidated, orderValidated), [userId, limit, offset], (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
    return photoList.map((photo) => ({
      ...photo,
      src: `${process.env.API_PATH}/photos/${photo.photoId}`,
    }));
  } catch (err) {
    console.error(err);
    return { error: true, message: err.code || err.message || err, status: 500 };
  }
};

const deletePhotoRecord = async (userId, photoId) => {
  try {
    const connection = await db();
    const deleteStatus = await new Promise((resolve, reject) => {
      connection.run(photoScripts.deletePhotobyId, [userId, photoId], async function (err) {
        if (this.changes === 0) {
          resolve(false);
        }
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });

    if (deleteStatus) {
      return { error: false };
    }
    return { error: true, message: 'requested photo does not exist', status: 404 };
  } catch (err) {
    console.error(err);
    return { error: true, message: err.code || err.message || err, status: 500 };
  }
};
const modifyPhoto = async (userId, photoId, options) => {
  // get the photo and make sure it exists
  const connection = await db();

  const photoExists = await new Promise((resolve) => {
    connection.get(photoScripts.getPhotoById, [userId, photoId], (err, row) => {
      if (err) resolve(false);
      if (!row) resolve(false);
      resolve(true);
    });
  });

  if (!photoExists) {
    return { error: true, message: 'photo does not exist', status: 404 };
  }

  const path = `${getUserPhotoPath(userId)}/${photoId}`;
  let modifiedImage = sharp(path);
  if (options.rotate) {
    modifiedImage = modifiedImage.rotate(options.rotate);
  }

  return modifiedImage.toBuffer((bufferErr, buffer) => {
    if (bufferErr) {
      return { error: true, message: 'error updating photo', status: 500 };
    }
    return fs.writeFile(path, buffer, (writeErr) => {
      if (writeErr) {
        return { error: true, message: 'error updating photo', status: 500 };
      }
      return { error: false };
    });
  });
};

module.exports = {
  createPhotosDirectory,
  createPhotoRecords,
  getPhotoBatchStatus,
  getUserPhotoPath,
  getPhotoList,
  deletePhotoRecord,
  modifyPhoto,
};
