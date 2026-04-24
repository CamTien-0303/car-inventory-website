import React, { useState, useEffect } from 'react';
import { PageHeader, LoadingState, ErrorState, RefreshButton } from '../components/common/ui';
import { getSummary } from '../services/reportService';
import { Package, Car, Warehouse as WarehouseIcon, UserSquare2, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const summary = await getSummary();
      setStats({
        products: summary.totalProducts || 0,
        vehicles: summary.totalVehicles || 0,
        inStock: summary.inStock || 0,
        reserved: summary.reserved || 0,
        sold: summary.sold || 0,
        warehouses: summary.totalWarehouses || 0,
        staff: summary.totalStaff || 0,
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
    { title: 'Tổng số xe', value: stats.vehicles, icon: Car, bg: 'var(--color-primary-soft)', color: '#3b82f6' },
    { title: 'Trong kho (In_stock)', value: stats.inStock, icon: ShieldCheck, bg: 'var(--color-success-soft)', color: '#22c55e' },
    { title: 'Đã đặt cọc (Reserved)', value: stats.reserved, icon: AlertTriangle, bg: 'var(--color-warning-soft)', color: '#f59e0b' },
    { title: 'Đã bán (Sold)', value: stats.sold, icon: CheckCircle2, bg: 'rgba(100,116,139,0.1)', color: '#64748b' },
    { title: 'Mẫu sản phẩm', value: stats.products, icon: Package, bg: 'var(--color-purple-soft)', color: '#8b5cf6' },
    { title: 'Tổng số kho', value: stats.warehouses, icon: WarehouseIcon, bg: 'var(--color-info-soft)', color: '#06b6d4' },
    { title: 'Tổng nhân viên', value: stats.staff, icon: UserSquare2, bg: 'rgba(20,184,166,0.1)', color: '#14b8a6' },
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

    </div>
  );
};

export default DashboardPage;
