/* eslint-disable linebreak-style */
const router = require('express').Router();
const { getAllMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validationCreateMovie, validationDeleteMovie } = require('../middlewares/validation');
const auth = require('../middlewares/auth');

module.exports = router;

router.use(auth);
router.get('/', getAllMovies);
router.post('/', validationCreateMovie, createMovie);
router.delete('/:movieId', validationDeleteMovie, deleteMovie);

module.exports = router;
