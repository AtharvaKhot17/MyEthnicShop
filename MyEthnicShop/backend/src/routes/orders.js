const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const {
  placeOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
  exportOrdersCSV,
} = require('../controllers/orderController');

// Place order
router.post('/', protect, placeOrder);
// Get logged-in user's orders
router.get('/my', protect, getUserOrders);
// Get order by ID
router.get('/:id', protect, getOrderById);
// Admin: get all orders
router.get('/', protect, roleCheck('admin'), getAllOrders);
// Admin: update order status
router.put('/:id', protect, roleCheck('admin'), updateOrderStatus);
// User: cancel order
router.put('/:id/cancel', protect, cancelOrder);
// Admin: get order stats
router.get('/stats', protect, roleCheck('admin'), getOrderStats);
// Admin: export orders as CSV
router.get('/export/csv', protect, roleCheck('admin'), exportOrdersCSV);

module.exports = router; 