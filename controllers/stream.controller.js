var db = require('../db');

module.exports.stream = (req, res) => {
	let users = db.get('users')
								.value()
	let user = db.get('users')
							 .find({ id : req.signedCookies.userId })
							 .value()
	res.render('stream/stream', {
		users: users,
		user: user,
		userId: req.signedCookies.userId
	})
}


module.exports.voteStar = (req, res) => {
	let userId = req.originalUrl.split('/').slice(3,4).join('');

	let usersVotedCheck = db.get('users')
								.find({ id : userId })
								.has('usersVoted')
								.value();
	let countStar = db.get('users')
										.find({ id : userId })
										.get('star', 0)
	if (!usersVotedCheck) {
		db.get('users')
		.find({ id : userId })
		.set('usersVoted', [])
		.write()
	}
	
	let usersVoted = db.get('users')
										 .find({ id : userId })
										 .value()
										 .usersVoted

	
	let userWall = req.originalUrl.split('/').pop();

	if (usersVoted.indexOf(userWall) === -1) { // neu user chua co trogn danh sach da vote cho thot thi ms dc vote
		db.get('users')
		.find({ id : userId })
		.set('star', countStar + 1)
		.write()

		usersVoted.push(userWall);
		db.write()
		res.redirect('/stream')
	} else {
		res.redirect('/stream')
	}
	

	// console.log();
	
}
