var db = require('../db');

module.exports.stream = (req, res) => {
	let userId = req.signedCookies.userId;
	let users = db.get('users')
								.value()
	let user = db.get('users')
							 .find({ id : userId })
							 .value()

	res.render('stream/stream', {
		users: users,
		user: user,
		userId: userId
	})
}


module.exports.voteUpStar = (req, res) => {
	let userId = req.originalUrl.split('/').slice(3,4).join('');

	let usersVotedUpCheck = db.get('users')
								.find({ id : userId })
								.has('usersVotedUp')
								.value();

	let countStar = db.get('users')
										.find({ id : userId })
										.get('star', 0)
	if (!usersVotedUpCheck) {
		db.get('users')
		.find({ id : userId })
		.set('usersVotedUp', [])
		.write()
	}
	
	let usersVotedUp = db.get('users')
										 .find({ id : userId })
										 .value()
										 .usersVotedUp

	
	let userWall = req.originalUrl.split('/').pop();

	if (usersVotedUp.indexOf(userWall) === -1) { // neu user chua co trogn danh sach da vote cho thot thi ms dc vote
		db.get('users')
		.find({ id : userId })
		.set('star', countStar + 1)
		.write()

		usersVotedUp.push(userWall);
		db.write()

		let usersVotedDownCheck = db.get('users')
								.find({ id : userId })
								.has('usersVotedDown')
								.value();

		// Xoa user trong vote down neu co
		if(usersVotedDownCheck) {
			let indexUsersVotedDown = db.get('users')
					.find({ id : userId })
					.value()
					.usersVotedDown
					.indexOf(userWall)
			let usersVotedDown = db.get('users')
							 .find({ id : userId })
							 .value()
							 .usersVotedDown
					 
			usersVotedDown.splice(indexUsersVotedDown,1);
			db.write()

			res.redirect('/stream')
		}

		
		res.redirect('/stream')
	} else {
		res.redirect('/stream')
	}
	
}

module.exports.voteDownStar = (req, res) => {
	let userId = req.originalUrl.split('/').slice(3,4).join('');

	let usersVotedDownCheck = db.get('users')
								.find({ id : userId })
								.has('usersVotedDown')
								.value();
	let countStar = db.get('users')
										.find({ id : userId })
										.get('star', 0)
	if (!usersVotedDownCheck) {
		db.get('users')
		.find({ id : userId })
		.set('usersVotedDown', [])
		.write()
	}
	
	let usersVotedDown = db.get('users')
										 .find({ id : userId })
										 .value()
										 .usersVotedDown

	
	let userWall = req.originalUrl.split('/').pop();

	let usersVotedUpCheck = db.get('users')
								.find({ id : userId })
								.has('usersVotedUp')
								.value();

	if (usersVotedDown.indexOf(userWall) === -1 && usersVotedUpCheck == false) { // neu dau tien chua lam gi ma vote down luon thi ko vote dc
		res.redirect('/stream')
	} else if (usersVotedDown.indexOf(userWall) === -1 && countStar !== 0 ) { // neu user chua co trogn danh sach da vote cho thot thi ms dc vote
		db.get('users')
		.find({ id : userId })
		.set('star', countStar - 1)
		.write()

		usersVotedDown.push(userWall);
		db.write()

		// xoa user trong vote up neu da co
		
		if(usersVotedUpCheck) {
			let indexUsersVotedUp = db.get('users')
					.find({ id : userId })
					.value()
					.usersVotedUp
					.indexOf(userWall)
			let usersVotedUp = db.get('users')
							 .find({ id : userId })
							 .value()
							 .usersVotedUp
					 
			usersVotedUp.splice(indexUsersVotedUp,1);

			db.write()
			res.redirect('/stream')
		}
		res.redirect('/stream')
	} else {
		res.redirect('/stream')
	}
	
}
