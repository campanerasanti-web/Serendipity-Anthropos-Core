import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from '../components/QrScanner';
import { getOrderByQrCode } from '../api/ordersApi';
import OrderCard from '../components/OrderCard';

/**
 * Página de escaneo de códigos QR
 */
export default function OrderScanPage() {
  const navigate = useNavigate();
  const [scannedOrder, setScannedOrder] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [error, setError] = useState(null);

  async function handleScanSuccess(scanResult) {
    try {
      // Obtener información de la orden
      const order = await getOrderByQrCode(scanResult.qrCode);
      setScannedOrder(order);
      setScanHistory(prev => [
        {
          order,
          scanTime: new Date(),
          scanResult,
        },
        ...prev.slice(0, 9) // Mantener solo los últimos 10
      ]);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleScanError(errorMsg) {
    setError(errorMsg);
  }

  function handleOrderClick(order) {
    navigate(`/orders/${order.id}`);
  }

  return (
    <div className="order-scan-page">
      <div className="page-header">
        <h1>📷 Escanear Códigos QR</h1>
        <button className="btn-back" onClick={() => navigate('/orders')}>
          ← Volver a Órdenes
        </button>
      </div>

      <div className="scan-layout">
        <div className="scan-section">
          <QrScanner
            onScanSuccess={handleScanSuccess}
            onError={handleScanError}
          />

          {error && (
            <div className="error-alert">
              <span>❌</span>
              <p>{error}</p>
            </div>
          )}

          {scannedOrder && (
            <div className="scan-result">
              <h3>✅ Escaneo Exitoso</h3>
              <OrderCard
                order={scannedOrder}
                onClick={() => handleOrderClick(scannedOrder)}
              />
            </div>
          )}
        </div>

        <div className="history-section">
          <h3>📜 Historial de Escaneos</h3>
          {scanHistory.length === 0 ? (
            <div className="empty-state">
              <p>No hay escaneos registrados</p>
            </div>
          ) : (
            <div className="history-list">
              {scanHistory.map((item, index) => (
                <div key={index} className="history-item">
                  <div className="history-time">
                    {item.scanTime.toLocaleTimeString('es-ES')}
                  </div>
                  <OrderCard
                    order={item.order}
                    onClick={() => handleOrderClick(item.order)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
