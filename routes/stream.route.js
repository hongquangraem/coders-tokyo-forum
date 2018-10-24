var express = require('express');

var controller = require('../controllers/stream.controller');
var authController = require('../controllers/auth.controller');
var router = express.Router();

router.get('/', controller.stream);
router.get('/logout', authController.logOut);

module.exports = router;
