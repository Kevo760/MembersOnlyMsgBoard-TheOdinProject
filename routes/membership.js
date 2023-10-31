var express = require('express');
var router = express.Router();
const asyncHandler = require("express-async-handler");
const authMidware = require('./middleware/auth_midware');
const SecretKey = require('../models/SecretKey');
const bcrypt = require('bcrypt');
const User = require('../models/User');

/* GET membership page. */
router.get('/', authMidware, asyncHandler(async (req, res, next) => {
  const userData = req.userData;

  // If there is no userData or if userData status is NOT basic return to home page
  if(!userData || userData.status !== 'Basic') {
    res.redirect('/')
    return
  }

  res.render('membership', { title: 'Upgrade membership', userData});
}));

router.post('/', authMidware, asyncHandler(async (req, res, next) => {
  const userData = req.userData;
  // Grab code input from the form submitted
  const codeEntered = req.body.code;
  // Grab the key from the collection
  const data =  await SecretKey.find({})
  // Verify the code entered and the key
  const verifyCode = await bcrypt.compare(codeEntered, data[0].key)

  // If verifyCode is true change current user status to premium and redirect to home page
  if(verifyCode) {
    try {
      await User.updateMany(
        {_id: userData._id},
        {
          $set: {
            status: 'Premium'
          }
        }
      );

      res.redirect('/');
      // If there's an error redisplay page with error
    } catch(error) {
      res.render('membership', { title: 'Upgrade membership', errorMsg: 'Something went wrong, try again later.', userData});
    }
    // If code is invalid reload page and input error message
  } else {
    res.render('membership', { title: 'Upgrade membership', errorMsg: 'Invalid Code!', userData});
  }
}));

module.exports = router;