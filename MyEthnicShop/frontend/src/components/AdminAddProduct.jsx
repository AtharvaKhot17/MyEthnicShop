import React, { useState, useRef } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import './AdminAddProduct.module.css';

const CATEGORY_OPTIONS = ['Saree', 'Kurti', 'Dress', 'Dupatta'];
const SIZE_OPTIONS = ['S', 'M', 'L', 'XL'];
const COLOR_OPTIONS = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'];

function AdminAddProduct({ onProductAdded }) {
  const [addForm, setAddForm] = useState({ name: '', price: '', description: '', category: CATEGORY_OPTIONS[0], stock: '', sizes: [], colors: [] });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState(null);
  const [addSuccess, setAddSuccess] = useState(null);
  const [addImages, setAddImages] = useState([]);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const sizeRef = useRef();
  const colorRef = useRef();

  // Close dropdowns on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (sizeRef.current && !sizeRef.current.contains(event.target)) setSizeDropdownOpen(false);
      if (colorRef.current && !colorRef.current.contains(event.target)) setColorDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    setAddSuccess(null);
    let imageUrls = [];
    try {
      if (addImages.length > 0) {
        const formData = new FormData();
        for (let img of addImages) {
          formData.append('images', img);
        }
        const uploadRes = await api.post('/products/upload-images', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrls = uploadRes.data.urls;
      }
      const res = await api.post('/products', {
        ...addForm,
        price: Number(addForm.price),
        stock: Number(addForm.stock),
        images: imageUrls,
        sizes: addForm.sizes,
        colors: addForm.colors,
      });
      setAddSuccess('Product added!');
      setAddForm({ name: '', price: '', description: '', category: CATEGORY_OPTIONS[0], stock: '', sizes: [], colors: [] });
      setAddImages([]);
      if (onProductAdded) onProductAdded(res.data);
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to add product');
    }
    setAddLoading(false);
  };

  return (
    <form onSubmit={handleAddProduct} className="adminAddProductFormV2">
      <h2 className="formTitle">Add New Product</h2>
      <p className="formDesc">Fill in the details below to add a new product to your shop.</p>
      <div className="formGrid">
        <div className="formSection">
          <label className="formLabel">Name</label>
          <input className="formInput" placeholder="Name" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} required />
        </div>
        <div className="formSection">
          <label className="formLabel">Price</label>
          <input className="formInput" placeholder="Price" type="number" value={addForm.price} onChange={e => setAddForm(f => ({ ...f, price: e.target.value }))} required />
        </div>
        <div className="formSection">
          <label className="formLabel">Category</label>
          <select className="formInput" value={addForm.category} onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))} required>
            {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="formSection">
          <label className="formLabel">Stock</label>
          <input className="formInput" placeholder="Stock" type="number" value={addForm.stock} onChange={e => setAddForm(f => ({ ...f, stock: e.target.value }))} required />
        </div>
        <div className="formSection">
          <label className="formLabel">Sizes</label>
          <div className="customMultiSelect" ref={sizeRef} tabIndex={0} onBlur={() => setSizeDropdownOpen(false)}>
            <div className="customMultiSelectInput" onClick={() => setSizeDropdownOpen(v => !v)}>
              {addForm.sizes.length === 0 ? (
                <span className="multiSelectPlaceholder">Select sizes</span>
              ) : (
                addForm.sizes.map(opt => (
                  <span key={opt} className="multiPill">
                    {opt}
                    <span className="multiPillRemove" onClick={e => { e.stopPropagation(); setAddForm(f => ({ ...f, sizes: f.sizes.filter(s => s !== opt) })); }}>&times;</span>
                  </span>
                ))
              )}
              <span className="dropdownArrow">▼</span>
            </div>
            {sizeDropdownOpen && (
              <div className="customMultiSelectMenu">
                {SIZE_OPTIONS.map(opt => (
                  <div
                    key={opt}
                    className={addForm.sizes.includes(opt) ? 'customMultiSelectOption selected' : 'customMultiSelectOption'}
                    onClick={() => setAddForm(f => ({ ...f, sizes: f.sizes.includes(opt) ? f.sizes.filter(s => s !== opt) : [...f.sizes, opt] }))}
                  >
                    {opt}
                    {addForm.sizes.includes(opt) && <span className="checkmark">✔</span>}
                  </div>
                ))}
                {addForm.sizes.length > 0 && (
                  <div className="customMultiSelectOption clearAll" onClick={() => setAddForm(f => ({ ...f, sizes: [] }))}>Clear All</div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="formSection">
          <label className="formLabel">Colors</label>
          <div className="customMultiSelect" ref={colorRef} tabIndex={0} onBlur={() => setColorDropdownOpen(false)}>
            <div className="customMultiSelectInput" onClick={() => setColorDropdownOpen(v => !v)}>
              {addForm.colors.length === 0 ? (
                <span className="multiSelectPlaceholder">Select colors</span>
              ) : (
                addForm.colors.map(opt => (
                  <span key={opt} className="multiPill">
                    {opt}
                    <span className="multiPillRemove" onClick={e => { e.stopPropagation(); setAddForm(f => ({ ...f, colors: f.colors.filter(c => c !== opt) })); }}>&times;</span>
                  </span>
                ))
              )}
              <span className="dropdownArrow">▼</span>
            </div>
            {colorDropdownOpen && (
              <div className="customMultiSelectMenu">
                {COLOR_OPTIONS.map(opt => (
                  <div
                    key={opt}
                    className={addForm.colors.includes(opt) ? 'customMultiSelectOption selected' : 'customMultiSelectOption'}
                    onClick={() => setAddForm(f => ({ ...f, colors: f.colors.includes(opt) ? f.colors.filter(c => c !== opt) : [...f.colors, opt] }))}
                  >
                    {opt}
                    {addForm.colors.includes(opt) && <span className="checkmark">✔</span>}
                  </div>
                ))}
                {addForm.colors.length > 0 && (
                  <div className="customMultiSelectOption clearAll" onClick={() => setAddForm(f => ({ ...f, colors: [] }))}>Clear All</div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="formSection fullWidth">
          <label className="formLabel">Description</label>
          <textarea className="formInput" placeholder="Description" value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} required />
        </div>
        <div className="formSection fullWidth">
          <label className="formLabel">Images</label>
          <input className="formInput" type="file" multiple accept="image/*" onChange={e => setAddImages([...e.target.files])} />
        </div>
      </div>
      {addError && <p className="formError">{addError}</p>}
      {addSuccess && <p className="formSuccess">{addSuccess}</p>}
      <motion.button
        type="submit"
        className="formSubmitBtn"
        disabled={addLoading}
        whileHover={{ scale: 1.07, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {addLoading ? 'Adding...' : 'Add Product'}
      </motion.button>
    </form>
  );
}

export default AdminAddProduct; 