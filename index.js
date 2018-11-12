require('dotenv').config();

var db = require('./db');
var path = require('path');
var express = require('express');
var app = express();
var port = 3000;
var bodyParser = require('body-parser'); // body-parser-middleware
var cookieParser = require('cookie-parser') // cookie-parser-middleware

var userRouter = require('./routes/user.route');
var streamRouter = require('./routes/stream.route');
var authRouter = require('./routes/auth.route');
var registerRouter = require('./routes/register.route');
var productsRouter = require('./routes/products.route');
var rankRouter = require('./routes/rank.route');
var authController = require('./controllers/auth.controller');
var authMiddleware = require('./middleware/auth.login');

app.set('views', './views');
app.set('view engine', 'pug');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-
app.use(express.static('public')); // setup public folder to save css, images, ...
app.use(cookieParser('process.env.SESSION_SECRET'));

app.get('/', (req, res) => {
	let user = db.get('users')
							 .find({ id : req.signedCookies.userId})
							 .value()
	let allUsers = db.get('users')
													.value()
	let randomUserId = allUsers[Math.floor(Math.random() * allUsers.length)].id

	res.render('index', {
		userId : req.signedCookies.userId,
		user: user,
		randomUserId: randomUserId
	})
})

app.use('/users', authMiddleware.requireAuth, userRouter);
app.use('/auth', authRouter);
app.use('/stream', streamRouter);
app.use('/register', registerRouter);
app.use('/logout', authController.logOut);
app.use('/products', productsRouter);
app.use('/rank', rankRouter);

app.listen(port, () => console.log('Server listening or port ' + port));
