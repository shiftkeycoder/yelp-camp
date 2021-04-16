const express = require('express');
const router = express.Router();
const Route = require('./include/member');
const route = new Route;
const passport = require('passport');
const passportOptions = {
  failureFlash: true,
  failureRedirect: '/members/login'
};

router.route('/')
.get(route.index)
.post(route.insert);
router.get('/new', route.create);
router.get('/login', route.login);
router.post('/auth', passport.authenticate('local', passportOptions), route.auth);
router.post('/logout', route.logout);
router.route('/:ID')
  .get(route.show)
  .put(route.update)
  .delete(route.delete);
router.get('/:ID/edit', route.edit);

module.exports = router;