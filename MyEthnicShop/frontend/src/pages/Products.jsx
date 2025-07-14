import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import handleApiError from '../utils/handleApiError';
import styles from './Products.module.css';
import { motion } from 'framer-motion';

const CATEGORY_OPTIONS = ['Saree', 'Kurti', 'Dress', 'Dupatta'];
const SIZE_OPTIONS = ['S', 'M', 'L', 'XL'];
const COLOR_OPTIONS = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'];

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [inStock, setInStock] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = () => {
    setLoading(true);
    setError(null);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (size) params.size = size;
    if (color) params.color = color;
    if (inStock) params.inStock = inStock;
    params.page = page;
    params.limit = 8;
    api.get('/products', { params })
      .then(res => {
        setProducts(res.data.products || res.data);
        setPages(res.data.pages || 1);
        setTotal(res.data.total || 0);
        setLoading(false);
      })
      .catch(err => {
        setError(handleApiError(err, 'Failed to fetch products'));
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [search, category, minPrice, maxPrice, size, color, inStock, page]);

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSize('');
    setColor('');
    setInStock('');
    setPage(1);
  };

  return (
    <div className={styles.container}>
      {/* Sidebar Filters */}
      <aside className={styles.sidebar}>
        <h3>Filters</h3>
        <input
          placeholder="Search..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className={styles.filterInput}
        />
        <div>
          <label className={styles.filterLabel}>Category:</label>
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} className={styles.filterSelect}>
            <option value="">All</option>
            {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className={styles.filterLabel}>Price:</label>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <input type="number" placeholder="Min" value={minPrice} onChange={e => { setMinPrice(e.target.value); setPage(1); }} className={styles.filterInput} style={{ width: 70 }} />
            <input type="number" placeholder="Max" value={maxPrice} onChange={e => { setMaxPrice(e.target.value); setPage(1); }} className={styles.filterInput} style={{ width: 70 }} />
          </div>
        </div>
        <div>
          <label className={styles.filterLabel}>Size:</label>
          <select value={size} onChange={e => { setSize(e.target.value); setPage(1); }} className={styles.filterSelect}>
            <option value="">All</option>
            {SIZE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className={styles.filterLabel}>Color:</label>
          <select value={color} onChange={e => { setColor(e.target.value); setPage(1); }} className={styles.filterSelect}>
            <option value="">All</option>
            {COLOR_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className={styles.filterLabel}>In Stock:</label>
          <select value={inStock} onChange={e => { setInStock(e.target.value); setPage(1); }} className={styles.filterSelect}>
            <option value="">All</option>
            <option value="true">In Stock</option>
            <option value="false">Out of Stock</option>
          </select>
        </div>
        <motion.button
          onClick={clearFilters}
          className={styles.clearBtn}
          whileHover={{ scale: 1.07, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          Clear Filters
        </motion.button>
        <div className={styles.total}>Total: {total}</div>
      </aside>
      {/* Product List */}
      <div className={styles.main}>
        <h1>Products</h1>
        {loading ? <p>Loading products...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : (
          <>
            <div className={styles.grid}>
              {products.length === 0 ? (
                <p>No products found.</p>
              ) : (
                products.map(product => <ProductCard key={product._id} product={product} />)
              )}
            </div>
            {/* Pagination Controls */}
            <div className={styles.pagination}>
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={styles.pageBtn + (p === page ? ' ' + styles.pageBtnActive : '')}
                >
                  {p}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Products; 