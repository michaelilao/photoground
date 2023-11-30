const fs = require('fs');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
require('dotenv').config();

// Routes
const users = require('./users/routes');
const { ensureExists } = require('./utils');

require('./database');
// Initialize DB
const app = express();
app.use(express.json());
app.use(cookieParser());

// Logger
const accessLogStream = fs.createWriteStream(path.join('logs', 'access.log'), { flags: 'a' });
app.use(morgan('common', { stream: accessLogStream }));
app.use(morgan('dev'));

// Initialize files directory
ensureExists('./files/photos', (err) => {
  if (err) {
    console.error('Error occured during ./files/photo directory creation', err);
  }
});

// Root endpoint
app.get('/', async (_req, res) => {
  res.json({ message: 'Welcome to Photoground API' });
});

// Define our routes
const api = process.env.API_PATH || '/api/v1';
app.use(`${api}/users`, users);

module.exports = app;
