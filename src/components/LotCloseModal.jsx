import React, { useState } from 'react';
import { closeLot } from '../api/lotsApi';
import FinalPackageViewer from './FinalPackageViewer';

export default function LotCloseModal({ lotId, open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  if (!open) return null;

  const handleConfirm = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await closeLot(lotId);
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg max-w-2xl w-full p-4">
        <header className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Cerrar Lote</h3>
          <button onClick={onClose} className="text-gray-500">Cerrar</button>
        </header>

        {!result ? (
          <div>
            <p className="mb-4">¿Deseas cerrar el lote <strong>{lotId}</strong>? Esta acción generará factura y packing list.</p>

            {error && <div className="mb-2 text-red-600">{error}</div>}

            <div className="flex gap-2">
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Confirmar cierre'}
              </button>

              <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <strong>Resultado:</strong>
            </div>
            <FinalPackageViewer packageData={result} />

            <div className="mt-4 flex gap-2">
              <button onClick={onClose} className="px-4 py-2 bg-green-600 text-white rounded">Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
