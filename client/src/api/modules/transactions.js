import axiosClient from '../axiosClient.js';

const transactionsApi = {
  getAllTransactionsByGroupDate: (datetime) => axiosClient.get(`/transactions/get-by-group-date?OptionDate=${datetime}`),
  getTotalCard: (datetime) => axiosClient.get(`/transactions/total-card?OptionDate=${datetime}`),
  getById: (id) => axiosClient.get(`/transactions/${id}`),
  create: (data) => axiosClient.post('/transactions/create', data),
  update: (id, data) => axiosClient.put(`/transactions/${id}`, data),
  delete: (id) => axiosClient.delete(`/transactions/${id}`),
};

export default transactionsApi;
