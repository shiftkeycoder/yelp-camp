const svr = require('../../../express');
const Campsite = require('../../../models/campsite');
const Review = require('../../../models/review');
const Fail = require('./fail');
const { campsiteJOI, reviewJOI } = require('./validation');

class CampsiteRT {
  constructor() { }
  async index(req, res, next) {
    try {
      const data = await Campsite.find({});
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
      const { ID } = req.params;
      const record = await Campsite.findById(ID).populate('reviews');
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
      const { error } = campsiteJOI.validate(req.body);
      if (error) {
        const errMSG = error.details.map(idx => idx.message).join(',');
        throw new Fail(errMSG, 400);
      }
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
      const { ID } = req.params;
      const record = await Campsite.findById(ID);
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
      const { ID } = req.params;
      const { error } = campsiteJOI.validate(req.body);
      if (error) {
        const errMSG = error.details.map(idx => idx.message).join(',');
        throw new Fail(errMSG, 400);
      }
      const record = await Campsite.findByIdAndUpdate(ID, { ...req.body.campsite });
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
      const { ID } = req.params;
      await Campsite.findByIdAndDelete(ID);
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
  async review_create(req, res, next) {
    try {
      const { ID } = req.params;
      const record = await Campsite.findById(ID);
      const review = new Review(req.body.review);
      const { error } = reviewJOI.validate(req.body);
      if (error) {
        const errMSG = error.details.map(idx => idx.message).join(',');
        throw new Fail(errMSG, 400);
      }
      record.reviews.push(review);
      await review.save();
      await record.save();
      res.redirect(`/campsites/${record._id}`);
    }
    catch(err) {
      next(err);
      res.render('campsites/review-create_fail', {
        status: err.statusCode,
        message: err.message,
        stack: err.stack
      });
    }
  }
  async review_delete(req, res, next) {
    try {
      const { ID, RID } = req.params;
      await Campsite.findByIdAndUpdate(ID, {$pull: {reviews: RID }});
      await Review.findByIdAndDelete(RID);
      res.redirect(`/campsites/${ID}`);
    }
    catch (err) {
      const fail = new Fail('DELETE FAIL', 500);
      next(fail);
      res.render('campsites/review-delete_fail', {
        status: fail.statusCode,
        message: fail.message
      });
    }
  }
  failEngine(err, res, req, next) {
    // const {statusCode, message } = err;
    // console.error(`[ERROR] ${statusCode} ${message}`);
    console.log(err);
  }
};
module.exports = CampsiteRT;