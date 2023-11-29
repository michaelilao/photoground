const express = require('express');
require('./database'); // Initialize DB
require('dotenv').config();

const app = express();
app.use(express.json());

const path = process.env.API_PATH || '/api/v1';

// Root endpoint
app.get('/', (_req, res) => {
  res.json({ message: 'Ok' });
});
// Define our routes
app.use(`${path}/users`, require('./routes/users'));

module.exports = app;
