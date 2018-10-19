var db = require('../db');

module.exports.index = (req, res) => {
	var users = db.get('users')
									.value()
	res.render('users/index', {
		users: users
	})
}

module.exports.books = (req, res) => {
	var closet = db.get('users')
									.value()[0] //mac dinh la nguoi dung dau tien
									.closet[0].books
	res.render('users/books', {
		books: closet
	})
}


module.exports.movies = (req, res) => {
	var closet = db.get('users')
									.value()[0] //mac dinh la nguoi dung dau tien
									.closet[1].movies
	res.render('users/movies', {
		movies: closet
	});
}

module.exports.songs = (req, res) => {
	var closet = db.get('users')
									.value()[0] //mac dinh la nguoi dung dau tien
									.closet[2].songs;
	res.render('users/songs', {
		songs: closet
	});
}

module.exports.blogs = (req, res) => {
	var closet = db.get('users')
									.value()[0] //mac dinh la nguoi dung dau tien
									.closet[3].blogs
	res.render('users/blogs', {
		blogs: closet
	});
}


module.exports.searchUser = (req, res) => {
	var q = req.query.q;
	var matchedUsers = db.get('users').filter(user => {
		return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
	});
	res.render('users/index', {
		users: matchedUsers.value()
	})			
}


module.exports.searchBooks = (req, res) => {
	var q = req.query.q;
	var matchedBooks = db.get('users')
													.value()[0]  // mac dinh search books in closet cua nguoi dung 1
													.closet[0].books
													.filter(book => book.name.toLowerCase().indexOf(q.toLowerCase()) !== -1 )
	res.render('users/books', {
		books: matchedBooks
	})
}

module.exports.searchMovies = (req, res) => {
	var q = req.query.q;
	var matchedMovies = db.get('users')
													.value()[0]  // mac dinh search books in closet cua nguoi dung 1
													.closet[1].movies
													.filter(movie => movie.name.toLowerCase().indexOf(q.toLowerCase()) !== -1 )
	res.render('users/movies', {
		movies: matchedMovies
	})
}

module.exports.searchSongs = (req, res) => {
	var q = req.query.q;
	var matchedSongs = db.get('users')
													.value()[0]  // mac dinh search books in closet cua nguoi dung 1
													.closet[2].songs
													.filter(song => song.name.toLowerCase().indexOf(q.toLowerCase()) !== -1 )
	res.render('users/songs', {
		songs: matchedSongs
	})
}

module.exports.searchBlogs = (req, res) => {
	var q = req.query.q;
	var matchedBlogs = db.get('users')
													.value()[0]  // mac dinh search books in closet cua nguoi dung 1
													.closet[3].blogs
													.filter(blog => blog.title.toLowerCase().indexOf(q.toLowerCase()) !== -1 )
	res.render('users/blogs', {
		blogs: matchedBlogs
	})
}
