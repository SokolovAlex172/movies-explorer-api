/* eslint-disable linebreak-style */
const router = require('express').Router();
const userRouter = require('./users');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const { validateSignIn, validateSignUp } = require('../middlewares/validation');
const NotFound = require('../errors/not-found');

router.post('/signin', validateSignIn(), login);
router.post('/signup', validateSignUp(), createUser);

router.use(auth);
router.use('/users', userRouter);

router.use(auth, userRouter);

router.use('*', (req, res, next) => {
  next(new NotFound('Запрашиваемая страница не существует'));
});

module.exports = router;
