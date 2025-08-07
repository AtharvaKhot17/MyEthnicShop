import axios from 'axios';

const api = axios.create({
  baseURL: 'https://myethnicshop.onrender.com/api', // Updated to deployed backend
  withCredentials: false,
});

export default api; 