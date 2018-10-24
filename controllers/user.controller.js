var db = require('../db');
var md5 = require('md5');
var shortid = require('shortid');
var _ = require('lodash');

module.exports.index = (req, res) => {
	var users = db.get('users')
									.value()
	res.render('users/index', {
		users: users
	});
}

module.exports.booksOfUser = (req, res) => {
	var user = db.get('users')
						   .find({id : req.params.id})
						   .value()
	var books = user.closet[0].books;
	res.render('users/books', {
		books: books
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

module.exports.moviesOfUser = (req, res) => {
	var user = db.get('users')
						   .find({id : req.params.id})
						   .value()
	var movies = user.closet[1].movies;
	res.render('users/movies', {
		movies: movies
	})
}

module.exports.songsOfUser = (req, res) => {
	var user = db.get('users')
						   .find({id : req.params.id})
						   .value()
	var songs = user.closet[2].songs;
	res.render('users/songs', {
		songs: songs
	})
}



module.exports.blogsOfUser = (req, res) => {
	var user = db.get('users')
						   .find({id : req.params.id})
						   .value()
	var blogs = user.closet[3].blogs;
	res.render('users/blogs', {
		blogs: blogs
	})
}

//  Search feature


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
	var user = db.get('users')
						   .find({id : req.params.id})
						   .value()
	var matchedBooks = user.closet[0].books
												 .filter(book => book.name.toLowerCase().indexOf(q.toLowerCase()) !== -1 )
	res.render('users/books', {
		books: matchedBooks
	})
}

module.exports.searchMovies = (req, res) => {
	var q = req.query.q;
	var user = db.get('users')
						   .find({id : req.params.id})
						   .value()
	var matchedMovies = user.closet[1].movies
												  .filter(movie => movie.name.toLowerCase().indexOf(q.toLowerCase()) !== -1 )
	res.render('users/movies', {
		movies: matchedMovies
	})
}

module.exports.searchSongs = (req, res) => {
	var q = req.query.q;
	var user = db.get('users')
						   .find({id : req.params.id})
						   .value()
	var matchedSongs = user.closet[2].songs
												  .filter(song => song.name.toLowerCase().indexOf(q.toLowerCase()) !== -1 )
	res.render('users/songs', {
		songs: matchedSongs
	})
}

module.exports.searchBlogs = (req, res) => {
	var q = req.query.q;
	var user = db.get('users')
						   .find({id : req.params.id})
						   .value()
	var matchedBlogs = user.closet[3].blogs
												  .filter(blog => blog.title.toLowerCase().indexOf(q.toLowerCase()) !== -1 )
	res.render('users/blogs', {
		blogs: matchedBlogs
	})
}

//  Create user

module.exports.createUser =(req, res) => {
	res.render('users/register')
}

module.exports.postCreateUser = (req, res) => {
	req.body.id = shortid.generate();
	req.body.closet = [
											{ "books" : [] },
											{ "movies": [] },
											{ "songs" : [] },
											{ "blogs" : [] }
										];
	req.body.password = md5(req.body.password);
	if (Object.keys(req).indexOf('file') === -1) {
		req.body.avatar = 'upload/2261c205c93b9aa7059d9c3fe7febdd4'
	} else {
		req.body.avatar = req.file.path.split('/').slice(1).join('/');
	}
	db.get('users')
		.push(req.body)
		.write();
	res.redirect('/users');

}

module.exports.deleteUser = (req, res) => {
	var id = req.params.id;
  db.get('users')
  	.remove({ id: id })
  	.write()
  res.redirect('/users')
}


module.exports.editInfoUser = (req, res) => {
	var userId = req.params.id;
	var user = db.get('users')
		.find({ id: userId })
		.value(); 
	res.render('users/editInfoUser', {
		user: user
	});
}

module.exports.postEditInfoUser = (req, res) => {
	var id = req.params.id;
	var newPassword = req.body.newPassword;
	var hashedPassword = md5(newPassword);
	var name = req.body.name;

	db.get('users')
  	.find({ id: id })
  	.assign(
  					{ name: name },
  					{ password: hashedPassword },
					)
  	.write()
  res.redirect('/users');
}


//  Products

// Books

module.exports.createNewBook = (req, res) => {
	res.render('users/createNewBook');
}

module.exports.postCreateNewBook = (req, res) => {
	var id = req.params.id;
	var user = db.get('users')
						   .find({id : id})
						   .value()			// tim user de push sach

	req.body.id = shortid.generate();
	if (Object.keys(req).indexOf('file') === -1) {   // neu ko chon gui anh len thi set default cover la anh kia
		req.body.cover = 'upload/2261c205c93b9aa7059d9c3fe7febdd4'
	} else {
		req.body.cover = req.file.path.split('/').slice(1).join('/');
	}
	user.closet[0].books
			.push(req.body)
	db.write();
  res.redirect('/users/' + user.id + '/books');
}

module.exports.deleteBook = (req, res) => {
	var id = req.signedCookies.userId;
	var bookId = req.params.id;
	var user = db.get('users')
						   .find({id : id})
						   .value()
	var bookWillbeRemove = user.closet[0].books
														 .find(book => book.id === bookId)
	var books = user.closet[0].books

  _.remove(books, bookWillbeRemove) // lodash library deleting book in books array
  db.write();

  res.redirect('/users/' + user.id +'/books')
}

module.exports.editBook = (req, res) => {
	var bookId = req.params.id;
	var book = db.get('users').first() // mac dinh add sach vao user dau tien === admin
	.get('closet').first()  
	.value().books
	.find(book => book.id === bookId);
  res.render('users/editBook', {
  	book: book
  });
}

module.exports.postEditBook = (req, res) => {
	var id = req.params.id;
	var newName = req.body.name;
	var newAuthor = req.body.author;
	var newDescription = req.body.description;

	let bookToEdit = db.get('users').first()
										 .get('closet').first()
										 .value().books
									   .find((e => e.id === id))

	bookToEdit.name = newName;
	bookToEdit.author = newAuthor;
	if (newDescription === ''){
		newDescription = bookToEdit.description;
	} else {	
		bookToEdit.description = newDescription;
	}
  db.write();
  res.redirect('../../books')
}

// End Books

// Movies

module.exports.createNewMovie = (req, res) => {
	res.render('users/createNewMovie');
}

module.exports.postCreateNewMovie = (req, res) => {
	var id = req.params.id;
	var user = db.get('users')
						   .find({id : id})
						   .value()			// tim user de push sach

	req.body.id = shortid.generate();
	if (Object.keys(req).indexOf('file') === -1) {   // neu ko chon gui anh len thi set default cover la anh kia
		req.body.cover = 'upload/2261c205c93b9aa7059d9c3fe7febdd4'
	} else {
		req.body.cover = req.file.path.split('/').slice(1).join('/');
	}
	user.closet[1].movies
			.push(req.body)
	db.write();
  res.redirect('/users/' + user.id + '/movies');
}

module.exports.deleteMovie = (req, res) => {
	var id = req.signedCookies.userId;
	var movieId = req.params.id;
	var user = db.get('users')
						   .find({id : id})
						   .value()
	var movieWillbeRemove = user.closet[1].movies
														 .find(movie => movie.id === movieId)
	var movies = user.closet[1].movies

  _.remove(movies, movieWillbeRemove) // lodash library deleting book in books array
  db.write();

  res.redirect('/users/' + user.id +'/movies')
}

module.exports.editMovie= (req, res) => {
	var movieId = req.params.id;
	var movie = db.get('users')
							  .value()[0]
							  .closet[1]
							  .movies
								.find(movie => movie.id === movieId);
  res.render('users/editMovie', {
  	movie: movie
  });
}

module.exports.postEditMovie = (req, res) => {
	var movieId = req.params.id;
	var newName = req.body.name;
	var newActors = req.body.actors;
	var newPreview = req.body.preview;

	let movieToEdit = db.get('users')
										  .value()[0]
										  .closet[1]
										  .movies
											.find(movie => movie.id === movieId);
	movieToEdit.name = newName;
	movieToEdit.actors = newActors;
	if (newPreview === ''){
		newPreview = movieToEdit.preview;
	} else {	
		movieToEdit.preview = newPreview;
	}
  db.write();
  res.redirect('../../movies')
}

// End Movies

// Blogs

module.exports.createNewBlog = (req, res) => {
	res.render('users/createNewBlog');
}

module.exports.postCreateNewBlog = (req, res) => {
	var id = req.params.id;
	var user = db.get('users')
						   .find({id : id})
						   .value()			// tim user de push sach

	req.body.id = shortid.generate();
	if (Object.keys(req.files).indexOf('cover') === -1) {   // neu ko chon gui anh len thi set default cover la anh kia
		req.body.cover = 'upload/2261c205c93b9aa7059d9c3fe7febdd4'
	} else {
		req.body.cover = req.files["cover"][0].path.split('/').slice(1).join('/');
	}
	req.body.article= req.files["file"][0].path.split('/').slice(1).join('/');

	user.closet[3].blogs
			.push(req.body)
	db.write();
  res.redirect('/users/' + user.id + '/blogs');
}

module.exports.deleteBlog = (req, res) => {
	var id = req.signedCookies.userId;
	var blogId = req.params.id;
	var user = db.get('users')
						   .find({id : id})
						   .value()
	var blogWillBeRemove = user.closet[3].blogs
														 .find(movie => movie.id === blogId)
	var blogs = user.closet[3].blogs

  _.remove(blogs, blogWillBeRemove) // lodash library deleting book in books array
  db.write();

  res.redirect('/users/' + user.id +'/blogs')

	var blogId = req.params.id;
}

module.exports.editBlog = (req, res) => {
	var blogId = req.params.id;
	var blog = db.get('users')
							  .value()[0]
							  .closet[3]
							  .blogs
								.find(blog => blog.id === blogId);
  res.render('users/editBlog', {
  	blog: blog
  });
}

module.exports.postEditBlog = (req, res) => {
	var blogId = req.params.id;
	var newTitle = req.body.title;
	var newAuthor = req.body.author;
	var newDescription = req.body.description;

	let blogToEdit = db.get('users')
										  .value()[0]
										  .closet[3]
										  .blogs
											.find(blog => blog.id === blogId);
											
	blogToEdit.title = newTitle;
	blogToEdit.author = newAuthor;
	if (newDescription === ''){
		newDescription = blogToEdit.description;
	} else {	
		blogToEdit.description = newDescription;
	}
  db.write();
  res.redirect('../../blogs')
}

// End Blogs

// Songs

module.exports.createNewSong = (req, res) => {
	res.render('users/createNewSong');
}

module.exports.postCreateNewSong = (req, res) => {
	var id = req.params.id;
	var user = db.get('users')
						   .find({id : id})
						   .value()			// tim user de push sach

	req.body.id = shortid.generate();
	if (Object.keys(req.files).indexOf('cover') === -1) {   // neu ko chon gui anh len thi set default cover la anh kia
		req.body.cover = 'upload/2261c205c93b9aa7059d9c3fe7febdd4'
	} else {
		req.body.cover = req.files["cover"][0].path.split('/').slice(1).join('/');
	}
	req.body.mp3File= req.files["mp3File"][0].path.split('/').slice(1).join('/');
	user.closet[2].songs
			.push(req.body)
	db.write();

  res.redirect('/users/' + user.id + '/songs');
}

module.exports.deleteSong = (req, res) => {
	var id = req.signedCookies.userId;
	var songId = req.params.id;
	var user = db.get('users')
						   .find({id : id})
						   .value()
	var songWillBeRemove = user.closet[2].songs
														 .find(movie => movie.id === songId)
	var songs = user.closet[2].songs

  _.remove(songs, songWillBeRemove) // lodash library deleting book in books array
  db.write();

  res.redirect('/users/' + user.id +'/songs')
}

module.exports.editSong = (req, res) => {
	var songId = req.params.id;
	var song = db.get('users')
							  .value()[0]
							  .closet[2]
							  .songs
								.find(song => song.id === songId);
  res.render('users/editSong', {
  	song: song
  });
}

module.exports.postEditSong = (req, res) => {
	var songId = req.params.id;
	var newName = req.body.name;
	var newComposers = req.body.composers;
	var newSingers = req.body.singers;
	var newLyrics = req.body.lyrics

	let songToEdit = db.get('users')
										  .value()[0]
										  .closet[2]
										  .songs
											.find(song => song.id === songId);
											
	songToEdit.name = newName;
	songToEdit.composers = newComposers;
	songToEdit.singers = newSingers;
	songToEdit.lyrics = newLyrics;
	if (newLyrics === ''){
		newLyrics = songToEdit.lyrics;
	} else {	
		songToEdit.lyrics = newLyrics;
	}
  db.write();
  res.redirect('../../songs')
}
