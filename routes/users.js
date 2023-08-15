/* eslint-disable linebreak-style */
const router = require('express').Router();
const { getUser, updateUser } = require('../controllers/users');
const { validationGetUser, validationUpdateUser } = require('../middlewares/validation');

router.get('/me', validationGetUser, getUser);
router.patch('/me', validationUpdateUser, updateUser);

module.exports = router;
