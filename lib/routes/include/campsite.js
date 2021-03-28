const svr = require('../../express');
const campsite = require('../../models/campsite');
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
  create(req, res) {
    res.render('campsites/new');
  }
  async insert(req, res) {
    const record = new campsite(req.body.campsite);
    await record.save();
    res.redirect(`/campsites/${record._id}`);
  }
};

module.exports = CampsiteRT;