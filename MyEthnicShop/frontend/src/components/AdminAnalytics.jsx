import React, { useEffect, useState } from 'react';
import api from '../api/axios';

function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/orders/stats')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch stats');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>Analytics</h2>
      {loading ? <p>Loading analytics...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : stats && (
        <>
          <div style={{ display: 'flex', gap: 32, marginBottom: 24 }}>
            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, minWidth: 120 }}>
              <div style={{ fontSize: 18, fontWeight: 'bold' }}>{stats.totalOrders}</div>
              <div>Total Orders</div>
            </div>
            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, minWidth: 120 }}>
              <div style={{ fontSize: 18, fontWeight: 'bold' }}>₹{stats.totalSales}</div>
              <div>Total Sales</div>
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <h4>Status Counts</h4>
            <ul>
              {Object.entries(stats.statusCounts).map(([status, count]) => (
                <li key={status}><b>{status}:</b> {count}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Orders Per Day (Last 7 Days)</h4>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
              {stats.ordersPerDay.map(day => (
                <div key={day._id} style={{ textAlign: 'center' }}>
                  <div style={{ background: '#007bff', width: 24, height: day.count * 16, borderRadius: 4, marginBottom: 4, transition: 'height 0.3s' }}></div>
                  <div style={{ fontSize: 12 }}>{day._id.slice(5)}</div>
                  <div style={{ fontSize: 12 }}>{day.count}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminAnalytics; 