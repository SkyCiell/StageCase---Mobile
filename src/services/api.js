import axios from 'axios';
import { getToken, removeToken } from '../utils/storage';

// Ganti dengan IP lokal kamu saat testing dengan Expo Go di HP fisik
// Android emulator: 10.0.2.2
// iOS simulator: localhost
// HP fisik: IP komputer kamu (cek dengan ipconfig)
export const API_BASE = 'http://10.2.13.7:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token ke setiap request
api.interceptors.request.use(
  async (config) => {
    console.log('📤 API Request:', config.method.toUpperCase(), config.url);
    console.log('📦 Request Data:', config.data);
    
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token attached');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Handle 401 → hapus token
api.interceptors.response.use(
  (res) => {
    console.log('✅ API Response:', res.status, res.config.url);
    console.log('📦 Response Data:', res.data);
    return res;
  },
  async (err) => {
    console.error('❌ API Error:', err.response?.status, err.config?.url);
    console.error('📦 Error Data:', err.response?.data);
    console.error('🔥 Error Message:', err.message);
    
    if (err.response?.status === 401) {
      console.log('🚪 Unauthorized - removing token');
      await removeToken();
    }
    return Promise.reject(err);
  }
);

export default api;
