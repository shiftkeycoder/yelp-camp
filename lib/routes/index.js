const svr = require('../express');
const CampsiteRT = require('./include/campsite');
const campsite = new CampsiteRT;

module.exports = app => {
  app.get('/', (req, res) => res.sendFile(`${__dirname}../../web/index.html`));
  app.get('/campsites', campsite.index);
  app.get('/campsites/new', campsite.create);
  app.get('/campsites/:id', campsite.show);
  app.post('/campsites', campsite.insert);
  app.get('/campsites/:id/edit', campsite.edit);
  app.put('/campsites/:id', campsite.update);
  app.delete('/campsites/:id', campsite.delete);
  app.all('*', campsite.fail404);
  app.use(campsite.failEngine);
};