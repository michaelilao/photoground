const db = require('../database');
const scripts = require('./sql');
const { photoPath } = require('../config');
const { ensureExists } = require('../utils');

const getUserPhotoPath = (userId) => `${photoPath}/${userId}`;
const createPhotosDirectory = async (userId) => {
  try {
    const connection = await db();
    const user = await new Promise((resolve, reject) => {
      connection.get(scripts.getUserById, [userId], async (err, row) => {
        if (err) {
          reject(err);
        }

        if (row && row?.user_id) {
          return resolve(row);
        }

        return resolve(false);
      });
    });

    // Initialize files directory
    ensureExists(getUserPhotoPath(user.user_id), (err) => {
      if (err) {
        throw new Error('Error occured during photo directory creation', err);
      }
    });

    return user;
    // return { user: { id: newUserId }, accessToken: token, tokenAge };
  } catch (err) {
    console.error(err);
    return { error: true, message: err.message, status: 500 };
  }
};
module.exports = { createPhotosDirectory };
