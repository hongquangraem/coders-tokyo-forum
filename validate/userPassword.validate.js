var md5 = require('md5');
var db = require('../db');

module.exports.validatePassword = (req, res, next) => {
	var userId = req.params.id;
	var user = db.get('users')
									 .find({ id: userId })
									 .value()
	var oldPassword =  db.get('users')
									 .find({ id: userId })
									 .value()
									 .password
	var validatePassword = req.body.password;
	var hashedOldPassword = md5(validatePassword);
	if (oldPassword !== hashedOldPassword) {
		res.render('users/editInfoUser', {
			user: user,
			errors: ['OldPassword wrong'],
			values: req.body
		})
		return;
	}
	next();
}
