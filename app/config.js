module.exports = {
  photoPath: `./${process.env.NODE_ENV}-files/photos`,
  rawPath: `./${process.env.NODE_ENV}-files/raw`,
  logPath: `./${process.env.NODE_ENV}-logs`,
  dbPath: `${process.env.NODE_ENV}-db.sqlite`,
  saltRounds: 10,
  tokenAge: 60 * 300, // 60s * 300; // 300 mins
  deleteFileFlag: true,
};
