var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin_panel', { title: 'Admin Panel' });
});

module.exports = router;