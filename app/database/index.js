const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const userScripts = require('../users/sql');
const statusScripts = require('../utils/sql');

const initDB = async () => {
  const DBSOURCE = `${process.env.NODE_ENV}-db.sqlite`;
  const connection = await new Promise((resolve) => {
    const db = new sqlite3.Database(DBSOURCE, async (initErr) => {
      if (initErr) {
        // Cannot open database
        console.error(initErr);
        throw initErr;
      }

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
            db.run(userScripts.insertUserRecord, [userId, ADMIN_USER, ADMIN_EMAIL, encryptedPassword]);
          }

          resolveUsers(true);
        });
      });

      resolve(db);
    });
  });

  return connection;
};

module.exports = initDB;
