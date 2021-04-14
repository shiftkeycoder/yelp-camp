const Fail = require('./fail');
module.exports.isAdmin = (req, res, next) => {
  if (req.session.token !== req.session.adminToken) {
    const fail = new Fail('Sorry, you are not authorized to perform this task. Please logon with an admin account.', 401);
    req.flash('error', fail.message);
    res.redirect('/members/login');
    next(fail);
  }
}