/* eslint-disable no-useless-escape */
exports.createTablePhotos = `CREATE TABLE photos (\
    photo_id TEXT PRIMARY KEY,\
    user_id TEXT,\
    name TEXT,\
    photo_type TEXT,\ 
    status_id TEXT,\
    batch_id TEXT,\
    width INTEGER,\
    height INTEGER,\
    hex TEXT,\
    date_original TEXT,\
    latitude REAL,\
    longitude REAL,\
    FOREIGN KEY(user_id) REFERENCES users(user_id),\
    FOREIGN KEY(status_id) REFERENCES status(status_id))`;

exports.insertPhoto = 'INSERT INTO photos (photo_id, user_id, name, photo_type, status_id, batch_id) VALUES (?, ?, ?, ?, ?, ?)';
exports.updatePhotoStatus = 'UPDATE photos SET status_id = ? WHERE photo_id = ?';
exports.deletePhotobyId = 'DELETE from photos WHERE user_id = ? AND photo_id = ?';

exports.updatePhoto = (fields) => {
  const sqlFields = fields.map((field) => `${field} = ?`);
  return `UPDATE photos SET ${sqlFields.join(', ')} WHERE photo_id = ?;`;
};

exports.getPhotosByBatchId = `SELECT photo_id as photoId, name, photo_type as photoType, status.status_TEXT as status\
    FROM photos INNER JOIN status\
    ON status.status_id = photos.status_id\ 
    WHERE batch_id = ?`;

exports.getPhotoListByParams = (sort, order) => `SELECT photo_id as photoId, name, photo_type as photoType, hex, date_original as dateOriginal,\ 
    width, height\
    FROM photos WHERE user_id = ?\
    AND status_id = 2\
    ORDER BY ${order} ${sort}\
    LIMIT ? OFFSET ?`;

exports.getPhotoById = 'SELECT photo_id as photoId, name, photo_type as photoType FROM photos WHERE user_id = ? AND photo_id = ?';
