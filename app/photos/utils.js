const { ExifImage } = require('exif');
const { getAverageColor } = require('fast-average-color-node');
const { photoPath, maxImageHeight, maxImageWidth } = require('../config');

const getUserPhotoPath = (userId) => `${photoPath}/${userId}`;

// eslint-disable-next-line arrow-body-style
const getExifMetaData = (path) => {
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

const getAverageHex = async (path) => {
  try {
    const color = await getAverageColor(path);
    return color.hex;
  } catch (err) {
    return null;
  }
};

const scaleDimensions = (width, height) => {
  let scaledWidth;
  let scaledHeight;
  let scale;
  if (width > height) {
    // Landscape - make width smaller and scale height accordingly
    scale = maxImageWidth / width;
    scaledWidth = maxImageWidth;
    scaledHeight = Math.round(height * scale);
  } else if (width < height) {
    // Portrait - make height smaller and scale width accordingly
    scale = maxImageHeight / height;
    scaledHeight = maxImageHeight;
    scaledWidth = Math.round(width * scale);
  } else {
    // Square - make width, height smaller at same time
    scale = maxImageHeight / height;
    scaledHeight = maxImageHeight;
    scaledWidth = Math.round(width * scale);
  }

  return [scaledWidth, scaledHeight];
};

module.exports = {
  getUserPhotoPath,
  getExifMetaData,
  getAverageHex,
  scaleDimensions,
};
