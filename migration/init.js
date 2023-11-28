exports.createUsersTable = `CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name text,\ 
    email text UNIQUE,\
    password text,\
    CONSTRAINT email_unique UNIQUE (email))`;

exports.insertAdminRecord = `INSERT INTO users (name, email, password) VALUES (?,?,?)`