const express = require('express');
const auth = require('../middlewares/auth');

const router = express.Router();

const userController = require('../controllers/user');

router.post('/users', userController.signupUser);
router.patch('/users/:id', auth, userController.updateUser);
router.post('/users/login', userController.loginUser);
router.get('/users/me', auth, userController.getProfile);

module.exports = router;
