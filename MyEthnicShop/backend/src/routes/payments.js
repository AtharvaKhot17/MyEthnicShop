const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getPaymentMethods,
} = require('../controllers/paymentController');

// Public routes
router.get('/methods', getPaymentMethods);

// Razorpay routes
router.post('/razorpay/create-order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);

module.exports = router; 