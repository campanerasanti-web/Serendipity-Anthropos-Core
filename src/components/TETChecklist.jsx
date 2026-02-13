import React, { useState, useEffect } from 'react';

const TETChecklist = () => {
  const [checklist, setChecklist] = useState({
    csvLoaded: false,
    qrGenerated: false,
    vnAssigned: false,
    readiness70: false,
    redOrdersReviewed: false,
    personalPanelUpdated: false,
    vnInterfaceTested: false,
    chatbotActivated: false
  });

  const checklistItems = [
    {
      key: 'csvLoaded',
      icon: '📊',
      title: 'CSV de Products cargado',
      description: 'Archivo CSV con productos y clientes importado al sistema',
      priority: 'high'
    },
    {
      key: 'qrGenerated',
      icon: '📷',
      title: 'Códigos QR generados',
      description: 'QR único asignado a cada orden para trazabilidad',
      priority: 'high'
    },
    {
      key: 'vnAssigned',
      icon: '🇻🇳',
      title: 'Órdenes asignadas a equipo Vietnam',
      description: 'Distribución de tareas entre los trabajadores vietnamitas',
      priority: 'high'
    },
    {
      key: 'readiness70',
      icon: '🎯',
      title: 'Readiness Score ≥ 70%',
      description: 'Puntaje de preparación del sistema sobre el umbral mínimo',
      priority: 'critical'
    },
    {
      key: 'redOrdersReviewed',
      icon: '🔴',
      title: 'Órdenes rojas revisadas',
      description: 'Todas las órdenes urgentes o vencidas han sido verificadas',
      priority: 'critical'
    },
    {
      key: 'personalPanelUpdated',
      icon: '👤',
      title: 'Panel Personal actualizado',
      description: 'Dashboard personal de cada trabajador con sus métricas',
      priority: 'medium'
    },
    {
      key: 'vnInterfaceTested',
      icon: '🌐',
      title: 'Interfaz vietnamita probada',
      description: 'Validación de traducciones y usabilidad en idioma vietnamita',
      priority: 'high'
    },
    {
      key: 'chatbotActivated',
      icon: '🤖',
      title: 'Chatbot asistente activado',
      description: 'Asistente inteligente funcional y respondiendo consultas',
      priority: 'medium'
    }
  ];

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tet_checklist');
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
    localStorage.setItem('tet_checklist', JSON.stringify(updated));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = checklistItems.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'border-red-500 bg-red-50';
      case 'high':
        return 'border-orange-500 bg-orange-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'critical':
        return '🔥 Crítico';
      case 'high':
        return '⚡ Alta';
      case 'medium':
        return '📌 Media';
      default:
        return '📋 Baja';
    }
  };

  return (
    <div className="tet-checklist bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
            <span className="text-4xl mr-3">🎊</span>
            Checklist TET - Prueba Piloto
          </h2>
          <div className="text-right">
            <div className="text-4xl font-bold text-green-600">{completionPercentage}%</div>
            <div className="text-sm text-gray-500">{completedCount} de {totalCount}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-green-500 to-teal-500 h-full transition-all duration-500 flex items-center justify-end pr-2"
            style={{ width: `${completionPercentage}%` }}
          >
            {completionPercentage > 10 && (
              <span className="text-xs text-white font-bold">{completionPercentage}%</span>
            )}
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {checklistItems.map((item) => {
          const isChecked = checklist[item.key];
          
          return (
            <div
              key={item.key}
              onClick={() => handleToggle(item.key)}
              className={`flex items-start p-5 rounded-lg border-2 cursor-pointer transition-all ${
                isChecked
                  ? 'bg-green-50 border-green-300 hover:bg-green-100'
                  : `${getPriorityColor(item.priority)} border-2 hover:shadow-md`
              }`}
            >
              {/* Checkbox */}
              <div className="flex-shrink-0 mr-4 mt-1">
                <div 
                  className={`w-7 h-7 rounded border-2 flex items-center justify-center transition-all ${
                    isChecked
                      ? 'bg-green-500 border-green-500'
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
              <div className="text-3xl mr-4">{item.icon}</div>
              
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`text-lg font-bold ${isChecked ? 'text-green-800 line-through' : 'text-gray-800'}`}>
                    {item.title}
                  </h3>
                  {!isChecked && (
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                      item.priority === 'critical' ? 'bg-red-200 text-red-800' :
                      item.priority === 'high' ? 'bg-orange-200 text-orange-800' :
                      'bg-yellow-200 text-yellow-800'
                    }`}>
                      {getPriorityLabel(item.priority)}
                    </span>
                  )}
                  {isChecked && (
                    <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full font-semibold">
                      ✓ Completado
                    </span>
                  )}
                </div>
                <p className={`text-sm ${isChecked ? 'text-gray-600' : 'text-gray-700'}`}>
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Success Message */}
      {completionPercentage === 100 && (
        <div className="mt-6 p-6 bg-gradient-to-r from-green-100 to-teal-100 rounded-lg border-2 border-green-300 text-center">
          <div className="text-6xl mb-3">🎊</div>
          <h3 className="text-2xl font-bold text-green-800 mb-2">
            ¡Sistema TET Completamente Listo!
          </h3>
          <p className="text-green-700">
            Todos los ítems han sido verificados. El sistema está preparado para la prueba piloto del 13 de febrero.
          </p>
          <p className="text-green-600 mt-2 font-semibold italic">
            "Chúc mừng năm mới! 🎊 Que el Año Nuevo Lunar traiga prosperidad y armonía."
          </p>
        </div>
      )}

      {/* Warning if incomplete */}
      {completionPercentage < 70 && (
        <div className="mt-6 p-4 bg-orange-50 border-2 border-orange-300 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <p className="font-bold text-orange-900">Readiness Score por debajo del objetivo</p>
              <p className="text-sm text-orange-800">
                Se requiere al menos 70% de completitud para la prueba piloto TET.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TETChecklist;
