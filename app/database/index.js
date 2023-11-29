const sqlite3 = require('sqlite3').verbose();
const scripts = require('../users/sql');

const DBSOURCE = 'db.sqlite';

const db = new sqlite3.Database(DBSOURCE, (initErr) => {
  if (initErr) {
    // Cannot open database
    throw initErr;
  }

  console.log('Connected to the SQLite database.');
  db.run(scripts.createUsersTable, (createAdminErr) => {
    if (!createAdminErr) {
      const { ADMIN_USER, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
      db.run(scripts.insertUserRecord, [ADMIN_USER, ADMIN_EMAIL, ADMIN_PASSWORD]);
    }
  });
});

module.exports = db;
