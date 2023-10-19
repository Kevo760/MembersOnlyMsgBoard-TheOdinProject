var express = require('express');
var router = express.Router();
const asyncHandler = require("express-async-handler");
const Post = require('../models/Post');
const Users = require('../models/User');

/* GET home page. */
router.get('/', asyncHandler( async (req, res, next) => {
  const getAllPost = await Post.find().sort({createdAt: 1}).populate('user');

  res.render('index', { title: 'Mini Msg Board', postData: getAllPost});
}
));

module.exports = router;
