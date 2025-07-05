import axiosClient from '../axiosClient.js';

const budgetsLimitApi = {
  getAll: () => axiosClient.get("/budgetsLimit"),
  getById: (id) => axiosClient.get(`/budgetsLimit/${id}`),
  create: (data) => axiosClient.post('/budgetsLimit/create', data),
  update: (id, data) => axiosClient.put(`/budgetsLimit/${id}`, data),
  delete: (id) => axiosClient.delete(`/budgetsLimit/${id}`),
};

export default budgetsLimitApi;
