/* eslint-disable linebreak-style */
const { celebrate, Joi } = require('celebrate');
const isUrl = require('validator/lib/isURL');
const BadRequest = require('../errors/bad-request');

const validationUrl = (url) => {
  const validate = isUrl(url);
  if (!validate) {
    throw new BadRequest('Некорректный адрес URL');
  }
  return url;
};

const validateSignIn = () => celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateSignUp = () => celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),

  }),
});

const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
  }),
});

const validationCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().custom(validationUrl).required(),
    trailerLink: Joi.string().custom(validationUrl).required(),
    thumbnail: Joi.string().custom(validationUrl).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validationDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  validateSignIn,
  validateSignUp,
  validationUpdateUser,
  validationCreateMovie,
  validationDeleteMovie,
};
