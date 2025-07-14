import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const ORDER_STATUS_OPTIONS = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

function AdminOrderManagement() {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [orderStatusUpdating, setOrderStatusUpdating] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailLoading, setOrderDetailLoading] = useState(false);
  const [orderDetailError, setOrderDetailError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setOrdersLoading(true);
    api.get('/orders')
      .then(res => {
        setOrders(res.data);
        setOrdersLoading(false);
      })
      .catch(err => {
        setOrdersError(err.message || 'Failed to fetch orders');
        setOrdersLoading(false);
      });
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setOrderStatusUpdating(orderId);
    try {
      const res = await api.put(`/orders/${orderId}`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: res.data.status, deliveredAt: res.data.deliveredAt } : o));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: res.data.status, deliveredAt: res.data.deliveredAt }));
      }
    } catch {
      setToast({ type: 'error', message: 'Failed to update order status' });
      setTimeout(() => setToast(null), 2000);
    }
    setOrderStatusUpdating('');
  };

  const handleViewDetails = async (orderId) => {
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

  const handleExportCSV = async () => {
    try {
      const res = await api.get('/orders/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'orders.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setToast({ type: 'error', message: 'Failed to export CSV' });
      setTimeout(() => setToast(null), 2000);
    }
  };

  return (
    <div>
      <h2>Order Management</h2>
      <motion.button
        onClick={handleExportCSV}
        style={{ marginBottom: 16, padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        whileHover={{ scale: 1.07, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        Export Orders as CSV
      </motion.button>
      {ordersLoading ? <p>Loading orders...</p> : ordersError ? <p style={{ color: 'red' }}>{ordersError}</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32 }}>
          <thead>
            <tr style={{ background: '#eee' }}>
              <th>Order ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} style={{ borderBottom: '1px solid #ccc' }}>
                <td>{order._id.slice(-6).toUpperCase()}</td>
                <td>{order.user?.name || 'N/A'}</td>
                <td>₹{order.totalPrice}</td>
                <td>{order.status}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order._id, e.target.value)}
                    disabled={orderStatusUpdating === order._id}
                    style={{ padding: 4, marginRight: 8 }}
                  >
                    {ORDER_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  {orderStatusUpdating === order._id && <span style={{ marginLeft: 8 }}>Updating...</span>}
                  <motion.button
                    onClick={() => handleViewDetails(order._id)}
                    style={{ marginLeft: 8, padding: '4px 10px', fontSize: 13 }}
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    View Details
                  </motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 8, minWidth: 400, maxWidth: 600, position: 'relative' }}>
            <motion.button
              onClick={closeModal}
              style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              &times;
            </motion.button>
            {orderDetailLoading ? <p>Loading order details...</p> : orderDetailError ? <p style={{ color: 'red' }}>{orderDetailError}</p> : selectedOrder && (
              <div>
                <h3>Order #{selectedOrder._id.slice(-6).toUpperCase()}</h3>
                <p><b>User:</b> {selectedOrder.user?.name} ({selectedOrder.user?.email})</p>
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
                <p style={{ fontSize: 13, color: '#888', marginTop: 12 }}>Order ID: {selectedOrder._id}</p>
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

export default AdminOrderManagement; 