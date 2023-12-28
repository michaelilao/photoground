const fs = require('fs');

const defaultCb = (path, err) => {
  if (err) {
    console.error(`Error occured during ${path} directory creation`, err);
  }
};
const ensureExists = (path, cb = defaultCb) => {
  const mask = 0o744; // Default R/W permissions

  fs.mkdir(path, { recursive: true, mask }, (err) => {
    if (err) {
      if (err.code === 'EEXIST') cb(`${path} folder already exists`); // Ignore the error if the folder already exists
      else cb(path, err); // Something else went wrong
    } else cb(path, null); // Successfully created folder
  });
};
module.exports = { ensureExists };
