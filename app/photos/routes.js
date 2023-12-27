const multer = require('multer');
const router = require('express').Router();
const controller = require('./controller');
const schemas = require('./models');
const { validateBody, validateParams } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { formatBody } = require('../middleware/format');
const { rawPath } = require('../config');

const upload = multer({ dest: rawPath }).any();

router.post('/upload', [authenticate, upload, formatBody, validateBody(schemas.upload)], controller.upload);
router.get('/status', [authenticate, validateParams(schemas.status)], controller.status);
router.get('/list', [authenticate, validateParams(schemas.list)], controller.list);
router.get('/:photoId', [authenticate, validateParams(schemas.list)], controller.file);

module.exports = router;
