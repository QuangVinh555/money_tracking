import axios from 'axios';

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_API}/api`, // 👈 thay bằng base URL thật
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
