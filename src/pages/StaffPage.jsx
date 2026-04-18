import React, { useState, useEffect } from 'react';
import { PageHeader, DataTable, LoadingState, ErrorState, Modal, RefreshButton } from '../components/common/ui';
import { getStaff, createStaff, updateStaff, deleteStaff } from '../services/staffService';

const StaffPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', departmentRole: 'Staff', phone: '', email: '', status: true });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getStaff();
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
      setFormData({ fullName: item.fullName, departmentRole: item.departmentRole, phone: item.phone, email: item.email, status: item.status });
    } else {
      setEditingItem(null);
      setFormData({ fullName: '', departmentRole: 'Staff', phone: '', email: '', status: true });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateStaff(editingItem.id, { staffId: editingItem.id, ...formData });
        alert('Cập nhật nhân viên thành công.');
      } else {
        await createStaff(formData);
        alert('Thêm nhân viên thành công.');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Xóa nhân viên "${item.fullName}"?`)) {
      try {
        await deleteStaff(item.id);
        alert('Đã xóa nhân viên.');
        loadData();
      } catch (err) {
        alert('Xóa thất bại: ' + err.message);
      }
    }
  };

  const roleLabels = {
    'Staff': 'Nhân viên',
    'Warehouse_Staff': 'NV Kho',
    'Sales': 'Kinh doanh',
    'Accountant': 'Kế toán',
    'Manager': 'Quản lý',
    'Technician': 'Kỹ thuật',
  };

  const columns = [
    { header: 'ID', key: 'id' },
    { header: 'Họ tên', key: 'fullName' },
    { header: 'Chức vụ', key: 'departmentRole', render: r => (
      <span className="badge badge-neutral">{roleLabels[r.departmentRole] || r.departmentRole}</span>
    )},
    { header: 'SĐT', key: 'phone' },
    { header: 'Email', key: 'email' },
    { header: 'Trạng thái', key: 'status', render: r => (
      <span className={`badge ${r.status ? 'badge-success' : 'badge-danger'}`}>
        {r.status ? 'Hoạt động' : 'Đã nghỉ'}
      </span>
    )},
  ];

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div>
      <PageHeader
        title="Nhân sự"
        subtitle={`${data.length} nhân viên`}
        actionLabel="+ Thêm NV"
        onAction={() => handleOpenModal()}
        extra={<RefreshButton onClick={loadData} />}
      />
      <DataTable columns={columns} data={data} onEdit={handleOpenModal} onDelete={handleDelete} keyExtractor={r => r.id} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Sửa nhân viên' : 'Thêm nhân viên mới'}>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Họ tên</label>
            <input required className="input" value={formData.fullName}
              onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="VD: Nguyễn Văn A" />
          </div>
          <div className="form-group">
            <label>Chức vụ</label>
            <select className="select" value={formData.departmentRole}
              onChange={e => setFormData({...formData, departmentRole: e.target.value})}>
              <option value="Staff">Staff</option>
              <option value="Warehouse_Staff">Warehouse Staff</option>
              <option value="Sales">Sales</option>
              <option value="Accountant">Accountant</option>
              <option value="Manager">Manager</option>
              <option value="Technician">Technician</option>
            </select>
          </div>
          <div className="input-row">
            <div className="form-group">
              <label>SĐT</label>
              <input className="input" value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="0909xxxxxx" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input required type="email" className="input" value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@company.com" />
            </div>
          </div>
          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="staff-active" checked={formData.status}
              onChange={e => setFormData({...formData, status: e.target.checked})} />
            <label htmlFor="staff-active" style={{ margin: 0 }}>Đang hoạt động</label>
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

export default StaffPage;
