var db = require('../db');

module.exports.rank = (req, res) => {
	let userId = req.signedCookies.userId;
	let users = db.get('users')
								.value()
	let user = db.get('users')
							 .find({ id : userId })
							 .value()

	var topUser = db.get('users')
  .sortBy('star')
  .take(10)
  .value()
	res.render('rank/rank', {
		users: topUser.reverse(),
		user: user,
		userId: userId
	})
}
