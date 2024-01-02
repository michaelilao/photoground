const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../database');
const scripts = require('./sql');
const { tokenAge } = require('../config');

const createUser = async (name, email, password) => {
  try {
    const connection = await db();

    // Check if user exists in DB
    const userExists = await new Promise((resolve, reject) => {
      connection.get(scripts.getUserByEmail, [email], async (err, row) => {
        if (err) {
          reject(err);
        }

        if (row && row?.userId) {
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
    await new Promise((resolve, reject) => {
      const userId = crypto.randomUUID();
      connection.run(scripts.insertUser, [userId, name, email, encryptedPassword], (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });

    // Get created user id
    const newUserId = await new Promise((resolve, reject) => {
      connection.get(scripts.getUserByEmail, [email], async (err, row) => {
        if (err) {
          reject(err);
        }

        if (row && row?.userId) {
          resolve(row?.userId);
        } else {
          reject(err);
        }
      });
    });

    const tokenKey = process.env.TOKEN_KEY;
    const token = jwt.sign({ id: newUserId, email }, tokenKey, {
      expiresIn: tokenAge,
    });

    return { user: { userId: newUserId }, accessToken: token, tokenAge };
  } catch (err) {
    console.error(err);
    return { error: true, message: err.message, status: 500 };
  }
};

const loginUser = async (email, password) => {
  try {
    // Check if user exists in DB
    const connection = await db();
    const user = await new Promise((resolve, reject) => {
      connection.get(scripts.getUserPasswordByEmail, [email], async (err, row) => {
        if (err) {
          reject(err);
        }

        return resolve(row);
      });
    });

    if (!user) {
      return { error: true, message: 'Email or Password are incorrect, please check and try again.', status: 400 };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return { error: true, message: 'Email or Password are incorrect, please check and try again.', status: 400 };
    }

    // Remove hashed password from user object
    delete user.password;

    const tokenKey = process.env.TOKEN_KEY;
    const token = jwt.sign({ id: user.userId, email }, tokenKey, {
      expiresIn: tokenAge,
    });

    return { user, accessToken: token, tokenAge };
  } catch (err) {
    console.error(err);
    return { error: true, message: err.code, status: 500 };
  }
};

module.exports = { createUser, loginUser };
