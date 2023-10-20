var express = require('express');
var router = express.Router();
const asyncHandler = require("express-async-handler");
const Post = require('../models/Post');
const Users = require('../models/User');

/* GET Admin page. */
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

  res.render('admin_panel', { title: 'Mini Msg Board', postData: getPost, current: page, nextPage: hasNextPage ? nextPage : null});
}
));


/* GET delete of single message page. */
router.get('/:id/delete', asyncHandler( async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate('user');

  if(post === null) {
    // No results.
    const err = new Error("product not found");
    err.status = 404;
    return next(err);
};

  res.render('post_delete', { title: 'Delete a post', post});
}
));

/* POST delete of single message page. */
router.post('/:id/delete', asyncHandler( async (req, res, next) => {
  await Post.findByIdAndRemove(req.body.postid);
  
  res.redirect('/admin')
}
));

module.exports = router;