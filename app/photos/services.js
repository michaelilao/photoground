const db = require('../database');
const scripts = require('./sql');

const createPhotosDirectory = async (userId) => {
  try {
    const connection = await db();
    const user = await new Promise((resolve, reject) => {
      connection.get(scripts.getUser, [userId], async (err, row) => {
        if (err) {
          reject(err);
        }

        if (row && row?.user_id) {
          return resolve(true);
        }

        return resolve(false);
      });
    });

    return { user: { id: newUserId }, accessToken: token, tokenAge };
  } catch (err) {
    console.error(err);
    return { error: true, message: err.message, status: 500 };
  }
};
module.exports = { createPhotosDirectory };
