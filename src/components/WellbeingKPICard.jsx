import React, { useState, useEffect } from 'react';

const WellbeingKPICard = () => {
  const [kpis, setKpis] = useState({
    pazInterior: 78,
    horasPresencia: 65,
    impactoAutomatizacion: 40,
    mindfulnessGain: 22
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
        pazInterior: 70 + Math.floor(Math.random() * 20),
        horasPresencia: 55 + Math.floor(Math.random() * 25),
        impactoAutomatizacion: 30 + Math.floor(Math.random() * 20),
        mindfulnessGain: 15 + Math.floor(Math.random() * 15)
      });
      setLoading(false);
    }, 800);
  };

  const getGradient = (value, threshold) => {
    if (value >= threshold) return 'from-green-500 to-teal-500';
    if (value >= threshold * 0.8) return 'from-yellow-500 to-orange-500';
    return 'from-orange-500 to-red-500';
  };

  const getTextColor = (value, threshold) => {
    if (value >= threshold) return 'text-green-700';
    if (value >= threshold * 0.8) return 'text-orange-700';
    return 'text-red-700';
  };

  return (
    <div className="wellbeing-kpi-card bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="text-3xl mr-3">🧘</span>
          KPIs de Bienestar
        </h3>
        <button
          onClick={loadKPIs}
          disabled={loading}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm font-semibold disabled:bg-gray-400"
        >
          {loading ? '⏳' : '🔄'} Actualizar
        </button>
      </div>

      {/* Main Paz Interior */}
      <div className={`mb-6 p-6 rounded-xl bg-gradient-to-r ${getGradient(kpis.pazInterior, 75)} text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-90 mb-1">PAZ INTERIOR INDEX</div>
            <div className="text-6xl font-bold">{kpis.pazInterior}%</div>
            <div className="text-sm mt-2 opacity-90">
              Objetivo: ≥ 75% {kpis.pazInterior >= 75 && '✓'}
            </div>
          </div>
          <div className="text-8xl opacity-20">🧘</div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Horas Presencia */}
        <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200">
          <div className="text-3xl mb-2">⏰</div>
          <div className={`text-4xl font-bold ${getTextColor(kpis.horasPresencia, 60)}`}>
            {kpis.horasPresencia}%
          </div>
          <div className="text-sm text-gray-700 font-semibold mt-2">
            Horas Presencia
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Objetivo: ≥ 60%
            {kpis.horasPresencia >= 60 && <span className="ml-1 text-green-600 font-bold">✓</span>}
          </div>
          
          {/* Mini Progress Bar */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-full transition-all"
              style={{ width: `${Math.min(kpis.horasPresencia, 100)}%` }}
            />
          </div>
        </div>

        {/* Impacto Automatización */}
        <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
          <div className="text-3xl mb-2">🤖</div>
          <div className="text-4xl font-bold text-blue-700">
            {kpis.impactoAutomatizacion}%
          </div>
          <div className="text-sm text-gray-700 font-semibold mt-2">
            Impacto Automatización
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Reducción tareas manuales
          </div>
          
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all"
              style={{ width: `${Math.min(kpis.impactoAutomatizacion, 100)}%` }}
            />
          </div>
        </div>

        {/* Mindfulness Gain */}
        <div className="p-5 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border-2 border-pink-200">
          <div className="text-3xl mb-2">🌸</div>
          <div className="text-4xl font-bold text-pink-700">
            +{kpis.mindfulnessGain}%
          </div>
          <div className="text-sm text-gray-700 font-semibold mt-2">
            Mindfulness Gain
          </div>
          <div className="text-xs text-gray-600 mt-1">
            vs baseline inicial
          </div>
          
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-pink-500 to-pink-600 h-full transition-all"
              style={{ width: `${Math.min(kpis.mindfulnessGain * 2, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Wellbeing Practices */}
      <div className="mt-6 p-5 bg-gradient-to-r from-teal-50 to-green-50 rounded-lg border border-teal-200">
        <h4 className="font-bold text-teal-900 mb-4 flex items-center">
          <span className="text-xl mr-2">🌱</span>
          Prácticas Activas
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-lg shadow-sm text-center">
            <div className="text-2xl mb-1">🧘</div>
            <div className="text-xs text-gray-600">Meditación Diaria</div>
            <div className="text-sm font-bold text-teal-700">15 min</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm text-center">
            <div className="text-2xl mb-1">🌬️</div>
            <div className="text-xs text-gray-600">Respiración</div>
            <div className="text-sm font-bold text-teal-700">3x/día</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm text-center">
            <div className="text-2xl mb-1">📝</div>
            <div className="text-xs text-gray-600">Journaling</div>
            <div className="text-sm font-bold text-teal-700">80%</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm text-center">
            <div className="text-2xl mb-1">🙏</div>
            <div className="text-xs text-gray-600">Gratitud</div>
            <div className="text-sm font-bold text-teal-700">Diaria</div>
          </div>
        </div>
      </div>

      {/* Projection */}
      <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <h4 className="font-bold text-purple-900 mb-3 flex items-center">
          <span className="text-xl mr-2">🔮</span>
          Proyección 6 Meses
        </h4>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div>
            <div className="text-green-600 font-bold">↑ 90%</div>
            <div className="text-gray-600">Paz Interior</div>
          </div>
          <div>
            <div className="text-green-600 font-bold">↑ 80%</div>
            <div className="text-gray-600">Presencia</div>
          </div>
          <div>
            <div className="text-green-600 font-bold">↑ +35%</div>
            <div className="text-gray-600">Mindfulness</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellbeingKPICard;
