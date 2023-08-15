/* eslint-disable linebreak-style */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const NotFound = require('./errors/not-found');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const { PORT = 3000 } = process.env;

const routes = require('./routes');
const errorHandler = require('./middlewares/error-handler');

const allowedCors = [
  'http://sokolov172.nomoreparties.co',
  'https://sokolov172.nomoreparties.co',
  'http://api.sokolov171.nomoreparties.co',
  'https://api.sokolov171.nomoreparties.co',
  'localhost:3000',
  'http://localhost',
  'http://localhost:3001',
  'http://localhost:3000',
];

const corsOptions = {
  origin: allowedCors,
  optionsSuccessStatus: 200,
  credentials: true,
};

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

app.use(helmet());
app.use(bodyParser.json());

app.use(requestLogger);

app.use(cors(corsOptions));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', routes);

app.use((req, res, next) => {
  next(new NotFound('Маршрут не найден'));
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(PORT);
});
