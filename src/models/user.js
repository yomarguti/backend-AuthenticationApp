'use strict';
const Sequelize = require('sequelize/index');
const sequelize = require('../db/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = sequelize.define(
  'user',
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    bio: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isNumeric: true,
        len: [10],
      },
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: [6, 250],
      },
    },
  },
  {
    timestamps: false,
  }
);

async function encryptPasswordIfChanged(user, options) {
  if (user.changed('password')) {
    const hashedPassword = await bcrypt.hash(user.password, 8);
    user.password = hashedPassword;
  }
}

User.prototype.generateAuthToken = function () {
  const user = this;
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

User.findByEmail = async function (email, password) {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login');
  }

  return user;
};

User.beforeSave(encryptPasswordIfChanged);
User.beforeUpdate(encryptPasswordIfChanged);

module.exports = User;
