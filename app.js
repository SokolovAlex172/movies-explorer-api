/* eslint-disable linebreak-style */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const allowedCors = [
  'http://sokolov172.nomoredomains.sbs',
  'https://sokolov172.nomoredomains.sbs',
  'http://api.sokolov172.nomoreparties.co',
  'https://api.sokolov172.nomoreparties.co',
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

app.use(cors(corsOptions));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);

app.use('/', routes);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

app.listen(PORT, () => {
  console.log(PORT);
});
