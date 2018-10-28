var express = require('express');

var router = express.Router();
var controller = require('../controllers/products.controller');

router.get('/', controller.products);

router.get('/:id/books', controller.booksOfUser);

router.get('/:id/movies', controller.moviesOfUser);

router.get('/:id/songs', controller.songsOfUser);

router.get('/:id/blogs', controller.blogsOfUser);

module.exports = router;
