var express = require('express');
const User = require('../models/User');
var router = express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt');
const authMidware = require('./middleware/auth_midware');

/* GET register page. */
router.get('/', authMidware, function(req, res, next) {
  const userData = req.userData;
  if(userData) {
    return res.redirect('/')
   }

  res.render('register', { title: 'Register' });
});

/* POST register page when user registers an account. */
router.post('/', authMidware, asyncHandler( async (req, res, next) => {
  const userData = req.userData;
  if(userData) {
    return res.redirect('/')
   }

  try {
  const { username, password, verifypw } = req.body;

  // Check if user exist
  const doesUserExist = await User.exists({ username: username});
  // Encrypt password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Create new user
  const newUser = User({
    username,
    password: hashedPassword
  });
  // If user exist add error message 
  if(doesUserExist) {
      res.render('register', { 
      title: 'Register',
      errorMsg: 'Username already exist',
    });
    return;
  };

  // If password and verify password does not match send error message
  if(password !== verifypw) {
    res.render('register', { 
      title: 'Register',
      errorMsg: 'Passwords do not match',
    });
    return;
  };
  // If there are no other errors save user and redirect to home page
  await newUser.save();
  res.redirect('/');

  } catch (error) {
    const err = new Error('Something went wrong');
    err.status = 404;
    return next(err);
  }
}));



module.exports = router;