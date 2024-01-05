const multer = require('multer');
const router = require('express').Router();
const controller = require('./controller');
const schemas = require('./models');
const { validateBody, validateParams } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { formatBody } = require('../middleware/format');
const { rawPath } = require('../config');

const mb = 1048576; // bytes to mb
const sizeLimit = mb * 20;
const upload = multer({ dest: rawPath, limits: { fileSize: sizeLimit } }).any();

router.post('/upload', [authenticate, upload, formatBody, validateBody(schemas.upload)], controller.upload);
router.get('/status', [authenticate, validateParams(schemas.status)], controller.status);
router.get('/list', [authenticate, validateParams(schemas.list)], controller.list);
router.get('/:photoId', [authenticate], controller.file);
router.delete('/:photoId', [authenticate], controller.remove);

module.exports = router;
