const svr = require('../express');
const CampsiteRT = require('./include/campsite');
const campsite = new CampsiteRT;


module.exports = app => {
  app.get('/', (req, res) => res.render('home'));
  app.get('/campsites', campsite.index);
  app.get('/campsites/new', campsite.create);
  app.get('/campsites/:id', campsite.show);
  app.post('/campsites', campsite.insert);
};