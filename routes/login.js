var express = require('express');
var router = express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
const authMidware = require('./middleware/auth_midware');

const jwtSecret = process.env.JWT_SECRET;

/* GET login page. */
router.get('/', authMidware, function(req, res, next) {
  const userData = req.userData;
  if(userData) {
   return res.redirect('/')
  }

  res.render('login', { title: 'Login' });
});

/* POST login page. */
router.post('/', authMidware, asyncHandler( async (req, res, next) => {
  const userData = req.userData;
  if(userData) {
    return res.redirect('/')
   }

  try {
  const { username, password } = req.body;
  // Check if user exist
  const doesUserExist = await User.findOne({ username });
  
  // If user not exist send user back to login page with error
  if(!doesUserExist) {
      res.render('login', { 
      title: 'Login',
      errorMsg: 'Invalid Credentials',
    });
    return;
  };

  // check encrpted password to see if password entered matches
  const checkPw = await bcrypt.compare(password, doesUserExist.password);

  // If password does not match send user back to login with eror message
  if(!checkPw) {
    res.render('login', { 
      title: 'Login',
      errorMsg: 'Invalid Credentials',
    });
    return;
  };

  // Create a cookie with the new token
  const token = jwt.sign({ userId: doesUserExist._id}, jwtSecret);
  res.cookie('token', token, { httpOnly: true});

  res.redirect('/');
  } catch (error) {
    console.log(error)
    const err = new Error('Something went wrong');
    err.status = 404;
    return next(err);
  }
}));


module.exports = router;