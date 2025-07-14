import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import styles from './Home.module.css';
import { motion } from 'framer-motion';
import 'keen-slider/keen-slider.min.css';

const CATEGORY_OPTIONS = [
  { name: 'Saree', img: 'https://cdn.shopify.com/s/files/1/0281/2510/2153/files/10_f6779c52-50eb-4ae1-800f-ce64fd021720_3_480x480.jpg?v=1744374305' },
  { name: 'Kurti', img: 'https://www.royalexport.in/product-img/women-faux-georgette-kurti-pan5-1727173517.jpg' },
  { name: 'Dress', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZW_rrF246kjNyvEJ2pE06ANxh5aegDnBd1w&s' }
];

function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products', { params: { page: 1 } })
      .then(res => {
        setFeatured(res.data.products || res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <svg
          className={styles.heroFloral}
          width="220" height="220" viewBox="0 0 220 220" fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', left: 0, top: 0, zIndex: 0, opacity: 0.18 }}
        >
          <path d="M110 10 Q130 60 180 40 Q200 100 140 120 Q180 180 100 180 Q60 200 40 140 Q10 130 40 80 Q20 40 80 40 Q100 10 110 10 Z" fill="#fbb1b1" />
        </svg>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            Women Clothing<br />
            <span style={{ color: 'var(--color-accent)' }}>on the Cultural Side</span>
          </h1>
          <p className={styles.heroDesc}>
            Discover ethnic elegance with our curated collection of sarees, kurtis, dresses, and more. Premium fabrics, handpicked styles, and fast delivery!
          </p>
          <Link to="/products">
            <motion.button
              style={{ fontSize: 18, padding: '14px 36px', borderRadius: 24, fontWeight: 600 }}
              whileHover={{ scale: 1.07, boxShadow: '0 4px 24px rgba(215,38,96,0.13)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              Shop Now
            </motion.button>
          </Link>
        </div>
        <div className={styles.heroImgArch}>
          <img src="https://i.pinimg.com/736x/d3/33/6a/d3336a358960730933336fff2873cc35.jpg" alt="Ethnic Wear" className={styles.heroImg} />
          <div className={styles.heroMagentaDot}></div>
        </div>
        <div className={styles.heroDecor}></div>
        <svg className={styles.heroFloral2} width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', right: 0, bottom: 0, zIndex: 0, opacity: 0.13 }}>
          <path d="M90 10 Q120 60 160 40 Q170 100 120 120 Q160 160 90 160 Q60 170 40 120 Q10 110 40 70 Q20 40 70 40 Q90 10 90 10 Z" fill="#fbb1b1" />
        </svg>
        <div className={styles.heroDivider}></div>
        <div className="divider"></div>
      </section>

      {/* Categories */}
      <section className={styles.categories}>
        <h2 style={{ textAlign: 'center' }}>Categories</h2>
        <div className={styles.categoryCarouselWrapper}>
          <div className={styles.categoryGrid}>
            {CATEGORY_OPTIONS.map(cat => (
              <div className={styles.categoryCard} key={cat.name}>
                <Link to={`/products?category=${cat.name}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img src={cat.img} alt={cat.name} className={styles.categoryImg} />
                  <div className={styles.categoryName}>{cat.name}</div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.featured}>
        <h2 style={{ textAlign: 'center' }}>Products</h2>
        <div className={styles.featuredGrid}>
          {loading ? <p>Loading...</p> : featured.length === 0 ? <p>No products found.</p> : featured.slice(0, 4).map(product => (
            <ProductCard key={product._id} product={product} />
            ))}
        </div>
      </section>

      {/* About/Why Shop Section */}
      <section className={styles.about}>
        <h2>Why Shop With Us?</h2>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutItem}>
            <span className={styles.aboutIcon}>🌟</span>
            <h4>Curated Styles</h4>
            <p>Handpicked ethnic wear for every occasion and mood.</p>
          </div>
          <div className={styles.aboutItem}>
            <span className={styles.aboutIcon}>🚚</span>
            <h4>Fast Delivery</h4>
            <p>Quick, reliable shipping across India and worldwide.</p>
          </div>
          <div className={styles.aboutItem}>
            <span className={styles.aboutIcon}>💬</span>
            <h4>Personal Support</h4>
            <p>Friendly, boutique-style customer service for every shopper.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home; 