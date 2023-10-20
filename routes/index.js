var express = require('express');
var router = express.Router();
const asyncHandler = require("express-async-handler");
const Post = require('../models/Post');
const Users = require('../models/User');

/* GET home page. */
router.get('/', asyncHandler( async (req, res, next) => {

  let perPage = 5;
  let page = req.query.page || 1;

  const getPost = await Post.aggregate([ 
  { $sort: { createdAt: 1 } },
  { $lookup: { 
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "user"
   }},
  ])
  .skip(perPage * page - perPage)
  .limit(perPage)
  .exec();

  const count = await Post.count();
  const nextPage = parseInt(page) + 1;
  const hasNextPage = nextPage <= Math.ceil(count / perPage);

  res.render('index', { title: 'Mini Msg Board', postData: getPost, current: page, nextPage: hasNextPage ? nextPage : null});
}
));

module.exports = router;
