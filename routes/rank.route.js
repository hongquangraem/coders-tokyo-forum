var express = require('express');

var controller = require('../controllers/rank.controller');
var router = express.Router();

router.get('/', controller.rank);

module.exports = router;
