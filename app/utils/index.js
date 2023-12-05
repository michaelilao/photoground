const fs = require('fs');

const ensureExists = (path, cb) => {
  const mask = 0o744; // Default R/W permissions

  fs.mkdir(path, { recursive: true, mask }, (err) => {
    if (err) {
      if (err.code === 'EEXIST') cb(`${path} folder already exists`); // Ignore the error if the folder already exists
      else cb(err); // Something else went wrong
    } else cb(null); // Successfully created folder
  });
};

const handleServiceErrors = () => {};
module.exports = { ensureExists };
