import React from 'react';

const InvestorHighlights = () => {
  const highlights = [
    {
      icon: '🎯',
      title: 'Trazabilidad Total',
      value: '100%',
      description: 'Cada orden rastreada con QR único',
      color: 'from-blue-500 to-blue-600',
      impact: 'high'
    },
    {
      icon: '⚡',
      title: 'Tiempo de Respuesta',
      value: '4.2h',
      description: 'Promedio de completitud de órdenes',
      color: 'from-green-500 to-green-600',
      impact: 'high'
    },
    {
      icon: '🌍',
      title: 'Alcance Multilingüe',
      value: '3 idiomas',
      description: 'Español, Vietnamita, Inglés',
      color: 'from-purple-500 to-purple-600',
      impact: 'medium'
    },
    {
      icon: '🤖',
      title: 'Automatización',
      value: '65%',
      description: 'Procesos automatizados',
      color: 'from-indigo-500 to-indigo-600',
      impact: 'high'
    },
    {
      icon: '🧘',
      title: 'Bienestar Integrado',
      value: '78%',
      description: 'Índice de satisfacción del equipo',
      color: 'from-pink-500 to-pink-600',
      impact: 'medium'
    },
    {
      icon: '📈',
      title: 'Escalabilidad',
      value: '10x',
      description: 'Capacidad de crecimiento proyectada',
      color: 'from-orange-500 to-orange-600',
      impact: 'high'
    }
  ];

  const getImpactBadge = (impact) => {
    switch (impact) {
      case 'high':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-semibold">Alto Impacto</span>;
      case 'medium':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-semibold">Impacto Medio</span>;
      case 'low':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">Impacto Bajo</span>;
      default:
        return null;
    }
  };

  return (
    <div className="investor-highlights">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="text-3xl mr-3">💎</span>
        Highlights para Inversores
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {highlights.map((highlight, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
          >
            {/* Header with gradient */}
            <div className={`bg-gradient-to-r ${highlight.color} p-6 text-white`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl">{highlight.icon}</span>
                {getImpactBadge(highlight.impact)}
              </div>
              <div className="text-4xl font-bold mb-2">{highlight.value}</div>
              <div className="text-sm opacity-90">{highlight.title}</div>
            </div>
            
            {/* Body */}
            <div className="p-6">
              <p className="text-gray-700">{highlight.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Investment Value Proposition */}
      <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
        <h3 className="text-xl font-bold text-indigo-900 mb-4">💰 Propuesta de Valor</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-indigo-600 mb-1">$150K</div>
            <div className="text-sm text-gray-600">Inversión inicial</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-green-600 mb-1">$450K</div>
            <div className="text-sm text-gray-600">Proyección 12 meses</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-purple-600 mb-1">3x ROI</div>
            <div className="text-sm text-gray-600">Retorno estimado</div>
          </div>
        </div>
      </div>

      {/* Competitive Advantages */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🏆 Ventajas Competitivas</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <span className="text-green-500 text-xl mr-3">✓</span>
            <p className="text-gray-700"><strong>Event Sourcing:</strong> Auditoría completa e inmutable de todas las operaciones</p>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 text-xl mr-3">✓</span>
            <p className="text-gray-700"><strong>Multilingüe Nativo:</strong> Interfaz adaptada culturalmente para equipos vietnamitas</p>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 text-xl mr-3">✓</span>
            <p className="text-gray-700"><strong>IA Integrada:</strong> Asistente inteligente con análisis predictivo y sugerencias contextuales</p>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 text-xl mr-3">✓</span>
            <p className="text-gray-700"><strong>Bienestar Medible:</strong> Métricas de satisfacción y balance vida-trabajo integradas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorHighlights;
