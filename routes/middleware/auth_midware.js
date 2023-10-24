const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const jwtSecret = process.env.JWT_SECRET;


// Middleware that checks is user is logged in
const authMidware = async(req, res, next) => {
  const token = req.cookies.token;

  if(!token) {
    req.userData = undefined;
    next();
  } else {
    try {
      // Decode token
      const decoded = jwt.verify(token, jwtSecret);
      // If token is verified find user with decoded UserID
      const user = await User.find({_id: decoded.userId});
      // If user is found pass user to userData
      req.userData = user[0];
      next();
    }catch(error) {
      // If any errors happen pass userData as undefined
      req.userData = undefined;
      next();
    }
  } 
}; 


module.exports = authMidware;