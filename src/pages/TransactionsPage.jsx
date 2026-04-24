import React, { useState, useEffect } from 'react';
import { PageHeader, DataTable, LoadingState, ErrorState, Modal, RefreshButton } from '../components/common/ui';
import { getTransactions, importVehicleTransaction, exportVehicleTransaction } from '../services/transactionService';

const TransactionsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [importData, setImportData] = useState({
    vin: '', engineNumber: '', chassisNumber: '',
    productId: 0, warehouseId: 0,
    importPrice: 0, staffId: 0, currentLocationDetail: ''
  });

  const [exportData, setExportData] = useState({
    vin: '', staffId: 0, exportPrice: 0
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getTransactions();
      setData(res);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (importData.vin.length !== 17) {
      alert('VIN phải đúng 17 ký tự.');
      return;
    }
    if (importData.staffId <= 0) {
      alert('Vui lòng nhập Staff ID hợp lệ.');
      return;
    }
    setSubmitLoading(true);
    try {
      const result = await importVehicleTransaction(importData);
      alert(typeof result === 'string' ? result : 'Nhập kho thành công!');
      setIsImportModalOpen(false);
      setImportData({
        vin: '', engineNumber: '', chassisNumber: '',
        productId: 0, warehouseId: 0,
        importPrice: 0, staffId: 0, currentLocationDetail: ''
      });
      loadData();
    } catch (err) {
      alert('Nhập kho thất bại: ' + err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleExportSubmit = async (e) => {
    e.preventDefault();
    if (exportData.vin.length !== 17) {
      alert('VIN phải đúng 17 ký tự.');
      return;
    }
    setSubmitLoading(true);
    try {
      const result = await exportVehicleTransaction(exportData);
      alert(typeof result === 'string' ? result : 'Xuất kho thành công!');
      setIsExportModalOpen(false);
      setExportData({ vin: '', staffId: 0, exportPrice: 0 });
      loadData();
    } catch (err) {
      alert('Xuất kho thất bại: ' + err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns = [
    { header: 'ID', key: 'id' },
    { header: 'VIN', key: 'vin', render: r => (
      <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{r.vin}</span>
    )},
    { header: 'Loại', key: 'type', render: r => (
      <span className={`badge ${r.type === 'Import' ? 'badge-info' : 'badge-success'}`}>
        {r.type === 'Import' ? '📥 Nhập' : '📤 Xuất'}
      </span>
    )},
    { header: 'Staff ID', key: 'staffId' },
    { header: 'Giá trị', key: 'price', render: r => {
      const val = Number(r.price);
      return val > 0 ? val.toLocaleString('vi-VN') + ' ₫' : '—';
    }},
    { header: 'Ngày GD', key: 'transactionDate', render: r =>
      r.transactionDate ? new Date(r.transactionDate).toLocaleString('vi-VN') : '—'
    },
  ];

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  const filteredData = data.filter(item => 
    (item.vin || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.type || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Giao dịch"
        subtitle={`${data.length} giao dịch`}
        extra={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <RefreshButton onClick={loadData} />
            <button onClick={() => setIsImportModalOpen(true)} className="btn btn-outline">📥 Nhập kho</button>
            <button onClick={() => setIsExportModalOpen(true)} className="btn btn-primary">📤 Xuất kho</button>
          </div>
        }
      />

      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
        <input 
          type="text" 
          className="input" 
          placeholder="Tìm kiếm VIN, loại (Import/Export)..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '250px' }}
        />
      </div>

      <DataTable columns={columns} data={filteredData} keyExtractor={r => r.id} />

      {/* IMPORT MODAL */}
      <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} title="Nhập xe vào kho">
        <form onSubmit={handleImportSubmit}>
          <div className="input-row">
            <div className="form-group">
              <label>Staff ID</label>
              <input required type="number" min={1} className="input" value={importData.staffId || ''}
                onChange={e => setImportData({...importData, staffId: parseInt(e.target.value) || 0})}
                placeholder="ID nhân viên"
              />
            </div>
            <div className="form-group">
              <label>Giá nhập (₫)</label>
              <input required type="number" min={0} className="input" value={importData.importPrice || ''}
                onChange={e => setImportData({...importData, importPrice: parseFloat(e.target.value) || 0})}
                placeholder="Giá trị nhập kho"
              />
            </div>
          </div>

          <hr style={{ margin: '0.75rem 0', border: 'none', borderTop: '1px solid var(--border-light)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Thông tin xe
          </span>

          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label>VIN (17 ký tự)</label>
            <input required maxLength={17} minLength={17} className="input"
              value={importData.vin}
              onChange={e => setImportData({...importData, vin: e.target.value.toUpperCase()})}
              placeholder="VD: 1HGBH41JXMN109186"
            />
          </div>

          <div className="input-row">
            <div className="form-group">
              <label>Số động cơ</label>
              <input required className="input" value={importData.engineNumber}
                onChange={e => setImportData({...importData, engineNumber: e.target.value})}
                placeholder="Engine number"
              />
            </div>
            <div className="form-group">
              <label>Số khung</label>
              <input required className="input" value={importData.chassisNumber}
                onChange={e => setImportData({...importData, chassisNumber: e.target.value})}
                placeholder="Chassis number"
              />
            </div>
          </div>

          <div className="input-row">
            <div className="form-group">
              <label>Product ID</label>
              <input required type="number" min={1} className="input" value={importData.productId || ''}
                onChange={e => setImportData({...importData, productId: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="form-group">
              <label>Warehouse ID</label>
              <input required type="number" min={1} className="input" value={importData.warehouseId || ''}
                onChange={e => setImportData({...importData, warehouseId: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Vị trí ban đầu</label>
            <input className="input" value={importData.currentLocationDetail}
              onChange={e => setImportData({...importData, currentLocationDetail: e.target.value})}
              placeholder="VD: Khu A - Hàng 1 - Ô 3"
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={() => setIsImportModalOpen(false)}>Hủy</button>
            <button type="submit" className="btn btn-primary" disabled={submitLoading}>
              {submitLoading ? 'Đang xử lý...' : 'Nhập kho'}
            </button>
          </div>
        </form>
      </Modal>

      {/* EXPORT MODAL */}
      <Modal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} title="Xuất xe khỏi kho (Bán)">
        <form onSubmit={handleExportSubmit}>
          <div className="form-group">
            <label>VIN xe cần xuất</label>
            <input required maxLength={17} minLength={17} className="input"
              value={exportData.vin}
              onChange={e => setExportData({...exportData, vin: e.target.value.toUpperCase()})}
              placeholder="VD: 1HGBH41JXMN109186"
            />
          </div>
          <div className="form-group">
            <label>Staff ID (người xử lý)</label>
            <input required type="number" min={1} className="input" value={exportData.staffId || ''}
              onChange={e => setExportData({...exportData, staffId: parseInt(e.target.value) || 0})}
            />
          </div>
          <div className="form-group">
            <label>Giá bán (₫)</label>
            <input required type="number" min={0} className="input" value={exportData.exportPrice || ''}
              onChange={e => setExportData({...exportData, exportPrice: parseFloat(e.target.value) || 0})}
              placeholder="Giá trị xuất kho"
            />
          </div>

          <div className="alert-banner alert-banner-info" style={{ margin: '0.5rem 0' }}>
            ⚠️ Xe phải ở trạng thái <strong>In_stock</strong> hoặc <strong>Reserved</strong> và đã hoàn tất giấy tờ mới xuất kho được.
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={() => setIsExportModalOpen(false)}>Hủy</button>
            <button type="submit" className="btn btn-primary" disabled={submitLoading}>
              {submitLoading ? 'Đang xử lý...' : 'Xuất kho'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TransactionsPage;
