const express = require('express');
const multer = require('../middlewares/upload');
const passport = require('../config/passport');

const router = express.Router();

const userController = require('../controllers/user');

router.post('/users', userController.signupUser);
router.post('/users/login', userController.loginUser);
router.get(
  '/users/me',
  passport.authenticate('jwt', { session: false }),
  userController.getProfile
);

router.patch(
  '/users/me',
  passport.authenticate('jwt', { session: false }),
  multer,
  userController.updateUser,
  userController.errorManager
);

module.exports = router;
