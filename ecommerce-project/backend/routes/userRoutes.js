const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/auth');
const {
  getUsers,
  getUserById,
  getProfile,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController');

router.use(authenticate); // All user routes require authentication

router.get('/profile', getProfile);
router.get('/', isAdmin, getUsers);
router.get('/stats/summary', isAdmin, getUserStats);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', isAdmin, deleteUser);

module.exports = router;