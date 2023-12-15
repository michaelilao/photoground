const fs = require('fs');
const crypto = require('crypto');
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

  // Run this insertion and photo upload async in the background
  files.forEach(async (file) => {
    const photoType = file.mimetype;
    const name = file.originalname;
    const photoId = crypto.randomUUID();
    const { pending } = uploadStatus;

    connection.run(photoScripts.insertPhoto, [photoId, userId, name, photoType, pending, batchId], async (insertErr) => {
      if (insertErr) {
        console.error(insertErr);
        // THINK: How to handle insertion errors
        return;
      }

      const currentPath = `${file.destination}/${file.filename}`;
      const newPath = `${getUserPhotoPath(userId)}/${file.filename}`;

      // TODO: Compress photos and upload them to their user folder Async
      fs.rename(currentPath, newPath, (moveErr) => {
        let status = uploadStatus.complete;
        if (moveErr) {
          console.error(insertErr);
          status = uploadStatus.error;
        }

        connection.run(photoScripts.updatePhotoStatus, [status, photoId], (updateErr) => {
          if (updateErr) {
            console.error(updateErr);
          }
        });
      });
    });
  });

  return batchId;
};
module.exports = { createPhotosDirectory, createPhotoRecords };
