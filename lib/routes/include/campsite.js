const svr = require('../../express');
const db = require('../../models/campsite');

class CampsiteRT {
  constructor() { }
  async index(req, res) {
    const data = await db.find({});
    res.render('campsites/index', {data});
  }
};

module.exports = CampsiteRT;