const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/auth');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getInvoice,
  getSalesReport
} = require('../controllers/orderController');

// Public routes
router.post('/', createOrder);

// Authenticated routes
router.get('/', authenticate, getOrders);
router.get('/reports/sales', authenticate, isAdmin, getSalesReport);
router.get('/:id', authenticate, getOrderById);
router.get('/:id/invoice', authenticate, getInvoice);
router.put('/:id', authenticate, isAdmin, updateOrderStatus);
router.put('/:id/status', authenticate, isAdmin, updateOrderStatus);

module.exports = router;