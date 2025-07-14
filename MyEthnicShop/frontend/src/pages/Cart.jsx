import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import styles from './Cart.module.css';
import { motion, AnimatePresence } from 'framer-motion';

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState(null);
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

  const handleUpdateQty = async (productId, size, color, quantity) => {
    setUpdating(true);
    try {
      await api.put('/users/cart', { productId, size, color, quantity });
      setCart(cart => cart.map(item =>
        item.product._id === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      ));
    } catch {
      setToast({ type: 'error', message: 'Failed to update quantity' });
      setTimeout(() => setToast(null), 2000);
    }
    setUpdating(false);
  };

  const handleRemove = async (productId, size, color) => {
    setUpdating(true);
    try {
      await api.delete('/users/cart', { data: { productId, size, color } });
      setCart(cart => cart.filter(item => !(item.product._id === productId && item.size === size && item.color === color)));
    } catch {
      setToast({ type: 'error', message: 'Failed to remove item' });
      setTimeout(() => setToast(null), 2000);
    }
    setUpdating(false);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.cartList}>
        <h1>Your Cart</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map(item => (
            <div className={styles.cartItem} key={item.product._id + item.size + item.color}>
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className={styles.cartImg}
              />
              <div className={styles.cartInfo}>
                <div className={styles.cartTitle}>{item.product.name}</div>
                <div className={styles.cartMeta}>Size: {item.size || '-'}</div>
                <div className={styles.cartMeta}>Color: {item.color || '-'}</div>
                <div className={styles.cartMeta}>Price: ₹{item.price}</div>
              </div>
              <div className={styles.cartActions}>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e => handleUpdateQty(item.product._id, item.size, item.color, Number(e.target.value))}
                  className={styles.qtyInput}
                  disabled={updating}
                />
                <span>Subtotal: ₹{item.price * item.quantity}</span>
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemove(item.product._id, item.size, item.color)}
                  disabled={updating}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className={styles.summary}>
        <div className={styles.summaryTitle}>Order Summary</div>
        <div className={styles.summaryRow}>
          <span>Items:</span>
          <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Total:</span>
          <span>₹{total}</span>
        </div>
        <button
          className={styles.checkoutBtn}
          onClick={() => navigate('/checkout')}
          disabled={cart.length === 0}
        >
          Proceed to Checkout
        </button>
      </div>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              position: 'fixed',
              top: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2000,
              background: toast.type === 'success' ? '#4caf50' : '#e53935',
              color: '#fff',
              padding: '12px 32px',
              borderRadius: 8,
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              fontWeight: 500,
              fontSize: 16,
            }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Cart; 