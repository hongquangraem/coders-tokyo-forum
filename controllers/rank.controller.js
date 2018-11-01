var db = require('../db');

module.exports.rank = (req, res) => {
	var topUser = db.get('users')
  .sortBy('star')
  .take(5)
  .value()
	res.render('rank/rank', {
		users: topUser.reverse()
	})
}
