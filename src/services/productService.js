import api from './apiClient';
import { normalizeProduct } from '../utils/normalizers';

export const getProducts = async () => {
  const data = await api.get('/Product');
  return Array.isArray(data) ? data.map(normalizeProduct) : [];
};

export const getProductById = async (id) => {
  const data = await api.get(`/Product/${id}`);
  return normalizeProduct(data);
};

export const createProduct = async (payload) => {
  const data = await api.post('/Product', payload);
  return normalizeProduct(data);
};

export const updateProduct = async (id, payload) => {
  await api.put(`/Product/${id}`, payload);
};

export const deleteProduct = async (id) => {
  await api.delete(`/Product/${id}`);
};
