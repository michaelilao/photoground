const router = require('express').Router();

const controller = require('./controller');
const schemas = require('./models');
const { validateBody } = require('../middleware/validate');

// router.post('/upload', validateBody(schemas.upload), controller.register);
router.post('/upload', controller.upload);

module.exports = router;
