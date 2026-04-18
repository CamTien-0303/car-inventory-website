import api from './apiClient';
import { normalizeReport } from '../utils/normalizers';

export const getInventoryAgingReport = async (alertDays = 90) => {
  const data = await api.get(`/Report/inventory-aging?alertDays=${alertDays}`);
  return Array.isArray(data) ? data.map(normalizeReport) : [];
};
