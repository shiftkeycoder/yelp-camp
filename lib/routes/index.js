const svr = require('../express');
const campsiteRTS = require('./campsites');
const errorRTS = require('./error');
module.exports = app => {
  app.get('/', (req, res) => res.sendFile(`${__dirname}../../web/index.html`));
  app.use('/campsites', campsiteRTS);
  app.use('/', errorRTS);
};