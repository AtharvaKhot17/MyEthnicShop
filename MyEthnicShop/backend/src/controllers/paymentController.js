const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const Order = require('../models/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/payments/razorpay/create-order
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;

  if (!amount || amount < 1) {
    res.status(400);
    throw new Error('Invalid amount');
  }

  try {
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500);
    throw new Error('Failed to create payment order');
  }
});

// @desc    Verify Razorpay payment
// @route   POST /api/payments/razorpay/verify
// @access  Private
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error('Missing payment verification parameters');
  }

  try {
    // Verify the payment signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      res.status(400);
      throw new Error('Invalid payment signature');
    }

    // Update the order with payment details
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.paymentResult = {
      id: razorpay_payment_id,
      status: 'completed',
      update_time: new Date().toISOString(),
      email_address: req.user.email,
    };
    order.paidAt = new Date();
    order.status = 'Pending'; // Order is paid but not yet shipped

    await order.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      order: order,
    });
  } catch (error) {
    console.error('Razorpay payment verification error:', error);
    res.status(500);
    throw new Error('Payment verification failed');
  }
});

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Public
const getPaymentMethods = asyncHandler(async (req, res) => {
  const methods = [
    {
      id: 'razorpay',
      name: 'Razorpay',
      description: 'Pay with UPI, Cards, Net Banking',
      icon: '💳',
      available: !!process.env.RAZORPAY_KEY_ID,
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: '💰',
      available: true,
    },
  ];

  res.json({
    success: true,
    methods: methods.filter(method => method.available),
  });
});

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getPaymentMethods,
}; 