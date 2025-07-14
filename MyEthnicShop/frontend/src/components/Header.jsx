import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Header.module.css';
import { FaUserCircle, FaShoppingCart, FaSearch, FaHeart, FaSignOutAlt } from 'react-icons/fa';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="Royal Fashion Home">
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="19" cy="19" r="19" fill="#d72660" />
            <path d="M19 8C21.5 14 28 13 28 19C28 25 19 30 19 30C19 30 10 25 10 19C10 13 16.5 14 19 8Z" fill="#fff5fa" />
            <ellipse cx="19" cy="19" rx="7" ry="4" fill="#fbb1b1" />
          </svg>
          <span style={{ color: '#2d1e2f', fontWeight: 700, fontSize: 22, marginLeft: 10, fontFamily: 'Poppins, Arial, sans-serif', letterSpacing: 1 }}>Royal Fashion</span>
        </Link>
        <div className={styles.searchBar}>
          <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1 }}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search for products, brands and more..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className={styles.searchBtn} type="submit" aria-label="Search">
              <FaSearch />
            </button>
          </form>
        </div>
        <nav className={styles.nav}>
          <NavLink to="/" className={({ isActive }) => isActive ? styles.active + ' ' + styles.link : styles.link}>Home</NavLink>
          <NavLink to="/products" className={({ isActive }) => isActive ? styles.active + ' ' + styles.link : styles.link}>Products</NavLink>
          <NavLink to="/cart" className={({ isActive }) => isActive ? styles.active + ' ' + styles.link : styles.link}><FaShoppingCart style={{ marginRight: 6, verticalAlign: 'middle' }} />Cart</NavLink>
          <NavLink to="/wishlist" className={({ isActive }) => isActive ? styles.active + ' ' + styles.link : styles.link}><FaHeart style={{ marginRight: 6, verticalAlign: 'middle', color: '#d72660' }} />Wishlist</NavLink>
          {user && user.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? styles.active + ' ' + styles.link : styles.link}>Admin</NavLink>
          )}
        </nav>
        <div className={styles.right}>
          {user ? (
            <>
              <NavLink to="/profile" className={styles.iconBtn} title="Profile">
                <FaUserCircle size={28} />
              </NavLink>
              <button className={styles.iconBtn} title="Logout" style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 8 }} onClick={() => { logout(); navigate('/'); }}>
                <FaSignOutAlt size={26} />
              </button>
            </>
          ) : (
            <NavLink to="/login" className={styles.iconBtn} title="Login">
              <FaUserCircle size={28} />
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header; 