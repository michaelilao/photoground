/* eslint-disable no-useless-escape */
exports.createUsersTable = `CREATE TABLE users (\
    user_id text PRIMARY KEY,\
    name text,\ 
    email text UNIQUE,\
    password text,\
    CONSTRAINT email_unique UNIQUE (email))`;

exports.insertUser = 'INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)';

exports.getUserByEmail = 'SELECT user_id as userId, name, email FROM users WHERE users.email = ?';

exports.getUserById = 'SELECT user_id as userId, name, email FROM users WHERE users.user_id = ?';

exports.getUserAllByEmail = 'SELECT user_id as userId, name, email, password FROM users WHERE users.email = ?';
