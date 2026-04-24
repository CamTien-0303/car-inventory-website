import React from 'react';
import { Edit, Trash2, Inbox } from 'lucide-react';

/* ================================================================
   DataTable — Reusable table with optional edit/delete + empty state
   ================================================================ */
export const DataTable = ({ columns, data, onEdit, onDelete, onRowClick, keyExtractor }) => {
  if (!data || data.length === 0) {
    return (
      <div className="table-container">
        <div className="table-empty">
          <div className="table-empty-icon">
            <Inbox size={40} strokeWidth={1.2} />
          </div>
          <p>Không có dữ liệu để hiển thị.</p>
          <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
            Dữ liệu sẽ xuất hiện khi có bản ghi từ API.
          </p>
        </div>
      </div>
    );
  }

  const hasActions = onEdit || onDelete;

  return (
    <div className="table-container">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={col.key || idx}>{col.header}</th>
              ))}
              {hasActions && <th style={{ width: '90px', textAlign: 'right' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={keyExtractor ? keyExtractor(row) : idx}
                className={onRowClick ? 'clickable-row' : ''}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx}>
                    {col.render ? col.render(row) : (row[col.key] ?? '—')}
                  </td>
                ))}
                {hasActions && (
                  <td>
                    <div className="actions-cell">
                      {onEdit && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onEdit(row); }}
                          className="btn-icon"
                          title="Chỉnh sửa"
                        >
                          <Edit size={15} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onDelete(row); }}
                          className="btn-icon"
                          style={{ color: 'var(--color-danger)' }}
                          title="Xóa"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ================================================================
   Modal
   ================================================================ */
export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button onClick={onClose} className="btn-icon" style={{ fontSize: '1.25rem' }}>&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   PageHeader
   ================================================================ */
export const PageHeader = ({ title, subtitle, actionLabel, onAction, extra }) => (
  <div className="page-header">
    <div>
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </div>
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      {extra}
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  </div>
);

/* ================================================================
   LoadingState
   ================================================================ */
export const LoadingState = ({ message = 'Đang tải dữ liệu...' }) => (
  <div className="state-container">
    <div className="spinner" />
    <p style={{ fontSize: '0.875rem' }}>{message}</p>
  </div>
);

/* ================================================================
   ErrorState — With friendly Render sleep message
   ================================================================ */
export const ErrorState = ({ message, onRetry }) => {
  const isConnectError = message && (
    message.includes('Không thể kết nối') ||
    message.includes('fetch') ||
    message.includes('network') ||
    message.includes('503') ||
    message.includes('502')
  );

  return (
    <div className="state-container">
      <div className="error-icon">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9375rem' }}>
        {isConnectError ? 'Không thể kết nối server' : 'Lỗi tải dữ liệu'}
      </p>
      <p style={{ fontSize: '0.8125rem', maxWidth: '400px', lineHeight: 1.5 }}>
        {message || 'Đã xảy ra lỗi không xác định.'}
      </p>
      {isConnectError && (
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '400px' }}>
          💡 Backend trên Render Free Tier có thể mất 30–60 giây để khởi động lại (cold start).
        </p>
      )}
      {onRetry && (
        <button onClick={onRetry} className="btn btn-outline" style={{ marginTop: '0.75rem' }}>
          Thử lại
        </button>
      )}
    </div>
  );
};

/* ================================================================
   RefreshButton — Small inline refresh button
   ================================================================ */
export const RefreshButton = ({ onClick, loading = false }) => (
  <button
    onClick={onClick}
    className="btn btn-outline btn-sm"
    disabled={loading}
    title="Làm mới dữ liệu"
  >
    {loading ? '⏳' : '🔄'} Refresh
  </button>
);

/* ================================================================
   EmptyState — Standalone empty state message
   ================================================================ */
export const EmptyState = ({ title = 'Không có dữ liệu', message = 'Không tìm thấy kết quả nào phù hợp.' }) => (
  <div className="state-container">
    <div className="table-empty-icon">
      <Inbox size={40} strokeWidth={1.2} />
    </div>
    <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9375rem' }}>{title}</p>
    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{message}</p>
  </div>
);
