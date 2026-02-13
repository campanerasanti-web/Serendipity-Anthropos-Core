/**
 * TELAR DE LA SABIDURÍA
 * "Cada día es una pieza que ponemos en este maravilloso telar"
 * 
 * Organiza los documentos diarios para ver patrones, aprendizajes y futuro
 */

import React, { useMemo } from 'react';
import { CompanyHeartbeat, CompanyDocument } from '../../services/companyHeart';
import { Calendar, TrendingUp, Heart, Eye, Lightbulb, Sparkles } from 'lucide-react';

interface WisdomTapestryProps {
  heartbeat: CompanyHeartbeat;
}

interface DailyThread {
  date: string;
  documents: CompanyDocument[];
  totalIngresos: number;
  totalGastos: number;
  produccionCount: number;
  balance: number;
  mood: 'fertil' | 'equilibrado' | 'tenso' | 'critico';
}

export const WisdomTapestry: React.FC<WisdomTapestryProps> = ({ heartbeat }) => {
  
  // Agrupar documentos por fecha
  const dailyThreads = useMemo(() => {
    const allDocs = [
      ...heartbeat.ingresos,
      ...heartbeat.gastos,
      ...heartbeat.produccion,
      ...heartbeat.salarios,
    ];

    const grouped = new Map<string, DailyThread>();

    allDocs.forEach(doc => {
      const date = doc.detectedDate || new Date(doc.addedAt).toISOString().split('T')[0];
      
      if (!grouped.has(date)) {
        grouped.set(date, {
          date,
          documents: [],
          totalIngresos: 0,
          totalGastos: 0,
          produccionCount: 0,
          balance: 0,
          mood: 'equilibrado',
        });
      }

      const thread = grouped.get(date)!;
      thread.documents.push(doc);

      if (doc.type === 'ingreso') {
        thread.totalIngresos += doc.detectedAmount || 0;
      } else if (doc.type === 'gasto' || doc.type === 'salario') {
        thread.totalGastos += doc.detectedAmount || 0;
      } else if (doc.type === 'produccion') {
        thread.produccionCount++;
      }
    });

    // Calcular balance y mood de cada día
    const threads = Array.from(grouped.values()).map(thread => {
      thread.balance = thread.totalIngresos - thread.totalGastos;
      
      if (thread.balance > 5000) thread.mood = 'fertil';
      else if (thread.balance > 0) thread.mood = 'equilibrado';
      else if (thread.balance > -2000) thread.mood = 'tenso';
      else thread.mood = 'critico';

      return thread;
    });

    return threads.sort((a, b) => b.date.localeCompare(a.date));
  }, [heartbeat]);

  // Extraer aprendizajes mirando hacia atrás
  const learnings = useMemo(() => {
    const lessons: string[] = [];
    
    if (dailyThreads.length < 2) return lessons;

    // Analizar tendencia de balance
    const balances = dailyThreads.slice(0, 7).map(t => t.balance);
    const avgBalance = balances.reduce((sum, b) => sum + b, 0) / balances.length;
    
    if (avgBalance > 1000) {
      lessons.push('💚 El ritmo de los últimos días genera excedente. Hay espacio para sembrar.');
    } else if (avgBalance < -500) {
      lessons.push('🌱 Los días recientes muestran tensión. Presencia y orden devuelven el flujo.');
    } else {
      lessons.push('⚖️ Balance sereno en los últimos días. El cuidado mantiene la armonía.');
    }

    // Analizar producción
    const prodDays = dailyThreads.filter(t => t.produccionCount > 0).length;
    if (prodDays > 10) {
      lessons.push('🏭 Producción consistente - más de 10 días activos. El ritmo sostiene.');
    }

    // Analizar días críticos
    const criticalDays = dailyThreads.filter(t => t.mood === 'critico').length;
    if (criticalDays > 0) {
      lessons.push(`⚠️ ${criticalDays} día(s) en tensión crítica. Cada obstáculo es oportunidad de fortaleza.`);
    }

    // Lección sobre el amor al prójimo reflejado en salarios
    const salaryDays = dailyThreads.filter(t => 
      t.documents.some(d => d.type === 'salario')
    ).length;
    if (salaryDays > 0) {
      lessons.push(`❤️ Amor materializado: ${salaryDays} jornadas cuidando del equipo con salarios.`);
    }

    return lessons;
  }, [dailyThreads]);

  // Proyección hacia adelante
  const projection = useMemo(() => {
    if (dailyThreads.length < 3) return null;

    const last7Days = dailyThreads.slice(0, 7);
    const avgDailyIncome = last7Days.reduce((sum, t) => sum + t.totalIngresos, 0) / 7;
    const avgDailyExpense = last7Days.reduce((sum, t) => sum + t.totalGastos, 0) / 7;
    const avgDailyBalance = avgDailyIncome - avgDailyExpense;

    const daysAhead = 30;
    const projectedBalance = avgDailyBalance * daysAhead;

    return {
      avgDailyIncome,
      avgDailyExpense,
      avgDailyBalance,
      projectedBalance,
      daysAhead,
      canPlant: projectedBalance > 10000,
    };
  }, [dailyThreads]);

  const getMoodColor = (mood: DailyThread['mood']) => {
    switch (mood) {
      case 'fertil': return 'bg-emerald-100 border-emerald-300 text-emerald-800';
      case 'equilibrado': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'tenso': return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'critico': return 'bg-rose-100 border-rose-300 text-rose-800';
    }
  };

  const getMoodEmoji = (mood: DailyThread['mood']) => {
    switch (mood) {
      case 'fertil': return '🌺';
      case 'equilibrado': return '🌿';
      case 'tenso': return '🍂';
      case 'critico': return '🥀';
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-3xl font-light text-slate-800 mb-2 flex items-center justify-center gap-2">
          <Sparkles size={28} className="text-purple-500" />
          Telar de la Sabiduría
        </h2>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
          "Cada día es una pieza que ponemos en este maravilloso telar. Viendo con el corazón 
          cómo nuestras intenciones se vuelven realidad."
        </p>
      </div>

      {/* APRENDIZAJES (Mirando hacia atrás) */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="text-purple-600" size={24} />
          <h3 className="text-lg font-medium text-purple-900">Mirando Hacia Atrás - Aprendizajes</h3>
        </div>
        <div className="space-y-2">
          {learnings.length > 0 ? (
            learnings.map((lesson, i) => (
              <p key={i} className="text-sm text-purple-800 leading-relaxed">
                {lesson}
              </p>
            ))
          ) : (
            <p className="text-sm text-purple-600 italic">
              Aún no hay suficiente historia para tejer aprendizajes...
            </p>
          )}
        </div>
      </div>

      {/* PROYECCIÓN (Mirando hacia adelante) */}
      {projection && (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-blue-600" size={24} />
            <h3 className="text-lg font-medium text-blue-900">Mirando Hacia Adelante - Proyección</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-blue-600 mb-1">Ingresos Diarios</p>
              <p className="text-lg font-light text-blue-900">${projection.avgDailyIncome.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 mb-1">Gastos Diarios</p>
              <p className="text-lg font-light text-blue-900">${projection.avgDailyExpense.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 mb-1">Balance Diario</p>
              <p className={`text-lg font-light ${projection.avgDailyBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                ${projection.avgDailyBalance.toFixed(0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-600 mb-1">30 Días Adelante</p>
              <p className={`text-lg font-light ${projection.projectedBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                ${projection.projectedBalance.toFixed(0)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm text-blue-800 bg-white/50 rounded-lg p-3">
            <Lightbulb className="text-blue-500 flex-shrink-0 mt-0.5" size={16} />
            <p>
              {projection.canPlant
                ? '🌱 La proyección muestra suelo fértil. Puedes sembrar algo diferente si lo deseas.'
                : '🌿 Mantén el cuidado presente. Siempre puedes revertir la historia con nuevas semillas.'}
            </p>
          </div>
        </div>
      )}

      {/* HILO DE DÍAS (El Telar) */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-slate-600" size={24} />
          <h3 className="text-lg font-medium text-slate-800">Hilos del Telar</h3>
          <span className="text-xs text-slate-500 ml-auto">{dailyThreads.length} días tejidos</span>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {dailyThreads.map((thread, idx) => (
            <div
              key={thread.date}
              className={`rounded-xl border-2 p-4 transition-all ${getMoodColor(thread.mood)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getMoodEmoji(thread.mood)}</span>
                  <div>
                    <p className="font-medium text-sm">
                      {new Date(thread.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })}
                    </p>
                    <p className="text-xs opacity-70">{thread.documents.length} documentos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-light ${thread.balance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    ${thread.balance.toFixed(0)}
                  </p>
                  <p className="text-xs opacity-70">
                    {thread.produccionCount > 0 && `🏭 ${thread.produccionCount} prod`}
                  </p>
                </div>
              </div>

              {/* Mini resumen de documentos */}
              <div className="flex flex-wrap gap-1 mt-2">
                {thread.documents.slice(0, 3).map((doc, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-white/60 rounded-full truncate max-w-[150px]"
                    title={doc.fileName}
                  >
                    {doc.fileName.split('.')[0].substring(0, 20)}
                  </span>
                ))}
                {thread.documents.length > 3 && (
                  <span className="text-xs px-2 py-1 bg-white/60 rounded-full">
                    +{thread.documents.length - 3} más
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEMILLA DEL AMOR */}
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200 text-center">
        <Heart className="mx-auto text-rose-500 mb-3" size={32} />
        <p className="text-sm text-rose-800 leading-relaxed">
          "El amor al prójimo es la más bella de las semillas que podemos plantar. 
          Los errores son aprendizaje. Mirando hacia atrás vemos el camino, 
          mirando hacia adelante siempre podemos sembrar algo diferente."
        </p>
      </div>
    </div>
  );
};
