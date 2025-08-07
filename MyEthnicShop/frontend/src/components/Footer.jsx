import React from 'react';
import styles from './Footer.module.css';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topRow}>
        <div className={styles.col}>
          <div className={styles.colTitle}>USEFUL LINKS</div>
          <Link to="/privacy" className={styles.link}>Privacy Policy</Link>
          <Link to="/categories" className={styles.link}>Categories</Link>
          <Link to="/about" className={styles.link}>About Us</Link>
          <Link to="/videos" className={styles.link}>Videos</Link>
          <Link to="/more" className={styles.link}>More</Link>
        </div>
        <div className={styles.col}>
          <div className={styles.colTitle}>NAVIGATION</div>
          <Link to="/" className={styles.link}>Home</Link>
          <Link to="/products" className={styles.link}>Products</Link>
          <Link to="/gallery" className={styles.link}>Gallery</Link>
          <Link to="/testimonials" className={styles.link}>Testimonials</Link>
        </div>
        <div className={styles.col}>
          <div className={styles.colTitle}>CONTACT</div>
          <div className={styles.contactText}>
            <div className={styles.contactItem}>
              <strong>Address:</strong><br />
              Palm Court Bldg M, 501/B, 5th Floor,<br />
              New Link Road, Beside Goregaon Sports Complex,<br />
              Malad West, Mumbai, Maharashtra 400064
            </div>
            <div className={styles.contactItem}>
              <strong>Phone:</strong> +91-8888888888
            </div>
            <div className={styles.contactItem}>
              <strong>Email:</strong> websupport@justdial.com
            </div>
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.colTitle}>CONNECT</div>
          <div className={styles.socials}>
            <button type="button" aria-label="Facebook" className={styles.socialIcon}>
              <FaFacebookF />
            </button>
            <button type="button" aria-label="LinkedIn" className={styles.socialIcon}>
              <FaLinkedinIn />
            </button>
            <button type="button" aria-label="Instagram" className={styles.socialIcon}>
              <FaInstagram />
            </button>
            <button type="button" aria-label="Twitter" className={styles.socialIcon}>
              <FaTwitter />
            </button>
          </div>
        </div>
      </div>
      <div className={styles.bottomRow}>
        <div className={styles.copyright}>
          © Copyrights 2023 - 2024. Justdial Ltd. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
} 