const fs = require('fs');
const crypto = require('crypto');
const sharp = require('sharp');
const db = require('../database');
const userScripts = require('../users/sql');
const photoScripts = require('./sql');
const { getUserPhotoPath, getAverageHex, getExifMetaData, scaleDimensions } = require('./utils');
const { ensureExists, formatCoords, formatDate } = require('../utils');
const { uploadStatus } = require('../utils/enums');
const { photosSchema } = require('./models');

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
  files.forEach(async (file) => {
    const photoId = crypto.randomUUID();
    const photoType = file.mimetype;
    const name = file.originalname;
    const { pending } = uploadStatus;

    const currentPath = `${file.destination}/${file.filename}`;
    const newPath = `${getUserPhotoPath(userId)}/${photoId}`;

    try {
      await new Promise((resolve, reject) => {
        connection.run(photoScripts.insertPhoto, [photoId, userId, name, photoType, pending, batchId], (insertErr) => {
          if (insertErr) {
            reject(insertErr);
          }
          resolve(true);
        });
      });

      const photoData = {};
      const image = sharp(currentPath);
      const metaData = await image.metadata();
      const exifMetaData = await getExifMetaData(currentPath);
      const hex = await getAverageHex(currentPath);

      photoData.width = metaData.width;
      photoData.height = metaData.height;

      if (exifMetaData?.exif?.DateTimeOriginal) {
        photoData.dateOriginal = formatDate(exifMetaData?.exif?.DateTimeOriginal);
      }

      if (exifMetaData?.gps) {
        const { GPSLatitudeRef, GPSLatitude, GPSLongitudeRef, GPSLongitude } = exifMetaData.gps;
        const [latitude, longitude] = formatCoords(GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef);
        photoData.latitude = latitude;
        photoData.longitude = longitude;
      }

      if (hex) {
        photoData.hex = hex;
      }

      const [scaledWidth, scaledHeight] = scaleDimensions(photoData.width, photoData.height);

      await new Promise((resolve, reject) => {
        image
          .resize(scaledWidth, scaledHeight, { withoutEnlargement: true })
          .jpeg({ progressive: true, force: false, quality: 80 })
          .png({ progressive: true, force: false, quality: 80 })
          .toFile(newPath)
          .then(() => resolve(true))
          .catch((imageAlterErr) => reject(imageAlterErr));
      });

      const status = uploadStatus.complete;
      photoData.statusId = status;
      const fields = Object.keys(photoData).map((key) => photosSchema[key]);

      // Can do last two operations in parrallel
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
    } catch (photoErr) {
      console.error(photoErr);
      connection.run(photoScripts.updatePhoto([photosSchema.statusId]), [uploadStatus.error, photoId], (updateErr) => {
        if (updateErr) {
          console.error(updateErr);
        }
      });
    }
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

  if ('isFavourite' in options) {
    const intIsFavourite = options.isFavourite ? 1 : 0;
    connection.run(photoScripts.updatePhoto([photosSchema.isFavourite]), [intIsFavourite, photoId], (updateErr) => {
      if (updateErr) {
        console.error(updateErr);
      }
    });
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

const getPhotoCount = async (userId) => {
  const connection = await db();
  try {
    const numPhotos = await new Promise((resolve, reject) => {
      connection.get(photoScripts.getUserPhotoCount, [userId], async (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row['COUNT(*)']);
      });
    });
    return numPhotos;
  } catch (err) {
    console.error(err);
    return { error: true, message: 'error getting photo limits', status: 500 };
  }
};
module.exports = {
  createPhotosDirectory,
  createPhotoRecords,
  getPhotoBatchStatus,
  getUserPhotoPath,
  getPhotoList,
  deletePhotoRecord,
  modifyPhoto,
  getPhotoCount,
};
