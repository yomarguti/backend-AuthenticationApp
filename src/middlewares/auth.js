const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { id: decoded.id } });
    const storedToken = await user.getTokens({ where: { encoded: token } });

    if (!storedToken) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('error:', error);
    res.status(401).send({ error: 'An error ocurred during authentication.' });
  }
};

module.exports = auth;
