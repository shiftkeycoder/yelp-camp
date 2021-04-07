const svr = require('../express');
const CampsiteRT = require('./include/campsite');
const campsite = new CampsiteRT;

module.exports = app => {
  app.get('/', (req, res) => res.sendFile(`${__dirname}../../web/index.html`));
  app.get('/campsites', campsite.index);
  app.get('/campsites/new', campsite.create);
  app.get('/campsites/:ID', campsite.show);
  app.post('/campsites', campsite.insert);
  app.get('/campsites/:ID/edit', campsite.edit);
  app.put('/campsites/:ID', campsite.update);
  app.delete('/campsites/:ID', campsite.delete);
  app.post('/campsites/:ID/reviews', campsite.review_create);
  app.delete('/campsites/:ID/reviews/:RID', campsite.review_delete);
  app.all('*', campsite.fail404);
  app.use(campsite.failEngine);
};