var db = require('../db');
var fs = require('fs');
var showdown  = require('showdown');
var converter = new showdown.Converter();

module.exports.products = (req, res) => {
	res.render(userId + '/products/books', {
		userId : req.signedCookies.userId
	})
}

module.exports.booksOfUser = (req, res) => {
	var page = parseInt(req.query.page) || 1; //n
	var perPage = 3; // x
	var start = (page - 1) * perPage;
	var end = page * perPage;
	let userId = req.params.id;
	let user = db.get('users') // find books of user to load books
							 .find({ id : userId })
							 .value()
	let userWallId = req.signedCookies.userId;
	let userWall = db.get('users')	// find userWall to display name and avatar
										.find({ id : userWallId })
										.value()
	let totalPages = Math.ceil(user.closet[0].books.length / perPage);
	books = user.closet[0].books.slice(start, end);
	console.log(totalPages);
	res.render('products/books', {
		user : user,
		userWall: userWall,
		books: books,
		page: page,
		totalPages : totalPages,
		url: req.originalUrl
	})
}

module.exports.moviesOfUser = (req, res) => {
	var page = parseInt(req.query.page) || 1; //n
	var perPage = 3; // x
	var start = (page - 1) * perPage;
	var end = page * perPage;
	let userId = req.params.id;
	let user = db.get('users') // find books of user to load books
							 .find({ id : userId })
							 .value()
	let userWallId = req.signedCookies.userId;
	let userWall = db.get('users')	// find userWall to display name and avatar
										.find({ id : userWallId })
										.value()
	let totalPages = Math.ceil(user.closet[1].movies.length / perPage);
	movies = user.closet[1].movies.slice(start, end);
	console.log(totalPages);
	res.render('products/movies', {
		user : user,
		userWall: userWall,
		movies: movies,
		page: page,
		totalPages : totalPages,
		url: req.originalUrl
	})
}

module.exports.songsOfUser = (req, res) => {
	var page = parseInt(req.query.page) || 1; //n
	var perPage = 4; // x
	var start = (page - 1) * perPage;
	var end = page * perPage;
	let userId = req.params.id;
	let user = db.get('users')
							 .find({ id : userId })
							 .value()
	let totalPages = Math.ceil(user.closet[2].songs.length / perPage);
	songs = user.closet[2].songs.slice(start, end);
	let userWallId = req.signedCookies.userId;
	let userWall = db.get('users')	// find userWall to display name and avatar
										.find({ id : userWallId })
										.value()
	res.render('products/songs', {
		user : user,
		userWall: userWall,
		songs: songs,
		page: page,
		totalPages: totalPages,
		url: req.originalUrl
	})
}

module.exports.blogsOfUser = (req, res) => {
	var page = parseInt(req.query.page) || 1; //n
	var perPage = 5; // x
	var start = (page - 1) * perPage;
	var end = page * perPage;
	let userId = req.params.id;
	let user = db.get('users')
							 .find({ id : userId })
							 .value()
	let totalPages = Math.ceil(user.closet[3].blogs.length / perPage);
	blogs = user.closet[3].blogs.slice(start, end);
	let userWallId = req.signedCookies.userId;
	let userWall = db.get('users')	// find userWall to display name and avatar
										.find({ id : userWallId })
										.value()
	res.render('products/blogs', {
		user : user,
		userId : userId,
		userWall: userWall,
		blogs: blogs,
		page: page,
		totalPages: totalPages,
		url: req.originalUrl
	})
}

/* Play song */

module.exports.playSong = (req, res) => {
	let songId = req.params.id;
	let userId = req.originalUrl.split('/')[2];
	let user = db.get('users')
							 .find({ id : userId })
							 .value()
	

	let userWallId = req.signedCookies.userId;
	let userWall = db.get('users')	// find userWall to display name and avatar
										.find({ id : userWallId })
										.value()
	allSongsOfUser = user.closet[2].songs;
	let songToPlay = allSongsOfUser.find(song => song.id === songId);

	if (req.query.page) {
		var page = parseInt(req.query.page) || 1; //n
 	} else {
 		var page = Math.ceil((allSongsOfUser.indexOf(songToPlay) + 1) / 4); // phan trang playsong
 	}
	var perPage = 4; // x
	var start = (page - 1) * perPage;
	var end = page * perPage;

	let totalPages = Math.ceil(user.closet[2].songs.length / perPage);						 
	songs = user.closet[2].songs.slice(start, end);
	
	res.render('products/playSong', {
		user : user,
		songs: songs,
		userWall: userWall,
		songToPlay: songToPlay,
		page: page,
		totalPages: totalPages
	})
}

/* Read blog */

module.exports.readBlog = (req, res) => {
	let blogId = req.params.id;
	let userId = req.originalUrl.split('/')[2];
	let userOwnThisBlog = db.get('users')
										 .find({ id : userId })
										 .value()
	let blogsOfUser= userOwnThisBlog.closet[3].blogs;
	let blogToRead = blogsOfUser.find(blog => blog.id === blogId);
	let userWallId = req.signedCookies.userId;
	let userWall = db.get('users')	// find userWall to display name and avatar
										.find({ id : userWallId })
										.value()
	let md = fs.readFileSync('public/' + blogToRead.article, { encoding: 'utf8'} );
	let html = converter.makeHtml(md);
	res.render('products/readBlog', {
		user: userOwnThisBlog,
		userWall: userWall,
		blog: blogToRead,
		article: html
	})
}


