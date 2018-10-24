require('dotenv').config();

var db = require('./db');
var express = require('express');
var app = express();
var port = 3000;
var bodyParser = require('body-parser'); // body-parser-middleware
var cookieParser = require('cookie-parser') // cookie-parser-middleware

var userRouter = require('./routes/user.route');
var streamRouter = require('./routes/stream.route');
var authRouter = require('./routes/auth.route');
var registerRouter = require('./routes/register.route');
var authMiddleware = require('./middleware/auth.login');

app.set('views', './views');
app.set('view engine', 'pug');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-
app.use(express.static('public')); // setup public folder to save css, images, ...
app.use(cookieParser('process.env.SESSION_SECRET'));

app.get('/', (req, res) => {
	if(!req.signedCookies) {
		res.render('index')
	}
	res.render('index2');
})

app.use('/users', authMiddleware.requireAuth, userRouter);
app.use('/auth', authRouter);
app.use('/stream', streamRouter);
app.use('/register', registerRouter);


app.listen(port, () => console.log('Server listening or port ' + port));
