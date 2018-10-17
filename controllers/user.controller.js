var db = require('../db');

module.exports.index = (req, res) => {
	res.render('users/index', {
		products: db.get('closet')
							.value()
	})
}
