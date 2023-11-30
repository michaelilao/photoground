const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const scripts = require('../users/sql');

const initDB = () => {
  const DBSOURCE = process.env.NODE_ENV === 'dev' ? 'dev-db.sqlite' : 'prod-db.sqlite';
  const db = new sqlite3.Database(DBSOURCE, (initErr) => {
    if (initErr) {
      // Cannot open database
      throw initErr;
    }
    console.debug('Connected to the SQLite database.');
    db.run(scripts.createUsersTable, async (createAdminErr) => {
      if (!createAdminErr) {
        const { ADMIN_USER, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
        const salt = process.env.SALT_ROUNDS || 10;
        const encryptedPassword = await bcrypt.hash(ADMIN_PASSWORD, Number(salt));
        db.run(scripts.insertUserRecord, [ADMIN_USER, ADMIN_EMAIL, encryptedPassword]);
      }
    });
  });
  return db;
};

module.exports = initDB();
