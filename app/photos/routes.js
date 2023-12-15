const router = require('express').Router();

const controller = require('./controller');
const schemas = require('./models');
const { validateBody, validateParams } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { formatBody } = require('../middleware/format');

router.post('/upload', [authenticate, formatBody, validateBody(schemas.upload)], controller.upload);
router.get('/status', [authenticate, validateParams(schemas.status)], controller.status);

module.exports = router;
