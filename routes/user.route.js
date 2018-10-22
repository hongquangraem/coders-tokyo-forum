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

router.get('/logout', authController.logOut);

// End login logout


router.get('/books', controller.books);

router.get('/movies', controller.movies);

router.get('/songs', controller.songs);

router.get('/blogs', controller.blogs);

router.get('/search', controller.searchUser);

router.get('/books/search', controller.searchBooks);

router.get('/movies/search', controller.searchMovies);

router.get('/songs/search', controller.searchSongs);

router.get('/blogs/search', controller.searchBlogs);

//User 

router.get('/create', controller.createUser);

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

router.get('/books/create', controller.createNewBook);

router.get('/books/delete/:id', controller.deleteBook);

router.get('/books/edit/:id', controller.editBook);

router.post('/books/edit/:id', controller.postEditBook);

router.post('/books/create', 
	upload.single('cover'),
	controller.postCreateNewBook
);

// End Books

// Movies 

router.get('/movies/create', controller.createNewMovie);

router.get('/movies/delete/:id', controller.deleteMovie);

router.get('/movies/edit/:id', controller.editMovie);

router.post('/movies/edit/:id', controller.postEditMovie);

router.post('/movies/create', 
	upload.single('cover'),
	controller.postCreateNewMovie
);

// End Movies

// Blogs 

router.get('/blogs/create', controller.createNewBlog);

router.get('/blogs/delete/:id', controller.deleteBlog);

router.get('/blogs/edit/:id', controller.editBlog);

router.post('/blogs/edit/:id', controller.postEditBlog);

router.post('/blogs/create',
	upload.fields([{ name: 'file', maxCount: 1 }, { name: 'cover', maxCount: 1 }]),
	controller.postCreateNewBlog
);

// End Blogs

// Songs 

router.get('/songs/create', controller.createNewSong);

router.get('/songs/delete/:id', controller.deleteSong);

router.get('/songs/edit/:id', controller.editSong);

router.post('/songs/edit/:id', controller.postEditSong);

router.post('/songs/create', 
	upload.fields([{ name: 'mp3File', maxCount: 1 }, { name: 'cover', maxCount: 1 }]),
	controller.postCreateNewSong
);

// End Songs

module.exports = router;
