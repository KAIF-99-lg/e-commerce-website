import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  // Check token in headers or body
  const token = req.headers.authorization?.split(" ")[1] || req.body.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not Authorized, Login Again' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log("JWT Error:", error);
    
    // Differentiate between different types of JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired, please login again' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    } else {
      return res.status(401).json({ success: false, message: 'Not Authorized' });
    }
  }
};

export default authUser;