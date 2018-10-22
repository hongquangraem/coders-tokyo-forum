var db = require('../db');
var md5 = require('md5');
var shortid = require('shortid');
var _ = require('lodash');

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


//  Create user

module.exports.createUser =(req, res) => {
	res.render('users/register')
}

module.exports.postCreateUser = (req, res) => {
	req.body.id = shortid.generate();
	req.body.closet = [];
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
	req.body.id = shortid.generate();
	if (Object.keys(req).indexOf('file') === -1) {   // neu ko chon gui anh len thi set default cover la anh kia
		req.body.cover = 'upload/2261c205c93b9aa7059d9c3fe7febdd4'
	} else {
		req.body.cover = req.file.path.split('/').slice(1).join('/');
	}
	// db.get('users')
	//   .value()[0] // mac dinh add sach vao user dau tien === admin
	//   .closet[0]
	//   .books
	//   .push(req.body)
	// db.write()

// code ben duoi nhin se clean hon ben tren
	db.get('users').first() // mac dinh add sach vao user dau tien === admin
	.get('closet').first()  
	.value().books
	.push(req.body)
	db.write()
  res.redirect('/users/books');
}

module.exports.deleteBook = (req, res) => {
	var id = req.params.id;
	var bookWillbeRemove = db.get('users').first()
												   .get('closet').first()
												   .value().books
													 .find(book => book.id === id); // tim ra book co id trung voi id muon delete
	var books = db.get('users').first()
  							.get('closet').first()
  							.value().books  // lay books array trong db
  
  _.remove(books, bookWillbeRemove) // lodash library deleting book in books array
  db.write();

  res.redirect('/users/books')

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
	req.body.id = shortid.generate();
	if (Object.keys(req).indexOf('file') === -1) {   // neu ko chon gui anh len thi set default cover la anh kia
		req.body.cover = 'upload/2261c205c93b9aa7059d9c3fe7febdd4'
	} else {
		req.body.cover = req.file.path.split('/').slice(1).join('/');
	}
	db.get('users')
  .value()[0]
  .closet[1]
  .movies
  .push(req.body)
  db.write();
  res.redirect('../movies');
}

module.exports.deleteMovie = (req, res) => {
	var id = req.params.id;
	var movieWillbeRemove = db.get('users')
													  .value()[0]
													  .closet[1]
													  .movies
													 .find(book => book.id === id); // tim ra book co id trung voi id muon delete
	var movies = db.get('users')
							  .value()[0]
							  .closet[1]
							  .movies // lay movies array trong db
  _.remove(movies, movieWillbeRemove) // lodash library deleting movie in movies array

  db.write();
  res.redirect('../../movies');

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
	req.body.id = shortid.generate();
	if (Object.keys(req.files).indexOf('cover') === -1) {   // neu ko chon gui anh len thi set default cover la anh kia
		req.body.cover = 'upload/2261c205c93b9aa7059d9c3fe7febdd4'
	} else {
		req.body.cover = req.files["cover"][0].path.split('/').slice(1).join('/');
	}
	req.body.article= req.files["file"][0].path.split('/').slice(1).join('/');
	
	db.get('users')
  .value()[0]
  .closet[3]
  .blogs
  .push(req.body)
  db.write();
  res.redirect('../blogs');
}

module.exports.deleteBlog = (req, res) => {
	var blogId = req.params.id;
	var blogWillbeRemove = db.get('users')
													  .value()[0]
													  .closet[3]
													  .blogs
													 .find(blog => blog.id === blogId ); // tim ra book co id trung voi id muon delete
	var blogs = db.get('users')
							  .value()[0]
							  .closet[3]
							  .blogs // lay movies array trong db
  _.remove(blogs, blogWillbeRemove) // lodash library deleting movie in movies array

  db.write();
  res.redirect('../../blogs');

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
	req.body.id = shortid.generate();
	if (Object.keys(req.files).indexOf('cover') === -1) {   // neu ko chon gui anh len thi set default cover la anh kia
		req.body.cover = 'upload/2261c205c93b9aa7059d9c3fe7febdd4'
	} else {
		req.body.cover = req.files["cover"][0].path.split('/').slice(1).join('/');
	}
	req.body.mp3File= req.files["mp3File"][0].path.split('/').slice(1).join('/');
	db.get('users')
  .value()[0]
  .closet[2]
  .songs
  .push(req.body)
  db.write();
  res.redirect('../songs');
}

module.exports.deleteSong = (req, res) => {
	var songId = req.params.id;
	var songWillbeRemove = db.get('users')
													  .value()[0]
													  .closet[2]
													  .songs
													 .find(song => song.id === songId ); // tim ra book co id trung voi id muon delete
	var songs = db.get('users')
							  .value()[0]
							  .closet[2]
							  .songs // lay movies array trong db
  _.remove(songs, songWillbeRemove) // lodash library deleting movie in movies array

  db.write();
  res.redirect('../../songs');

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
