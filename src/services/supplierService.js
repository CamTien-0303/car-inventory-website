import api from './apiClient';
import { normalizeSupplier } from '../utils/normalizers';

export const getSuppliers = async () => {
  const data = await api.get('/Supplier');
  return Array.isArray(data) ? data.map(normalizeSupplier) : [];
};

export const createSupplier = async (payload) => {
  const data = await api.post('/Supplier', payload);
  return normalizeSupplier(data);
};

export const updateSupplier = async (id, payload) => {
  await api.put(`/Supplier/${id}`, payload);
};

export const deleteSupplier = async (id) => {
  await api.delete(`/Supplier/${id}`);
};
