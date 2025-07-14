import React from 'react';
import styles from './Contact.module.css';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaClock } from 'react-icons/fa';

export default function Contact() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contact Us</h1>
      <div className={styles.topRow}>
        <div className={styles.mapCol}>
          <iframe
            title="Map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=72.8258%2C19.1702%2C72.8558%2C19.2002&amp;layer=mapnik"
            style={{ border: 0, width: '100%', height: 260, borderRadius: 18 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
        <div className={styles.infoCol}>
          <div className={styles.infoItem}><FaMapMarkerAlt className={styles.icon} />
            <div>
              <b>Our Office Address</b><br />
              Palm Court Bldg M, 501/B, 5th Floor, New Link Road,<br />
              Beside Goregaon Sports Complex, Malad West,<br />
              Mumbai, Maharashtra 400064
            </div>
          </div>
          <div className={styles.infoItem}><FaEnvelope className={styles.icon} />
            <div>
              <b>General Enquiries</b><br />
              websupport@justdial.com
            </div>
          </div>
          <div className={styles.infoItem}><FaPhone className={styles.icon} />
            <div>
              <b>Call Us</b><br />
              +91-8888888888
            </div>
          </div>
          <div className={styles.infoItem}><FaClock className={styles.icon} />
            <div>
              <b>Our Timing</b><br />
              Mon - Sun : 10:00 AM - 07:00 PM
            </div>
          </div>
        </div>
      </div>
      <form className={styles.form}>
        <input className={styles.input} type="text" placeholder="Full Name" required />
        <input className={styles.input} type="text" placeholder="Mobile Number" required />
        <input className={styles.input} type="email" placeholder="Email ID" required />
        <textarea className={styles.textarea} placeholder="Message" required />
        <button className={styles.submitBtn} type="submit">Submit</button>
      </form>
    </div>
  );
} 