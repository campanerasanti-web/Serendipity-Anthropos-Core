/**
 * Panel donde los guardianes preguntan sobre documentos sin contexto
 */

import React, { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { UnclassifiedDocument } from '../../hooks/usePaymentFolder';
import { addPaymentRecord } from '../../services/gardenMemory';

interface GuardianQuestionsProps {
  documents: UnclassifiedDocument[];
  onDocumentClassified: (fileName: string) => void;
}

export const GuardianQuestions: React.FC<GuardianQuestionsProps> = ({
  documents,
  onDocumentClassified,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<UnclassifiedDocument | null>(null);
  const [answers, setAnswers] = useState({
    amount: '',
    date: '',
    description: '',
    type: 'ingreso' as 'ingreso' | 'pago',
  });

  if (documents.length === 0) {
    return null;
  }

  const handleSubmit = () => {
    if (!selectedDoc || !answers.amount || !answers.date) return;

    addPaymentRecord({
      amount: parseFloat(answers.amount),
      date: answers.date,
      description: answers.description || selectedDoc.fileName,
      type: answers.type,
      source: selectedDoc.fileName,
    });

    onDocumentClassified(selectedDoc.fileName);
    setSelectedDoc(null);
    setAnswers({ amount: '', date: '', description: '', type: 'ingreso' });
  };

  return (
    <div className="rounded-2xl border border-amber-300/40 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <MessageCircle className="text-amber-600" size={24} />
        <h3 className="text-xl font-semibold text-amber-900">
          Preguntas del Guardián
        </h3>
        <span className="ml-auto bg-amber-200 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
          {documents.length}
        </span>
      </div>

      {!selectedDoc ? (
        <div className="space-y-2">
          <p className="text-amber-800 text-sm mb-3">
            Hay documentos nuevos que necesitan contexto. ¿Me ayudas a entenderlos?
          </p>
          {documents.map((doc) => (
            <button
              key={doc.fileName}
              onClick={() => setSelectedDoc(doc)}
              className="w-full text-left px-4 py-3 rounded-lg bg-white border border-amber-200 hover:border-amber-400 hover:shadow-md transition-all"
            >
              <p className="text-sm font-medium text-amber-900">{doc.fileName}</p>
              <p className="text-xs text-amber-600 mt-1">
                Recibido: {new Date(doc.receivedAt).toLocaleString('es-ES')}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-amber-900">{selectedDoc.fileName}</p>
            <button
              onClick={() => setSelectedDoc(null)}
              className="text-amber-600 hover:text-amber-800"
            >
              <X size={18} />
            </button>
          </div>

          <div className="bg-white/60 rounded-lg p-3 text-xs text-amber-800 font-mono max-h-32 overflow-y-auto">
            {selectedDoc.content.substring(0, 300)}...
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">
                ¿Es un ingreso o un pago?
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setAnswers({ ...answers, type: 'ingreso' })}
                  className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                    answers.type === 'ingreso'
                      ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
                      : 'border-gray-300 bg-white text-gray-600'
                  }`}
                >
                  Ingreso
                </button>
                <button
                  onClick={() => setAnswers({ ...answers, type: 'pago' })}
                  className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                    answers.type === 'pago'
                      ? 'border-red-500 bg-red-50 text-red-700 font-semibold'
                      : 'border-gray-300 bg-white text-gray-600'
                  }`}
                >
                  Pago
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">
                ¿Cuál es el monto?
              </label>
              <input
                type="number"
                step="0.01"
                value={answers.amount}
                onChange={(e) => setAnswers({ ...answers, amount: e.target.value })}
                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">
                ¿Qué fecha tiene?
              </label>
              <input
                type="date"
                value={answers.date}
                onChange={(e) => setAnswers({ ...answers, date: e.target.value })}
                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">
                ¿Alguna nota adicional? (opcional)
              </label>
              <input
                type="text"
                value={answers.description}
                onChange={(e) => setAnswers({ ...answers, description: e.target.value })}
                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="Ej: Pago a proveedor X, Factura #123..."
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!answers.amount || !answers.date}
              className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Send size={18} />
              Guardar en el Jardín
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
