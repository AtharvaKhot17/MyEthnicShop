import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import styles from './EditProduct.module.css';
import { motion } from 'framer-motion';

const CATEGORY_OPTIONS = ['Saree', 'Kurti', 'Dress', 'Dupatta'];
const SIZE_OPTIONS = ['S', 'M', 'L', 'XL'];
const COLOR_OPTIONS = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'];

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', price: '', description: '', category: CATEGORY_OPTIONS[0], stock: '' });
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [images, setImages] = useState([]); // existing image URLs
  const [newImages, setNewImages] = useState([]); // new files
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then(res => {
        setForm({
          name: res.data.name || '',
          price: res.data.price || '',
          description: res.data.description || '',
          category: res.data.category || CATEGORY_OPTIONS[0],
          stock: res.data.stock || '',
        });
        setSizes(res.data.sizes || []);
        setColors(res.data.colors || []);
        setImages(res.data.images || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch product');
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    let imageUrls = [...images];
    try {
      if (newImages.length > 0) {
        const formData = new FormData();
        for (let img of newImages) {
          formData.append('images', img);
        }
        const uploadRes = await api.post('/products/upload-images', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrls = imageUrls.concat(uploadRes.data.urls);
      }
      await api.put(`/products/${id}`, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: imageUrls,
        sizes,
        colors,
      });
      setSuccess('Product updated!');
      setTimeout(() => navigate('/admin'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Product</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={styles.input} required />
        <input placeholder="Price" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className={styles.input} required />
        <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={styles.select} required>
          {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className={styles.input} required />
        <label style={{ fontWeight: 600, marginBottom: 4 }}>Sizes:</label>
        <div className="multiSelectContainer">
          {SIZE_OPTIONS.map(opt => (
            <span
              key={opt}
              className={sizes.includes(opt) ? 'pill selected' : 'pill'}
              onClick={() => setSizes(sizes.includes(opt) ? sizes.filter(s => s !== opt) : [...sizes, opt])}
              tabIndex={0}
              role="button"
              aria-pressed={sizes.includes(opt)}
            >
              {opt}
              {sizes.includes(opt) && (
                <span className="pillRemove" onClick={e => { e.stopPropagation(); setSizes(sizes.filter(s => s !== opt)); }}>&times;</span>
              )}
            </span>
          ))}
          {sizes.length > 0 && (
            <button type="button" className="clearBtn" onClick={() => setSizes([])}>Clear</button>
          )}
        </div>
        <label style={{ fontWeight: 600, marginBottom: 4 }}>Colors:</label>
        <div className="multiSelectContainer">
          {COLOR_OPTIONS.map(opt => (
            <span
              key={opt}
              className={colors.includes(opt) ? 'pill selected' : 'pill'}
              onClick={() => setColors(colors.includes(opt) ? colors.filter(c => c !== opt) : [...colors, opt])}
              tabIndex={0}
              role="button"
              aria-pressed={colors.includes(opt)}
            >
              {opt}
              {colors.includes(opt) && (
                <span className="pillRemove" onClick={e => { e.stopPropagation(); setColors(colors.filter(c => c !== opt)); }}>&times;</span>
              )}
            </span>
          ))}
          {colors.length > 0 && (
            <button type="button" className="clearBtn" onClick={() => setColors([])}>Clear</button>
          )}
        </div>
        <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={styles.textarea} required />
        <div>
          <label>Current Images:</label>
          <div className={styles.imgGallery}>
            {images.map((img, idx) => (
              <img key={idx} src={img} alt="Product" className={styles.imgThumb} />
            ))}
          </div>
        </div>
        <input type="file" multiple accept="image/*" onChange={e => setNewImages([...e.target.files])} className={styles.fileInput} />
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <motion.button
          type="submit"
          className={styles.submitBtn}
          whileHover={{ scale: 1.07, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          Update Product
        </motion.button>
      </form>
    </div>
  );
}

export default EditProduct; 