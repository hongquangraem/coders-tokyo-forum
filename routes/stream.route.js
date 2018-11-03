var express = require('express');

var controller = require('../controllers/stream.controller');
var authController = require('../controllers/auth.controller');
var authMiddleware = require('../middleware/auth.login');
var router = express.Router();

router.get('/', controller.stream);

router.get('/logout', authController.logOut);

router.get('/voteUp/:id/:id', authMiddleware.requireAuth, controller.voteUpStar);

router.get('/voteDown/:id/:id', authMiddleware.requireAuth, controller.voteDownStar);

module.exports = router;
