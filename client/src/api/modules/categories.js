import axiosClient from '../axiosClient.js';

const categoriesApi = {
  getAll: () => axiosClient.get("/category"),
  getById: (id) => axiosClient.get(`/category/${id}`),
  create: (data) => axiosClient.post('/category', data),
  update: (id, data) => axiosClient.put(`/category/${id}`, data),
  delete: (id) => axiosClient.delete(`/category/${id}`),
};

export default categoriesApi;
