const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportConfig = require('./config/passport');

//passport config
passport.use(new LocalStrategy(passportConfig.options, passportConfig.logic));
passportConfig.serial();
passportConfig.deserial();

//connect to mongo
const db = require('./config/keys').MongoUri;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

//bodyparser
app.use(express.urlencoded({ extended: false }));

//express session
app.use(
  session({
    secret: 'learning web',
    resave: true,
    saveUninitialized: true,
  })
);

//passport
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

//server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('server has started'));
