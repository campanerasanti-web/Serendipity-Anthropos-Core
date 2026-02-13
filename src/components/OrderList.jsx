import React, { useState } from 'react';
import OrderCard from './OrderCard';

/**
 * Lista de órdenes con filtros
 */
export default function OrderList({ orders, onOrderClick, loading = false }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  if (loading) {
    return (
      <div className="order-list-loading">
        <span className="spinner">⏳</span>
        <p>Cargando órdenes...</p>
      </div>
    );
  }

  // Filtrar órdenes
  const filteredOrders = orders.filter(order => {
    // Filtro de estado
    if (filter !== 'all' && order.status !== filter) return false;

    // Filtro de búsqueda
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        order.customer.toLowerCase().includes(searchLower) ||
        order.product.toLowerCase().includes(searchLower) ||
        order.qrCode.toLowerCase().includes(searchLower) ||
        (order.assignedTo && order.assignedTo.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  return (
    <div className="order-list">
      <div className="list-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Buscar por cliente, producto, QR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            Todas ({orders.length})
          </button>
          <button
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            ⏳ Pendientes
          </button>
          <button
            className={filter === 'in-progress' ? 'active' : ''}
            onClick={() => setFilter('in-progress')}
          >
            ⚙️ En Progreso
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            ✅ Completadas
          </button>
        </div>
      </div>

      <div className="orders-grid">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <p>No se encontraron órdenes</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onClick={() => onOrderClick && onOrderClick(order)}
            />
          ))
        )}
      </div>
    </div>
  );
}
