/* eslint-disable no-useless-escape */
exports.createUsersTable = `CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name text,\ 
    email text UNIQUE,\
    password text,\
    CONSTRAINT email_unique UNIQUE (email))`;

exports.insertUserRecord = 'INSERT INTO users (name, email, password) VALUES (?,?,?)';

exports.getUserRecordByEmail = 'SELECT * FROM users WHERE users.email = ?';
exports.getUserById = 'SELECT * FROM users WHERE users.user_id = ?';
