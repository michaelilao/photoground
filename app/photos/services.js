const db = require('../database');
const userScripts = require('../users/sql');
const { photoPath } = require('../config');
const { ensureExists } = require('../utils');

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
const createPhotoRecords = (files, userId) => {};
module.exports = { createPhotosDirectory, createPhotoRecords };
