module.exports = {
  photoPath: `./${process.env.NODE_ENV}-files/photos`,
  rawPath: `./${process.env.NODE_ENV}-files/raw`,
  logPath: `./${process.env.NODE_ENV}-logs`,
  dbPath: `${process.env.NODE_ENV}-db.sqlite`,
  saltRounds: 10,
  tokenAge: 60 * 30, // 60s * 30; // 30 mins
};
