const express = require('express');
const app = express();
const path = require('path');

module.exports = {
  app: app,
  path: path,
  init() {
    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, '../views'));
  },
  listen() {
    app.listen(process.env.PORT, process.env.IP, () => {
      console.log(`Serving on port: ${process.env.PORT}`);
    });
  }
};