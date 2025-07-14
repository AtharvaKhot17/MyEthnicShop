import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import handleApiError from '../utils/handleApiError';
import styles from './ProductDetail.module.css';
import { motion, AnimatePresence } from 'framer-motion';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(handleApiError(err, 'Failed to fetch product'));
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    setReviewLoading(true);
    api.get(`/products/${id}/reviews`)
      .then(res => {
        setReviews(res.data);
        setReviewLoading(false);
      })
      .catch((err) => {
        setReviewError(handleApiError(err, 'Failed to fetch reviews'));
        setReviewLoading(false);
      });
  }, [id, reviewSuccess]);

  const handleAddToCart = async () => {
    try {
      await api.post('/users/cart', { productId: product._id, quantity: 1 });
      setToast({ type: 'success', message: 'Added to cart!' });
      setTimeout(() => setToast(null), 2000);
      navigate('/cart');
    } catch {
      setToast({ type: 'error', message: 'Failed to add to cart. Please login.' });
      setTimeout(() => setToast(null), 2000);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await api.post('/users/wishlist', { productId: product._id });
      setToast({ type: 'success', message: 'Added to wishlist!' });
      setTimeout(() => setToast(null), 2000);
      navigate('/wishlist');
    } catch {
      setToast({ type: 'error', message: 'Failed to add to wishlist. Please login.' });
      setTimeout(() => setToast(null), 2000);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    setReviewError(null);
    setReviewSuccess(null);
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      setReviewSuccess('Review added!');
      setComment('');
      setRating(5);
    } catch (err) {
      setReviewError(handleApiError(err, 'Failed to add review'));
    }
    setReviewSubmitting(false);
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleEditSubmit = async (e, reviewId) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await api.put(`/products/${id}/reviews/${reviewId}`, { rating: editRating, comment: editComment });
      setReviewSuccess('Review updated!');
      setEditingReviewId(null);
      setEditComment('');
      setEditRating(5);
    } catch (err) {
      setReviewError(handleApiError(err, 'Failed to update review'));
    }
    setEditLoading(false);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete your review?')) return;
    setDeleteLoading(reviewId);
    try {
      await api.delete(`/products/${id}/reviews/${reviewId}`);
      setReviewSuccess('Review deleted!');
    } catch (err) {
      setReviewError(handleApiError(err, 'Failed to delete review'));
    }
    setDeleteLoading('');
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  const alreadyReviewed = user && reviews.some(r => r.user === user._id);

  const handleImageClick = (idx) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[lightboxIndex] || product.images[0]}
            alt={product.name}
            className={styles.mainImg}
            onClick={() => handleImageClick(lightboxIndex)}
          />
        ) : (
          <img
            src="https://via.placeholder.com/350x350?text=No+Image"
            alt="No product"
            className={styles.mainImg}
          />
        )}
        {product.images && product.images.length > 1 && (
          <div className={styles.thumbs}>
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={product.name}
                className={styles.thumb + (idx === lightboxIndex ? ' ' + styles.thumbActive : '')}
                onClick={() => setLightboxIndex(idx)}
              />
            ))}
          </div>
        )}
        <AnimatePresence>
          {lightboxOpen && product.images && product.images.length > 0 && (
            <motion.div
              className={styles.lightbox}
              onClick={() => setLightboxOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ zIndex: 1000 }}
            >
              <motion.div
                className={styles.lightboxInner}
                onClick={e => e.stopPropagation()}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <img src={product.images[lightboxIndex]} alt={product.name} className={styles.lightboxImg} />
                <button onClick={() => setLightboxOpen(false)} className={styles.lightboxClose}>&times;</button>
                {product.images.length > 1 && (
                  <>
                    <button onClick={() => setLightboxIndex((lightboxIndex - 1 + product.images.length) % product.images.length)} className={styles.lightboxNav + ' ' + styles.lightboxPrev}>&lt;</button>
                    <button onClick={() => setLightboxIndex((lightboxIndex + 1) % product.images.length)} className={styles.lightboxNav + ' ' + styles.lightboxNext}>&gt;</button>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className={styles.right}>
        <h2 className={styles.title}>{product.name}</h2>
        <p className={styles.price}>₹{product.price}</p>
        <p className={styles.info}>{product.description}</p>
        <p className={styles.info}><b>Category:</b> {product.category}</p>
        {product.sizes && product.sizes.length > 0 && (
          <p className={styles.info}><b>Sizes:</b> {product.sizes.join(', ')}</p>
        )}
        {product.colors && product.colors.length > 0 && (
          <p className={styles.info}><b>Colors:</b> {product.colors.join(', ')}</p>
        )}
        {product.fabric && <p className={styles.info}><b>Fabric:</b> {product.fabric}</p>}
        <p className={styles.stock}><b>Stock:</b> {product.isInStock ? 'In Stock' : 'Out of Stock'}</p>
        <div className={styles.actions}>
          <motion.button
            className={styles.button}
            disabled={!product.isInStock}
            onClick={handleAddToCart}
            whileHover={{ scale: 1.07, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            Add to Cart
          </motion.button>
          <motion.button
            className={styles.button}
            onClick={handleAddToWishlist}
            whileHover={{ scale: 1.07, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            Add to Wishlist
          </motion.button>
        </div>
        <hr style={{ margin: '24px 0' }} />
        <h3 className={styles.section}>Product Reviews</h3>
        {reviewLoading ? <p>Loading reviews...</p> : reviewError ? <p style={{ color: 'red' }}>{reviewError}</p> : reviews.length === 0 ? <p>No reviews yet.</p> : (
          <div className={styles.reviewList}>
            {reviews.map((r, idx) => (
              <div key={idx} className={styles.reviewItem}>
                <b className={styles.reviewName}>{r.name}</b> <span className={styles.reviewStars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                <div style={{ fontSize: 14, color: '#555' }}>{r.comment}</div>
                <div className={styles.reviewDate}>{new Date(r.createdAt).toLocaleDateString()}</div>
                {user && r.user === user._id && (
                  <div style={{ marginTop: 4 }}>
                    <button onClick={() => handleEditClick(r)} style={{ marginRight: 8, padding: '2px 8px', fontSize: 13 }}>Edit</button>
                    <button onClick={() => handleDeleteReview(r._id)} style={{ color: 'red', padding: '2px 8px', fontSize: 13 }} disabled={deleteLoading === r._id}>{deleteLoading === r._id ? 'Deleting...' : 'Delete'}</button>
                  </div>
                )}
                {editingReviewId === r._id && (
                  <form onSubmit={e => handleEditSubmit(e, r._id)} style={{ marginTop: 8, background: '#f9f9f9', padding: 8, borderRadius: 4 }}>
                    <label>Rating: </label>
                    <select value={editRating} onChange={e => setEditRating(Number(e.target.value))} style={{ marginBottom: 4 }}>
                      {[5, 4, 3, 2, 1].map(val => <option key={val} value={val}>{val}</option>)}
                    </select>
                    <br />
                    <textarea value={editComment} onChange={e => setEditComment(e.target.value)} style={{ width: '100%', marginBottom: 4, padding: 6 }} required />
                    <button type="submit" style={{ padding: '4px 12px', marginRight: 8 }} disabled={editLoading}>{editLoading ? 'Saving...' : 'Save'}</button>
                    <button type="button" onClick={() => setEditingReviewId(null)} style={{ padding: '4px 12px' }}>Cancel</button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
        {user && !alreadyReviewed && (
          <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
            <h4>Add a Review</h4>
            <label>Rating: </label>
            <select value={rating} onChange={e => setRating(Number(e.target.value))} style={{ marginBottom: 8 }}>
              {[5, 4, 3, 2, 1].map(val => <option key={val} value={val}>{val}</option>)}
            </select>
            <br />
            <textarea placeholder="Comment" value={comment} onChange={e => setComment(e.target.value)} style={{ width: '100%', marginBottom: 8, padding: 8 }} required />
            {reviewError && <p style={{ color: 'red' }}>{reviewError}</p>}
            {reviewSuccess && <p style={{ color: 'green' }}>{reviewSuccess}</p>}
            <button type="submit" className={styles.button} disabled={reviewSubmitting}>{reviewSubmitting ? 'Submitting...' : 'Submit Review'}</button>
          </form>
        )}
        {user && alreadyReviewed && <p style={{ color: 'green' }}>You have already reviewed this product.</p>}
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

export default ProductDetail; 