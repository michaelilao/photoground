const router = require('express').Router();

const controller = require('./controller');
const schemas = require('./models');
const { validateBody } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { formatBody } = require('../middleware/format');

router.post('/upload', [formatBody, authenticate, validateBody(schemas.upload)], controller.upload);

module.exports = router;
