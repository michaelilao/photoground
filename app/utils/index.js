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

// Date Incoming const  '2023:11:23 17:19:47'
// Output ISO8601 YYYY-MM-DD HH:MM:SS.SSS
const formatDate = (dateString) => {
  if (!dateString) return null;
  if (dateString.length === 0) {
    return null;
  }

  const dateArr = dateString.split(' ');
  if (dateArr.length !== 2) {
    return null;
  }

  const date = dateArr[0].replaceAll(':', '-');
  const ms = '.000';
  const time = dateArr[1] + ms;

  const formattedDate = `${date} ${time}`;
  if (Number.isNaN(Date.parse(formattedDate))) {
    return null;
  }
  return formattedDate;
};

// [d,mm,ss], N/S, [dd, mm, ss], W/E
const formatCoords = (lat, latDir, long, longDir) => {
  const minToDeg = 60;
  const secToDeg = 3600;
  const signs = {
    N: 1,
    E: 1,
    S: -1,
    W: -1,
  };

  if (!signs[latDir] || !signs[longDir] || lat.length !== 3 || long.length !== 3) return [null, null];

  const formattedLat = (lat[0] + lat[1] / minToDeg + lat[2] / secToDeg) * signs[latDir];

  const formattedLong = (long[0] + long[1] / minToDeg + long[2] / secToDeg) * signs[longDir];
  return [formattedLat, formattedLong];
};
module.exports = { ensureExists, formatDate, formatCoords };
