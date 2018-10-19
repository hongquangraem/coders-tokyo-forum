var db = require('../db');

module.exports.requireAuth = function(req, res, next) {
	if(!req.signedCookies.userId) {
		res.redirect('/auth/login');
		return;
	};
	var user = db.get('users').find({ id : req.signedCookies.userId }).value()
	if(!user) {
		res.redirect('/auth/login'); // co cookie but fake cookie
		return;
	}
	
	res.locals.user = user;

	next();
};

module.exports.requireAuthAdmin = function(req, res, next) {
	var user = db.get('users').find({ id : req.signedCookies.userId }).value();
	userId = user.id;
	if(userId !== '123') {
		res.redirect('/users/books')
	}
	next();
	// res.render('users/books')
};
