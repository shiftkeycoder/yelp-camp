const express = require('express');
const router = express.Router();
const Route = require('./include/campsite');
const route = new Route;

router.get('/', route.index);
router.get('/new', route.create);
router.get('/:ID', route.show);
router.post('/', route.insert);
router.get('/:ID/edit', route.edit);
router.put('/:ID', route.update);
router.delete('/:ID', route.delete);
router.post('/:ID/reviews', route.review_create);
router.delete('/:ID/reviews/:RID', route.review_delete);

module.exports = router;