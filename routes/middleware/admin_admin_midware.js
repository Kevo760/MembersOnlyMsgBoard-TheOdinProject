const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;


// Middleware that sends userId and ID to the page
const authMidware = (req, res, next) => {
  const token = req.cookies.token;

  if(!token) {
    req.isAuth = false;
    next();
  } else {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.userId = decoded.userId;
      req.status = decoded.status;
      next();
    }catch(error) {
      req.isAuth = false;
      next();
    }
  } 
};

module.exports = authMidware;