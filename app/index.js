const express = require('express');
const cookieParser = require('cookie-parser');

const users = require('./users/routes');
require('./database'); // Initialize DB
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());
const path = process.env.API_PATH || '/api/v1';
// Root endpoint
app.get('/', (_req, res) => {
  res.json({ message: 'Ok' });
});

// Define our routes
app.use(`${path}/users`, users);

module.exports = app;
