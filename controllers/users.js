/* eslint-disable linebreak-style */
const mongooseError = require('mongoose').Error;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/bad-request');
const NotFound = require('../errors/not-found');
const Conflict = require('../errors/conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => next(new NotFound('Пользователь по указанному _id не найден')))
    .then((users) => res.send(users))
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные'));
      } return next(error);
    });
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((({ _id }) => User.findById(_id)))
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.code === 11000) {
        next(new Conflict('Пользователь с таким email уже существует'));
        return;
      }
      if (error instanceof mongooseError.ValidationError) {
        next(new BadRequest('Переданы некорректные данные'));
        return;
      }
      next(error);
    });
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;

  const { name, email } = req.body;
  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .orFail(() => next(new NotFound('Пользователь с указанным _id не найден')))
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные'));
      }
      if (error.code === 11000) {
        next(new Conflict('Пользователь с таким email уже существует'));
      }
      return next(error);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, `${NODE_ENV === 'production' ? JWT_SECRET : 'yandex-praktikum'}`, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  login,
};
