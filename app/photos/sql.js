/* eslint-disable no-useless-escape */
exports.createTablePhotos = `CREATE TABLE photos (\
    photo_id text PRIMARY KEY,\
    user_id text,\
    name text,\
    photo_type text,\ 
    FOREIGN KEY(user_id) REFERENCES users(user_id),\
    CONSTRAINT name_unique UNIQUE (name))`;

exports.insertPhotoRecord = (numPhotos) => {
  const placeholders = Array(numPhotos)
    .map(() => '(?)')
    .join(',');
  return `INSERT INTO photos (photo_id, user_id, name, photo_type) VALUES ${placeholders}`;
};
