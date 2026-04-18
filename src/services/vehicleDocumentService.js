import api from './apiClient';
import { normalizeVehicleDocument } from '../utils/normalizers';

export const getVehicleDocuments = async () => {
  const data = await api.get('/VehicleDocument');
  return Array.isArray(data) ? data.map(normalizeVehicleDocument) : [];
};

export const createVehicleDocument = async (payload) => {
  const data = await api.post('/VehicleDocument', payload);
  return normalizeVehicleDocument(data);
};

export const updateVehicleDocument = async (id, payload) => {
  await api.put(`/VehicleDocument/${id}`, payload);
};

export const deleteVehicleDocument = async (id) => {
  await api.delete(`/VehicleDocument/${id}`);
};
