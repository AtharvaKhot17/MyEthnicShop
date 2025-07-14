import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import styles from './Wishlist.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/users/wishlist')
      .then(res => {
        setWishlist(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch wishlist');
        setLoading(false);
      });
  }, []);

  const handleRemove = async (id) => {
    try {
      await api.delete(`/users/wishlist/${id}`);
      setWishlist(wishlist.filter(item => item._id !== id));
    } catch {
      setToast({ type: 'error', message: 'Failed to remove from wishlist' });
      setTimeout(() => setToast(null), 2000);
    }
  };

  if (loading) return <p>Loading wishlist...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className={styles.grid}>
          {wishlist.map(item => (
            <ProductCard
              key={item._id}
              product={item}
              onRemove={() => handleRemove(item._id)}
              showRemove={true}
              showWishlist={false}
              showCart={true}
            />
          ))}
        </div>
      )}
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

export default Wishlist; 