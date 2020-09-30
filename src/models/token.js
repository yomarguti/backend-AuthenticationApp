'use strict';
const Sequelize = require('sequelize/index');
const sequelize = require('../db/index');

const Token = sequelize.define(
  'token',
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    encoded: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Token;
