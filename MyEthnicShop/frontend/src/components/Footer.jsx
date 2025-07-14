import React from 'react';
import styles from './Footer.module.css';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topRow}>
        <div className={styles.col}>
          <div className={styles.colTitle}>USEFUL LINKS</div>
          <button type="button" className={styles.linkButton}>PRIVACY POLICY</button>
          <button type="button" className={styles.linkButton}>CATEGORIES</button>
          <button type="button" className={styles.linkButton}>ABOUT US</button>
          <button type="button" className={styles.linkButton}>VIDEOS</button>
          <button type="button" className={styles.linkButton}>MORE</button>
        </div>
        <div className={styles.col}>
          <div className={styles.colTitle}>&nbsp;</div>
          <button type="button" className={styles.linkButton}>HOME</button>
          <button type="button" className={styles.linkButton}>PRODUCTS</button>
          <button type="button" className={styles.linkButton}>GALLERY</button>
          <button type="button" className={styles.linkButton}>TESTIMONIALS</button>
        </div>
        <div className={styles.col}>
          <div className={styles.colTitle}>CONTACT</div>
          <div className={styles.contactText}>
            Palm Court Bldg M, 501/B, 5th Floor, New Link Road,<br />
            Beside Goregaon Sports Complex, Malad West,<br />
            Mumbai, Maharashtra 400064<br />
            +91-8888888888<br />
            websupport@justdial.com
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.colTitle}>CONNECT</div>
          <div className={styles.socials}>
            <button type="button" aria-label="Facebook" className={styles.socialIcon}><FaFacebookF /></button>
            <button type="button" aria-label="LinkedIn" className={styles.socialIcon}><FaLinkedinIn /></button>
            <button type="button" aria-label="Instagram" className={styles.socialIcon}><FaInstagram /></button>
            <button type="button" aria-label="Twitter" className={styles.socialIcon}><FaTwitter /></button>
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