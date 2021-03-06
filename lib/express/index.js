const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Member = require('../models/member');
const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
const { props } = require('./include/middleware');
const { contentPolicy } = require('./include/content-security');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const { CLOUD_DB, SECRET } = process.env;
const storeOptions = {
  mongoUrl: CLOUD_DB,
  secret: SECRET || 'yelpcampsecret',
  touchAfter: 24 * 60 * 60
};
const sessionOptions = {
  name: 'nomad',
  secret: SECRET ||'yelpcampsecret',
  store: MongoStore.create(storeOptions),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + ONE_WEEK,
    maxAge: ONE_WEEK
  }
};
const flash = require('connect-flash');

module.exports = {
  app: app,
  path: path,
  init() {
    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, '../../views'));
    app.use(express.urlencoded({ extended: true }));
    app.use(methodOverride('_method'));
    app.use(express.static('web'));
    app.use(cookieParser('YelpCamp'));
    app.use(session(sessionOptions));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(Member.authenticate()));
    passport.serializeUser(Member.serializeUser());
    passport.deserializeUser(Member.deserializeUser());
    app.use(props);
    app.use(mongoSanitize({ replaceWith: '_'}));
    app.use(helmet.contentSecurityPolicy(contentPolicy));
  },
  listen() {
    app.listen(process.env.PORT, process.env.IP, () => {
      console.log(`Serving on port: ${process.env.PORT}`);
    });
  }
};