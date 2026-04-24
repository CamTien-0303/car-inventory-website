import React, { useState, useEffect } from 'react';
import { PageHeader, DataTable, LoadingState, ErrorState, Modal, RefreshButton } from '../components/common/ui';
import { getVehicleDocuments, createVehicleDocument, updateVehicleDocument, deleteVehicleDocument } from '../services/vehicleDocumentService';

const VehicleDocumentsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    vin: '', documentType: 'Registration', status: 'Pending',
    issueDate: new Date().toISOString().slice(0, 10), fileUrl: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getVehicleDocuments();
      setData(res);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        vin: item.vin,
        documentType: item.documentType,
        status: item.status,
        issueDate: item.issueDate ? item.issueDate.slice(0, 10) : '',
        fileUrl: item.fileUrl || ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        vin: '', documentType: 'Registration', status: 'Pending',
        issueDate: new Date().toISOString().slice(0, 10), fileUrl: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateVehicleDocument(editingItem.id, { documentId: editingItem.id, ...formData });
        alert('Cập nhật giấy tờ thành công.');
      } else {
        await createVehicleDocument(formData);
        alert('Thêm giấy tờ thành công.');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Xóa giấy tờ #${item.id} (VIN: ${item.vin})?`)) {
      try {
        await deleteVehicleDocument(item.id);
        alert('Đã xóa giấy tờ.');
        loadData();
      } catch (err) {
        alert('Xóa thất bại: ' + err.message);
      }
    }
  };

  const docTypeLabels = {
    'Registration': 'Đăng ký',
    'Insurance': 'Bảo hiểm',
    'Import_Tax': 'Thuế NK',
    'Maintenance': 'Bảo dưỡng',
  };

  const columns = [
    { header: 'ID', key: 'id' },
    { header: 'VIN', key: 'vin', render: r => (
      <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{r.vin}</span>
    )},
    { header: 'Loại', key: 'documentType', render: r => (
      <span className="badge badge-neutral">{docTypeLabels[r.documentType] || r.documentType}</span>
    )},
    { header: 'Trạng thái', key: 'status', render: r => (
      <span className={`badge ${r.status === 'Completed' ? 'badge-success' : r.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
        {r.status === 'Completed' ? '✓ Hoàn tất' : r.status === 'Rejected' ? '✗ Từ chối' : '⏳ Chờ xử lý'}
      </span>
    )},
    { header: 'Ngày cấp', key: 'issueDate', render: r =>
      r.issueDate ? new Date(r.issueDate).toLocaleDateString('vi-VN') : '—'
    },
  ];

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  const filteredData = data.filter(item => 
    (item.vin || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.documentType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.status || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Giấy tờ xe"
        subtitle={`${data.length} giấy tờ`}
        actionLabel="+ Thêm giấy tờ"
        onAction={() => handleOpenModal()}
        extra={<RefreshButton onClick={loadData} />}
      />

      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
        <input 
          type="text" 
          className="input" 
          placeholder="Tìm kiếm VIN, loại giấy tờ..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '250px' }}
        />
      </div>

      <DataTable columns={columns} data={filteredData} onEdit={handleOpenModal} onDelete={handleDelete} keyExtractor={r => r.id} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Sửa giấy tờ' : 'Thêm giấy tờ mới'}>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>VIN xe</label>
            <input required className="input" maxLength={17} value={formData.vin}
              onChange={e => setFormData({...formData, vin: e.target.value.toUpperCase()})}
              placeholder="VIN 17 ký tự"
            />
          </div>
          <div className="input-row">
            <div className="form-group">
              <label>Loại giấy tờ</label>
              <select className="select" value={formData.documentType}
                onChange={e => setFormData({...formData, documentType: e.target.value})}>
                <option value="Registration">Đăng ký</option>
                <option value="Insurance">Bảo hiểm</option>
                <option value="Import_Tax">Thuế nhập khẩu</option>
                <option value="Maintenance">Bảo dưỡng</option>
              </select>
            </div>
            <div className="form-group">
              <label>Trạng thái</label>
              <select className="select" value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Pending">Chờ xử lý</option>
                <option value="Completed">Hoàn tất</option>
                <option value="Rejected">Từ chối</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Ngày cấp</label>
            <input required type="date" className="input" value={formData.issueDate}
              onChange={e => setFormData({...formData, issueDate: e.target.value})} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Hủy</button>
            <button type="submit" className="btn btn-primary">Lưu</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VehicleDocumentsPage;
