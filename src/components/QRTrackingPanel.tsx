/**
 * TRAZABILIDAD QR - Panel de Órdenes con Semáforo
 * Generación de QR codes y seguimiento de estado rojo/ámbar/verde
 * 
 * "Cada código es un rastro de luz en el camino"
 */

import React, { useState } from 'react';
import {
  useQRTracking,
  getStatusColor,
  getStatusEmoji,
  getStatusLabel,
  TrafficLightStatus,
  Order,
} from '../hooks/useQRTracking';
import { useI18n } from '../i18n/I18nContext';

export const QRTrackingPanel: React.FC = () => {
  const { t, language } = useI18n();
  const {
    orders,
    isLoading,
    error,
    createOrder,
    updateOrderStatus,
    getOrdersByStatus,
    getOrderStats,
    deleteOrder,
  } = useQRTracking();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<TrafficLightStatus | 'all'>('all');

  // Estado del formulario
  const [formData, setFormData] = useState({
    customer: '',
    product: '',
    quantity: 1,
    dueDate: '',
    assignedTo: '',
    notes: '',
  });

  const stats = getOrderStats();

  const handleCreateOrder = async () => {
    if (!formData.customer || !formData.product || !formData.dueDate) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    await createOrder(
      formData.customer,
      formData.product,
      formData.quantity,
      new Date(formData.dueDate),
      formData.assignedTo || undefined,
      formData.notes || undefined
    );

    // Resetear formulario
    setFormData({
      customer: '',
      product: '',
      quantity: 1,
      dueDate: '',
      assignedTo: '',
      notes: '',
    });
    setShowCreateForm(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: TrafficLightStatus) => {
    await updateOrderStatus(orderId, newStatus, `Estado actualizado a ${newStatus}`);
  };

  const filteredOrders =
    filterStatus === 'all' ? orders : getOrdersByStatus(filterStatus);

  return (
    <div className="qr-tracking-panel">
      {/* Header con estadísticas */}
      <div className="qr-header">
        <h2>{t.qrTracking.title}</h2>
        <div className="qr-stats">
          <div className="stat">
            <span className="label">Total:</span>
            <span className="value">{stats.total}</span>
          </div>
          <div className="stat red">
            <span className="emoji">🔴</span>
            <span className="value">{stats.red}</span>
          </div>
          <div className="stat amber">
            <span className="emoji">🟡</span>
            <span className="value">{stats.amber}</span>
          </div>
          <div className="stat green">
            <span className="emoji">🟢</span>
            <span className="value">{stats.green}</span>
          </div>
          {stats.overdue > 0 && (
            <div className="stat overdue">
              <span className="label">Vencidas:</span>
              <span className="value">{stats.overdue}</span>
            </div>
          )}
        </div>
      </div>

      {/* Controles */}
      <div className="qr-controls">
        <button
          className="create-order-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? '✕ Cancelar' : '+ Nueva Orden'}
        </button>

        <div className="filter-buttons">
          <button
            className={filterStatus === 'all' ? 'active' : ''}
            onClick={() => setFilterStatus('all')}
          >
            Todas
          </button>
          <button
            className={filterStatus === 'red' ? 'active' : ''}
            onClick={() => setFilterStatus('red')}
          >
            🔴 Urgentes
          </button>
          <button
            className={filterStatus === 'amber' ? 'active' : ''}
            onClick={() => setFilterStatus('amber')}
          >
            🟡 En Proceso
          </button>
          <button
            className={filterStatus === 'green' ? 'active' : ''}
            onClick={() => setFilterStatus('green')}
          >
            🟢 Completadas
          </button>
        </div>
      </div>

      {/* Formulario de creación */}
      {showCreateForm && (
        <div className="create-order-form">
          <h3>Nueva Orden</h3>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Cliente*"
              value={formData.customer}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
            />
            <input
              type="text"
              placeholder="Producto*"
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
            />
            <input
              type="number"
              placeholder="Cantidad*"
              min="1"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })
              }
            />
            <input
              type="date"
              placeholder="Fecha de entrega*"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
            <input
              type="text"
              placeholder="Asignado a (opcional)"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            />
            <textarea
              placeholder="Notas adicionales (opcional)"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>
          <button className="submit-btn" onClick={handleCreateOrder}>
            Crear Orden con QR
          </button>
        </div>
      )}

      {/* Estado de carga */}
      {isLoading && <div className="qr-loading">Cargando órdenes...</div>}
      {error && <div className="qr-error">{error}</div>}

      {/* Lista de órdenes */}
      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <p>No hay órdenes {filterStatus !== 'all' ? `con estado ${filterStatus}` : ''}.</p>
            <button onClick={() => setShowCreateForm(true)}>Crear primera orden</button>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              onDelete={deleteOrder}
              language={language as 'es' | 'vi' | 'en'}
            />
          ))
        )}
      </div>
    </div>
  );
};

/**
 * Tarjeta individual de orden con QR
 */
interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: TrafficLightStatus) => void;
  onDelete: (orderId: string) => Promise<boolean>;
  language: 'es' | 'vi' | 'en';
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusChange, onDelete, language }) => {
  const [showDetails, setShowDetails] = useState(false);
  const statusColor = getStatusColor(order.status);
  const statusEmoji = getStatusEmoji(order.status);
  const statusLabel = getStatusLabel(order.status, language);

  // Verificar si está vencida
  const isOverdue = order.status !== 'green' && order.dueDate < new Date();

  return (
    <div
      className={`order-card ${order.status} ${isOverdue ? 'overdue' : ''}`}
      style={{ borderLeftColor: statusColor }}
    >
      <div className="order-header" onClick={() => setShowDetails(!showDetails)}>
        <div className="order-id">
          <span className="status-emoji">{statusEmoji}</span>
          <span className="id">{order.id}</span>
        </div>
        <div className="order-customer">
          <strong>{order.customer}</strong>
          <span className="product">{order.product} x{order.quantity}</span>
        </div>
        <div className="order-due">
          {isOverdue && <span className="overdue-badge">⚠️ Vencida</span>}
          <span className="date">
            {order.dueDate.toLocaleDateString(language === 'vi' ? 'vi-VN' : language === 'en' ? 'en-US' : 'es-ES')}
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="order-details">
          {/* QR Code con SVG simple */}
          <div className="qr-code-container">
            <div className="qr-code-placeholder">
              <span className="qr-icon">📱</span>
              <p className="qr-label">QR Code</p>
              <code className="qr-data">{order.qrCode}</code>
            </div>
          </div>

          {/* Información adicional */}
          <div className="order-info">
            {order.assignedTo && (
              <p>
                <strong>Asignado a:</strong> {order.assignedTo}
              </p>
            )}
            {order.notes && (
              <p>
                <strong>Notas:</strong> {order.notes}
              </p>
            )}
            <p>
              <strong>Creada:</strong>{' '}
              {order.createdAt.toLocaleString(language === 'vi' ? 'vi-VN' : language === 'en' ? 'en-US' : 'es-ES')}
            </p>
            <p>
              <strong>Actualizada:</strong>{' '}
              {order.updatedAt.toLocaleString(language === 'vi' ? 'vi-VN' : language === 'en' ? 'en-US' : 'es-ES')}
            </p>
          </div>

          {/* Controles de estado */}
          <div className="status-controls">
            <button
              className={`status-btn red ${order.status === 'red' ? 'active' : ''}`}
              onClick={() => onStatusChange(order.id, 'red')}
              disabled={order.status === 'red'}
            >
              🔴 {getStatusLabel('red', language)}
            </button>
            <button
              className={`status-btn amber ${order.status === 'amber' ? 'active' : ''}`}
              onClick={() => onStatusChange(order.id, 'amber')}
              disabled={order.status === 'amber'}
            >
              🟡 {getStatusLabel('amber', language)}
            </button>
            <button
              className={`status-btn green ${order.status === 'green' ? 'active' : ''}`}
              onClick={() => onStatusChange(order.id, 'green')}
              disabled={order.status === 'green'}
            >
              🟢 {getStatusLabel('green', language)}
            </button>
          </div>

          {/* Historial de estados */}
          <div className="status-history">
            <h4>Historial:</h4>
            {order.statusHistory.map((history, idx) => (
              <div key={idx} className="history-item">
                <span className="emoji">{getStatusEmoji(history.status)}</span>
                <span className="timestamp">
                  {history.timestamp.toLocaleString(language === 'vi' ? 'vi-VN' : language === 'en' ? 'en-US' : 'es-ES')}
                </span>
                {history.reason && <span className="reason">{history.reason}</span>}
              </div>
            ))}
          </div>

          {/* Botón eliminar */}
          <button
            className="delete-btn"
            onClick={async () => {
              if (window.confirm('¿Eliminar esta orden?')) {
                await onDelete(order.id);
              }
            }}
          >
            🗑️ Eliminar
          </button>
        </div>
      )}
    </div>
  );
};
