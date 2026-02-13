import React from 'react';

const KPIExecutivePanel = ({ metrics }) => {
  const kpis = [
    {
      key: 'readinessScore',
      label: 'Readiness Score',
      value: metrics.readinessScore,
      unit: '%',
      target: 70,
      icon: '🎯',
      color: metrics.readinessScore >= 70 ? 'green' : 'orange'
    },
    {
      key: 'ordersProcessed',
      label: 'Órdenes Procesadas',
      value: metrics.ordersProcessed,
      unit: '',
      target: 100,
      icon: '📦',
      color: 'blue'
    },
    {
      key: 'redOrders',
      label: 'Órdenes Rojas',
      value: metrics.redOrders,
      unit: '',
      target: 5,
      icon: '🔴',
      color: metrics.redOrders <= 5 ? 'green' : 'red',
      inverse: true // Lower is better
    },
    {
      key: 'completionRate',
      label: 'Tasa de Completitud',
      value: metrics.completionRate,
      unit: '%',
      target: 85,
      icon: '✅',
      color: metrics.completionRate >= 85 ? 'green' : 'orange'
    },
    {
      key: 'avgCompletionTime',
      label: 'Tiempo Promedio',
      value: metrics.avgCompletionTime,
      unit: 'h',
      target: 4,
      icon: '⏱️',
      color: metrics.avgCompletionTime <= 4 ? 'green' : 'orange',
      inverse: true
    },
    {
      key: 'vietnamTeamSentiment',
      label: 'Sentiment Equipo VN',
      value: metrics.vietnamTeamSentiment,
      unit: '%',
      target: 75,
      icon: '🇻🇳',
      color: metrics.vietnamTeamSentiment >= 75 ? 'green' : 'orange'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: 'from-green-500 to-green-600',
      blue: 'from-blue-500 to-blue-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600',
      purple: 'from-purple-500 to-purple-600'
    };
    return colors[color] || colors.blue;
  };

  const getStatusIcon = (kpi) => {
    let isOnTarget;
    if (kpi.inverse) {
      isOnTarget = kpi.value <= kpi.target;
    } else {
      isOnTarget = kpi.value >= kpi.target;
    }
    
    return isOnTarget ? '✓' : '⚠️';
  };

  const getStatusColor = (kpi) => {
    let isOnTarget;
    if (kpi.inverse) {
      isOnTarget = kpi.value <= kpi.target;
    } else {
      isOnTarget = kpi.value >= kpi.target;
    }
    
    return isOnTarget ? 'text-green-600' : 'text-orange-600';
  };

  return (
    <div className="kpi-executive-panel">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.key}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            {/* Gradient Header */}
            <div className={`bg-gradient-to-r ${getColorClasses(kpi.color)} p-6 text-white relative overflow-hidden`}>
              <div className="absolute top-0 right-0 text-8xl opacity-10 transform translate-x-4 -translate-y-4">
                {kpi.icon}
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{kpi.icon}</span>
                  <span className={`text-2xl ${getStatusColor(kpi)}`}>
                    {getStatusIcon(kpi)}
                  </span>
                </div>
                
                <div className="text-5xl font-bold mb-2">
                  {kpi.value}{kpi.unit}
                </div>
                
                <div className="text-sm opacity-90">
                  {kpi.label}
                </div>
              </div>
            </div>
            
            {/* Target Info */}
            <div className="p-4 bg-gray-50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Objetivo: {kpi.inverse ? '≤' : '≥'} {kpi.target}{kpi.unit}
                </span>
                <span className={`font-semibold ${getStatusColor(kpi)}`}>
                  {getStatusIcon(kpi) === '✓' ? 'Cumplido' : 'En progreso'}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`bg-gradient-to-r ${getColorClasses(kpi.color)} h-full transition-all duration-500`}
                  style={{ 
                    width: `${kpi.inverse 
                      ? Math.max(0, ((kpi.target - kpi.value) / kpi.target) * 100) 
                      : Math.min(100, (kpi.value / kpi.target) * 100)}%` 
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Global Status */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="text-2xl mr-3">📊</span>
          Estado Global del Sistema
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-600">
              {kpis.filter(k => (k.inverse ? k.value <= k.target : k.value >= k.target)).length}
            </div>
            <div className="text-sm text-gray-600">KPIs Cumplidos</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="text-2xl font-bold text-orange-600">
              {kpis.filter(k => (k.inverse ? k.value > k.target : k.value < k.target)).length}
            </div>
            <div className="text-sm text-gray-600">KPIs en Progreso</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((kpis.filter(k => (k.inverse ? k.value <= k.target : k.value >= k.target)).length / kpis.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Tasa de Cumplimiento</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIExecutivePanel;
