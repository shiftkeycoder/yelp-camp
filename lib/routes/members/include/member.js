const svr = require('../../../express');
const Member = require('../../../models/member');
const { hashPWD, authPWD } = require('../../../bcrypt');
const Fail = require('../../lib/fail');
const { memberJOI } = require('../../lib/validation');
let adminToken;

class MemberRT {
  constructor() { }
  async index(req, res, next) {
    try {
      if (req.session.token !== req.session.adminToken) {
        const fail = new Fail('Sorry, you are not authorized to perform this task. Please logon with an admin account.', 401);
        req.session.origin = req.originalUrl;
        req.flash('error', fail.message);
        res.redirect('/members/login');
        next(fail);
      }
      const data = await Member.find({});
      res.render('members/index', { data, OK_MSG: req.flash('success') });
    }
    catch (err) {
      const fail = new Fail(err.message, 500);
      req.flash('error', "I'm sorry. I couldn't find any members in the database.");
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
      if (req.session.token !== req.session.adminToken) {
        const fail = new Fail('Sorry, you are not authorized to perform this task. Please logon with an admin account.', 401);
        req.session.origin = req.originalUrl;
        req.flash('error', fail.message);
        res.redirect('/members/login');
        next(fail);
      }
      else {
        const { ID } = req.params;
        const record = await Member.findById(ID);
        res.render('members/show', { record, OK_MSG: req.flash('success') });
      }
    }
    catch (err) {
      const fail = new Fail(err.message, 500);
      req.flash('error', "I'm sorry.I was not able to find this member.");
      res.render('error/find_fail', {
        status: fail.statusCode,
        message: fail.message,
        stack: fail.stack,
        ERROR_MSG: req.flash('error')
      });
      next(fail);
    }
  }
  create(req, res) {
    res.render('members/new');
  }
  async insert(req, res, next) {
    try {
      const { error } = memberJOI.validate(req.body);
      if (error) {
        const errMSG = error.details.map(idx => idx.message).join(',');
        throw new Fail(errMSG, 400);
      }
      const { username, email, password } = req.body.member;
      const member = new Member({ username, email });
      const record = await Member.register(member, password);
      req.login(record, err => {
        if (err) {
          return next(err);
        }
        else {
          req.session.token = record._id;
          req.flash('success', `${record.username} has registered!`);
          res.redirect('/campsites');
        }
       });
    }
    catch (err) {
      const fail = new Fail(err.message, 500);
      req.flash('error', "I'm sorry. I could not create this member. Invalid data was detected. Please check your data and try again.");
      res.render('error/create_fail', {
        status: fail.statusCode,
        message: fail.message,
        stack: fail.stack,
        ERROR_MSG: req.flash('error')
      });
      next(fail);
    }
  }
  async edit(req, res, next) {
    try {
      if (req.session.token !== req.session.adminToken) {
        const fail = new Fail('Sorry, you are not authorized to perform this task. Please logon with an admin account.', 401);
        req.session.origin = req.originalUrl;
        req.flash('error', fail.message);
        res.redirect('/members/login');
        next(fail);
      }
      else {
        const { ID } = req.params;
        const record = await Member.findById(ID);
        res.render('members/edit', { record });
      }
    }
    catch (err) {
      const fail = new Fail(err.message, 500);
      req.flash('error', "I'm sorry.I was not able to find this member.");
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
      if (req.session.token !== req.session.adminToken) {
        const fail = new Fail('Sorry, you are not authorized to perform this task. Please logon with an admin account.', 401);
        req.session.origin = req.originalUrl;
        req.flash('error', fail.message);
        res.redirect('/members/login');
        next(fail);
      }
      else {
        const { ID } = req.params;
        const { error } = memberJOI.validate(req.body);
        if (error) {
          const errMSG = error.details.map(idx => idx.message).join(',');
          throw new Fail(errMSG, 400);
        }
        const { username, email, password } = req.body;
        const key = await hashPWD(password);
        const record = await Member.findByIdAndUpdate(ID, { username, password: key });
        req.session.token = record._id;
        req.flash('success', 'Member Updated!');
        res.redirect(`/members/${record._id}`);
      }
    }
    catch (err) {
      const fail = new Fail(err.message, 500);
      req.flash('error', "I'm sorry. I could not update this member. Please check your data and try again.");
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
      if (req.session.token !== req.session.adminToken) {
        const fail = new Fail('Sorry, you are not authorized to perform this task. Please logon with an admin account.', 401);
        req.session.origin = req.originalUrl;
        req.flash('error', fail.message);
        res.redirect('/members/login');
        next(fail);
      }
      else {
        const { ID } = req.params;
        await Member.findByIdAndDelete(ID);
        req.flash('success', 'Member Deleted!');
        res.redirect('/members');
      }
    }
    catch (err) {
      const fail = new Fail(err.message, 500);
      req.flash('error', "I'm sorry. I could not remove this member. The member may no longer exist. Please refresh your browser.");
      res.render('error/delete_fail', {
        status: fail.statusCode,
        message: fail.message,
        stack: fail.stack,
        ERROR_MSG: req.flash('error')
      });
      next(fail);
    }
  }
  login(req, res) {
    res.render('members/login', { ERROR_MSG: req.flash('error')});
  }
  async auth(req, res, next) {
    try {
      const { username } = req.body;
      const user = await Member.findOne({ username });
      const admin = await Member.findOne({ username: 'Admin' });
      
      res.locals.user = req.user;
      adminToken = admin._id;
      req.session.token = user._id;
      req.session.adminToken = adminToken;
      req.flash('success', `Welcome back, ${user.username}!`);
      req.login(user, err => {
        if (err) {
          return next(err);
        }
        else {
          const redirectPath = req.session.origin || '/campsites';
          delete req.session.origin;
          res.redirect(redirectPath);
        }
      });
      
    }
    catch (err) {
      const fail = new Fail(err.message, 400);
      req.flash('error', "Incorrect Username or Password!");
      res.redirect('/members/login');
      next(fail);
    }
  }
  logout(req, res) {
    req.logout();
    req.session.token = null;
    res.redirect('/');
  }
}
module.exports = MemberRT;