var db = require('../db');
var md5 = require('md5');

module.exports.login = function(req, res) {
	res.render('auth/login')
};

module.exports.postLogin = function(req, res) {
	// console.log(req.body);
	var email = req.body.email;
	var password = req.body.password;
	var user = db.get('users').find({ email : email }).value();

	var errors = [];

	if (!email && !password) {		// empty 
		errors.push('Type your account');
		res.render('auth/login', {
			errors: errors,
			values: req.body
		})
	}

	if (!email) {		// empty email
		errors.push('Email required');
		res.render('auth/login', {
			errors: errors,
			values: req.body
		})
	}

	if (!password) {  // empty password
		errors.push('Password required');
		res.render('auth/login', {
			errors: errors,
			values: req.body
		})
	}

	if (!user) {	// user doesn't register
			errors.push('User doesn\'t exists');
			res.render('auth/login', {
				errors: errors,
				values: req.body
			})
		}

	var hashedPassword = md5(password); // wrong password

	if (hashedPassword !== user.password) {
		errors.push('wrong password');
		res.render('auth/login', {
			errors: errors,
			values: req.body
		})
	}

	res.cookie('userId', user.id, { //success
		signed: true
	});

	res.redirect('/users');
}
