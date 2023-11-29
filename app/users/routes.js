const router = require('express').Router();

const controller = require('./controller');
const schemas = require('./models');
const { validateBody } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

router.post('/register', validateBody(schemas.register), controller.register);
router.get('/', authenticate, (req, res) => res.json({ message: 'goosd' }));

module.exports = router;
