var express = require('express');
var multer = require('multer');

var controller = require('../controllers/user.controller');
var authMiddeware = require('../middleware/auth.login');
var authController = require('../controllers/auth.controller');
var validate = require('../validate/user.validate');
var validateOldPassWord = require('../validate/userPassword.validate');
var router = express.Router();
var upload = multer({ dest: './public/upload/' });
var uploadMd = multer({ dest: './public/mdFile' });

// Login logout

router.get('/', authMiddeware.requireAuthAdmin, controller.index);

router.get('/:id/logout', authController.logOut);

// End login logout

router.get('/:id/books', controller.booksOfUser)


router.get('/:id/movies', controller.moviesOfUser);

router.get('/:id/songs', controller.songsOfUser);

router.get('/:id/blogs', controller.blogsOfUser);

router.get('/search', controller.searchUser);

router.get('/:id/books/search', controller.searchBooks);

router.get('/:id/movies/search', controller.searchMovies);

router.get('/:id/songs/search', controller.searchSongs);

router.get('/:id/blogs/search', controller.searchBlogs);

//User 

router.get('/register', controller.createUser);

router.get('/delete/:id', controller.deleteUser);

router.get('/edit/:id', controller.editInfoUser);

router.post('/edit/:id', 
	validateOldPassWord.validatePassword,
	controller.postEditInfoUser
);

router.post('/create', 
	upload.single('avatar'),
	validate.userRegister,
	controller.postCreateUser
);

// End User

// Books 

router.get('/:id/books/create', controller.createNewBook);

router.get('/delete/book/:id', controller.deleteBook);

router.get('/book/edit/:id', controller.editBook);

router.post('/book/edit/:id', 
	upload.single('cover'),
	controller.postEditBook);

router.post('/:id/books/create', 
	upload.single('cover'),
	controller.postCreateNewBook
);

// End Books

// Movies 

router.get('/:id/movies/create', controller.createNewMovie);

router.get('/delete/movie/:id', controller.deleteMovie);

router.get('/movie/edit/:id', controller.editMovie);

router.post('/movie/edit/:id', 
	upload.single('cover'),
	controller.postEditMovie);

router.post('/:id/movies/create', 
	upload.single('cover'),
	controller.postCreateNewMovie
);

// End Movies

// Blogs 

router.get('/:id/blogs/create', controller.createNewBlog);

router.get('/delete/blog/:id', controller.deleteBlog);

router.get('/blog/edit/:id', controller.editBlog);

router.post('/blog/edit/:id', 
	upload.single('cover'),
	controller.postEditBlog);

router.post('/:id/blogs/create',
	upload.fields([{ name: 'file', maxCount: 1 }, { name: 'cover', maxCount: 1 }]),
	controller.postCreateNewBlog
);

// End Blogs

// Songs 

router.get('/:id/songs/create', controller.createNewSong);

router.get('/delete/song/:id', controller.deleteSong);

router.get('/song/edit/:id', controller.editSong);

router.post('/song/edit/:id', 
	upload.single('cover'),
	controller.postEditSong);

router.post('/:id/songs/create', 
	upload.fields([{ name: 'mp3File', maxCount: 1 }, { name: 'cover', maxCount: 1 }]),
	controller.postCreateNewSong
);

// End Songs


module.exports = router;
