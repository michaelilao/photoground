const mb = 1048576; // bytes to mb

module.exports = {
  photoPath: `./${process.env.NODE_ENV}-files/photos`,
  rawPath: `./${process.env.NODE_ENV}-files/raw`,
  logPath: `./${process.env.NODE_ENV}-logs`,
  dbPath: `${process.env.NODE_ENV}-db.sqlite`,
  saltRounds: 10,
  tokenAge: 60 * 300, // 60s * 300; // 300 mins
  deleteFileFlag: true,
  maxImageWidth: 2240,
  maxImageHeight: 1260,
  uploadLimit: mb * 10,
  fileLimit: 30, // only 30 photos for now
};
