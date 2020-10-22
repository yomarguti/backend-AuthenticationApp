const User = require('../models/user');
const path = require('path');

const signupUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.create({ password, email });
    const token = await user.generateAuthToken();

    res.status(200).send({ user, token });
  } catch (error) {
    console.log('error:', error);
    res.status(400).send({ error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email, password);
    const token = await user.generateAuthToken();

    res.status(200).send({ user, token });
  } catch (error) {
    console.log('error:', error);
    res.status(401).send({ error: 'Unable to login' });
  }
};

const getProfile = (req, res) => {
  res.status(200).send({ user: req.user });
};

const updateUser = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['bio', 'name', 'password', 'phone', 'email', 'profileImage', 'avatar'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid update' });
    }

    updates.forEach((update) => {
      if (update === 'avatar') {
        req.user.profileImage = `${req.file.filename}`;
      } else {
        req.user[update] = req.body[update];
      }
    });

    await req.user.save();

    const { password, ...user } = req.user;

    res.status(200).send({ user });
  } catch (error) {
    console.log('error:', error);
    req.status(400).send({ error: 'Unable to save the image to database' });
  }
};

const getAvatar = (req, res) => {
  try {
    const url = path.join(__dirname, `../../${req.user.profileImage}`);
    res.set('content-type', 'image/jpeg');
    res.status(200).sendFile(url);
  } catch (error) {
    console.log('error:', error);
    req.status(400).send({ error: 'Unable to retrieve avatar' });
  }
};

const errorManager = (error, req, res, next) => {
  console.log('error:', error);
  res.status(400).send({ error: error.message });
};

const getAuth = async (req, res) => {
  const token = await req.user.generateAuthToken();
  res.redirect(`${process.env.REDIRECT_URL}/me/${token}`);
};

module.exports = {
  signupUser,
  updateUser,
  loginUser,
  getProfile,
  errorManager,
  getAvatar,
  getAuth,
};
