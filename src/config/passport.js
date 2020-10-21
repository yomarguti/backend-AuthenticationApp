const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

//PassportConfig
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

//JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, cb) => {
      const user = await User.findOne({ where: { id: jwtPayload.id } });
      if (user) return cb(null, user);

      return cb(new Error('user not found'));
    }
  )
);

//Google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const name = profile.displayName;
        const email = profile.emails[0].value;
        const user = await getUser(email, 'google', name);
        cb(null, user);
      } catch (error) {
        console.log('error:', error);
        return cb(error, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3001/auth/github/callback',
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const email = profile.emails[0].value;
        const user = await getUser(email, 'github');
        cb(null, user);
      } catch (error) {
        console.log('error:', error);
        return cb(error, null);
      }
    }
  )
);

const getUser = async (email, provider, name = '') => {
  const user = await User.findOne({ where: { email } });
  if (user) return user;
  const newUser = await User.create({ name, email, provider });
  if (newUser) return newUser;
};

module.exports = passport;
