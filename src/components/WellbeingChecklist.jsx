import React, { useState, useEffect } from 'react';

const WellbeingChecklist = () => {
  const [checklist, setChecklist] = useState({
    pazInteriorBaseline: false,
    horasPresenciaBaseline: false,
    tcmBaseline: false,
    concienciaBenchmark: false,
    projection6Months: false,
    dailyDocumentation: false
  });

  const checklistItems = [
    {
      key: 'pazInteriorBaseline',
      icon: '🧘',
      title: 'Paz Interior - Baseline establecido',
      description: 'Medición inicial de índice de paz interior (0-100%). Registrar práctica diaria de mindfulness.',
      target: 'Objetivo: ≥ 75%',
      metrics: 'Meditación, respiración consciente, momentos de presencia'
    },
    {
      key: 'horasPresenciaBaseline',
      icon: '⏰',
      title: 'Horas de Presencia Baseline',
      description: 'Cuantificación de horas de trabajo en estado de flow consciente vs modo reactivo.',
      target: 'Objetivo: ≥ 60% del tiempo en presencia',
      metrics: 'Trabajo profundo, distracciones, multitasking'
    },
    {
      key: 'tcmBaseline',
      icon: '☯️',
      title: 'Benchmark TCM Baseline',
      description: 'Evaluación inicial de Medicina Tradicional China: Qi Score, balance Yin-Yang, elementos.',
      target: 'Objetivo: Balance en 5 elementos',
      metrics: 'Fuego, Tierra, Metal, Agua, Madera'
    },
    {
      key: 'concienciaBenchmark',
      icon: '🧠',
      title: 'Benchmark de Conciencia Activa',
      description: 'Medición consciente de claridad mental, atención plena y estabilidad emocional.',
      target: 'Objetivo: ≥ 80% de presencia sostenida',
      metrics: 'Claridad, enfoque, equilibrio emocional'
    },
    {
      key: 'projection6Months',
      icon: '📈',
      title: 'Proyección a 6 meses documentada',
      description: 'Plan de evolución de métricas de bienestar con hitos mensuales definidos.',
      target: 'Objetivo: Incremento del 20%',
      metrics: 'Paz +15%, Presencia +20%, TCM Balance +10%'
    },
    {
      key: 'dailyDocumentation',
      icon: '📝',
      title: 'Documentación diaria activa',
      description: 'Sistema de registro diario de prácticas de bienestar y reflexiones conscientes.',
      target: 'Objetivo: 80% de días documentados',
      metrics: 'Journal, notas, insights, gratitud'
    }
  ];

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wellbeing_checklist');
    if (saved) {
      setChecklist(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  const handleToggle = (key) => {
    const updated = {
      ...checklist,
      [key]: !checklist[key]
    };
    setChecklist(updated);
    localStorage.setItem('wellbeing_checklist', JSON.stringify(updated));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = checklistItems.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="wellbeing-checklist bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
            <span className="text-4xl mr-3">🧘</span>
            Checklist de Bienestar Consciente
          </h2>
          <div className="text-right">
            <div className="text-4xl font-bold text-teal-600">{completionPercentage}%</div>
            <div className="text-sm text-gray-500">{completedCount} de {totalCount}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-teal-500 to-green-500 h-full transition-all duration-500 flex items-center justify-end pr-2"
            style={{ width: `${completionPercentage}%` }}
          >
            {completionPercentage > 10 && (
              <span className="text-xs text-white font-bold">{completionPercentage}%</span>
            )}
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-4">
        {checklistItems.map((item) => {
          const isChecked = checklist[item.key];
          
          return (
            <div
              key={item.key}
              onClick={() => handleToggle(item.key)}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                isChecked
                  ? 'bg-teal-50 border-teal-300 hover:bg-teal-100'
                  : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:border-teal-300 hover:shadow-lg'
              }`}
            >
              <div className="flex items-start">
                {/* Checkbox */}
                <div className="flex-shrink-0 mr-4 mt-1">
                  <div 
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      isChecked
                        ? 'bg-teal-500 border-teal-500'
                        : 'bg-white border-gray-400'
                    }`}
                  >
                    {isChecked && (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                
                {/* Icon */}
                <div className="text-4xl mr-4">{item.icon}</div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-xl font-bold ${isChecked ? 'text-teal-800 line-through' : 'text-gray-800'}`}>
                      {item.title}
                    </h3>
                    {isChecked && (
                      <span className="px-3 py-1 bg-teal-200 text-teal-800 text-xs rounded-full font-semibold">
                        ✓ Establecido
                      </span>
                    )}
                  </div>
                  
                  <p className={`mb-3 ${isChecked ? 'text-gray-600' : 'text-gray-700'}`}>
                    {item.description}
                  </p>
                  
                  {/* Target and Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-white/70 rounded-lg border border-purple-200">
                      <div className="text-xs font-semibold text-purple-700 mb-1">🎯 TARGET</div>
                      <div className="text-sm text-gray-800">{item.target}</div>
                    </div>
                    <div className="p-3 bg-white/70 rounded-lg border border-teal-200">
                      <div className="text-xs font-semibold text-teal-700 mb-1">📊 MÉTRICAS</div>
                      <div className="text-sm text-gray-800">{item.metrics}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Status */}
      {completionPercentage === 100 ? (
        <div className="mt-6 p-6 bg-gradient-to-r from-teal-100 to-green-100 rounded-xl border-2 border-teal-300 text-center">
          <div className="text-6xl mb-3">🎉</div>
          <h3 className="text-2xl font-bold text-teal-800 mb-2">
            ¡Baseline de Bienestar Completo!
          </h3>
          <p className="text-teal-700 mb-3">
            Todas las métricas iniciales han sido establecidas. Ahora puedes trackear tu evolución.
          </p>
          <div className="p-4 bg-white/60 rounded-lg">
            <p className="text-gray-700 italic">
              "La conciencia es el primer paso hacia la transformación. El tracking consciente es el segundo."
            </p>
            <p className="text-teal-700 font-semibold mt-2">— Thomas Merton del Mindfulness</p>
          </div>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌱</span>
            <div>
              <p className="font-bold text-purple-900">Establecimiento en Progreso</p>
              <p className="text-sm text-purple-800">
                Completa todos los baselines para comenzar el tracking de evolución de bienestar.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mindfulness Quote */}
      <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
        <p className="text-center text-gray-700 italic">
          "No puedes mejorar lo que no mides. Pero la medición debe venir de un lugar de amor, no de juicio."
          <span className="block mt-2 text-purple-600 font-semibold">— El Guardián del Bienestar</span>
        </p>
      </div>
    </div>
  );
};

export default WellbeingChecklist;
