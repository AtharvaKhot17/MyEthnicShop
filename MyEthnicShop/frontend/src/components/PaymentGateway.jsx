import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { FaLock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import styles from './PaymentGateway.module.css';

const PaymentGateway = ({ amount, orderId, onPaymentSuccess, onPaymentError }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await api.get('/payments/methods');
      setPaymentMethods(response.data.methods);
    } catch (err) {
      console.error('Failed to fetch payment methods:', err);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      switch (selectedMethod) {
        case 'razorpay':
          await handleRazorpayPayment();
          break;
        case 'cod':
          await handleCODPayment();
          break;
        default:
          throw new Error('Invalid payment method');
      }
    } catch (err) {
      setError(err.message || 'Payment failed');
      onPaymentError?.(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      // Create Razorpay order
      const response = await api.post('/payments/razorpay/create-order', {
        amount,
        currency: 'INR',
        receipt: `order_${orderId}`,
      });

      const options = {
        key: 'rzp_test_0b3LzdUeKAhIoK',
        amount: response.data.order.amount,
        currency: response.data.order.currency,
        name: 'MyEthnicShop',
        description: 'Payment for your order',
        order_id: response.data.order.id,
        handler: async (response) => {
          try {
            // Verify payment
            await api.post('/payments/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            });
            
            setSuccess(true);
            onPaymentSuccess?.();
          } catch (err) {
            throw new Error('Payment verification failed');
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
        },
        theme: {
          color: '#d72684',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      throw new Error('Failed to initialize Razorpay payment');
    }
  };

  const handleCODPayment = async () => {
    setSuccess(true);
    onPaymentSuccess?.();
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={styles.successContainer}
      >
        <FaCheckCircle className={styles.successIcon} />
        <h3>Payment Successful!</h3>
        <p>Your order has been placed successfully.</p>
      </motion.div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Choose Payment Method</h3>
      <div className={styles.methodsContainer}>
        {paymentMethods.map((method) => (
          <motion.div
            key={method.id}
            className={`${styles.methodCard} ${selectedMethod === method.id ? styles.selected : ''}`}
            onClick={() => setSelectedMethod(method.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={styles.methodIcon}>{method.icon}</div>
            <div className={styles.methodInfo}>
              <h4>{method.name}</h4>
              <p>{method.description}</p>
            </div>
            {selectedMethod === method.id && (
              <FaCheckCircle className={styles.checkIcon} />
            )}
          </motion.div>
        ))}
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.errorContainer}
        >
          <FaTimesCircle className={styles.errorIcon} />
          <span>{error}</span>
        </motion.div>
      )}
      <motion.button
        onClick={handlePayment}
        disabled={loading}
        className={styles.payButton}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? 'Processing...' : `Pay ₹${amount}`}
      </motion.button>
      <div className={styles.securityNote}>
        <FaLock className={styles.lockIcon} />
        <span>Your payment information is secure and encrypted</span>
      </div>
    </div>
  );
};

export default PaymentGateway; 