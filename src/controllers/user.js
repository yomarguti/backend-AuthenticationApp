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

const updateUser = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['bio', 'name', 'password', 'phone', 'email'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update' });
  }

  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (!user) {
      return res.status(400).send({ error: 'User not found' });
    }
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    res.status(200).send(user);
  } catch (error) {
    console.log('error:', error);
    return res.status(400).send({ error: 'User not updated' });
  }
};

const getProfile = (req, res) => {
  res.status(200).send({ user: req.user });
};

const uploadAvatar = async (req, res) => {
  try {
    const filePath = `${req.file.destination}/${req.file.filename}`;

    req.user.profileImage = filePath;

    await req.user.save();
    res.status(200).send({ user: req.user });
  } catch (error) {
    req.status(400).send({ error: 'Unable to save the image to database' });
  }
};

module.exports = {
  signupUser,
  updateUser,
  loginUser,
  getProfile,
  uploadAvatar,
};
