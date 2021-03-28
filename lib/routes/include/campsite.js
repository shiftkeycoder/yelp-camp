const svr = require('../../express');
const db = require('../../models/campsite');

class CampsiteRT {
  constructor() { }
  async index(req, res) {
    const data = await db.find({});
    res.render('campsites/index', {data});
  }
  async show(req, res) {
    const record = await db.findById(req.params.id);
    res.render('campsites/show', {record});
  }
};

module.exports = CampsiteRT;