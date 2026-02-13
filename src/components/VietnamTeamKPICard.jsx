import React, { useState, useEffect } from 'react';

const VietnamTeamKPICard = () => {
  const [kpis, setKpis] = useState({
    sentimentScore: 78,
    interfaceUsage: 85,
    ordersAssignedVN: 92,
    communicationQuality: 82,
    culturalAlignment: 88
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadKPIs();
  }, []);

  const loadKPIs = async () => {
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setKpis({
        sentimentScore: 70 + Math.floor(Math.random() * 20),
        interfaceUsage: 75 + Math.floor(Math.random() * 20),
        ordersAssignedVN: 85 + Math.floor(Math.random() * 15),
        communicationQuality: 75 + Math.floor(Math.random() * 15),
        culturalAlignment: 80 + Math.floor(Math.random() * 15)
      });
      setLoading(false);
    }, 800);
  };

  const getGradient = (value, threshold) => {
    if (value >= threshold) return 'from-green-500 to-emerald-500';
    if (value >= threshold * 0.8) return 'from-yellow-500 to-orange-500';
    return 'from-orange-500 to-red-500';
  };

  const getTextColor = (value, threshold) => {
    if (value >= threshold) return 'text-green-700';
    if (value >= threshold * 0.8) return 'text-orange-700';
    return 'text-red-700';
  };

  return (
    <div className="vietnam-team-kpi-card bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="text-3xl mr-3">🇻🇳</span>
          KPIs Equipo Vietnam
        </h3>
        <button
          onClick={loadKPIs}
          disabled={loading}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-semibold disabled:bg-gray-400"
        >
          {loading ? '⏳' : '🔄'} Actualizar
        </button>
      </div>

      {/* Main Sentiment Score */}
      <div className={`mb-6 p-6 rounded-xl bg-gradient-to-r ${getGradient(kpis.sentimentScore, 75)} text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-90 mb-1">SENTIMENT SCORE</div>
            <div className="text-6xl font-bold">{kpis.sentimentScore}%</div>
            <div className="text-sm mt-2 opacity-90">
              Objetivo: ≥ 75% {kpis.sentimentScore >= 75 && '✓'}
            </div>
          </div>
          <div className="text-8xl opacity-20">😊</div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Interface Usage */}
        <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
          <div className="text-3xl mb-2">🌐</div>
          <div className={`text-4xl font-bold ${getTextColor(kpis.interfaceUsage, 80)}`}>
            {kpis.interfaceUsage}%
          </div>
          <div className="text-sm text-gray-700 font-semibold mt-2">
            Uso Interfaz Vietnamita
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Objetivo: ≥ 80%
            {kpis.interfaceUsage >= 80 && <span className="ml-1 text-green-600 font-bold">✓</span>}
          </div>
          
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all"
              style={{ width: `${Math.min(kpis.interfaceUsage, 100)}%` }}
            />
          </div>
        </div>

        {/* Orders Assigned */}
        <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200">
          <div className="text-3xl mb-2">📦</div>
          <div className="text-4xl font-bold text-purple-700">
            {kpis.ordersAssignedVN}%
          </div>
          <div className="text-sm text-gray-700 font-semibold mt-2">
            Órdenes Asignadas VN
          </div>
          <div className="text-xs text-gray-600 mt-1">
            De total de órdenes activas
          </div>
          
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-full transition-all"
              style={{ width: `${Math.min(kpis.ordersAssignedVN, 100)}%` }}
            />
          </div>
        </div>

        {/* Communication Quality */}
        <div className="p-5 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg border-2 border-teal-200">
          <div className="text-3xl mb-2">💬</div>
          <div className={`text-4xl font-bold ${getTextColor(kpis.communicationQuality, 75)}`}>
            {kpis.communicationQuality}%
          </div>
          <div className="text-sm text-gray-700 font-semibold mt-2">
            Calidad Comunicación
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Claridad mensajes + respuestas
          </div>
          
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-teal-500 to-teal-600 h-full transition-all"
              style={{ width: `${Math.min(kpis.communicationQuality, 100)}%` }}
            />
          </div>
        </div>

        {/* Cultural Alignment */}
        <div className="p-5 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border-2 border-pink-200">
          <div className="text-3xl mb-2">🎎</div>
          <div className={`text-4xl font-bold ${getTextColor(kpis.culturalAlignment, 80)}`}>
            {kpis.culturalAlignment}%
          </div>
          <div className="text-sm text-gray-700 font-semibold mt-2">
            Alineación Cultural
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Adaptación sistema a cultura VN
          </div>
          
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-pink-500 to-pink-600 h-full transition-all"
              style={{ width: `${Math.min(kpis.culturalAlignment, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="mt-6 p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
        <h4 className="font-bold text-emerald-900 mb-4 flex items-center">
          <span className="text-xl mr-2">👥</span>
          Miembros Activos
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-2xl mb-1">👤</div>
            <div className="text-xs text-gray-600">Nguyễn Văn An</div>
            <div className="text-sm font-bold text-emerald-700">95% activo</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-2xl mb-1">👤</div>
            <div className="text-xs text-gray-600">Trần Thị Bình</div>
            <div className="text-sm font-bold text-emerald-700">88% activo</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-2xl mb-1">👤</div>
            <div className="text-xs text-gray-600">Lê Minh Cường</div>
            <div className="text-sm font-bold text-emerald-700">92% activo</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-2xl mb-1">➕</div>
            <div className="text-xs text-gray-600">Otros</div>
            <div className="text-sm font-bold text-emerald-700">7 más</div>
          </div>
        </div>
      </div>

      {/* TET Celebration */}
      <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg border-2 border-red-200">
        <div className="flex items-center gap-4">
          <div className="text-5xl">🎊</div>
          <div className="flex-1">
            <h4 className="font-bold text-red-900 mb-1">Próximo: Tết Nguyên Đán 2026</h4>
            <p className="text-sm text-gray-700">
              Sistema multilingüe en producción. Interfaz vietnamita validada por el equipo.
            </p>
            <p className="text-sm font-semibold text-red-700 mt-2">
              Chúc mừng năm mới! 🎊
            </p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h4 className="font-bold text-blue-900 mb-3 flex items-center">
          <span className="text-xl mr-2">💡</span>
          Insights Clave
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Alta adopción de interfaz vietnamita (+85%)</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Sentiment positivo del equipo Vietnam</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">→</span>
            <span>Oportunidad: Expandir capacitación en QR scanning</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VietnamTeamKPICard;
