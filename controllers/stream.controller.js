var db = require('../db');

module.exports.stream = (req, res) => {
	let users = db.get('users')
								.value();
	res.render('stream/stream', {
		users: users,
		userId: req.signedCookies.userId
	})
}
