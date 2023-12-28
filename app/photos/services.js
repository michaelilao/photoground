const fs = require('fs');
const crypto = require('crypto');
const db = require('../database');
const userScripts = require('../users/sql');
const photoScripts = require('./sql');
const { photoPath } = require('../config');
const { ensureExists } = require('../utils');
const { uploadStatus } = require('../utils/enums');
const { photosSchema } = require('./models');

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
    const photoId = file.filename;
    const { pending } = uploadStatus;

    connection.run(photoScripts.insertPhoto, [photoId, userId, name, photoType, pending, batchId], async (insertErr) => {
      if (insertErr) {
        console.error(insertErr);
        // THINK: How to handle insertion into db errors
        return;
      }

      const currentPath = `${file.destination}/${file.filename}`;
      const newPath = `${getUserPhotoPath(userId)}/${file.filename}`;

      // TODO: Compress photos and upload them to their user folder Async

      // Move photos from raw to user photo path
      fs.rename(currentPath, newPath, (moveErr) => {
        let status = uploadStatus.complete;
        if (moveErr) {
          console.error(insertErr);
          status = uploadStatus.error;
        }

        // Update status of each record
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

const getPhotoList = async (userId, limit = 10, offset = 0, sort = 'asc', order = 'photo_id') => {
  try {
    const connection = await db();
    const sortValidated = sort.toLowerCase() === 'asc' ? 'asc' : 'desc';
    const orderValidated = photosSchema[order] || 'name';

    const photoList = await new Promise((resolve, reject) => {
      connection.all(photoScripts.getPhotoListByParams(sortValidated, orderValidated), [userId, limit, offset], (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
    return photoList;
  } catch (err) {
    console.error(err);
    return { error: true, message: err.code || err.message || err, status: 500 };
  }
};
module.exports = {
  createPhotosDirectory,
  createPhotoRecords,
  getPhotoBatchStatus,
  getUserPhotoPath,
  getPhotoList,
};
