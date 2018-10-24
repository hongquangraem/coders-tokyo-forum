var express = require('express');
var multer = require('multer');

var validate = require('../validate/user.validate');
var router = express.Router();
var upload = multer({ dest: './public/upload/' });

var controller = require('../controllers/register.controller');

router.get('/', controller.createUser);

router.post('/', 
	upload.single('avatar'),
	validate.userRegister,
	controller.postCreateUser
);

module.exports = router;
