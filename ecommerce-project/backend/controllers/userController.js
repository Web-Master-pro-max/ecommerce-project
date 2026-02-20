const { User, Order } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all users (Admin only)
// @route   GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is requesting their own data or is admin
    if (req.user.id !== user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is updating their own data or is admin
    if (req.user.id !== user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update only allowed fields
    const allowedUpdates = ['name'];
    if (req.user.role === 'admin') {
      allowedUpdates.push('role');
    }

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    await user.update(updates);

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't allow deleting yourself
    if (req.user.id === user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await user.destroy();

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get current user's profile
// @route   GET /api/users/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get user statistics (Admin only)
// @route   GET /api/users/stats/summary
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const adminCount = await User.count({ where: { role: 'admin' } });
    const customerCount = await User.count({ where: { role: 'customer' } });
    
    // New users in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsers = await User.count({
      where: {
        created_at: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    res.json({
      success: true,
      stats: {
        total_users: totalUsers,
        admins: adminCount,
        customers: customerCount,
        new_users_30days: newUsers
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  getProfile,
  updateUser,
  deleteUser,
  getUserStats
};