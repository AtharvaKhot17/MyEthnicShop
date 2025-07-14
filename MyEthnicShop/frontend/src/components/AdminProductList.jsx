import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import './AdminProductList.module.css';

function AdminProductList({ products, setProducts }) {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch {
      setToast({ type: 'error', message: 'Failed to delete product' });
      setTimeout(() => setToast(null), 2000);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await api.get('/products/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products.csv');
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
      <motion.button
        onClick={handleExportCSV}
        style={{ marginBottom: 16, padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        whileHover={{ scale: 1.07, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        Export Products as CSV
      </motion.button>
      <h3>All Products</h3>
      <div className="adminTableWrapper">
        <table className="adminTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td className="ellipsisCell" title={product.name}>{product.name}</td>
                <td>₹{product.price}</td>
                <td>{product.category}</td>
                <td>{product.stock}</td>
                <td>
                  <motion.button
                    onClick={() => navigate(`/admin/products/${product._id}/edit`)}
                    className="adminTableBtn editBtn"
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(product._id)}
                    className="adminTableBtn deleteBtn"
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    Delete
                  </motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default AdminProductList; 