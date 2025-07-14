const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const { Parser } = require('json2csv');

// @desc    Create a new product (admin)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      images: req.body.images || [],
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      size,
      fabric,
      inStock,
      page = 1,
      limit = 10,
      color,
    } = req.query;

    const query = {};

    // Search by name, material, color
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { fabric: { $regex: search, $options: 'i' } },
        { colors: { $regex: search, $options: 'i' } },
      ];
    }
    // Filter by category
    if (category) query.category = category;
    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    // Filter by size
    if (size) query.sizes = size;
    // Filter by fabric
    if (fabric) query.fabric = fabric;
    // Filter by color
    if (color) query.colors = color;
    // Filter by inStock
    if (inStock !== undefined) query.isInStock = inStock === 'true';

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product (admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product (admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.remove();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload product images to Cloudinary
exports.uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }
    // Use Promise.all to upload all images
    const urls = await Promise.all(
      req.files.map(file =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: 'products' }, (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          });
          stream.end(file.buffer);
        })
      )
    );
    res.json({ urls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a review to a product
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed by this user' });
    }
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews for a product
exports.getReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product.reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit a review
exports.editReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const review = product.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { rating, comment } = req.body;
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    await product.save();
    // Update ratings and numReviews
    product.numReviews = product.reviews.length;
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save();
    res.json({ message: 'Review updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const review = product.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    review.remove();
    // Update ratings and numReviews
    product.numReviews = product.reviews.length;
    product.ratings = product.reviews.length > 0 ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length : 0;
    await product.save();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export products as CSV (admin)
exports.exportProductsCSV = async (req, res) => {
  try {
    const products = await Product.find();
    const fields = [
      { label: 'Product ID', value: '_id' },
      { label: 'Name', value: 'name' },
      { label: 'Category', value: 'category' },
      { label: 'Price', value: 'price' },
      { label: 'Stock', value: 'stock' },
      { label: 'Num Reviews', value: 'numReviews' },
      { label: 'Ratings', value: 'ratings' },
      { label: 'Created At', value: row => row.createdAt?.toISOString() },
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(products);
    res.attachment('products.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 