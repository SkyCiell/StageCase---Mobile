import axios from 'axios';

// Update with your local IP when testing on physical mobile device via Expo Go
const API_URL = 'http://10.0.2.2:5000/api'; // Android Emulator default

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export default api;
