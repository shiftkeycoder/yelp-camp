const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');

module.exports = {
  app: app,
  path: path,
  init() {
    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, '../views'));
    app.use(express.urlencoded({ extended: true }));
    app.use(methodOverride('_method'));
    app.use(express.static('web'));
    app.use(cookieParser('YelpCamp'));
  },
  listen() {
    app.listen(process.env.PORT, process.env.IP, () => {
      console.log(`Serving on port: ${process.env.PORT}`);
    });
  }
};