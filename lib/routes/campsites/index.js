const express = require('express');
const router = express.Router();
const Route = require('./include/campsite');
const route = new Route;

router.route('/')
  .get(route.index)
  .post(route.insert);
router.get('/new', route.create);
router.route('/:ID')
  .get(route.show)
  .put(route.update)
  .delete(route.delete);
router.get('/:ID/edit', route.edit);
router.post('/:ID/reviews', route.review_create);
router.delete('/:ID/reviews/:RID', route.review_delete);

module.exports = router;