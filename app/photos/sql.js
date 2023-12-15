/* eslint-disable no-useless-escape */
exports.createTablePhotos = `CREATE TABLE photos (\
    photo_id text PRIMARY KEY,\
    user_id text,\
    name text,\
    photo_type text,\ 
    status_id text,\
    batch_id text,\
    FOREIGN KEY(user_id) REFERENCES users(user_id),\
    FOREIGN KEY(status_id) REFERENCES status(status_id))`;

exports.insertPhoto = 'INSERT INTO photos (photo_id, user_id, name, photo_type, status_id, batch_id) VALUES (?, ?, ?, ?, ?, ?)';
exports.updatePhotoStatus = 'UPDATE photos SET status_id = ? WHERE photo_id = ?';

exports.getPhotosByBatchId = `SELECT photo_id as photoId, name, photo_type as photoType, status.status_text as status\
    FROM photos INNER JOIN status\
    ON status.status_id = photos.status_id\ 
    WHERE batch_id = ?`;
