const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const User = require('../../models/User');

// Middleware checks is who is logged in an admin
const adminAuthMidware = async(req, res, next) => {
  const token = req.cookies.token;

  if(!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  } 
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const checkUser = await User.find({_id: decoded.userId});

    if(checkUser[0].status === 'Admin'){
      req.userData = checkUser[0];
      next();
      return;
    } else {
      res.status(401).json({ message: 'Unauthorized' });
      return; 
    }
  } catch(error) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
};


module.exports = adminAuthMidware;