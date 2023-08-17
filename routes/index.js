/* eslint-disable linebreak-style */
const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const { validateSignIn, validateSignUp } = require('../middlewares/validation');
const NotFound = require('../errors/not-found');

router.post('/signin', validateSignIn(), login);
router.post('/signup', validateSignUp(), createUser);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use(auth);
router.use('*', (req, res, next) => {
  next(new NotFound('Запрашиваемая страница не существует'));
});

module.exports = router;
