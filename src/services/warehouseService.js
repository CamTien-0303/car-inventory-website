import api from './apiClient';
import { normalizeWarehouse } from '../utils/normalizers';

export const getWarehouses = async () => {
  const data = await api.get('/Warehouse');
  return Array.isArray(data) ? data.map(normalizeWarehouse) : [];
};

export const createWarehouse = async (payload) => {
  const data = await api.post('/Warehouse', payload);
  return normalizeWarehouse(data);
};

export const updateWarehouse = async (id, payload) => {
  await api.put(`/Warehouse/${id}`, payload);
};

export const deleteWarehouse = async (id) => {
  await api.delete(`/Warehouse/${id}`);
};
