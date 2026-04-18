import React, { useState, useEffect } from 'react';
import { PageHeader, DataTable, LoadingState, ErrorState, Modal, RefreshButton } from '../components/common/ui';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';

const ProductsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ brand: '', modelName: '', year: new Date().getFullYear(), engineType: '', baseColor: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
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
      setFormData({ brand: item.brand, modelName: item.modelName, year: item.year, engineType: item.engineType, baseColor: item.baseColor });
    } else {
      setEditingItem(null);
      setFormData({ brand: '', modelName: '', year: new Date().getFullYear(), engineType: '', baseColor: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        // Backend expects full Product object with ProductId
        await updateProduct(editingItem.id, { productId: editingItem.id, ...formData });
        alert('Cập nhật sản phẩm thành công.');
      } else {
        await createProduct(formData);
        alert('Thêm sản phẩm thành công.');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Xóa sản phẩm ${item.brand} ${item.modelName}?`)) {
      try {
        await deleteProduct(item.id);
        alert('Đã xóa sản phẩm.');
        loadData();
      } catch (err) {
        alert('Xóa thất bại: ' + err.message);
      }
    }
  };

  const columns = [
    { header: 'ID', key: 'id' },
    { header: 'Hãng', key: 'brand' },
    { header: 'Mẫu xe', key: 'modelName' },
    { header: 'Năm SX', key: 'year' },
    { header: 'Loại máy', key: 'engineType' },
    { header: 'Màu', key: 'baseColor', render: r => (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: r.baseColor?.toLowerCase() || '#ccc', border: '1px solid var(--border-light)', flexShrink: 0 }} />
        {r.baseColor}
      </span>
    )},
  ];

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div>
      <PageHeader
        title="Sản phẩm"
        subtitle={`${data.length} mẫu xe`}
        actionLabel="+ Thêm sản phẩm"
        onAction={() => handleOpenModal()}
        extra={<RefreshButton onClick={loadData} />}
      />
      <DataTable columns={columns} data={data} onEdit={handleOpenModal} onDelete={handleDelete} keyExtractor={r => r.id} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}>
        <form onSubmit={handleSave}>
          <div className="input-row">
            <div className="form-group">
              <label>Hãng xe</label>
              <input required className="input" value={formData.brand}
                onChange={e => setFormData({...formData, brand: e.target.value})} placeholder="VD: Toyota" />
            </div>
            <div className="form-group">
              <label>Mẫu xe</label>
              <input required className="input" value={formData.modelName}
                onChange={e => setFormData({...formData, modelName: e.target.value})} placeholder="VD: Camry" />
            </div>
          </div>
          <div className="input-row">
            <div className="form-group">
              <label>Năm sản xuất</label>
              <input required type="number" className="input" value={formData.year}
                onChange={e => setFormData({...formData, year: parseInt(e.target.value) || 0})} />
            </div>
            <div className="form-group">
              <label>Loại động cơ</label>
              <input required className="input" value={formData.engineType}
                onChange={e => setFormData({...formData, engineType: e.target.value})} placeholder="VD: Gasoline" />
            </div>
          </div>
          <div className="form-group">
            <label>Màu cơ bản</label>
            <input required className="input" value={formData.baseColor}
              onChange={e => setFormData({...formData, baseColor: e.target.value})} placeholder="VD: White" />
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

export default ProductsPage;
