import React, { useState } from 'react';
import { registerQrScan } from '../api/ordersApi';

/**
 * Escáner de códigos QR (simulado)
 * En producción, integrar con librería de escaneo real
 */
export default function QrScanner({ onScanSuccess, onError }) {
  const [scanning, setScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');

  async function handleManualScan() {
    if (!manualInput.trim()) return;

    setScanning(true);
    try {
      // Registrar escaneo
      const scanResult = await registerQrScan(
        manualInput,
        'Santiago Campanera',
        'Oficina Principal',
        'Desktop Scanner'
      );

      onScanSuccess && onScanSuccess(scanResult);
      setManualInput('');
    } catch (err) {
      onError && onError(err.message);
    } finally {
      setScanning(false);
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      handleManualScan();
    }
  }

  return (
    <div className="qr-scanner">
      <div className="scanner-header">
        <h3>📷 Escanear Código QR</h3>
        <p className="scanner-subtitle">
          En producción: integrar con cámara real
        </p>
      </div>

      <div className="scanner-mock">
        <div className="scanner-frame">
          <div className="scanner-corners">
            <div className="corner top-left"></div>
            <div className="corner top-right"></div>
            <div className="corner bottom-left"></div>
            <div className="corner bottom-right"></div>
          </div>
          <div className="scanner-line"></div>
          <p className="scanner-instruction">
            📱 Posiciona el código QR en el centro
          </p>
        </div>
      </div>

      <div className="manual-input-section">
        <label htmlFor="qr-manual">O ingresa el código manualmente:</label>
        <div className="input-group">
          <input
            type="text"
            id="qr-manual"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ej: ORD-1681234567890-1234"
            disabled={scanning}
          />
          <button
            className="scan-btn"
            onClick={handleManualScan}
            disabled={scanning || !manualInput.trim()}
          >
            {scanning ? '⏳ Escaneando...' : '🔍 Escanear'}
          </button>
        </div>
      </div>

      <div className="scanner-tips">
        <h4>💡 Consejos:</h4>
        <ul>
          <li>En producción, usa una librería como <code>react-qr-scanner</code></li>
          <li>Asegúrate de dar permisos de cámara al navegador</li>
          <li>El código QR debe estar bien iluminado y enfocado</li>
        </ul>
      </div>
    </div>
  );
}
