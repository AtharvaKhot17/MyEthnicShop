import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import styles from './Profile.module.css';
import { motion, AnimatePresence } from 'framer-motion';

function Profile() {
  const { user, setUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailLoading, setOrderDetailLoading] = useState(false);
  const [orderDetailError, setOrderDetailError] = useState(null);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/orders/my')
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch orders');
        setLoading(false);
      });
  }, []);

  const handleOrderClick = async (orderId) => {
    setShowModal(true);
    setOrderDetailLoading(true);
    setOrderDetailError(null);
    setSelectedOrder(null);
    try {
      const res = await api.get(`/orders/${orderId}`);
      setSelectedOrder(res.data);
    } catch (err) {
      setOrderDetailError('Failed to fetch order details');
    }
    setOrderDetailLoading(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setOrderDetailError(null);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(null);
    try {
      const res = await api.put('/users/profile', form);
      setUser(prev => ({ ...prev, name: res.data.name, email: res.data.email }));
      setFormSuccess('Profile updated!');
      setForm(f => ({ ...f, password: '' }));
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update profile');
    }
    setFormLoading(false);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return;
    setCancellingOrderId(orderId);
    try {
      await api.put(`/orders/${orderId}/cancel`);
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: 'Cancelled' } : o));
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to cancel order' });
      setTimeout(() => setToast(null), 2000);
    }
    setCancellingOrderId('');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Profile</h1>
      <form onSubmit={handleProfileUpdate} className={styles.profileForm}>
        <h3 className={styles.formTitle}>Update Profile</h3>
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className={styles.input}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          className={styles.input}
          required
        />
        <input
          placeholder="New Password (leave blank to keep current)"
          type="password"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          className={styles.input}
        />
        {formError && <p className={styles.formError}>{formError}</p>}
        {formSuccess && <p className={styles.formSuccess}>{formSuccess}</p>}
        <motion.button
          type="submit"
          className={styles.profileBtn}
          disabled={formLoading}
          whileHover={{ scale: 1.07, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {formLoading ? 'Updating...' : 'Update Profile'}
        </motion.button>
      </form>
      <h2 className={styles.orderTitle}>Order History</h2>
      {loading ? <p>Loading orders...</p> : error ? <p className={styles.formError}>{error}</p> : orders.length === 0 ? <p>No orders found.</p> : (
        <table className={styles.orderTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>
                  <button className={styles.orderIdBtn} onClick={() => handleOrderClick(order._id)}>{order._id.slice(-6).toUpperCase()}</button>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.status}</td>
                <td>₹{order.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showModal && (
        <div className={styles.orderModalOverlay}>
          <div className={styles.orderModal}>
            <button onClick={closeModal} className={styles.closeBtn}>&times;</button>
            {orderDetailLoading ? <p>Loading order details...</p> : orderDetailError ? <p className={styles.formError}>{orderDetailError}</p> : selectedOrder && (
              <div>
                <h3>Order #{selectedOrder._id.slice(-6).toUpperCase()}</h3>
                <p><b>Date:</b> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                <p><b>Status:</b> {selectedOrder.status}</p>
                <p><b>Total:</b> ₹{selectedOrder.totalPrice}</p>
                <p><b>Payment Method:</b> {selectedOrder.paymentMethod}</p>
                <p><b>Shipping Address:</b> {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}</p>
                <h4>Items:</h4>
                <ul>
                  {selectedOrder.orderItems.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: 8 }}>
                      <b>{item.name}</b> ({item.qty} x ₹{item.price})
                      {item.size && <span> | Size: {item.size}</span>}
                      {item.color && <span> | Color: {item.color}</span>}
                    </li>
                  ))}
                </ul>
                {selectedOrder.status === 'Delivered' && selectedOrder.deliveredAt && (
                  <p><b>Delivered At:</b> {new Date(selectedOrder.deliveredAt).toLocaleDateString()}</p>
                )}
                {selectedOrder.status === 'Pending' && (
                  <button
                    onClick={() => handleCancelOrder(selectedOrder._id)}
                    disabled={cancellingOrderId === selectedOrder._id}
                    className={styles.cancelOrderBtn}
                  >
                    {cancellingOrderId === selectedOrder._id ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>
            )}
          </div>
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

export default Profile; 