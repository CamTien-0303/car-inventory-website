import api from './apiClient';
import { normalizeStaff } from '../utils/normalizers';

export const getStaff = async () => {
  const data = await api.get('/Staff');
  return Array.isArray(data) ? data.map(normalizeStaff) : [];
};

export const createStaff = async (payload) => {
  const data = await api.post('/Staff', payload);
  return normalizeStaff(data);
};

export const updateStaff = async (id, payload) => {
  await api.put(`/Staff/${id}`, payload);
};

export const deleteStaff = async (id) => {
  await api.delete(`/Staff/${id}`);
};
