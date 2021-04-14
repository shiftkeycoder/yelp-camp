const svr = require('../../../express');
const Campsite = require('../../../models/campsite');
const Review = require('../../../models/review');
const Fail = require('../../lib/fail');
const { campsiteJOI, reviewJOI } = require('../../lib/validation');
let token;
let adminToken;

class CampsiteRT {
  constructor() { }
  async index(req, res, next) {
    try {
      token = req.session.token;
      adminToken = req.session.adminToken;
      const data = await Campsite.find({});
      res.render('campsites/index', { data });
    }
    catch (err) {
      const fail = new Fail(err.message, 400);
      req.flash('error', "I'm sorry. I couldn't find any campsites in the database.");
      res.render('error/read_fail', {
        status: fail.statusCode,
        message: fail.message,
        stack: fail.stack,
        ERROR_MSG: req.flash('error')
      });
      next(fail);
    }
  }
  async show(req, res, next) {
    try {
      const { ID } = req.params;
      const record = await Campsite.findById(ID).populate('reviews');
      res.render('campsites/show', { record });
    }
    catch (err) {
      const fail = new Fail(err.message, 400);
      req.flash('error', "I'm sorry.I was not able to find this campsite.");
      res.render('error/find_fail', {
        status: fail.statusCode,
        message: fail.message,
        stack: fail.stack,
        ERROR_MSG: req.flash('error')
      });
      next(fail);
      
    }
  }
  create(req, res, next) {
    if (token !== adminToken) {
      const fail = new Fail('Sorry, you are not authorized to perform this task. Please logon with an admin account.', 401);
      req.session.origin = req.originalUrl;
      req.flash('error', fail.message);
      res.redirect('/members/login');
      next(fail);
    }
    else {
      res.render('campsites/new');
    }
  }
  async insert(req, res, next) {
    try {
      if (token !== adminToken) {
        const fail = new Fail('Sorry, you are not authorized to perform this task. Please logon with an admin account.', 401);
        req.session.origin = req.originalUrl;
        req.flash('error', fail.message);
        res.redirect('/members/login');
        next(fail);
      }
      else {
        const { error } = campsiteJOI.validate(req.body);
        if (error) {
          const errMSG = error.details.map(idx => idx.message).join(',');
          throw new Fail(errMSG, 400);
        }
        const record = new Campsite(req.body.campsite);
        await record.save();
        req.flash('success', 'New campsite created!');
        res.redirect(`/campsites/${record._id}`);
      }
    }
    catch (err) {
      const fail = new Fail(err.message, 500);
      req.flash('error', "I'm sorry. I could not create this campsite. Invalid data was detected. Please check your data and try again.");
      res.render('error/create_fail', {
        status: err.statusCode,
        message: err.message,
        stack: err.stack,
        ERROR_MSG: req.flash('error')
      });
      next(fail);
    }
  }
  async edit(req, res, next) {
    try {
      if (token !== adminToken) {
        const fail = new Fail('Sorry, you are not authorized to perform this task. Please logon with an admin account.', 401);
        req.session.origin = req.originalUrl;
        req.flash('error', fail.message);
        res.redirect('/members/login');
        next(fail);
      }
      else {
        const { ID } = req.params;
        const record = await Campsite.findById(ID);
        res.render('campsites/edit', { record });
      }
    }
    catch (err) {
      const fail = new Fail(err.message, 500);
      req.flash('error', "I'm sorry.I was not able to find this campsite.");
      res.render('error/find_fail', {
        status: fail.statusCode,
        message: fail.message,
        stack: fail.stack,
        ERROR_MSG: req.flash('error')
      });
      next(fail);
    }
  }
  async update(req, res, next) {
    try {
      if (token !== adminToken) {
        const fail = new Fail('Sorry, you are not authorized to perform this task. Please logon with an admin account.', 401);
        req.session.origin = req.originalUrl;
        req.flash('error', fail.message);
        res.redirect('/members/login');
        next(fail);
      }
      else {
        const { ID } = req.params;
        const { error } = campsiteJOI.validate(req.body);
        if (error) {
          const errMSG = error.details.map(idx => idx.message).join(',');
          throw new Fail(errMSG, 400);
        }
        const record = await Campsite.findByIdAndUpdate(ID, { ...req.body.campsite });
        req.flash('success', 'Campsite Updated!');
        res.redirect(`/campsites/${record._id}`);
      }
    }
    catch (err) {
      const fail = new Fail(err.message, 500);
      req.flash('error', "I'm sorry. I could not update this campsite. Please check your data and try again.");
      res.render('error/update_fail', {
        status: fail.statusCode,
        message: fail.message,
        stack: fail.stack,
        ERROR_MSG: req.flash('error')
      });
      next(fail);
    }
  }
  async delete(req, res, next) {
    try {
      if (token !== adminToken) {
        const fail = new Fail('Sorry, you are not authorized to perform this task. Please logon with an admin account.', 401);
        req.session.origin = req.originalUrl;
        req.flash('error', fail.message);
        res.redirect('/members/login');
        next(fail);
      }
      else {
        const { ID } = req.params;
        await Campsite.findByIdAndDelete(ID);
        req.flash('success', 'Campsite Deleted!');
        res.redirect('/campsites');
      }
    }
    catch (err) {
      const fail = new Fail(err.message, 500);
      req.flash('error', "I'm sorry. I could not remove this campsite. The campsite may no longer exist. Please refresh your browser.");
      res.render('error/delete_fail', {
        status: fail.statusCode,
        message: fail.message,
        stack: fail.stack,
        ERROR_MSG: req.flash('error')
      });
      next(fail);
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
      req.flash('success', 'New review created!');
      res.redirect(`/campsites/${record._id}`);
    }
    catch (err) {
      const fail = new Fail(err.message, 500);
      req.flash('error', "I'm sorry. I could not create this review. Invalid data was detected. Please check your data and try again.");
      res.render('error/review-create_fail', {
        status: fail.statusCode,
        message: fail.message,
        stack: fail.stack,
        ERROR_MSG: req.flash('error')
      });
      next(fail);
    }
  }
  async review_delete(req, res, next) {
    try {
      if (token !== adminToken) {
        const fail = new Fail('Sorry, you are not authorized to perform this task. Please logon with an admin account.', 401);
        req.session.origin = req.originalUrl;
        req.flash('error', fail.message);
        res.redirect('/members/login');
        next(fail);
      }
      else {
        const { ID, RID } = req.params;
        await Campsite.findByIdAndUpdate(ID, { $pull: { reviews: RID } });
        await Review.findByIdAndDelete(RID);
        req.flash('success', 'Review Deleted!');
        res.redirect(`/campsites/${ID}`);
      }
    }
    catch (err) {
      const fail = new Fail(err.message, 500);
      req.flash('error', "I'm sorry. I could not create this review. Invalid data was detected. Please check your data and try again.");
      res.render('error/review-delete_fail', {
        status: fail.statusCode,
        message: fail.message,
        stack: fail.stack,
        ERROR_MSG: req.flash('error')
      });
      next(fail);
    }
  }
};
module.exports = CampsiteRT;