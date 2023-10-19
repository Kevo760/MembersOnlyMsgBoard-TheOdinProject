var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('add_post', { title: 'Add Post' });
});

module.exports = router;