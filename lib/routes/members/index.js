const express = require('express');
const router = express.Router();
const Route = require('./include/member');
const route = new Route;
const passport = require('passport');
const passportOptions = {
  failureFlash: true,
  failureRedirect: '/members/login'
};

router.get('/', route.index);
router.get('/new', route.create);
router.get('/login', route.login);
router.post('/auth', passport.authenticate('local', passportOptions), route.auth);
router.post('/logout', route.logout);
router.get('/:ID', route.show);
router.post('/', route.insert);
router.get('/:ID/edit', route.edit);
router.put('/:ID', route.update);
router.delete('/:ID', route.delete);

module.exports = router;