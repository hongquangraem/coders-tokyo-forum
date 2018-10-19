var express = require('express');

var controller = require('../controllers/user.controller');

var authMiddeware = require('../middleware/auth.login');

var router = express.Router();

router.get('/', authMiddeware.requireAuthAdmin, controller.index);

router.get('/books', controller.books);

router.get('/movies', controller.movies);

router.get('/songs', controller.songs);

router.get('/blogs', controller.blogs);

router.get('/search', controller.searchUser);

router.get('/books/search', controller.searchBooks);

router.get('/movies/search', controller.searchMovies);

router.get('/songs/search', controller.searchSongs);

router.get('/blogs/search', controller.searchBlogs);

module.exports = router;
