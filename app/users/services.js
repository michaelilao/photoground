const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');
const scripts = require('./sql');

const createUser = async (name, email, password) => {
  try {
    // Check if user exists in DB
    const userExists = await new Promise((resolve, reject) => {
      db.get(scripts.getUserRecordByEmail, [email], async (err, row) => {
        if (err) {
          reject(err);
        }

        if (row && row?.id) {
          return resolve(true);
        }

        return resolve(false);
      });
    });

    if (userExists) {
      return { error: true, message: 'Could not create user, email already exists', status: 400 };
    }

    // Hash password
    const salt = process.env.SALT_ROUNDS || 10;
    const encryptedPassword = await bcrypt.hash(password, Number(salt));

    // Insert user into DB
    const newUser = await new Promise((resolve, reject) => {
      db.run(scripts.insertUserRecord, [name, email, encryptedPassword], function (err) {
        if (err) {
          reject(err);
        }
        resolve(this.lastID);
      });
    });

    const tokenKey = process.env.TOKEN_KEY;
    const token = jwt.sign({ id: newUser, email }, tokenKey, {
      expiresIn: '1h',
    });

    return { id: newUser, accessToken: token };
  } catch (err) {
    return { error: true, message: err.code, status: 500 };
  }
};

module.exports = { createUser };
