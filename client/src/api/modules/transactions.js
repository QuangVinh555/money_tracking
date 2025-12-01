import axiosClient from '../axiosClient.js';

const transactionsApi = {
  // getAllTransactions: (datetime, params = {}) => axiosClient.get('/transactions/get-all-transactions', {params: { OptionDate: datetime, ...params }}),
  getSearchTransactions: (params = {}) => axiosClient.get('/transactions/search', {params: params}),
  getAllTransactionsByGroupDate: (datetime) => axiosClient.get(`/transactions/get-by-group-date?OptionDate=${datetime}`),
  getTotalCard: (datetime) => axiosClient.get(`/transactions/total-card?OptionDate=${datetime}`),
  getTotalCardByDate: (datetime) => axiosClient.get(`/transactions/total-card-by-date?OptionDate=${datetime}`),
  getById: (id) => axiosClient.get(`/transactions/${id}`),
  create: (data) => axiosClient.post('/transactions/create', data),
  update: (id, data) => axiosClient.put(`/transactions/update/${id}`, data),
  delete: (id) => axiosClient.delete(`/transactions/delete/${id}`),
};

export default transactionsApi;
