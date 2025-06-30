import axiosClient from '../axiosClient.js';

const transactionsApi = {
  getAll: () => axiosClient.get('/transactions/get-by-group-date'),
  getById: (id) => axiosClient.get(`/transactions/${id}`),
  create: (data) => axiosClient.post('/transactions', data),
  update: (id, data) => axiosClient.put(`/transactions/${id}`, data),
  delete: (id) => axiosClient.delete(`/transactions/${id}`),
};

export default transactionsApi;
