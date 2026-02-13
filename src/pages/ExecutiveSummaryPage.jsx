import React, { useState } from 'react';
import InvestorHighlights from '../components/InvestorHighlights';
import KPIExecutivePanel from '../components/KPIExecutivePanel';

const ExecutiveSummaryPage = () => {
  const [exportLoading, setExportLoading] = useState(false);

  const executiveSummary = {
    vision: "Transformar la operación de Serendipity Bros en un ecosistema digital autónomo que integra mindfulness, tecnología y eficiencia operativa.",
    mission: "Implementar el Protocolo TET (Tết Nguyên Đán 2026) como piloto de un sistema de gestión de órdenes inteligente con trazabilidad QR, interfaz multilingüe (ES/VN/EN) y análisis de bienestar integrado.",
    currentPhase: "Fase Alfa - Prueba Piloto TET (13 de febrero de 2026)",
    keyMetrics: {
      readinessScore: 72,
      ordersProcessed: 156,
      redOrders: 8,
      completionRate: 87,
      avgCompletionTime: 4.2,
      vietnamTeamSentiment: 78
    }
  };

  const handleExportPDF = () => {
    setExportLoading(true);
    
    // Mock PDF export
    setTimeout(() => {
      console.log('📊 Exportando Executive Report en PDF...');
      alert('✅ Executive Report exportado exitosamente (función mock)');
      setExportLoading(false);
    }, 2000);
  };

  return (
    <div className="executive-summary-page min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-indigo-500">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                📊 Executive Summary Report
              </h1>
              <p className="text-gray-600 text-lg">
                Serendipity Bros - El Mediador de Sofía
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Generado: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <button
              onClick={handleExportPDF}
              disabled={exportLoading}
              className={`px-6 py-3 rounded-lg font-semibold text-white transition-all ${
                exportLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
              }`}
            >
              {exportLoading ? '⏳ Exportando...' : '📄 Exportar PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="max-w-7xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
            <span className="text-2xl mr-2">🔭</span> Visión
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {executiveSummary.vision}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
            <span className="text-2xl mr-2">🎯</span> Misión
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {executiveSummary.mission}
          </p>
        </div>
      </div>

      {/* Current Phase */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2 flex items-center">
            <span className="text-3xl mr-3">🚀</span> Fase Actual
          </h2>
          <p className="text-xl font-semibold">
            {executiveSummary.currentPhase}
          </p>
          <div className="mt-4 bg-white/20 rounded-lg p-4">
            <p className="text-sm">
              <strong>Objetivo:</strong> Validar el sistema de órdenes con QR, interfaz multilingüe y métricas de bienestar durante el período festivo de Tết Nguyên Đán.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Executive Panel */}
      <div className="max-w-7xl mx-auto mb-8">
        <KPIExecutivePanel metrics={executiveSummary.keyMetrics} />
      </div>

      {/* Investor Highlights */}
      <div className="max-w-7xl mx-auto mb-8">
        <InvestorHighlights />
      </div>

      {/* Strategic Insights */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-3">💡</span> Insights Estratégicos
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <h3 className="font-bold text-green-800 mb-2">✅ Fortalezas Clave</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Trazabilidad QR implementada exitosamente</li>
                <li>Sistema de semáforo visual intuitivo (rojo/amarillo/verde)</li>
                <li>Interfaz vietnamita funcional con alta aceptación del equipo</li>
                <li>Event Sourcing garantiza auditoría completa</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <h3 className="font-bold text-yellow-800 mb-2">⚠️ Áreas de Mejora</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Reducir el número de órdenes rojas (actualmente: {executiveSummary.keyMetrics.redOrders})</li>
                <li>Aumentar Readiness Score a ≥ 85%</li>
                <li>Optimizar tiempo promedio de completitud (objetivo: &lt; 4 horas)</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <h3 className="font-bold text-blue-800 mb-2">🔮 Proyección a 6 Meses</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Escalabilidad a 500+ órdenes mensuales</li>
                <li>Integración con ERP externo (opcional)</li>
                <li>Machine Learning para predicción de tiempos</li>
                <li>Expansión a otros clientes de Serendipity Bros</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Thesis */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl shadow-lg p-6 border border-purple-200">
          <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
            <span className="text-3xl mr-3">💎</span> Tesis de Inversión
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-3xl font-bold text-purple-600 mb-2">3x</div>
              <div className="text-sm text-gray-600">ROI proyectado en 12 meses</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-3xl font-bold text-indigo-600 mb-2">40%</div>
              <div className="text-sm text-gray-600">Reducción en tiempo operativo</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-3xl font-bold text-pink-600 mb-2">85%</div>
              <div className="text-sm text-gray-600">Satisfacción del equipo Vietnam</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white/60 rounded-lg">
            <p className="text-gray-700 italic text-center">
              "El Mediador de Sofía no es solo un sistema de gestión de órdenes. Es una plataforma de transformación cultural que integra eficiencia operativa con bienestar consciente."
            </p>
            <p className="text-purple-700 font-semibold text-center mt-2">
              — Santiago Campanera, Founder
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummaryPage;
