module.exports.userRegister = (req, res, next) => {
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var errors = [];

	if (!name && !email	&& !password) {
		errors.push('Fill your name, email and password');
	}

	if (!name) {
		errors.push('Name is required');
	}

	if (!email) {
		errors.push('Email is required');
	}

	if (!password) {
		errors.push('Password is required');
	}

	if (errors.length) {
		res.render('users/register', {
			errors: errors,
			values: req.body
		})
		return;
	}

	next();
}
