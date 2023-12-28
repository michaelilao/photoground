const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
require('dotenv').config();
const favicon = require('serve-favicon');
const { ensureExists } = require('./utils');
const { photoPath } = require('./config');

const port = process.env.API_PORT || 4000;
const api = process.env.API_PATH || '/api/v1';

const users = require('./users/routes');
const photos = require('./photos/routes');

// Initialize app
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Initialize files directory
ensureExists(photoPath);

// Routes
app.use(favicon(path.join(__dirname, 'web', 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'web', 'public')));
app.get('/', async (_req, res) => res.sendFile('web/root.html', { root: __dirname }));
app.use(`${api}/users`, users);
app.use(`${api}/photos`, photos);

require('./database')().then(() => {
  console.debug('db initialized');

  const server = app.listen(port, () => {
    console.debug(`server running on port ${port}`);
  });

  app.close = () => {
    console.debug(`closing the server on port ${port}`);
    server.close();
  };
});

module.exports = app;
