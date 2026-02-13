import React from 'react';

const AssistantQuickActions = ({ onActionClick }) => {
  const quickActions = [
    {
      id: 'create-order',
      icon: '➕',
      title: 'Crear Orden',
      description: 'Nueva orden con QR',
      color: 'from-blue-500 to-blue-600',
      action: () => onActionClick('create-order')
    },
    {
      id: 'change-status',
      icon: '🔄',
      title: 'Cambiar Estado',
      description: 'Actualizar órdenes',
      color: 'from-green-500 to-green-600',
      action: () => onActionClick('change-status')
    },
    {
      id: 'scan-qr',
      icon: '📷',
      title: 'Escanear QR',
      description: 'Trazabilidad',
      color: 'from-purple-500 to-purple-600',
      action: () => onActionClick('scan-qr')
    },
    {
      id: 'view-stats',
      icon: '📊',
      title: 'Ver KPIs',
      description: 'Dashboard global',
      color: 'from-orange-500 to-orange-600',
      action: () => onActionClick('view-stats')
    },
    {
      id: 'workspace',
      icon: '💼',
      title: 'Workspace',
      description: 'Plan operativo',
      color: 'from-teal-500 to-teal-600',
      action: () => onActionClick('workspace')
    },
    {
      id: 'paz-presencia',
      icon: '🧘',
      title: 'Paz/Presencia',
      description: 'Bienestar',
      color: 'from-pink-500 to-pink-600',
      action: () => onActionClick('paz-presencia')
    }
  ];

  return (
    <div className="assistant-quick-actions">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="text-2xl mr-2">⚡</span>
        Acciones Rápidas
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className={`group relative overflow-hidden p-5 bg-gradient-to-br ${action.color} rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ 
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} />
            </div>

            {/* Content */}
            <div className="relative text-white">
              <div className="text-4xl mb-3">{action.icon}</div>
              <div className="text-lg font-bold mb-1">{action.title}</div>
              <div className="text-sm opacity-90">{action.description}</div>
            </div>

            {/* Hover Arrow */}
            <div className="absolute bottom-3 right-3 text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
              →
            </div>
          </button>
        ))}
      </div>

      {/* AI Suggestion */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
        <div className="flex items-start gap-3">
          <span className="text-3xl">🤖</span>
          <div className="flex-1">
            <h4 className="font-bold text-indigo-900 mb-2">Sugerencia del Asistente</h4>
            <p className="text-sm text-gray-700">
              Basándome en tu actividad reciente, recomiendo revisar las <strong>Órdenes Rojas</strong> y actualizar el <strong>Panel Personal</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantQuickActions;
