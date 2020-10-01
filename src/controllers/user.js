const User = require('../models/user');

const signupUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.create({ password, email });
    const token = await user.generateAuthToken();
    await user.createToken({ encoded: token });

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
    await user.createToken({ encoded: token });

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
  console.log('req:', req.body);
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['bio', 'name', 'password', 'phone', 'email', 'profileImage'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid update' });
    }
    if (updates.includes('profileImage')) {
    }
    updates.forEach((update) => {
      if (update === 'profileImage') {
        req.user.profileImage = `${req.file.destination}/${req.file.filename}`;
      } else {
        req.user[update] = req.body[update];
      }
    });

    await req.user.save();
    res.status(200).send({ user: req.user });
  } catch (error) {
    console.log('error:', error);
    req.status(400).send({ error: 'Unable to save the image to database' });
  }
};

const errorManager = (error, req, res, next) => {
  console.log('error:', error);
  res.status(400).send({ error: error.message });
};

module.exports = {
  signupUser,
  updateUser,
  loginUser,
  getProfile,
  errorManager,
};
