import React, { useState, useEffect } from 'react';

const OperationalKPICard = () => {
  const [kpis, setKpis] = useState({
    readinessScore: 72,
    totalOrders: 156,
    redOrders: 8,
    overdueOrders: 3,
    avgCompletionTime: 4.2,
    completionRate: 87
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadKPIs();
  }, []);

  const loadKPIs = async () => {
    setLoading(true);
    // Mock API call - in production, fetch from backend
    setTimeout(() => {
      // Simulated data with slight variations
      setKpis({
        readinessScore: 70 + Math.floor(Math.random() * 15),
        totalOrders: 150 + Math.floor(Math.random() * 20),
        redOrders: 5 + Math.floor(Math.random() * 8),
        overdueOrders: Math.floor(Math.random() * 5),
        avgCompletionTime: 3.5 + Math.random() * 1.5,
        completionRate: 80 + Math.floor(Math.random() * 15)
      });
      setLoading(false);
    }, 800);
  };

  const getScoreColor = (score, threshold) => {
    if (score >= threshold) return 'text-green-600';
    if (score >= threshold * 0.8) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBg = (score, threshold) => {
    if (score >= threshold) return 'from-green-500 to-green-600';
    if (score >= threshold * 0.8) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="operational-kpi-card bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="text-3xl mr-3">⚙️</span>
          KPIs Operacionales
        </h3>
        <button
          onClick={loadKPIs}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold disabled:bg-gray-400"
        >
          {loading ? '⏳' : '🔄'} Actualizar
        </button>
      </div>

      {/* Main Readiness Score */}
      <div className={`mb-6 p-6 rounded-xl bg-gradient-to-r ${getScoreBg(kpis.readinessScore, 70)} text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-90 mb-1">READINESS SCORE</div>
            <div className="text-6xl font-bold">{kpis.readinessScore}%</div>
            <div className="text-sm mt-2 opacity-90">
              Objetivo: ≥ 70% {kpis.readinessScore >= 70 && '✓'}
            </div>
          </div>
          <div className="text-8xl opacity-20">🎯</div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Total Orders */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
          <div className="text-2xl mb-2">📦</div>
          <div className="text-3xl font-bold text-blue-700">{kpis.totalOrders}</div>
          <div className="text-sm text-gray-700 font-semibold">Órdenes Totales</div>
        </div>

        {/* Red Orders */}
        <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border-2 border-red-200">
          <div className="text-2xl mb-2">🔴</div>
          <div className={`text-3xl font-bold ${kpis.redOrders <= 5 ? 'text-green-700' : 'text-red-700'}`}>
            {kpis.redOrders}
          </div>
          <div className="text-sm text-gray-700 font-semibold">
            Órdenes Rojas
            {kpis.redOrders <= 5 && <span className="ml-1 text-green-600">✓</span>}
          </div>
        </div>

        {/* Overdue Orders */}
        <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-2 border-orange-200">
          <div className="text-2xl mb-2">⏰</div>
          <div className={`text-3xl font-bold ${kpis.overdueOrders === 0 ? 'text-green-700' : 'text-orange-700'}`}>
            {kpis.overdueOrders}
          </div>
          <div className="text-sm text-gray-700 font-semibold">Órdenes Vencidas</div>
        </div>

        {/* Avg Completion Time */}
        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200">
          <div className="text-2xl mb-2">⏱️</div>
          <div className={`text-3xl font-bold ${getScoreColor(kpis.avgCompletionTime <= 4, true)}`}>
            {kpis.avgCompletionTime.toFixed(1)}h
          </div>
          <div className="text-sm text-gray-700 font-semibold">
            Tiempo Promedio
            {kpis.avgCompletionTime <= 4 && <span className="ml-1 text-green-600">✓</span>}
          </div>
        </div>

        {/* Completion Rate */}
        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-200">
          <div className="text-2xl mb-2">✅</div>
          <div className={`text-3xl font-bold ${getScoreColor(kpis.completionRate, 85)}`}>
            {kpis.completionRate}%
          </div>
          <div className="text-sm text-gray-700 font-semibold">
            % Completadas
            {kpis.completionRate >= 85 && <span className="ml-1 text-green-600">✓</span>}
          </div>
        </div>

        {/* Health Indicator */}
        <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg border-2 border-teal-200">
          <div className="text-2xl mb-2">💚</div>
          <div className="text-2xl font-bold text-teal-700">
            {kpis.readinessScore >= 70 && kpis.redOrders <= 5 ? 'SALUDABLE' : 'ATENCIÓN'}
          </div>
          <div className="text-sm text-gray-700 font-semibold">Estado Sistema</div>
        </div>
      </div>

      {/* Trends Indicator */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
        <h4 className="font-bold text-indigo-900 mb-3">📈 Tendencias</h4>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div>
            <div className="text-green-600 font-bold">↑ +5%</div>
            <div className="text-gray-600">Readiness</div>
          </div>
          <div>
            <div className="text-green-600 font-bold">↓ -20%</div>
            <div className="text-gray-600">Órdenes Rojas</div>
          </div>
          <div>
            <div className="text-green-600 font-bold">↑ +12%</div>
            <div className="text-gray-600">Completitud</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationalKPICard;
