import React, { useState } from 'react';
import { updateOrder } from '../api/ordersApi';

/**
 * Formulario de edición de órdenes
 */
export default function OrderEditForm({ order, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    customer: order.customer,
    product: order.product,
    quantity: order.quantity,
    dueDate: new Date(order.dueDate).toISOString().split('T')[0],
    priority: order.priority,
    assignedTo: order.assignedTo || '',
    notes: order.notes || '',
    updatedBy: 'Santiago Campanera',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedOrder = await updateOrder(order.id, {
        ...formData,
        quantity: parseInt(formData.quantity, 10),
        dueDate: new Date(formData.dueDate).toISOString(),
      });

      onSuccess && onSuccess(updatedOrder);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="order-edit-form">
      <h3>✏️ Editar Orden</h3>

      {error && (
        <div className="error-alert">
          <span>❌</span>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="customer">Cliente *</label>
            <input
              type="text"
              id="customer"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="product">Producto/Servicio *</label>
            <input
              type="text"
              id="product"
              name="product"
              value={formData.product}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="quantity">Cantidad *</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <div className="form-field">
            <label htmlFor="dueDate">Fecha de Vencimiento *</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="priority">Prioridad</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Baja</option>
              <option value="normal">Normal</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="assignedTo">Asignado a</label>
            <input
              type="text"
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
            />
          </div>

          <div className="form-field full-width">
            <label htmlFor="notes">Notas</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>

        <div className="form-actions">
          {onCancel && (
            <button type="button" className="btn-cancel" onClick={onCancel}>
              ❌ Cancelar
            </button>
          )}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? '⏳ Guardando...' : '💾 Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
