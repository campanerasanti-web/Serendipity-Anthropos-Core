import React from 'react';
import { formatDate, getStatusLabel } from '../api/ordersApi';

/**
 * Timeline visual del historial de estados
 */
export default function OrderTimeline({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="timeline-empty">
        <p>No hay historial de cambios registrado</p>
      </div>
    );
  }

  const statusIcons = {
    pending: '⏳',
    'in-progress': '⚙️',
    completed: '✅',
    cancelled: '❌',
  };

  const statusColors = {
    pending: 'gray',
    'in-progress': 'amber',
    completed: 'green',
    cancelled: 'red',
  };

  return (
    <div className="order-timeline">
      {history.map((item, index) => (
        <div key={item.id} className={`timeline-item ${statusColors[item.newStatus]}`}>
          <div className="timeline-marker">
            <span className="marker-icon">{statusIcons[item.newStatus] || '📌'}</span>
            {index < history.length - 1 && <div className="marker-line"></div>}
          </div>

          <div className="timeline-content">
            <div className="timeline-header">
              <span className="status-change">
                {item.previousStatus && (
                  <>
                    <span className="old-status">{getStatusLabel(item.previousStatus)}</span>
                    <span className="arrow">→</span>
                  </>
                )}
                <span className="new-status">{getStatusLabel(item.newStatus)}</span>
              </span>
              <span className="timestamp">{formatDate(item.changedAt)}</span>
            </div>

            {item.changedBy && (
              <div className="timeline-meta">
                <span className="user-icon">👤</span>
                <span className="user-name">{item.changedBy}</span>
              </div>
            )}

            {item.reason && (
              <div className="timeline-reason">
                <span className="reason-icon">💬</span>
                <p>{item.reason}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
