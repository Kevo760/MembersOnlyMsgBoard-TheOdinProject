var express = require('express');
var router = express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if(!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  }catch(error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

/* POST login page. */
router.post('/', asyncHandler( async (req, res, next) => {
  // Create a universal error message to keep information secure
  const errorMsg = 'Invalid Credentials'

  try {
  const { username, password } = req.body;

  // Check if user exist
  const doesUserExist = await User.findOne({ username });
  


  // If user not exist send user back to login page with error
  if(!doesUserExist) {
      res.render('login', { 
      title: 'Login',
      errorMsg,
    });
    return;
  };

  // check encrpted password to see if password entered matches
  const checkPw = await bcrypt.compare(password, doesUserExist.password);

  // If password does not match send user back to login with eror message
  if(!checkPw) {
    res.render('login', { 
      title: 'Login',
      errorMsg
    });
    return;
  };
  // Create a cookie with the new token
  const token = jwt.sign({ userId: doesUserExist._id, status: doesUserExist.status, jwtSecret});
  res.cookie('token', token), { httpOnly: true};

  res.redirect('/');

  } catch (error) {
    const err = new Error('Something went wrong');
    err.status = 404;
    return next(err);
  }
}));


module.exports = router;