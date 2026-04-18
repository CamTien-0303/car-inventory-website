import React, { useState, useEffect } from 'react';
import { PageHeader, DataTable, LoadingState, ErrorState, Modal, RefreshButton } from '../components/common/ui';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../services/supplierService';

const SuppliersPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ supplierName: '', contactInfo: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getSuppliers();
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
      setFormData({ supplierName: item.supplierName, contactInfo: item.contactInfo });
    } else {
      setEditingItem(null);
      setFormData({ supplierName: '', contactInfo: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateSupplier(editingItem.id, { supplierId: editingItem.id, ...formData });
        alert('Cập nhật NCC thành công.');
      } else {
        await createSupplier(formData);
        alert('Thêm NCC thành công.');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Xóa nhà cung cấp "${item.supplierName}"?`)) {
      try {
        await deleteSupplier(item.id);
        alert('Đã xóa NCC.');
        loadData();
      } catch (err) {
        alert('Xóa thất bại: ' + err.message);
      }
    }
  };

  const columns = [
    { header: 'ID', key: 'id' },
    { header: 'Tên NCC', key: 'supplierName' },
    { header: 'Liên hệ', key: 'contactInfo' },
  ];

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div>
      <PageHeader
        title="Nhà cung cấp"
        subtitle={`${data.length} NCC`}
        actionLabel="+ Thêm NCC"
        onAction={() => handleOpenModal()}
        extra={<RefreshButton onClick={loadData} />}
      />
      <DataTable columns={columns} data={data} onEdit={handleOpenModal} onDelete={handleDelete} keyExtractor={r => r.id} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Sửa NCC' : 'Thêm NCC mới'}>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Tên nhà cung cấp</label>
            <input required className="input" value={formData.supplierName}
              onChange={e => setFormData({...formData, supplierName: e.target.value})} placeholder="VD: Toyota Việt Nam" />
          </div>
          <div className="form-group">
            <label>Thông tin liên hệ</label>
            <input required className="input" value={formData.contactInfo}
              onChange={e => setFormData({...formData, contactInfo: e.target.value})} placeholder="SĐT hoặc email" />
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

export default SuppliersPage;
