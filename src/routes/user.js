const express = require('express');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/upload');

const router = express.Router();

const userController = require('../controllers/user');

router.post('/users', userController.signupUser);
router.patch('/users/:id', auth, userController.updateUser);
router.post('/users/login', userController.loginUser);
router.get('/users/me', auth, userController.getProfile);
router.post(
  '/users/me/avatar',
  [auth, multer],
  userController.uploadAvatar,
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;
