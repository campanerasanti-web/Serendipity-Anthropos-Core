import React, { useState, useEffect } from 'react';
import { getAllOrders } from '../api/ordersApi';
import OrderList from '../components/OrderList';
import OrderStatsPanel from '../components/OrderStatsPanel';
import OrderCreateForm from '../components/OrderCreateForm';
import OrderDetail from '../components/OrderDetail';

/**
 * Página principal de órdenes
 */
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error cargando órdenes:', err);
      alert('Error cargando órdenes: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCreateSuccess(newOrder) {
    setOrders(prev => [newOrder, ...prev]);
    setShowCreateForm(false);
  }

  function handleOrderClick(order) {
    setSelectedOrder(order);
  }

  function handleUpdate() {
    loadOrders();
    setSelectedOrder(null);
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>📦 Sistema de Órdenes con QR</h1>
        <button
          className="btn-create-order"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? '❌ Cancelar' : '➕ Nueva Orden'}
        </button>
      </div>

      <OrderStatsPanel />

      {showCreateForm && (
        <OrderCreateForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {selectedOrder ? (
        <OrderDetail
          order={selectedOrder}
          onUpdate={handleUpdate}
          onClose={() => setSelectedOrder(null)}
        />
      ) : (
        <OrderList
          orders={orders}
          onOrderClick={handleOrderClick}
          loading={loading}
        />
      )}
    </div>
  );
}
