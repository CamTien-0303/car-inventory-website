import api from './apiClient';
import { normalizeVehicle } from '../utils/normalizers';

export const getVehicles = async () => {
  const data = await api.get('/Vehicle');
  return Array.isArray(data) ? data.map(normalizeVehicle) : [];
};

export const getVehicleByVin = async (vin) => {
  const data = await api.get(`/Vehicle/${encodeURIComponent(vin)}`);
  return data;  // Return raw data (includes nested Product, Warehouse, Documents)
};

export const createVehicle = async (payload) => {
  const data = await api.post('/Vehicle', payload);
  return normalizeVehicle(data);
};

export const updateVehicle = async (vin, payload) => {
  await api.put(`/Vehicle/${encodeURIComponent(vin)}`, payload);
};

export const deleteVehicle = async (vin) => {
  await api.delete(`/Vehicle/${encodeURIComponent(vin)}`);
};

/**
 * Backend signature:
 *   PATCH /api/Vehicle/location?vin=X&newLocation=Y&staffId=Z
 * All params are query-string (not body).
 */
export const updateVehicleLocation = async (vin, newLocation, staffId = 1) => {
  const params = new URLSearchParams({ vin, newLocation, staffId });
  await api.patch(`/Vehicle/location?${params.toString()}`);
};
