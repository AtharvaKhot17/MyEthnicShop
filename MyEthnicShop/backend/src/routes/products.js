const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  addReview,
  getReviews,
  editReview,
  deleteReview,
  exportProductsCSV,
} = require('../controllers/productController');
const protect = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const upload = require('../middlewares/upload');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, roleCheck('admin'), createProduct);
router.put('/:id', protect, roleCheck('admin'), updateProduct);
router.delete('/:id', protect, roleCheck('admin'), deleteProduct);

// Image upload route
router.post('/upload-images', protect, roleCheck('admin'), upload.array('images', 5), uploadProductImages);

// Product reviews
router.post('/:id/reviews', protect, addReview);
router.get('/:id/reviews', getReviews);
router.put('/:id/reviews/:reviewId', protect, editReview);
router.delete('/:id/reviews/:reviewId', protect, deleteReview);

// Admin: export products as CSV
router.get('/export/csv', protect, roleCheck('admin'), exportProductsCSV);

module.exports = router; 