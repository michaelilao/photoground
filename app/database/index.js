const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const { dbPath } = require('../config');
const userScripts = require('../users/sql');
const photoScripts = require('../photos/sql');
const statusScripts = require('../utils/sql');

const initDB = async () => {
  const DBSOURCE = dbPath;
  const connection = await new Promise((resolve) => {
    const db = new sqlite3.Database(DBSOURCE, async (initErr) => {
      if (initErr) {
        // Cannot open database
        console.error(initErr);
        throw initErr;
      }

      // Enable foreign key support
      await new Promise((resolveForeignKeys) => {
        db.get('PRAGMA foreign_keys = ON').then(resolveForeignKeys(true));
      });

      // Try to create status table
      await new Promise((resolveStatus) => {
        db.run(statusScripts.createStatusTable, (createStatusErr) => {
          if (!createStatusErr) {
            db.run(statusScripts.insertStatusRecords);
          }
          resolveStatus(true);
        });
      });

      // Try to create users table
      await new Promise((resolveUsers) => {
        db.run(userScripts.createUsersTable, async (createAdminErr) => {
          if (!createAdminErr) {
            // If table doesnt exist, create the admin record
            const { ADMIN_USER, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
            const salt = process.env.SALT_ROUNDS || 10;
            const encryptedPassword = await bcrypt.hash(ADMIN_PASSWORD, Number(salt));
            const userId = crypto.randomUUID();
            db.run(userScripts.insertUser, [userId, ADMIN_USER, ADMIN_EMAIL, encryptedPassword]);
          }

          resolveUsers(true);
        });
      });

      // Try to create photos table
      await new Promise((resolvePhotos) => {
        db.run(photoScripts.createTablePhotos, async () => {
          resolvePhotos(true);
        });
      });

      resolve(db);
    });
  });

  return connection;
};

module.exports = initDB;
