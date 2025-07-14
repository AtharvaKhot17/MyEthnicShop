import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import styles from './Checkout.module.css';
import { motion } from 'framer-motion';
import PaymentGateway from '../components/PaymentGateway';

function Checkout() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get('/users/cart')
      .then(res => {
        setCart(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch cart');
        setLoading(false);
      });
  }, []);

  const itemsPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 1000 ? 0 : 50;
  const taxPrice = Math.round(itemsPrice * 0.05);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    setError(null);
    setSuccess(null);
    try {
      const orderResponse = await api.post('/orders', {
        orderItems: cart.map(item => ({
          product: item.product._id,
          name: item.product.name,
          qty: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
          image: item.product.images[0],
        })),
        shippingAddress: { address, city, postalCode, country },
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });
      
      setOrderId(orderResponse.data._id);
      
      if (paymentMethod === 'COD') {
        setSuccess('Order placed successfully!');
        setTimeout(() => navigate('/orders'), 1200);
      } else {
        setShowPayment(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    }
    setPlacing(false);
  };

  const handlePaymentSuccess = () => {
    setSuccess('Payment successful! Order placed successfully!');
    setTimeout(() => navigate('/orders'), 1200);
  };

  const handlePaymentError = (error) => {
    setError(error.message || 'Payment failed');
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (cart.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div className={styles.container}>
      <form className={styles.checkoutForm} onSubmit={handlePlaceOrder}>
        <div className={styles.formTitle}>Shipping Address</div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Address</label>
          <input className={styles.input} placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>City</label>
          <input className={styles.input} placeholder="City" value={city} onChange={e => setCity(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Postal Code</label>
          <input className={styles.input} placeholder="Postal Code" value={postalCode} onChange={e => setPostalCode(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Country</label>
          <input className={styles.input} placeholder="Country" value={country} onChange={e => setCountry(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Payment Method</label>
          <select className={styles.select} value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            <option value="COD">Cash on Delivery</option>
            <option value="razorpay">Razorpay (UPI, Cards, Net Banking)</option>
          </select>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <motion.button
          type="submit"
          className={styles.placeOrderBtn}
          disabled={placing}
          whileHover={{ scale: 1.07, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {placing ? 'Placing Order...' : 'Place Order'}
        </motion.button>
      </form>

      {showPayment && orderId && (
        <div className={styles.paymentSection}>
          <PaymentGateway
            amount={totalPrice}
            orderId={orderId}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </div>
      )}
      <div className={styles.summary}>
        <div className={styles.summaryTitle}>Order Summary</div>
        <ul style={{ marginBottom: 12 }}>
          {cart.map(item => {
            // Build details string only if size or color exists
            let details = [];
            if (item.size) details.push(`Size: ${item.size}`);
            if (item.color) details.push(`Color: ${item.color}`);
            return (
              <li key={item.product._id + (item.size || '') + (item.color || '')}>
                {item.product.name}
                {details.length > 0 && (
                  <span> ({details.join(', ')})</span>
                )}
                {' '}x {item.quantity} = ₹{item.price * item.quantity}
              </li>
            );
          })}
        </ul>
        <div className={styles.summaryRow}>
          <span>Items:</span>
          <span>₹{itemsPrice}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Shipping:</span>
          <span>₹{shippingPrice}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Tax:</span>
          <span>₹{taxPrice}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Total:</span>
          <span>₹{totalPrice}</span>
        </div>
      </div>
    </div>
  );
}

export default Checkout; 