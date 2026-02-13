import React, { useEffect, useState } from 'react';
import { getNextStep } from '../api/assistantApi';

export default function AssistantPanel({ lotId, open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [finalPackage, setFinalPackage] = useState(null);

  useEffect(() => {
    if (open) {
      loadStep('start');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const loadStep = async (next = 'start', data = {}) => {
    setLoading(true);
    try {
      const res = await getNextStep({ lotId, step: next, data });
      setStep(res.nextStep || res.NextStep || null);
      setSuggestions(res.suggestions || res.Suggestions || []);
      setWarnings(res.warnings || res.Warnings || []);
      setFinalPackage(res.finalPackage || res.FinalPackage || null);
    } catch (err) {
      console.error('assistant load error', err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed right-6 bottom-20 z-50 w-96 max-h-[70vh] bg-white border rounded-lg shadow-lg overflow-auto">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Asistente Guiado</h3>
          <div className="text-xs text-gray-500">🎧 Escucha Activa</div>
        </div>
        <button className="text-sm text-gray-600" onClick={onClose}>Cerrar</button>
      </div>

      <div className="p-4">
        {loading && <div className="mb-2 text-sm text-gray-500">Cargando...</div>}
        {step ? (
          <div>
            <div className="mb-2">
              <div className="text-sm font-medium">{step.title}</div>
              <div className="text-sm text-gray-700">{step.message}</div>
            </div>

            {suggestions && suggestions.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-gray-500 mb-1">Sugerencias</div>
                <ul className="list-disc pl-5 text-sm">
                  {suggestions.map((s, i) => (
                    <li key={i}><strong>{s.field}:</strong> {s.issue} — {s.recommendation}</li>
                  ))}
                </ul>
              </div>
            )}

            {warnings && warnings.length > 0 && (
              <div className="mb-3 text-sm text-yellow-700">
                <div className="text-xs text-gray-500 mb-1">Advertencias</div>
                <ul className="list-disc pl-5">
                  {warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}

            <div className="flex gap-2 flex-wrap mt-3">
              {step.actions && step.actions.map((a, idx) => (
                <button
                  key={idx}
                  onClick={() => loadStep(a)}
                  className="px-3 py-1 bg-indigo-600 text-white text-sm rounded"
                >
                  {a}
                </button>
              ))}
            </div>

            {finalPackage && (
              <div className="mt-4 border-t pt-3">
                <div className="text-sm font-medium">Paquete final</div>
                <pre className="text-xs bg-gray-50 p-2 rounded mt-2 max-h-48 overflow-auto">{JSON.stringify(finalPackage, null, 2)}</pre>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500">Sin pasos disponibles.</div>
        )}
      </div>
    </div>
  );
}
