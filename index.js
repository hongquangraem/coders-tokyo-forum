var express = require('express');
var app = express();
var port = 3000;

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
	res.render('index');
})

app.use(express.static('public')); // setup public folder to save css, images, ...

app.listen(port, () => console.log('Server listening or port ' + port));
