const express = require('express');
const router = express.Router();
const { register, login, getMe, checkAuth, logout } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validation');

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/me', authenticate, getMe);
router.get('/check', checkAuth);
router.post('/logout', logout);

module.exports = router;