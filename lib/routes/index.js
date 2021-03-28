const svr = require('../express');
const CampsiteRT = require('./include/campsite');
const campsite = new CampsiteRT;


module.exports = app => {
  app.get('/', (req, res) => res.render('home'));
  app.get('/campsites', campsite.index);
};