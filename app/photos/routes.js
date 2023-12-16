const router = require('express').Router();
const multer = require('multer');
const controller = require('./controller');
const schemas = require('./models');
const { validateBody, validateParams } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { formatBody } = require('../middleware/format');
const { rawPath } = require('../config');

const upload = multer({ dest: rawPath }).any();

router.post('/upload', [upload, authenticate, formatBody, validateBody(schemas.upload)], controller.upload);
router.get('/status', [authenticate, validateParams(schemas.status)], controller.status);

module.exports = router;
