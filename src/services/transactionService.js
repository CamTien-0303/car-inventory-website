import api from './apiClient';
import { normalizeTransaction } from '../utils/normalizers';

export const getTransactions = async () => {
  const data = await api.get('/Transaction');
  return Array.isArray(data) ? data.map(normalizeTransaction) : [];
};

/**
 * Backend expects VehicleImportDto:
 * { vin, engineNumber, chassisNumber, productId, warehouseId, importPrice, staffId, currentLocationDetail }
 */
export const importVehicleTransaction = async (payload) => {
  return await api.post('/Transaction/import', payload);
};

/**
 * Backend expects ExportRequestDto:
 * { vin, staffId, exportPrice }
 */
export const exportVehicleTransaction = async (payload) => {
  return await api.post('/Transaction/export', payload);
};
