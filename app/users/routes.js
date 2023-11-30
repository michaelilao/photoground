const router = require('express').Router();

const controller = require('./controller');
const schemas = require('./models');
const { validateBody } = require('../middleware/validate');

router.post('/register', validateBody(schemas.register), controller.register);
router.post('/login', validateBody(schemas.login), controller.login);

module.exports = router;
