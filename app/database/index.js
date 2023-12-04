const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const userScripts = require('../users/sql');
const statusScripts = require('../utils/sql');

const initDB = async () => {
  const DBSOURCE = process.env.NODE_ENV === 'test' ? ':memory:' : `${process.env.NODE_ENV}-db.sqlite`;
  const db = new sqlite3.Database(DBSOURCE, async (initErr) => {
    if (initErr) {
      // Cannot open database
      console.error(initErr);
      throw initErr;
    }
    console.debug('Connected to the SQLite database.');

    // Try to create users table

    db.run(userScripts.createUsersTable, async (createAdminErr) => {
      if (!createAdminErr) {
        // If table doesnt exist, create the admin record
        const { ADMIN_USER, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
        const salt = process.env.SALT_ROUNDS || 10;
        const encryptedPassword = await bcrypt.hash(ADMIN_PASSWORD, Number(salt));
        db.run(userScripts.insertUserRecord, [ADMIN_USER, ADMIN_EMAIL, encryptedPassword]);
      }
    });

    // Try to create status table
    db.run(statusScripts.createStatusTable, async (createStatusErr) => {
      if (!createStatusErr) {
        db.run(statusScripts.insertStatusRecords);
      }
    });
  });

  return db;
};

module.exports = initDB();
