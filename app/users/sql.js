/* eslint-disable no-useless-escape */
exports.createUsersTable = `CREATE TABLE users (user_id text PRIMARY KEY, name text,\ 
    email text UNIQUE,\
    password text,\
    CONSTRAINT email_unique UNIQUE (email))`;

exports.insertUserRecord = 'INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)';

exports.getUserRecordByEmail = 'SELECT * FROM users WHERE users.email = ?';
