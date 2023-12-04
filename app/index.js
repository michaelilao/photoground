const fs = require('fs');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const multer = require('multer');
require('dotenv').config();
const { ensureExists } = require('./utils');

const port = process.env.API_PORT || 4000;

// Routes
const users = require('./users/routes');
const photos = require('./photos/routes');

// Initialize files directory
ensureExists('./files/photos', (err) => {
  if (err) {
    console.error('Error occured during ./files/photo directory creation', err);
  }
});

// Initialize app
const app = express();
app.use(express.json());
app.use(multer({ dest: './files/raw' }).any());
app.use(cookieParser());

// Logger
const accessLogStream = fs.createWriteStream(path.join('logs', 'access.log'), { flags: 'a' });
app.use(morgan('common', { stream: accessLogStream }));
app.use(morgan('dev'));

// Root endpoint
app.get('/', async (_req, res) => {
  res.json({ message: 'Welcome to Photoground API' });
});

// Define our routes
const api = process.env.API_PATH || '/api/v1';
app.use(`${api}/users`, users);
app.use(`${api}/photos`, photos);

// Initalize DB and wait to start until it is done
require('./database')().then(() => {
  console.debug('db initialized');

  // Start server
  app.listen(port, () => {
    console.debug(`server running on port ${port}`);
  });
});

module.exports = app;
