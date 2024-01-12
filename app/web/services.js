const fs = require('fs');
const { getAverageColor } = require('fast-average-color-node');

const publicFolder = './public/images';

const getStaticPhotos = async () => {
  const photos = await new Promise((resolve) => {
    fs.readdir(publicFolder, (err, files) => {
      if (err) {
        resolve([]);
      }

      const formattedPhotos = Promise.all(
        files.map(async (file) => ({
          photoId: file,
          hex: (await getAverageColor(`${publicFolder}/${file}`)).hex,
          src: `images/${file}`,
        }))
      );

      resolve(formattedPhotos);
    });
  });

  return photos;
};

module.exports = { getStaticPhotos };
