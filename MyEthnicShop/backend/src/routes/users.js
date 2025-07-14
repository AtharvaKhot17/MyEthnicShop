const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');
const {
  addToCart,
  updateCartItem,
  removeFromCart,
  getCart,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  updateProfile,
} = require('../controllers/userController');

// Cart routes
router.post('/cart', protect, addToCart);
router.put('/cart', protect, updateCartItem);
router.delete('/cart', protect, removeFromCart);
router.get('/cart', protect, getCart);

// Wishlist routes
router.post('/wishlist', protect, addToWishlist);
router.delete('/wishlist', protect, removeFromWishlist);
router.get('/wishlist', protect, getWishlist);

// Update user profile
router.put('/profile', protect, updateProfile);

module.exports = router; 