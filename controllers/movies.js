/* eslint-disable linebreak-style */
const Movie = require('../models/movie');
const BadRequest = require('../errors/bad-request');
const NotFound = require('../errors/not-found');
const Forbidden = require('../errors/forbidden');

const getMovies = (req, res, next) => {
  const { _id } = req.user;

  Movie.find({ owner: _id })
    .then((movies) => {
      if (!movies) {
        next(new NotFound('Фильмы не найдены'));
      }
      res.send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
  } = req.body;

  const { _id } = req.user;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
    owner: _id,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
        return;
      }
      next(error);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFound('Фильм с указанным _id не найден');
    })
    .then((movie) => {
      if (req.user._id !== movie.owner._id.toString()) {
        throw new Forbidden('Удаление запрещено');
      }
      return Movie.findByIdAndRemove(req.params.movieId);
    })
    .then((movie) => {
      res.send(movie);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else if (error.name === 'NotFound') {
        next(new NotFound('Фильм с указанным _id не найден'));
      } else {
        next(error);
      }
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
