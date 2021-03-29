const svr = require('../../express');
const campsite = require('../../models/campsite');
const db = require('../../models/campsite');

class CampsiteRT {
  constructor() { }
  async index(req, res) {
    await db.find({}, (err, data) => {
      if (err) console.log(err);
      else res.render('campsites/index', { data });
    });
  }
  async show(req, res) {
    await db.findById(req.params.id, (err, record) => {
      if (err) console.log(err);
      else res.render('campsites/show', { record });
    });
  }
  create(req, res) {
    res.render('campsites/new');
  }
  async insert(req, res) {
    const record = new campsite(req.body.campsite);
    await record.save();
    res.redirect(`/campsites/${record._id}`);
  }
  async edit(req, res) {
    await db.findById(req.params.id, (err, record) => {
      if (err) console.log(err);
      else res.render('campsites/edit', { record });
    });
  }
  async update(req, res) {
    const { id } = req.params;
    await db.findByIdAndUpdate(id, { ...req.body.campsite }, (err, record) => {
      if (err) res.redirect('/campsites');
      else res.redirect(`/campsites/${record._id}`);
    });
  }
};

module.exports = CampsiteRT;