import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/password', data),
};

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  createUser: (data) => api.post('/admin/users', data),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  createStore: (data) => api.post('/admin/stores', data),
  getStores: (params) => api.get('/admin/stores', { params }),
};

export const storeService = {
  getStores: (params) => api.get('/stores', { params }),
  submitRating: (storeId, rating) => api.post(`/stores/${storeId}/ratings`, { rating }),
  updateRating: (storeId, rating) => api.put(`/stores/${storeId}/ratings`, { rating }),
};

export const storeOwnerService = {
  getDashboard: () => api.get('/store-owner/dashboard'),
  getRatings: (params) => api.get('/store-owner/ratings', { params }),
};
