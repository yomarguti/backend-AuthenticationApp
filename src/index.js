require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');

const db = require('./db/index');
require('./db/config');

const API_PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());

//Routes
const userRoute = require('./routes/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

//Static
app.use('/users/me/avatar', express.static(path.join(__dirname, `../avatars`)));

//Routes
app.use('/api', userRoute);

db.sync()
  .then(() => {
    app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
  })
  .catch((e) => {
    console.log('Error ', e);
  });
