const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');
const scripts = require('./sql');

const tokenAge = 60 * 30; // 30 mins

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
    const newUserId = await new Promise((resolve, reject) => {
      db.run(scripts.insertUserRecord, [name, email, encryptedPassword], function (err) {
        if (err) {
          reject(err);
        }
        resolve(this.lastID);
      });
    });

    const tokenKey = process.env.TOKEN_KEY;
    const token = jwt.sign({ id: newUserId, email }, tokenKey, {
      expiresIn: tokenAge,
    });

    return { user: { id: newUserId }, accessToken: token, tokenAge };
  } catch (err) {
    return { error: true, message: err.code, status: 500 };
  }
};

const loginUser = async (email, password) => {
  try {
    // Check if user exists in DB
    const user = await new Promise((resolve, reject) => {
      db.get(scripts.getUserRecordByEmail, [email], async (err, row) => {
        if (err) {
          reject(err);
        }

        return resolve(row);
      });
    });

    if (!user) {
      return { error: true, message: 'Email or Password do not match, please check and try again.', status: 400 };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return { error: true, message: 'Email or Password do not match, please check and try again.', status: 400 };
    }

    // Remove hashed password from user object
    delete user.password;
    const tokenKey = process.env.TOKEN_KEY;
    const token = jwt.sign({ id: 1, email }, tokenKey, {
      expiresIn: tokenAge,
    });

    return { user, accessToken: token, tokenAge };
  } catch (err) {
    return { error: true, message: err.code, status: 500 };
  }
};
module.exports = { createUser, loginUser };
