/* eslint-disable linebreak-style */
const router = require('express').Router();
const { getUser, updateUser } = require('../controllers/users');
const { validationUpdateUser } = require('../middlewares/validation');
const auth = require('../middlewares/auth');

router.use(auth);
router.get('/me', getUser);
router.patch('/me', validationUpdateUser, updateUser);

module.exports = router;
