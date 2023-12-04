const fs = require('fs');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const multer = require('multer');
require('dotenv').config();
const { ensureExists } = require('./utils');

// Routes
const users = require('./users/routes');
const photos = require('./photos/routes');
require('./database');

// Initialize files directory
ensureExists('./files/photos', (err) => {
  if (err) {
    console.error('Error occured during ./files/photo directory creation', err);
  }
});
// Initialize DB and app
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

module.exports = app;
