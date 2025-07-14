require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth');
const protect = require('./src/middlewares/auth');
const roleCheck = require('./src/middlewares/roleCheck');
const productRoutes = require('./src/routes/products');
const userRoutes = require('./src/routes/users');
const orderRoutes = require('./src/routes/orders');
const paymentRoutes = require('./src/routes/payments');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Connect to MongoDB
connectDB();

// Simple root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Test protected route (any user)
app.get('/api/test/user', protect, (req, res) => {
  res.json({ message: 'Hello, authenticated user!', user: req.user });
});

// Test admin-only route
app.get('/api/test/admin', protect, roleCheck('admin'), (req, res) => {
  res.json({ message: 'Hello, admin!', user: req.user });
});

// Error handling middleware (basic)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
