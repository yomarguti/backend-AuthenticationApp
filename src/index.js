const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const fs = require('fs');
const passport = require('./config/passport');

const db = require('./db/index');

const API_PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());

app.use(passport.initialize());

//Routes
const userRoutes = require('./routes/user');
const passportRoutes = require('./routes/passport');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

const avatar_dir = path.join(__dirname, `../avatars`);

if (!fs.existsSync(avatar_dir)) fs.mkdirSync(avatar_dir);

//Static
app.use('/users/me/avatar', express.static(avatar_dir));

//Routes append /api
app.use(passportRoutes);
app.use('/api', userRoutes);

db.authenticate()
  .then(() => {
    app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
  })
  .catch((e) => {
    console.log('Error ', e);
  });
