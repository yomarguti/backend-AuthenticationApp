const Sequelize = require('sequelize/index');

const { DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST } = process.env;

const db = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, {
  dialect: 'mysql',
  host: process.env.DATABASE_HOST,
  logging: false,
});

module.exports = db;
