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
      if (req.session.token !== req.session.adminToken) res.redirect('/members/login');
      else {
        const data = await Member.find({});
        res.render('members/index', { data, OK_MSG: req.flash('success') });
      }
    }
    catch (err) {
      const fail = new Fail('READ FAIL', 500);
      next(fail);
      req.flash('error', "I'm sorry. I couldn't find any members in the database.");
      res.render('error/read_fail', {
        status: fail.statusCode,
        message: fail.message,
        stack: fail.stack,
        ERROR_MSG: req.flash('error')
      });
    }
  }
  async show(req, res, next) {
    try {
      if (req.session.token !== req.session.adminToken) res.redirect('/members/login');
      else {
        const { ID } = req.params;
        const record = await Member.findById(ID);
        res.render('members/show', { record, OK_MSG: req.flash('success'), PSWD: req.flash('password') });
      }
    }
    catch (err) {
      const fail = new Fail('FIND FAIL', 500);
      next(fail);
      req.flash('error', "I'm sorry.I was not able to find this member.");
      res.render('error/find_fail', {
        status: fail.statusCode,
        message: fail.message,
        stack: fail.stack,
        ERROR_MSG: req.flash('error')
      });
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
      const { username, password } = req.body.member;
      const key = await hashPWD(password);
      const record = new Member({username, password: key});
      await record.save();
      req.session.token = record._id;
      req.flash('password', password);
      req.flash('success', 'New member created!');
      res.redirect('/campsites');
    }
    catch (err) {
      next(err);
      req.flash('error', "I'm sorry. I could not create this member. Invalid data was detected. Please check your data and try again.");
      res.render('error/create_fail', {
        status: err.statusCode,
        message: err.message,
        stack: err.stack,
        ERROR_MSG: req.flash('error')
      });
    }
  }
  async edit(req, res, next) {
    try {
      if (req.session.token !== req.session.adminToken) res.redirect('/members/login');
      else {
        const { ID } = req.params;
        const record = await Member.findById(ID);
        res.render('members/edit', { record });
      }
    }
    catch (err) {
      const fail = new Fail('FIND FAIL', 500);
      next(fail);
      req.flash('error', "I'm sorry.I was not able to find this member.");
      res.render('error/find_fail', {
        status: fail.statusCode,
        message: fail.message,
        stack: fail.stack,
        ERROR_MSG: req.flash('error')
      });
    }
  }
  async update(req, res, next) {
    try {
      if (req.session.token !== req.session.adminToken) res.redirect('/members/login');
      else {
        const { ID } = req.params;
        const { error } = memberJOI.validate(req.body);
        if (error) {
          const errMSG = error.details.map(idx => idx.message).join(',');
          throw new Fail(errMSG, 400);
        }
        const { username, password } = req.body.member;
        const key = await hashPWD(password);
        const record = await Member.findByIdAndUpdate(ID, { username, password: key });
        req.session.token = record._id;
        req.flash('password', password);
        req.flash('success', 'Member Updated!');
        res.redirect(`/members/${record._id}`);
      }
    }
    catch (err) {
      // const fail = new Fail('UPDATE FAIL ', 500);
      next(err);
      req.flash('error', "I'm sorry. I could not update this member. Please check your data and try again.");
      res.render('error/update_fail', {
        status: err.statusCode,
        message: err.message,
        stack: err.stack,
        ERROR_MSG: req.flash('error')
      });
    }
  }
  async delete(req, res, next) {
    try {
      if (req.session.token !== req.session.adminToken) res.redirect('/members/login');
      else {
        const { ID } = req.params;
        await Member.findByIdAndDelete(ID);
        req.flash('success', 'Member Deleted!');
        res.redirect('/members');
      }
    }
    catch (err) {
      const fail = new Fail('DELETE FAIL', 500);
      next(fail);
      req.flash('error', "I'm sorry. I could not remove this member. The member may no longer exist. Please refresh your browser.");
      res.render('error/delete_fail', {
        status: fail.statusCode,
        message: fail.message,
        ERROR_MSG: req.flash('error')
      });
    }
  }
  login(req, res) {
    res.render('members/login', { ERROR_MSG: req.flash('error')});
  }
  async auth(req, res, next) {
    try {
      const { error } = memberJOI.validate(req.body);
      if (error) {
        const errMSG = error.details.map(idx => idx.message).join(',');
        throw new Fail(errMSG, 400);
      }
      const { username, password } = req.body.member;
      const user = await Member.findOne({ username });
      const admin = await Member.findOne({ username: 'Admin' });
      const isAuth = await authPWD(password, user.password);
      if (isAuth) {
        adminToken = admin._id;
        req.session.token = user._id;
        req.session.adminToken = adminToken;
        req.flash('success', `Welcome back, ${user.username}!`);
        res.redirect('/campsites');
      }
      else {
        req.flash('error', 'Incorrect Username or Password!');
        res.redirect('/members/login');
      }
    }
    catch (err) {
      const fail = new Fail('LOGIN FAIL', 400);
      next(fail);
      req.flash('error', "Incorrect Username or Password!");
      res.render('error/find_fail', {
        status: fail.statusCode,
        message: fail.message,
        stack: fail.stack,
        ERROR_MSG: req.flash('error')
      });
    }
  }
  logout(req, res) {
    req.session.destroy();
    res.redirect('/');
  }
  failEngine(err, res, req, next) { console.log(err); }
  flash(req, res, next) {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.password = req.flash('password');
    next();
  }
}
module.exports = MemberRT;