import React, { useState, useEffect } from 'react';
import { PageHeader, DataTable, LoadingState, ErrorState, Modal, RefreshButton } from '../components/common/ui';
import { getVehicles, getVehicleByVin, createVehicle, updateVehicle, deleteVehicle, updateVehicleLocation } from '../services/vehicleService';
import { normalizeVehicleDocument } from '../utils/normalizers';
import { X } from 'lucide-react';

const VehiclesPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detail panel
  const [selectedVin, setSelectedVin] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    vin: '', engineNumber: '', chassisNumber: '',
    productId: 0, warehouseId: 0, status: 'In_stock', currentLocationDetail: ''
  });
  const [locationData, setLocationData] = useState({ vin: '', currentLocationDetail: '', staffId: 1 });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getVehicles();
      setData(res);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Load vehicle detail when clicking a row
  const handleRowClick = async (row) => {
    const vin = row.vin;
    if (selectedVin === vin) {
      setSelectedVin(null);
      setDetail(null);
      return;
    }
    setSelectedVin(vin);
    setDetailLoading(true);
    setDetailError(null);
    try {
      const raw = await getVehicleByVin(vin);
      setDetail(raw);
    } catch (err) {
      setDetailError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData({
        vin: '', engineNumber: '', chassisNumber: '',
        productId: 0, warehouseId: 0, status: 'In_stock', currentLocationDetail: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.vin.length !== 17) {
      alert('VIN phải đúng 17 ký tự.');
      return;
    }
    try {
      if (editingItem) {
        await updateVehicle(editingItem.vin, formData);
        alert('Cập nhật xe thành công.');
      } else {
        await createVehicle(formData);
        alert('Thêm xe thành công.');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Xóa xe VIN ${item.vin}?`)) {
      try {
        await deleteVehicle(item.vin);
        alert('Đã xóa xe.');
        if (selectedVin === item.vin) {
          setSelectedVin(null);
          setDetail(null);
        }
        loadData();
      } catch (err) {
        alert('Xóa thất bại: ' + err.message);
      }
    }
  };

  const handleUpdateLocation = async (e) => {
    e.preventDefault();
    try {
      await updateVehicleLocation(locationData.vin, locationData.currentLocationDetail, locationData.staffId);
      alert('Cập nhật vị trí thành công.');
      setIsLocationModalOpen(false);
      loadData();
    } catch (err) {
      alert('Cập nhật vị trí thất bại: ' + err.message);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').replace('_', ' ');
    if (status === 'In_stock' || status === 'In_Stock') return <span className="badge badge-success">{s}</span>;
    if (status === 'Sold') return <span className="badge badge-warning">{s}</span>;
    if (status === 'Reserved') return <span className="badge badge-info">{s}</span>;
    return <span className="badge badge-neutral">{s}</span>;
  };

  const columns = [
    { header: 'VIN', key: 'vin', render: (row) => (
      <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.75rem' }}>{row.vin}</span>
    )},
    { header: 'Product ID', key: 'productId' },
    { header: 'Warehouse ID', key: 'warehouseId' },
    { header: 'Status', key: 'status', render: (row) => getStatusBadge(row.status) },
    { header: 'Location', key: 'currentLocationDetail' },
    { header: 'Move', key: 'move', render: (row) => (
      <button
        className="btn btn-outline btn-sm"
        onClick={(e) => {
          e.stopPropagation();
          setLocationData({ vin: row.vin, currentLocationDetail: row.currentLocationDetail || '', staffId: 1 });
          setIsLocationModalOpen(true);
        }}
      >
        Di chuyển
      </button>
    )},
  ];

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div>
      <PageHeader
        title="Quản lý xe"
        subtitle={`${data.length} xe trong hệ thống`}
        actionLabel="+ Thêm xe"
        onAction={() => handleOpenModal()}
        extra={<RefreshButton onClick={loadData} />}
      />

      <DataTable
        columns={columns}
        data={data}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        onRowClick={handleRowClick}
        keyExtractor={r => r.vin}
      />

      {/* Vehicle Detail Panel */}
      {selectedVin && (
        <div className="detail-panel">
          <div className="detail-panel-header">
            <h3>Chi tiết xe: {selectedVin}</h3>
            <button className="btn-icon" onClick={() => { setSelectedVin(null); setDetail(null); }}>
              <X size={18} />
            </button>
          </div>
          <div className="detail-panel-body">
            {detailLoading && <LoadingState message="Đang tải chi tiết..." />}
            {detailError && <ErrorState message={detailError} onRetry={() => handleRowClick({ vin: selectedVin })} />}
            {detail && !detailLoading && !detailError && (
              <>
                <div className="detail-grid">
                  <div className="detail-field">
                    <span className="detail-label">VIN</span>
                    <span className="detail-value" style={{ fontFamily: 'monospace' }}>{detail?.vin || detail?.Vin || '—'}</span>
                  </div>
                  <div className="detail-field">
                    <span className="detail-label">Engine Number</span>
                    <span className="detail-value">{detail?.engineNumber || detail?.EngineNumber || '—'}</span>
                  </div>
                  <div className="detail-field">
                    <span className="detail-label">Chassis Number</span>
                    <span className="detail-value">{detail?.chassisNumber || detail?.ChassisNumber || '—'}</span>
                  </div>
                  <div className="detail-field">
                    <span className="detail-label">Status</span>
                    <span className="detail-value">{getStatusBadge(detail?.status || detail?.Status)}</span>
                  </div>
                  <div className="detail-field">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{detail?.currentLocationDetail || detail?.CurrentLocationDetail || '—'}</span>
                  </div>
                </div>

                {/* Product info */}
                {(detail?.product || detail?.Product) && (
                  <>
                    <div className="detail-section-title">Thông tin sản phẩm</div>
                    <div className="detail-grid">
                      <div className="detail-field">
                        <span className="detail-label">Brand</span>
                        <span className="detail-value">{detail?.product?.brand || detail?.Product?.Brand || detail?.product?.Brand || '—'}</span>
                      </div>
                      <div className="detail-field">
                        <span className="detail-label">Model</span>
                        <span className="detail-value">{detail?.product?.modelName || detail?.Product?.ModelName || detail?.product?.ModelName || '—'}</span>
                      </div>
                      <div className="detail-field">
                        <span className="detail-label">Year</span>
                        <span className="detail-value">{detail?.product?.year || detail?.Product?.Year || detail?.product?.Year || '—'}</span>
                      </div>
                      <div className="detail-field">
                        <span className="detail-label">Engine Type</span>
                        <span className="detail-value">{detail?.product?.engineType || detail?.Product?.EngineType || detail?.product?.EngineType || '—'}</span>
                      </div>
                      <div className="detail-field">
                        <span className="detail-label">Color</span>
                        <span className="detail-value">{detail?.product?.baseColor || detail?.Product?.BaseColor || detail?.product?.BaseColor || '—'}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Warehouse info */}
                {(detail?.warehouse || detail?.Warehouse) && (
                  <>
                    <div className="detail-section-title">Thông tin kho</div>
                    <div className="detail-grid">
                      <div className="detail-field">
                        <span className="detail-label">Warehouse</span>
                        <span className="detail-value">{detail?.warehouse?.name || detail?.Warehouse?.Name || detail?.warehouse?.Name || '—'}</span>
                      </div>
                      <div className="detail-field">
                        <span className="detail-label">Address</span>
                        <span className="detail-value">{detail?.warehouse?.address || detail?.Warehouse?.Address || detail?.warehouse?.Address || '—'}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Documents */}
                {(() => {
                  const docs = detail?.documents || detail?.Documents || [];
                  if (docs.length === 0) return null;
                  return (
                    <>
                      <div className="detail-section-title">Giấy tờ xe ({docs.length})</div>
                      <div className="table-container" style={{ marginTop: '0.5rem' }}>
                        <table>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Loại</th>
                              <th>Trạng thái</th>
                              <th>Ngày cấp</th>
                            </tr>
                          </thead>
                          <tbody>
                            {docs.map((doc, i) => {
                              const d = normalizeVehicleDocument(doc);
                              return (
                                <tr key={d.id || i}>
                                  <td>{d.id}</td>
                                  <td>{d.documentType}</td>
                                  <td>
                                    <span className={`badge ${d.status === 'Completed' ? 'badge-success' : d.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                                      {d.status}
                                    </span>
                                  </td>
                                  <td>{d.issueDate ? new Date(d.issueDate).toLocaleDateString('vi-VN') : '—'}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      )}

      {/* Create / Edit Vehicle Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Sửa thông tin xe' : 'Thêm xe mới'}>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>VIN (17 ký tự)</label>
            <input required className="input" minLength={17} maxLength={17}
              value={formData.vin}
              onChange={e => setFormData({...formData, vin: e.target.value.toUpperCase()})}
              readOnly={!!editingItem}
              placeholder="Nhập mã VIN 17 ký tự"
            />
          </div>
          <div className="input-row">
            <div className="form-group">
              <label>Engine Number</label>
              <input required className="input" value={formData.engineNumber}
                onChange={e => setFormData({...formData, engineNumber: e.target.value})}
                placeholder="Số động cơ"
              />
            </div>
            <div className="form-group">
              <label>Chassis Number</label>
              <input required className="input" value={formData.chassisNumber}
                onChange={e => setFormData({...formData, chassisNumber: e.target.value})}
                placeholder="Số khung"
              />
            </div>
          </div>
          <div className="input-row">
            <div className="form-group">
              <label>Product ID</label>
              <input required type="number" className="input" value={formData.productId}
                onChange={e => setFormData({...formData, productId: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="form-group">
              <label>Warehouse ID</label>
              <input required type="number" className="input" value={formData.warehouseId}
                onChange={e => setFormData({...formData, warehouseId: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Vị trí chi tiết</label>
            <input className="input" value={formData.currentLocationDetail}
              onChange={e => setFormData({...formData, currentLocationDetail: e.target.value})}
              placeholder="VD: Khu A - Hàng 3 - Ô 12"
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Hủy</button>
            <button type="submit" className="btn btn-primary">Lưu</button>
          </div>
        </form>
      </Modal>

      {/* Update Location Modal */}
      <Modal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} title="Cập nhật vị trí xe">
        <form onSubmit={handleUpdateLocation}>
          <div className="form-group">
            <label>VIN</label>
            <input className="input" value={locationData.vin} readOnly />
          </div>
          <div className="form-group">
            <label>Vị trí mới</label>
            <input required className="input" value={locationData.currentLocationDetail}
              onChange={e => setLocationData({...locationData, currentLocationDetail: e.target.value})}
              placeholder="VD: Khu B - Hàng 1 - Ô 5"
            />
          </div>
          <div className="form-group">
            <label>Staff ID (người thực hiện)</label>
            <input required type="number" className="input" value={locationData.staffId}
              onChange={e => setLocationData({...locationData, staffId: parseInt(e.target.value) || 1})}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={() => setIsLocationModalOpen(false)}>Hủy</button>
            <button type="submit" className="btn btn-primary">Cập nhật</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VehiclesPage;
