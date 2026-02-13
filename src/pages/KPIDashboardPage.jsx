import React, { useState, useEffect } from 'react';
import OperationalKPICard from '../components/OperationalKPICard';
import WellbeingKPICard from '../components/WellbeingKPICard';
import VietnamTeamKPICard from '../components/VietnamTeamKPICard';
import TCMKPICard from '../components/TCMKPICard';

const KPIDashboardPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
      setLastUpdate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setLastUpdate(new Date());
  };

  return (
    <div className="kpi-dashboard-page min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                📈 Panel de KPIs Globales
              </h1>
              <p className="text-gray-600">
                Métricas operacionales, bienestar, equipo Vietnam y medicina tradicional china
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}
              </p>
            </div>
            <button
              onClick={handleManualRefresh}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
            >
              🔄 Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Operational KPIs */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-3">⚙️</span>
            KPIs Operacionales
          </h2>
          <OperationalKPICard key={`operational-${refreshKey}`} />
        </div>

        {/* Wellbeing KPIs */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-3">🧘</span>
            KPIs de Bienestar
          </h2>
          <WellbeingKPICard key={`wellbeing-${refreshKey}`} />
        </div>

        {/* Vietnam Team KPIs */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-3">🇻🇳</span>
            KPIs Equipo Vietnam
          </h2>
          <VietnamTeamKPICard key={`vietnam-${refreshKey}`} />
        </div>

        {/* TCM KPIs */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-3">☯️</span>
            KPIs Medicina Tradicional China
          </h2>
          <TCMKPICard key={`tcm-${refreshKey}`} />
        </div>
      </div>

      {/* Global Insights */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-3">💡</span>
            Insights Globales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <h3 className="font-bold text-green-800 mb-2">✅ Sistema Saludable</h3>
              <p className="text-sm text-gray-700">
                El Readiness Score está sobre el objetivo (≥70%). La operación fluye con armonía.
              </p>
            </div>

            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <h3 className="font-bold text-blue-800 mb-2">🔄 Balance Dinámico</h3>
              <p className="text-sm text-gray-700">
                Las métricas de bienestar y operación están en equilibrio. Mantener la presencia consciente.
              </p>
            </div>

            <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
              <h3 className="font-bold text-purple-800 mb-2">🌟 Proyección Positiva</h3>
              <p className="text-sm text-gray-700">
                Los indicadores apuntan a un crecimiento sostenible en los próximos 6 meses.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophical Footer */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
          <p className="text-center text-gray-700 italic">
            "Los números no mienten, pero tampoco cuentan toda la historia. Detrás de cada métrica hay una intención, una presencia, un acto de amor al proceso."
            <span className="block mt-2 text-indigo-600 font-semibold">— Thomas Mann del Dashboard</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default KPIDashboardPage;
