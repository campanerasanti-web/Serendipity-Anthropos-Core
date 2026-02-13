import React from 'react';
import { getTrafficLightColor, getTrafficLightEmoji, formatDate, getPriorityLabel, getStatusLabel } from '../api/ordersApi';

/**
 * Tarjeta de orden con semáforo visual
 */
export default function OrderCard({ order, onClick }) {
  const trafficColor = getTrafficLightColor(order.status, order.dueDate);
  const emoji = getTrafficLightEmoji(trafficColor);
  
  const now = new Date();
  const dueDate = new Date(order.dueDate);
  const isOverdue = dueDate < now && order.status !== 'completed' && order.status !== 'cancelled';

  return (
    <div
      className={`order-card ${trafficColor} ${isOverdue ? 'overdue' : ''}`}
      onClick={onClick}
    >
      <div className="order-header">
        <div className="order-id">
          <span className="status-emoji">{emoji}</span>
          <div>
            <h3 className="order-customer">{order.customer}</h3>
            <span className="product">{order.product}</span>
          </div>
        </div>
        {isOverdue && <span className="overdue-badge">⚠️ Vencida</span>}
      </div>

      <div className="order-info">
        <div className="info-row">
          <span className="label">QR:</span>
          <span className="value mono">{order.qrCode}</span>
        </div>
        <div className="info-row">
          <span className="label">Cantidad:</span>
          <span className="value">{order.quantity}</span>
        </div>
        <div className="info-row">
          <span className="label">Vencimiento:</span>
          <span className="value">{new Date(order.dueDate).toLocaleDateString('es-ES')}</span>
        </div>
        <div className="info-row">
          <span className="label">Prioridad:</span>
          <span className={`badge priority-${order.priority}`}>
            {getPriorityLabel(order.priority)}
          </span>
        </div>
        <div className="info-row">
          <span className="label">Estado:</span>
          <span className={`badge status-${order.status}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>
        {order.assignedTo && (
          <div className="info-row">
            <span className="label">Asignado a:</span>
            <span className="value">{order.assignedTo}</span>
          </div>
        )}
      </div>

      {order.notes && (
        <div className="order-notes">
          <p>{order.notes}</p>
        </div>
      )}
    </div>
  );
}
