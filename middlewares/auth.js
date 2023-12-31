/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');
const AuthorizedError = require('../errors/authorization-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthorizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret');
  } catch (err) {
    next(new AuthorizedError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
