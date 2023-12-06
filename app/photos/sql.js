/* eslint-disable no-useless-escape */
exports.createTablePhotos = `CREATE TABLE photos (\
    id INTEGER PRIMARY KEY AUTOINCREMENT,\
    filename text,\ 
    )`;

exports.insertUserRecord = 'INSERT INTO users (name, email, password) VALUES (?,?,?)';
