const svr = require('../express');
const campsiteRTS = require('./campsites');
const errorRTS = require('./error');
const memberRTS = require('./members');
module.exports = app => {
  app.get('/', (req, res) => res.sendFile(`${__dirname}../../web/index.html`));
  app.use('/campsites', campsiteRTS);
  app.use('/members', memberRTS);
  app.use('/', errorRTS);
};