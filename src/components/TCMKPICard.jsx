import React, { useState, useEffect } from 'react';

const TCMKPICard = () => {
  const [kpis, setKpis] = useState({
    qiScore: 75,
    yinYangBalance: 68,
    blockedElements: 1,
    energyLeaks: 2,
    meridianFlow: 82
  });

  const [elements, setElements] = useState({
    fire: 78,    // Fuego (火) - Heart, passion
    earth: 82,   // Tierra (土) - Spleen, stability
    metal: 71,   // Metal (金) - Lungs, precision
    water: 65,   // Agua (水) - Kidneys, wisdom
    wood: 88     // Madera (木) - Liver, growth
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
        qiScore: 65 + Math.floor(Math.random() * 25),
        yinYangBalance: 60 + Math.floor(Math.random() * 30),
        blockedElements: Math.floor(Math.random() * 3),
        energyLeaks: Math.floor(Math.random() * 4),
        meridianFlow: 75 + Math.floor(Math.random() * 20)
      });
      
      setElements({
        fire: 65 + Math.floor(Math.random() * 30),
        earth: 70 + Math.floor(Math.random() * 25),
        metal: 60 + Math.floor(Math.random() * 30),
        water: 60 + Math.floor(Math.random() * 30),
        wood: 75 + Math.floor(Math.random() * 20)
      });
      
      setLoading(false);
    }, 800);
  };

  const getGradient = (value, threshold) => {
    if (value >= threshold) return 'from-green-500 to-emerald-500';
    if (value >= threshold * 0.8) return 'from-yellow-500 to-orange-500';
    return 'from-orange-500 to-red-500';
  };

  const getElementColor = (element) => {
    const colors = {
      fire: 'from-red-500 to-orange-500',
      earth: 'from-yellow-500 to-amber-500',
      metal: 'from-gray-400 to-gray-500',
      water: 'from-blue-500 to-cyan-500',
      wood: 'from-green-500 to-emerald-500'
    };
    return colors[element];
  };

  const getElementIcon = (element) => {
    const icons = {
      fire: '🔥',
      earth: '⛰️',
      metal: '🔩',
      water: '💧',
      wood: '🌲'
    };
    return icons[element];
  };

  const getElementName = (element) => {
    const names = {
      fire: 'Fuego (火)',
      earth: 'Tierra (土)',
      metal: 'Metal (金)',
      water: 'Agua (水)',
      wood: 'Madera (木)'
    };
    return names[element];
  };

  const getElementOrgan = (element) => {
    const organs = {
      fire: 'Corazón',
      earth: 'Bazo',
      metal: 'Pulmones',
      water: 'Riñones',
      wood: 'Hígado'
    };
    return organs[element];
  };

  const blockedElementsList = Object.entries(elements).filter(([, value]) => value < 70);

  return (
    <div className="tcm-kpi-card bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="text-3xl mr-3">☯️</span>
          KPIs Medicina Tradicional China
        </h3>
        <button
          onClick={loadKPIs}
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors text-sm font-semibold disabled:bg-gray-400"
        >
          {loading ? '⏳' : '🔄'} Actualizar
        </button>
      </div>

      {/* Main Qi Score */}
      <div className={`mb-6 p-6 rounded-xl bg-gradient-to-r ${getGradient(kpis.qiScore, 70)} text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-90 mb-1">QI SCORE (氣)</div>
            <div className="text-6xl font-bold">{kpis.qiScore}%</div>
            <div className="text-sm mt-2 opacity-90">
              Objetivo: ≥ 70% {kpis.qiScore >= 70 && '✓'}
            </div>
          </div>
          <div className="text-8xl opacity-20">☯️</div>
        </div>
      </div>

      {/* Balance Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Yin-Yang Balance */}
        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200">
          <div className="text-2xl mb-2">☯️</div>
          <div className="text-3xl font-bold text-purple-700">{kpis.yinYangBalance}%</div>
          <div className="text-xs text-gray-700 font-semibold">Yin-Yang Balance</div>
        </div>

        {/* Blocked Elements */}
        <div className={`p-4 bg-gradient-to-br rounded-lg border-2 ${
          kpis.blockedElements === 0 
            ? 'from-green-50 to-green-100 border-green-200' 
            : 'from-orange-50 to-orange-100 border-orange-200'
        }`}>
          <div className="text-2xl mb-2">🚫</div>
          <div className={`text-3xl font-bold ${kpis.blockedElements === 0 ? 'text-green-700' : 'text-orange-700'}`}>
            {kpis.blockedElements}
          </div>
          <div className="text-xs text-gray-700 font-semibold">Elementos Bloqueados</div>
        </div>

        {/* Energy Leaks */}
        <div className={`p-4 bg-gradient-to-br rounded-lg border-2 ${
          kpis.energyLeaks === 0 
            ? 'from-green-50 to-green-100 border-green-200' 
            : 'from-yellow-50 to-yellow-100 border-yellow-200'
        }`}>
          <div className="text-2xl mb-2">💨</div>
          <div className={`text-3xl font-bold ${kpis.energyLeaks === 0 ? 'text-green-700' : 'text-yellow-700'}`}>
            {kpis.energyLeaks}
          </div>
          <div className="text-xs text-gray-700 font-semibold">Fugas de Energía</div>
        </div>

        {/* Meridian Flow */}
        <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg border-2 border-teal-200">
          <div className="text-2xl mb-2">🌊</div>
          <div className="text-3xl font-bold text-teal-700">{kpis.meridianFlow}%</div>
          <div className="text-xs text-gray-700 font-semibold">Flujo Meridiano</div>
        </div>
      </div>

      {/* Five Elements */}
      <div className="mb-6">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center">
          <span className="text-xl mr-2">🌟</span>
          Cinco Elementos (五行)
        </h4>
        
        <div className="space-y-3">
          {Object.entries(elements).map(([element, value]) => (
            <div key={element}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getElementIcon(element)}</span>
                  <div>
                    <div className="font-semibold text-gray-800">{getElementName(element)}</div>
                    <div className="text-xs text-gray-600">{getElementOrgan(element)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${value >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                    {value}%
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className={`bg-gradient-to-r ${getElementColor(element)} h-full transition-all duration-500`}
                  style={{ width: `${Math.min(value, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blocked Elements Alert */}
      {blockedElementsList.length > 0 && (
        <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-300 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h4 className="font-bold text-orange-900 mb-2">Elementos que Requieren Atención</h4>
              <ul className="space-y-1 text-sm text-orange-800">
                {blockedElementsList.map(([element, value]) => (
                  <li key={element}>
                    <strong>{getElementName(element)}</strong>: {value}% (objetivo: ≥70%)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TCM Practices */}
      <div className="p-5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
        <h4 className="font-bold text-amber-900 mb-4 flex items-center">
          <span className="text-xl mr-2">🎋</span>
          Prácticas Recomendadas
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-2xl mb-1">🧘</div>
            <div className="text-xs text-gray-600 font-semibold">Qi Gong</div>
            <div className="text-xs text-gray-500">20 min/día</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-2xl mb-1">🍵</div>
            <div className="text-xs text-gray-600 font-semibold">Té Verde</div>
            <div className="text-xs text-gray-500">3 tazas/día</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-2xl mb-1">💆</div>
            <div className="text-xs text-gray-600 font-semibold">Acupresión</div>
            <div className="text-xs text-gray-500">Puntos clave</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-2xl mb-1">🌙</div>
            <div className="text-xs text-gray-600 font-semibold">Sueño Reparador</div>
            <div className="text-xs text-gray-500">7-8 horas</div>
          </div>
        </div>
      </div>

      {/* Philosophical Quote */}
      <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
        <p className="text-center text-gray-700 italic text-sm">
          "El sabio armoniza los cinco elementos, equilibra Yin y Yang, y fluye con el Tao. No fuerza, no resiste. Simplemente es."
          <span className="block mt-2 text-indigo-600 font-semibold">— Tao Te Ching</span>
        </p>
      </div>
    </div>
  );
};

export default TCMKPICard;
