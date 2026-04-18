import React, { useState, useEffect } from 'react';
import { PageHeader, LoadingState, ErrorState, RefreshButton } from '../components/common/ui';
import { getProducts } from '../services/productService';
import { getVehicles } from '../services/vehicleService';
import { getWarehouses } from '../services/warehouseService';
import { getTransactions } from '../services/transactionService';
import { getStaff } from '../services/staffService';
import { Package, Car, Warehouse as WarehouseIcon, ArrowRightLeft, UserSquare2, AlertTriangle } from 'lucide-react';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [products, vehicles, warehouses, transactions, staff] = await Promise.all([
        getProducts().catch(() => []),
        getVehicles().catch(() => []),
        getWarehouses().catch(() => []),
        getTransactions().catch(() => []),
        getStaff().catch(() => []),
      ]);

      const inStock = vehicles.filter(v => v.status === 'In_stock' || v.status === 'In_Stock').length;
      const sold = vehicles.filter(v => v.status === 'Sold').length;
      const imports = transactions.filter(t => t.type === 'Import').length;
      const exports = transactions.filter(t => t.type === 'Export').length;

      setStats({
        products: products.length,
        vehicles: vehicles.length,
        inStock,
        sold,
        warehouses: warehouses.length,
        staff: staff.length,
        totalTransactions: transactions.length,
        imports,
        exports,
      });
    } catch (err) {
      setError(err.message || 'Không thể tải dữ liệu thống kê.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return <LoadingState message="Đang tải tổng quan..." />;
  if (error) return <ErrorState message={error} onRetry={fetchStats} />;

  const statCards = [
    { title: 'Tổng xe', value: stats.vehicles, icon: Car, bg: 'var(--color-primary-soft)', color: '#3b82f6' },
    { title: 'Trong kho', value: stats.inStock, icon: Car, bg: 'var(--color-success-soft)', color: '#22c55e' },
    { title: 'Đã bán', value: stats.sold, icon: Car, bg: 'var(--color-warning-soft)', color: '#f59e0b' },
    { title: 'Mẫu sản phẩm', value: stats.products, icon: Package, bg: 'var(--color-purple-soft)', color: '#8b5cf6' },
    { title: 'Kho bãi', value: stats.warehouses, icon: WarehouseIcon, bg: 'var(--color-info-soft)', color: '#06b6d4' },
    { title: 'Giao dịch', value: stats.totalTransactions, icon: ArrowRightLeft, bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
    { title: 'Nhân sự', value: stats.staff, icon: UserSquare2, bg: 'rgba(20,184,166,0.1)', color: '#14b8a6' },
  ];

  const allZero = statCards.every(c => c.value === 0);

  return (
    <div>
      <PageHeader
        title="Tổng quan"
        subtitle="Dashboard quản lý kho xe"
        extra={<RefreshButton onClick={fetchStats} />}
      />

      {allZero && (
        <div className="alert-banner alert-banner-warning" style={{ marginBottom: '1.5rem' }}>
          <AlertTriangle size={18} />
          <div>
            <strong>Chưa có dữ liệu.</strong> Backend có thể đang khởi động hoặc database chưa có seed data.
            Hãy thử nhấn Refresh sau 30–60 giây.
          </div>
        </div>
      )}

      <div className="card-grid">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="stat-card">
              <div className="stat-card-header">
                <span className="stat-title">{card.title}</span>
                <div className="stat-icon-wrap" style={{ background: card.bg }}>
                  <Icon size={18} color={card.color} />
                </div>
              </div>
              <span className="stat-value">{card.value}</span>
            </div>
          );
        })}
      </div>

      {stats.totalTransactions > 0 && (
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
          <div className="stat-card" style={{ flex: 1 }}>
            <span className="stat-title">Nhập kho</span>
            <span className="stat-value" style={{ color: '#3b82f6' }}>{stats.imports}</span>
          </div>
          <div className="stat-card" style={{ flex: 1 }}>
            <span className="stat-title">Xuất kho</span>
            <span className="stat-value" style={{ color: '#22c55e' }}>{stats.exports}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
