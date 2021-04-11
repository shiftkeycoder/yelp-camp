const express = require('express');
const router = express.Router();
const Route = require('./include/member');
const route = new Route;

router.get('/', route.index);
router.get('/new', route.create);
router.get('/login', route.login);
router.post('/auth', route.auth);
router.post('/logout', route.logout);
router.get('/:ID', route.show);
router.post('/', route.insert);
router.get('/:ID/edit', route.edit);
router.put('/:ID', route.update);
router.delete('/:ID', route.delete);
router.use(route.failEngine);
router.use(route.flash);

module.exports = router;