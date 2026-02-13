import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../api/ordersApi';
import OrderDetail from '../components/OrderDetail';

/**
 * Página de detalle de orden individual
 */
export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  async function loadOrder() {
    try {
      setLoading(true);
      const data = await getOrderById(orderId);
      setOrder(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleUpdate() {
    loadOrder();
  }

  function handleClose() {
    navigate('/orders');
  }

  if (loading) {
    return (
      <div className="page-loading">
        <span className="spinner">⏳</span>
        <p>Cargando orden...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-error">
        <span>❌</span>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/orders')}>
          ← Volver a Órdenes
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page-error">
        <span>📦</span>
        <h2>Orden no encontrada</h2>
        <button onClick={() => navigate('/orders')}>
          ← Volver a Órdenes
        </button>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <OrderDetail
        order={order}
        onUpdate={handleUpdate}
        onClose={handleClose}
      />
    </div>
  );
}
