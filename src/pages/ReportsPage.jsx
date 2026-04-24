import React, { useState, useEffect } from 'react';
import { PageHeader, DataTable, LoadingState, ErrorState, RefreshButton, EmptyState } from '../components/common/ui';
import { getInventoryAgingReport } from '../services/reportService';
import { AlertTriangle } from 'lucide-react';

const ReportsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getInventoryAgingReport();
      setData(res);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const alertCount = data.filter(r => r.daysInInventory > 90).length;

  const columns = [
    { header: 'VIN', key: 'vin', render: r => (
      <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{r.vin}</span>
    )},
    { header: 'Hãng', key: 'brand' },
    { header: 'Mẫu xe', key: 'modelName' },
    { header: 'Kho', key: 'warehouseName' },
    { header: 'Trạng thái', key: 'status', render: r => <span className="badge badge-neutral">{r.status}</span> },
    { header: 'Vị trí', key: 'currentLocationDetail' },
    { header: 'Ngày tồn kho', key: 'daysInInventory', render: r => {
      const isAlert = r.daysInInventory > 90;
      return (
        <span style={{
          color: isAlert ? 'var(--color-danger)' : 'var(--text-main)',
          fontWeight: isAlert ? 700 : 500,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          {isAlert && <AlertTriangle size={14} />}
          {r.daysInInventory} ngày
        </span>
      );
    }},
  ];

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;
  if (!data || data.length === 0) return <EmptyState title="Không có dữ liệu" message="Không có xe nào đang tồn kho." />;

  return (
    <div>
      <PageHeader
        title="Báo cáo tồn kho"
        subtitle="Phân tích thời gian xe nằm trong kho"
        extra={<RefreshButton onClick={loadData} />}
      />

      {alertCount > 0 && (
        <div className="alert-banner alert-banner-warning" style={{ marginBottom: '1rem' }}>
          <AlertTriangle size={18} />
          <div>
            <strong>{alertCount} xe</strong> đã tồn kho trên 90 ngày — cần xem xét giảm giá hoặc bảo dưỡng.
          </div>
        </div>
      )}

      <p style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
        Báo cáo tính số ngày xe ở trạng thái In_stock/Reserved. Xe tồn kho &gt; 90 ngày sẽ được đánh dấu cảnh báo.
      </p>

      <DataTable columns={columns} data={data} keyExtractor={r => r.vin} />
    </div>
  );
};

export default ReportsPage;
