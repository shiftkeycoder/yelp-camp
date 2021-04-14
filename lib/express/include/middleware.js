const error = (err, res, req, next) => {
  next(err);
};

const props = (req, res, next) => {
  res.locals.user = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
};

module.exports = { error, props };