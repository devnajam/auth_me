const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//load user model
const User = require('../models/User');

const options = {
  usernameField: 'email',
};

module.exports = {
  options: options,
  logic: async (email, password, done) => {
    console.log(emai, password);
    const user = await User.findOne({ email: email });
    if (!user) {
      return done(null, false, { message: 'the email is not registered' });
    }
    //if there is user check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Password incorrect' });
    }
  },
  serial: () => {
    passport.serializeUser((id, done) => {
      done(null, id);
    });
  },
  deserial: () => {
    passport.deserializeUser((id, done) => {
      User.findById(id, (err, user) => {
        done(err, user);
      });
    });
  },
};
