const Order = require('../models/Order');
const User = require('../models/User');
const { Parser } = require('json2csv');

// Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await order.save();
    // Optionally clear user's cart after order
    await User.findByIdAndUpdate(req.user._id, { cart: [] });
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logged-in user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // Only allow user or admin to view
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    if (status === 'Delivered') order.deliveredAt = Date.now();
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel an order (user)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }
    order.status = 'Cancelled';
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order analytics/stats (admin)
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalSalesAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalSales = totalSalesAgg[0]?.total || 0;
    // Orders per day (last 7 days)
    const last7 = new Date();
    last7.setDate(last7.getDate() - 6);
    const ordersPerDay = await Order.aggregate([
      { $match: { createdAt: { $gte: last7 } } },
      { $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
        sales: { $sum: "$totalPrice" }
      } },
      { $sort: { _id: 1 } }
    ]);
    // Status counts
    const statusAgg = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const statusCounts = {};
    statusAgg.forEach(s => { statusCounts[s._id] = s.count; });
    res.json({ totalOrders, totalSales, ordersPerDay, statusCounts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export orders as CSV (admin)
exports.exportOrdersCSV = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    const fields = [
      { label: 'Order ID', value: '_id' },
      { label: 'User', value: 'user.name' },
      { label: 'Email', value: 'user.email' },
      { label: 'Total', value: 'totalPrice' },
      { label: 'Status', value: 'status' },
      { label: 'Created At', value: row => row.createdAt?.toISOString() },
      { label: 'Delivered At', value: row => row.deliveredAt ? row.deliveredAt.toISOString() : '' },
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(orders);
    res.attachment('orders.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 