import React, { useState, useEffect } from 'react';
import { PageHeader, DataTable, LoadingState, ErrorState, Modal, RefreshButton } from '../components/common/ui';
import { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } from '../services/warehouseService';

const WarehousesPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', address: '', capacity: 100 });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getWarehouses();
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
      setFormData({ name: item.name, address: item.address, capacity: item.capacity });
    } else {
      setEditingItem(null);
      setFormData({ name: '', address: '', capacity: 100 });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateWarehouse(editingItem.id, { warehouseId: editingItem.id, ...formData });
        alert('Cập nhật kho thành công.');
      } else {
        await createWarehouse(formData);
        alert('Thêm kho thành công.');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Xóa kho "${item.name}"?`)) {
      try {
        await deleteWarehouse(item.id);
        alert('Đã xóa kho.');
        loadData();
      } catch (err) {
        alert('Xóa thất bại: ' + err.message);
      }
    }
  };

  const columns = [
    { header: 'ID', key: 'id' },
    { header: 'Tên kho', key: 'name' },
    { header: 'Địa chỉ', key: 'address' },
    { header: 'Sức chứa', key: 'capacity', render: r => (
      <span style={{ fontWeight: 600 }}>{r.capacity} xe</span>
    )},
  ];

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div>
      <PageHeader
        title="Kho bãi"
        subtitle={`${data.length} kho`}
        actionLabel="+ Thêm kho"
        onAction={() => handleOpenModal()}
        extra={<RefreshButton onClick={loadData} />}
      />
      <DataTable columns={columns} data={data} onEdit={handleOpenModal} onDelete={handleDelete} keyExtractor={r => r.id} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Sửa kho' : 'Thêm kho mới'}>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Tên kho</label>
            <input required className="input" value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})} placeholder="VD: Kho Thủ Đức" />
          </div>
          <div className="form-group">
            <label>Địa chỉ</label>
            <input required className="input" value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})} placeholder="VD: 123 Đường ABC, TP.HCM" />
          </div>
          <div className="form-group">
            <label>Sức chứa (số xe tối đa)</label>
            <input required type="number" min={1} className="input" value={formData.capacity}
              onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 0})} />
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

export default WarehousesPage;
