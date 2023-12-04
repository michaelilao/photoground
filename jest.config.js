/** @type {import('jest').Config} */
const dotenv = require('dotenv');

dotenv.config({
  path: '.env',
});

const config = {
  verbose: true,
  globals: {
    __DEV__: true,
  },
  prettierPath: null,
  setupFiles: ['./app/database/index.js'],
};

module.exports = config;
