/* eslint-disable linebreak-style */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const { limiter } = require('./middlewares/limiter');
const { PORT, DB_ADDRESS } = require('./utils/config');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
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

mongoose.connect(DB_ADDRESS);

app.use(helmet());

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(requestLogger);

app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(PORT);
});
