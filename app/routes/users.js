const router = require('express').Router();
const controller = require('../controllers/users');

router.post('/register', controller.register);

module.exports = router;
