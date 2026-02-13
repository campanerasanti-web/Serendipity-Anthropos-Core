import React, { useState } from 'react';
import TETChecklist from '../components/TETChecklist';
import WellbeingChecklist from '../components/WellbeingChecklist';

const ChecklistsPage = () => {
  const [activeChecklist, setActiveChecklist] = useState('tet');

  return (
    <div className="checklists-page min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-green-500">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
            ☑️ Checklists de Verificación
          </h1>
          <p className="text-gray-600">
            Listas de verificación para TET, Bienestar y Operaciones
          </p>
        </div>
      </div>

      {/* Checklist Selector */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveChecklist('tet')}
            className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all ${
              activeChecklist === 'tet'
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-green-50'
            }`}
          >
            🎊 Checklist TET
          </button>
          <button
            onClick={() => setActiveChecklist('wellbeing')}
            className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all ${
              activeChecklist === 'wellbeing'
                ? 'bg-teal-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-teal-50'
            }`}
          >
            🧘 Checklist Bienestar
          </button>
        </div>
      </div>

      {/* Checklist Content */}
      <div className="max-w-7xl mx-auto">
        {activeChecklist === 'tet' ? (
          <TETChecklist />
        ) : (
          <WellbeingChecklist />
        )}
      </div>

      {/* Mindfulness Footer */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
          <p className="text-center text-gray-700 italic">
            "Cada checkbox marcado es un paso hacia la claridad. Cada tarea completada, una afirmación de tu presencia."
            <span className="block mt-2 text-green-600 font-semibold">— El Guardián del Flujo</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChecklistsPage;
