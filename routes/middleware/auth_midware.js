const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const jwtSecret = process.env.JWT_SECRET;


// Middleware that checks is user is an admin via token 
const authMidware = async(req, res, next) => {
  const token = req.cookies.token;

  const checkUser = await User.find({_id: req.userId});

  if(!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  } 
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const checkUser = await User.find({_id: decoded.userId});

    if(checkUser.status === 'Admin'){
      req.userData = checkUser;
      next();
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
  }catch(error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
};

module.exports = authMidware;