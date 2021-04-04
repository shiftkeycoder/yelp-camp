const svr = require('../../express');
const campsite = require('../../models/campsite');
const db = require('../../models/campsite');
const Fail = require('./fail');
const Joi = require('joi');

function isValid(req, res, next) {
  const campsiteSchema = Joi.object({
    campsite: Joi.object({
      title: Joi.string().required(),
      image: Joi.string().required(),
      price: Joi.number().required().min(0),
      description: Joi.string().required(),
      location: Joi.string().required()
    }).required()
  });
  const { error } = campsiteSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(idx => idx.message).join(',');
    throw new Fail(errMsg, 400);
  }
  else {
    next();
  }
}
class CampsiteRT {
  constructor() { }
  async index(req, res, next) {
    try {
      const data = await db.find({});
      res.render('campsites/index', { data })
    }
    catch (err) {
      const fail = new Fail('READ FAIL', 500);
      next(fail);
      res.render('campsites/read_fail', {
        status: fail.statusCode,
        message: fail.message,
        stack: fail.stack
      });
    }
  }
  async show(req, res, next) {
    try {
      const record = await db.findById(req.params.id,);
      res.render('campsites/show', { record });
    }
    catch (err) {
      const fail = new Fail('FIND FAIL', 500);
      next(fail);
      res.render('campsites/find_fail', {
        status: fail.statusCode,
        message: fail.message,
        stack: fail.stack
      });
    }
  }
  create(req, res) {
    res.render('campsites/new');
  }
  async insert(req, res, next) {
    try {
      isValid(req, res, next);
      const record = new campsite(req.body.campsite);
      await record.save();
      res.redirect(`/campsites/${record._id}`);
    }
    catch (err) {
      // const fail = new Fail('CREATE FAIL', 500);
      next(err);
      res.render('campsites/create_fail', {
        status: err.statusCode,
        message: err.message,
        stack: err.stack
      });
    }
  }
  async edit(req, res, next) {
    try {
      const record = await db.findById(req.params.id);
      res.render('campsites/edit', { record });
    }
    catch (err) {
      const fail = new Fail('FIND FAIL', 500);
      next(fail);
      res.render('campsites/find_fail', {
        status: fail.statusCode,
        message: fail.message,
        stack: fail.stack
      });
    }
  }
  async update(req, res, next) {
    try {
      const { id } = req.params;
      isValid(req, res, next);
      const record = await db.findByIdAndUpdate(id, { ...req.body.campsite });
      res.redirect(`/campsites/${record._id}`);
    }
    catch (err) {
      // const fail = new Fail('UPDATE FAIL ', 500);
      next(err);
      res.render('campsites/update_fail', {
        status: err.statusCode,
        message: err.message,
        stack: err.stack
      });
    }
  }
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await db.findByIdAndDelete(id);
      res.redirect('/campsites');
    }
    catch (err) {
      const fail = new Fail('DELETE FAIL', 500);
      next(fail);
      res.render('campsites/delete_fail', {
        status: fail.statusCode,
        message: fail.message
      });
    }
  }
  fail404(req, res) {
    const fail = new Fail('Page Not Found', 404);
    res.render('campsites/page_fail', {
      status: fail.statusCode,
      message: fail.message,
      stack: fail.stack
    });
  }
  failEngine(err, res, req, next) {
    // const {statusCode, message } = err;
    // console.error(`[ERROR] ${statusCode} ${message}`);
    console.log(err);
  }
};

module.exports = CampsiteRT;