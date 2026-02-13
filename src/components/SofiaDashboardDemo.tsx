import React, { useState } from 'react';
import { Sparkles, TrendingUp, ShieldCheck, AlertCircle, Database } from 'lucide-react';

/**
 * Dashboard de demostración con datos simulados
 * Muestra la UI completa mientras se configura Supabase
 */
const SofiaDashboardDemo: React.FC = () => {
  const [showSupabaseInfo, setShowSupabaseInfo] = useState(false);

  // Datos de demostración
  const demoStats = {
    total_incomes: 45780.50,
    total_invoices: 12,
    total_fixed_costs: 18200.00,
  };

  const demoInsight = {
    narrative: "La abundancia fluye cuando honramos el equilibrio entre dar y recibir. Hoy es un día propicio para la claridad financiera.",
    emoji: "✨",
    confidence_score: 0.87,
  };

  const demoTrendData = [
    { date: '2026-01-15', daily_profit: 850 },
    { date: '2026-01-16', daily_profit: 920 },
    { date: '2026-01-17', daily_profit: 780 },
    { date: '2026-01-18', daily_profit: 1100 },
    { date: '2026-01-19', daily_profit: 980 },
    { date: '2026-01-20', daily_profit: 1250 },
    { date: '2026-01-21', daily_profit: 1050 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light text-white mb-2">Dashboard de Sofia</h1>
              <p className="text-slate-400">Inteligencia de Abundancia en Tiempo Real</p>
            </div>
            <button
              onClick={() => setShowSupabaseInfo(!showSupabaseInfo)}
              className="px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-300 hover:bg-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Database size={18} />
              <span className="text-sm">Estado de Conexión</span>
            </button>
          </div>
        </div>

        {/* Estado de Supabase */}
        {showSupabaseInfo && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="text-amber-400 flex-shrink-0 mt-1" size={24} />
              <div className="space-y-2">
                <p className="text-amber-200 font-medium">
                  📊 Mostrando datos de demostración
                </p>
                <p className="text-slate-300 text-sm">
                  Este dashboard usa datos simulados. Para conectar con tu base de datos real:
                </p>
                <ol className="text-slate-400 text-sm space-y-1 ml-4 list-decimal">
                  <li>Verifica que las credenciales en <code className="bg-slate-800 px-2 py-0.5 rounded">.env</code> sean correctas</li>
                  <li>Crea las tablas: <code className="bg-slate-800 px-2 py-0.5 rounded">invoices</code>, <code className="bg-slate-800 px-2 py-0.5 rounded">fixed_costs</code>, <code className="bg-slate-800 px-2 py-0.5 rounded">daily_metrics</code></li>
                  <li>Descamenta <code className="bg-slate-800 px-2 py-0.5 rounded">SofiaDashboard</code> en <code className="bg-slate-800 px-2 py-0.5 rounded">App.tsx</code></li>
                </ol>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6 animate-in fade-in duration-700">
          {/* Tarjeta de Insight Diario */}
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 rounded-[2rem] border border-indigo-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="text-indigo-400" size={20} />
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
                Mensaje del Día {demoInsight.emoji}
              </span>
              <span className="ml-auto text-xs text-slate-500">
                Confianza: {(demoInsight.confidence_score * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-lg italic text-slate-200">"{demoInsight.narrative}"</p>
          </div>

          {/* Grid de Métricas Principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/[0.03] p-6 rounded-[2rem] border border-white/5 hover:border-emerald-500/30 transition-all">
              <p className="text-slate-500 text-sm mb-1">Ingresos Proyectados</p>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-4xl font-light text-white">
                  ${demoStats.total_incomes.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <p className="text-slate-400 text-sm mt-2">
                {demoStats.total_invoices} facturas registradas
              </p>
            </div>

            <div className="bg-white/[0.03] p-6 rounded-[2rem] border border-white/5 hover:border-red-500/30 transition-all">
              <p className="text-slate-500 text-sm mb-1">Gastos Fijos</p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-4xl font-light text-white">
                  ${demoStats.total_fixed_costs.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </p>
                <ShieldCheck className="text-emerald-400" size={20} />
              </div>
              <p className="text-slate-400 text-sm mt-2">
                Nómina, alquiler y servicios
              </p>
            </div>

            <div className="bg-white/[0.03] p-6 rounded-[2rem] border border-white/5 hover:border-indigo-500/30 transition-all">
              <p className="text-slate-500 text-sm mb-1">Balance Neto</p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-4xl font-light text-emerald-400">
                  ${(demoStats.total_incomes - demoStats.total_fixed_costs).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </p>
                <TrendingUp className="text-emerald-400" size={20} />
              </div>
              <p className="text-slate-400 text-sm mt-2">
                Margen: {((1 - demoStats.total_fixed_costs / demoStats.total_incomes) * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Gráfico de Tendencia Simulado */}
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2.5rem] space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-indigo-400" size={20} />
                <h3 className="text-sm font-medium text-slate-300 uppercase tracking-widest">
                  Tendencia de Abundancia (últimos 7 días)
                </h3>
              </div>
              <span className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full">
                Demo Mode
              </span>
            </div>

            <div className="h-64 flex items-end gap-2 px-4">
              {demoTrendData.map((day, idx) => {
                const maxProfit = Math.max(...demoTrendData.map(d => d.daily_profit));
                const height = (day.daily_profit / maxProfit) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="relative group">
                      <div
                        className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all hover:from-indigo-500 hover:to-indigo-300"
                        style={{ height: `${height * 2}px` }}
                      />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${day.daily_profit}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {new Date(day.date).getDate()}/{new Date(day.date).getMonth() + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
              <h3 className="text-slate-300 font-medium mb-3">🎯 Próximos Pasos</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                  Configurar tablas en Supabase
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                  Cargar datos reales de producción
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                  Activar sincronización en tiempo real
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-6 rounded-2xl">
              <h3 className="text-indigo-300 font-medium mb-3">💡 Recursos</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Database size={14} className="text-indigo-400" />
                  <a href="https://supabase.com/docs" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 transition-colors">
                    Documentación de Supabase
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles size={14} className="text-indigo-400" />
                  Ver archivo: <code className="text-xs bg-slate-800 px-1.5 py-0.5 rounded">queries.ts</code>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SofiaDashboardDemo;
