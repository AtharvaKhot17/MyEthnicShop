import React, { useEffect, useState } from 'react';
import AdminAddProduct from '../components/AdminAddProduct';
import AdminProductList from '../components/AdminProductList';
import AdminOrderManagement from '../components/AdminOrderManagement';
import AdminAnalytics from '../components/AdminAnalytics';
import api from '../api/axios';
import styles from './AdminDashboard.module.css';

const TABS = [
  { key: 'analytics', label: 'Analytics' },
  { key: 'add', label: 'Add Product' },
  { key: 'products', label: 'All Products' },
  { key: 'orders', label: 'Order Management' },
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('add');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/products')
      .then(res => {
        setProducts(res.data.products || res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch products');
        setLoading(false);
      });
  }, []);

  const handleProductAdded = (newProduct) => {
    setProducts(prev => [...prev, newProduct]);
    setActiveTab('products');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      <div className={styles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={activeTab === tab.key ? `${styles.tabBtn} ${styles.tabBtnActive}` : styles.tabBtn}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'analytics' && <AdminAnalytics />}
      {activeTab === 'add' && <AdminAddProduct onProductAdded={handleProductAdded} />}
      {activeTab === 'products' && (loading ? <p>Loading products...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : <AdminProductList products={products} setProducts={setProducts} />)}
      {activeTab === 'orders' && <AdminOrderManagement />}
    </div>
  );
}

export default AdminDashboard; 