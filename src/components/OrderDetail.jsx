import React, { useState, useEffect } from 'react';
import { getOrderHistory, changeOrderStatus, deleteOrder } from '../api/ordersApi';
import OrderStatusBadge from './OrderStatusBadge';
import OrderTimeline from './OrderTimeline';
import { formatDate, getTrafficLightEmoji, getTrafficLightColor, getPriorityLabel } from '../api/ordersApi';

/**
 * Vista detallada de una orden con historial y acciones
 */
export default function OrderDetail({ order, onUpdate, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [order.id]);

  async function loadHistory() {
    try {
      const data = await getOrderHistory(order.id);
      setHistory(data);
    } catch (err) {
      console.error('Error cargando historial:', err);
    }
  }

  async function handleStatusChange(newStatus) {
    setLoading(true);
    try {
      await changeOrderStatus(order.id, newStatus, null, 'Santiago Campanera');
      onUpdate && onUpdate();
      await loadHistory();
    } catch (err) {
      alert('Error cambiando estado: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('¿Seguro que deseas eliminar esta orden?')) return;

    setLoading(true);
    try {
      await deleteOrder(order.id, 'Santiago Campanera');
      onUpdate && onUpdate();
      onClose && onClose();
    } catch (err) {
      alert('Error eliminando orden: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  const trafficColor = getTrafficLightColor(order.status, order.dueDate);
  const emoji = getTrafficLightEmoji(trafficColor);

  return (
    <div className="order-detail">
      <div className="detail-header">
        <div className="header-left">
          <span className="traffic-emoji">{emoji}</span>
          <div>
            <h2>{order.customer}</h2>
            <p className="product-name">{order.product}</p>
          </div>
        </div>
        <div className="header-right">
          <OrderStatusBadge status={order.status} size="large" />
          {onClose && (
            <button className="close-btn" onClick={onClose}>✖️</button>
          )}
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-section">
          <h3>📋 Información General</h3>
          <div className="info-table">
            <div className="info-row">
              <span className="label">ID:</span>
              <span className="value mono">{order.id}</span>
            </div>
            <div className="info-row">
              <span className="label">Código QR:</span>
              <span className="value mono">
                {order.qrCode}
                <button className="btn-qr" onClick={() => setShowQr(!showQr)}>
                  {showQr ? '🔼' : '🔽'} {showQr ? 'Ocultar' : 'Ver'} QR
                </button>
              </span>
            </div>
            {showQr && (
              <div className="qr-display">
                <div className="qr-placeholder">
                  <span className="qr-icon">📱</span>
                  <p>{order.qrCode}</p>
                  <small>En producción: generar imagen QR real</small>
                </div>
              </div>
            )}
            <div className="info-row">
              <span className="label">Cantidad:</span>
              <span className="value">{order.quantity}</span>
            </div>
            <div className="info-row">
              <span className="label">Vencimiento:</span>
              <span className="value">{formatDate(order.dueDate)}</span>
            </div>
            <div className="info-row">
              <span className="label">Prioridad:</span>
              <span className={`badge priority-${order.priority}`}>
                {getPriorityLabel(order.priority)}
              </span>
            </div>
            {order.assignedTo && (
              <div className="info-row">
                <span className="label">Asignado a:</span>
                <span className="value">{order.assignedTo}</span>
              </div>
            )}
            <div className="info-row">
              <span className="label">Creada:</span>
              <span className="value">{formatDate(order.createdAt)}</span>
            </div>
            <div className="info-row">
              <span className="label">Actualizada:</span>
              <span className="value">{formatDate(order.updatedAt)}</span>
            </div>
          </div>

          {order.notes && (
            <div className="notes-section">
              <h4>📝 Notas:</h4>
              <p>{order.notes}</p>
            </div>
          )}
        </div>

        <div className="detail-section">
          <h3>⚙️ Acciones Rápidas</h3>
          <div className="action-buttons">
            {order.status !== 'in-progress' && (
              <button
                className="action-btn amber"
                onClick={() => handleStatusChange('in-progress')}
                disabled={loading}
              >
                ⚙️ Marcar en Progreso
              </button>
            )}
            {order.status !== 'completed' && (
              <button
                className="action-btn green"
                onClick={() => handleStatusChange('completed')}
                disabled={loading}
              >
                ✅ Marcar Completada
              </button>
            )}
            {order.status !== 'cancelled' && (
              <button
                className="action-btn red"
                onClick={() => handleStatusChange('cancelled')}
                disabled={loading}
              >
                ❌ Cancelar Orden
              </button>
            )}
          </div>

          <div className="danger-zone">
            <h4>⚠️ Zona de Peligro</h4>
            <button className="delete-btn" onClick={handleDelete} disabled={loading}>
              🗑️ Eliminar Orden
            </button>
          </div>
        </div>
      </div>

      <div className="timeline-section">
        <h3>📅 Historial de Cambios</h3>
        <OrderTimeline history={history} />
      </div>
    </div>
  );
}
