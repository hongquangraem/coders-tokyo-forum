var db = require('../db');

module.exports.products = (req, res) => {
	res.render(userId + '/products/books', {
		userId : req.signedCookies.userId
	})
}

module.exports.booksOfUser = (req, res) => {
	var page = parseInt(req.query.page) || 1; //n
	var perPage = 4; // x
	var start = (page - 1) * perPage;
	var end = page * perPage;
	let userId = req.params.id;
	let user = db.get('users')
							 .find({ id : userId })
							 .value()
	books = user.closet[0].books.slice(start, end)
	res.render('products/books', {
		user : user,
		books: books,
		page: page
	})
}

module.exports.moviesOfUser = (req, res) => {
	res.render('products/movies')
}

module.exports.songsOfUser = (req, res) => {
	let userId = req.params.id;
	let user = db.get('users')
							 .find({ id : userId })
							 .value()
	songs = user.closet[2].songs
	let lyricsSongsArray = songs.reduce((obj, song, index) => {
		obj[song.id] = song.lyrics
		return obj
	},{})
	res.render('products/songs', {
		user : user,
		songs: songs,
		lyrics: lyricsSongsArray
	})
}

module.exports.blogsOfUser = (req, res) => {
	res.render('products/blogs')
}

