const svr = require('../../../express');
const Campsite = require('../../../models/campsite');
const Review = require('../../../models/review');
const Fail = require('../../lib/fail');
const { campsiteJOI, reviewJOI } = require('../../lib/validation');
const { cloudinary } = require('../../../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { MBX_TOKEN } = process.env;
let token;
let adminToken;
let pass;
const geocoder = mbxGeocoding({ accessToken: MBX_TOKEN });
function isAdmin(req, res) {
  token = req.session.token;
  adminToken = req.session.adminToken;
  if (token !== adminToken || token == null) {
    const fail = new Fail('Sorry, you are not authorized to perform this task. Please logout and logon with an admin account.t.', 401);
    req.session.origin = req.originalUrl;
    req.flash('error', fail.message);
    pass = false;
    return res.redirect('/members/login');
  }
  else {
    pass = true;
  }
}

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
      const record = await Campsite.findById(ID)
        .populate({
          path: 'reviews',
          populate: {
            path: 'author',
            model: 'Member'
          }
        }).populate('author');
      res.render('campsites/show', { record, token, adminToken, mapToken: process.env.MBX_TOKEN });
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
    isAdmin(req, res);
    if (pass) {
      res.render('campsites/new');
    }
  }
  async insert(req, res, next) {
    try {
      isAdmin(req, res);
      if (pass) {
        const { error } = campsiteJOI.validate(req.body);
        if (error) {
          const errMSG = error.details.map(idx => idx.message).join(',');
          throw new Fail(errMSG, 400);
        }
        const { location } = req.body.campsite;
        const data = await geocoder.forwardGeocode({
          query: location,
          limit: 1
        }).send();
        const { geometry } = data.body.features[0];
        console.log(geometry);
        res.send(geometry);

        // let record = new Campsite(req.body.campsite);
        // const { file } = req;
        // const { geometry } = data.body.features[0];
        // record.image = { url: file.path, filename: file.filename };
        // record.author = req.user._id;
        // record.geometry = geometry;
        // await record.save();
        // console.log(record);
        // req.flash('success', 'New campsite created!');
        // res.redirect(`/campsites/${record._id}`);
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
      isAdmin(req, res);
      if (pass) {
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
      isAdmin(req, res);
      if (pass) {
        const { ID } = req.params;
        const { error } = campsiteJOI.validate(req.body);
        if (error) {
          const errMSG = error.details.map(idx => idx.message).join(',');
          throw new Fail(errMSG, 400);
        }
        const { file } = req;
        const { title, price, description, location } = req.body.campsite;
        const data = await geocoder.forwardGeocode({
          query: location,
          limit: 1
        }).send();
        const { geometry } = data.body.features[0];
        const record = await Campsite.findByIdAndUpdate(ID, {
          title,
          image: {
            url: file.path,
            filename: file.filename
          },
          price,
          description,
          location,
          geometry
         });
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
      isAdmin(req, res);
      if (pass) {
        const { ID } = req.params;
        const record = await Campsite.findById(ID);
        await cloudinary.uploader.destroy(record.image.filename);
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
      if (!req.user) {
        const fail = new Fail('Sorry, you are not authorized to perform this task. Please login.', 401);
        req.session.origin = req.originalUrl;
        req.flash('error', fail.message);
        res.redirect('/members/login');
        next(fail);
      }
      const { ID } = req.params;
      const record = await Campsite.findById(ID);
      const { error } = reviewJOI.validate(req.body);
      const { body, rating, author = req.user._id } = req.body.review;
      const review = new Review({ body, rating, author });
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
      isAdmin(req, res);
      if (pass) {
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