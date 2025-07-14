import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import styles from './ProductCard.module.css';
import { motion } from 'framer-motion';
import { FaStar, FaTag, FaShoppingCart, FaHeart, FaTrash } from 'react-icons/fa';

function ProductCard({ product, onRemove, showRemove, showWishlist = true, showCart = true }) {
  const navigate = useNavigate();

  // Example badge logic (customize as needed)
  let badge = '';
  if (!product.isInStock) badge = 'Out of Stock';
  else if (product.isNew) badge = 'New';
  else if (product.isOnSale) badge = 'Sale';

  const handleAddToCart = async () => {
    try {
      await api.post('/users/cart', { productId: product._id, quantity: 1 });
      alert('Added to cart!');
      navigate('/cart');
    } catch {
      alert('Failed to add to cart. Please login.');
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await api.post('/users/wishlist', { productId: product._id });
      alert('Added to wishlist!');
      navigate('/wishlist');
    } catch {
      alert('Failed to add to wishlist. Please login.');
    }
  };

  return (
    <motion.div
      className={styles.card}
      whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {badge && <div className={styles.badge}>{badge}</div>}
      <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/200x200?text=No+Image'}
          alt={product.name}
          className={styles.img}
        />
        {/* Brand */}
        {product.brand && <div className={styles.brand}>{product.brand}</div>}
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.price}>₹{product.price}</p>
        <div className={styles.infoRow}>
          {/* Rating */}
          {product.ratings && (
            <span className={styles.rating}><FaStar style={{ color: '#fbbf24', marginRight: 3, verticalAlign: 'middle' }} />{product.ratings.toFixed(1)}</span>
          )}
          {/* Discount */}
          {product.discount && (
            <span className={styles.discount}><FaTag style={{ color: '#d72660', marginRight: 3, verticalAlign: 'middle' }} />{product.discount}% OFF</span>
          )}
        </div>
      </Link>
      <div className={styles.actionsRow}>
        {showRemove && (
          <button className={styles.button + ' ' + styles.removeBtn} onClick={onRemove}><FaTrash style={{ marginRight: 6 }} />Remove</button>
        )}
        {showCart && product.isInStock && (
          <button className={styles.button} onClick={handleAddToCart}><FaShoppingCart style={{ marginRight: 6 }} />Add to Cart</button>
        )}
        {showWishlist && !showRemove && (
          <button className={styles.button} onClick={handleAddToWishlist}><FaHeart style={{ marginRight: 6 }} />Add to Wishlist</button>
        )}
      </div>
    </motion.div>
  );
}

export default ProductCard; 