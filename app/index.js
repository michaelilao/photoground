const fs = require('fs');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
require('dotenv').config();
const { ensureExists } = require('./utils');
const { photoPath, logPath } = require('./config');

const port = process.env.API_PORT || 4000;
const api = process.env.API_PATH || '/api/v1';

const users = require('./users/routes');
const photos = require('./photos/routes');

// Initialize app
const app = express();
app.use(express.json());
app.use(cookieParser());

// Initialize files directory
ensureExists(photoPath, (err) => {
  if (err) {
    console.error('Error occured during photo directory creation', err);
  }
});

// Initialize logger folders and logger
app.use(morgan('dev'));
ensureExists(logPath, (err) => {
  if (err) {
    console.error('Error occured during log directory creation', err);
  }
  const accessLogStream = fs.createWriteStream(path.join(logPath, 'access.log'), { flags: 'a' });
  app.use(morgan('common', { stream: accessLogStream }));
});

// Routes
app.get('/', async (_req, res) => res.json({ message: 'Welcome to Photoground API' }));
app.use(`${api}/users`, users);
app.use(`${api}/photos`, photos);

// Initalize DB and wait to start until it is done
require('./database')().then(() => {
  console.debug('db initialized');

  // Start server
  const server = app.listen(port, () => {
    console.debug(`server running on port ${port}`);
  });
  // Assign app close function
  app.close = () => {
    console.debug(`closing the server on port ${port}`);
    server.close();
  };
});

module.exports = app;
