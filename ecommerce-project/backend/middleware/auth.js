const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Verify authentication (session or JWT)
const authenticate = async (req, res, next) => {
  try {
    // Check if user is in session
    if (req.session && req.session.user) {
      const user = await User.findByPk(req.session.user.id);
      if (user) {
        req.user = user;
        return next();
      }
    }

    // Check for JWT token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin only.' });
  }
};

module.exports = { authenticate, isAdmin };