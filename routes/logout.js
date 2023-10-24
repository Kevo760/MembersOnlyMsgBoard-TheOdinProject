var express = require('express');
var router = express.Router();
require('dotenv').config();
const authMidware = require('./middleware/auth_midware');

/* GET logout page. */
router.get('/', authMidware, function(req, res, next) {
    const userData = req.userData;
    if(!userData) {
     return res.redirect('/')
    }
    
    res.clearCookie('token');
    res.redirect('/');
  });

  module.exports = router;