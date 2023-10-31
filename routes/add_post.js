var express = require('express');
var router = express.Router();
const asyncHandler = require("express-async-handler");
const Post = require('../models/Post');
const authMidware = require('./middleware/auth_midware');

/* GET add post page. */
router.get('/', authMidware, (req, res, next) => {
  const userData = req.userData;
  
  if(!userData) {
    res.redirect('/')
    return
  }

  res.render('add_post', { title: 'Add Post', userData });
});

router.post('/', authMidware, asyncHandler(async (req, res, next) => {
 const userID = req.userData._id;
 const message = req.body.message;
 const post = new Post({
  user: userID,
  message
 });

  try {
    await post.save()
    res.redirect('/')
    return
  } catch(error) {
    // If error occurs input 404 error
    const err = new Error(error);
    err.status = 404;
    return next(err);
  }
}));


module.exports = router;