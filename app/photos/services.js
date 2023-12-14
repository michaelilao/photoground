const fs = require('fs');
const db = require('../database');
const userScripts = require('../users/sql');
const photoScripts = require('./sql');
const { photoPath } = require('../config');
const { ensureExists } = require('../utils');
const { uploadStatus } = require('../utils/enums');

const getUserPhotoPath = (userId) => `${photoPath}/${userId}`;
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
    ensureExists(getUserPhotoPath(user.userId), (err) => {
      if (err) {
        throw new Error('Error occured during photo directory creation', err);
      }
    });

    return { error: false };
  } catch (err) {
    console.error(err);
    return { error: true, message: err.message, status: 500 };
  }
};

const createPhotoRecords = async (files, userId) => {
  const connection = await db();
  const batchId = crypto.randomUUID();

  await Promise.all(
    files.map(async (file) => {
      const photoType = file.mimetype;
      const name = file.originalname;
      const photoId = crypto.randomUUID();
      const { pending } = uploadStatus;

      console.log('starting', name);
      connection.run(photoScripts.insertPhotoRecord, [photoId, userId, name, photoType, pending, batchId], async (err) => {
        console.log('running', name);
        if (err) {
          console.error(err);
          return;
        }

        await fs.renameSync();
        console.log('f');
      });
    }),
  );

  return batchId;
};
module.exports = { createPhotosDirectory, createPhotoRecords };
