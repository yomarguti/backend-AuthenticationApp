const express = require('express');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/upload');

const router = express.Router();

const userController = require('../controllers/user');

router.post('/users', userController.signupUser);
router.post('/users/login', userController.loginUser);
router.get('/users/me', auth, userController.getProfile);
router.patch('/users/me', [auth, multer], userController.updateUser, userController.errorManager);
// router.get('/users/me/avatar', auth, userController.getAvatar);

module.exports = router;
