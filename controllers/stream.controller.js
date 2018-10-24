var db = require('../db');

module.exports.stream = (req, res) => {
	let users = db.get('users')
								.value();
	res.render('users/stream', {
		users: users,
	})
}
