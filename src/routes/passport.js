const express = require('express');
const passport = require('../config/passport');

const userController = require('../controllers/user');

const router = express.Router();

// OAuth Authentication, Just going to this URL will open OAuth screens
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Oauth user data comes to these redirectURLs
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  userController.getAuth
);

router.get('/auth/github', passport.authenticate('github'));

router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  userController.getAuth
);

module.exports = router;
