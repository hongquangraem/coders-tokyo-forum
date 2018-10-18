var db = require('../db');

module.exports.index = (req, res) => {
	var closet = db.get('users')
									.value()[0].closet;
	res.render('users/index', {
		products: closet
	})
}
