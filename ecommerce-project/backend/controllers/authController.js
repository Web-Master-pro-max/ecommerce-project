const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Store user in session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.status(201).json({
      success: true,
      user: req.session.user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Store user in session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.json({
      success: true,
      user: req.session.user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Check authentication status
// @route   GET /api/auth/check
const checkAuth = (req, res) => {
  try {
    if (req.session && req.session.user) {
      // Refresh session expiration on each check
      req.session.touch();
      return res.json({
        authenticated: true,
        user: req.session.user
      });
    }
    res.json({
      authenticated: false,
      user: null
    });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({
      error: 'Authentication check failed',
      authenticated: false,
      user: null
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
};

module.exports = {
  register,
  login,
  getMe,
  checkAuth,
  logout
};