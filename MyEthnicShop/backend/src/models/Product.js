const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true, enum: ['Saree', 'Kurti', 'Dress', 'Dupatta'] },
  sizes: [{ type: String }], // e.g., ['S', 'M', 'L', 'XL']
  colors: [{ type: String }],
  fabric: { type: String },
  images: [{ type: String }], // URLs (Cloudinary)
  stock: { type: Number, required: true, default: 0 },
  isInStock: { type: Boolean, default: true },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [reviewSchema],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema); 