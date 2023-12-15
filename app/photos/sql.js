/* eslint-disable no-useless-escape */
exports.createTablePhotos = `CREATE TABLE photos (\
    photo_id text PRIMARY KEY,\
    user_id text,\
    name text,\
    photo_type text,\ 
    status text,\
    batch_id text,\
    FOREIGN KEY(user_id) REFERENCES users(user_id),\
    FOREIGN KEY(status) REFERENCES status(status_id))`;

exports.insertPhoto = 'INSERT INTO photos (photo_id, user_id, name, photo_type, status, batch_id) VALUES (?, ?, ?, ?, ?, ?)';
exports.updatePhotoStatus = 'UPDATE photos SET status = ? WHERE photo_id = ?';
