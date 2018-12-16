var db = require('../db');
var md5 = require('md5');
var shortid = require('shortid');

module.exports.createUser =(req, res) => {
	res.render('users/register')
}

module.exports.postCreateUser = (req, res) => {
	req.body.id = shortid.generate();
	req.body.closet = [
											{ "books" : [] },
											{ "movies": [] },
											{ "songs" : [] },
											{ "blogs" : [] }
										];
	req.body.password = md5(req.body.password);
	req.body.usersVotedUp = [];
	req.body.usersVotedDown = [];
	req.body.star = 0;
	if (Object.keys(req).indexOf('file') === -1) {
		req.body.avatar = 'upload/2261c205c93b9aa7059d9c3fe7febdd4'
	} else {
		req.body.avatar = req.file.path.split('/').slice(1).join('/');
	}
	db.get('users')
		.push(req.body)
		.write();
	res.redirect('/users');

}
