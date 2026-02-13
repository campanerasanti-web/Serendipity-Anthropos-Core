/**
 * TEMPLO INTERIOR
 * Visualization of Anthropos internal state
 * Shows system mood, heart coherence, and Sofia insights
 * Integration point with AnthroposCore for full cycle execution
 */

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchLastAnthroposReport,
  runFullCheckup,
  invalidateAllQueries
} from '../services/queries';
import type { AnthroposReport, CheckupResponse } from '../types';
import {
  Heart,
  Brain,
  Zap,
  AlertTriangle,
  Shield,
  Clock,
  Loader2,
  RefreshCw,
  Droplets,
  Wind,
  Sun,
  Moon
} from 'lucide-react';

// ============================================================
// TEMPLE INTERIOR COMPONENT
// ============================================================

export default function TemploInterior() {
  const queryClient = useQueryClient();

  // QUERIES
  const anthroposQuery = useQuery({
    queryKey: ['anthropos'],
    queryFn: fetchLastAnthroposReport,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 2 // 2 minutes
  });

  // MUTATIONS
  const checkupMutation = useMutation({
    mutationFn: runFullCheckup,
    onSuccess: () => {
      invalidateAllQueries(queryClient);
      alert('✅ Checkup completo - Sistema sincronizado');
    },
    onError: (error) => {
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  });

  const report = anthroposQuery.data;
  const isLoading = anthroposQuery.isLoading;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">Templo Interior</h1>
          <p className="text-purple-200 text-lg">
            Vista del estado interno de Anthropos - El Sistema Vivo
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => anthroposQuery.refetch()}
            disabled={anthroposQuery.isRefetching}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 rounded-lg text-white font-bold flex items-center gap-2 transition"
          >
            <RefreshCw className={`w-5 h-5 ${anthroposQuery.isRefetching ? 'animate-spin' : ''}`} />
            {anthroposQuery.isRefetching ? 'Actualizando...' : 'Refrescar Estado'}
          </button>

          <button
            onClick={() => checkupMutation.mutate()}
            disabled={checkupMutation.isPending}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg text-white font-bold flex items-center gap-2 transition"
          >
            <Zap className="w-5 h-5" />
            {checkupMutation.isPending ? 'Ejecutando...' : 'Ejecutar Checkup Total'}
          </button>
        </div>

        {isLoading ? (
          <div className="text-center text-white py-12">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-400" />
            <p>Sincronizando con Anthropos...</p>
          </div>
        ) : report ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT COLUMN - SYSTEM STATE */}
            <div className="space-y-6">
              {/* MOOD SECTION */}
              <MoodCard mood={report.system_mood} />

              {/* HEART COHERENCE */}
              <CoherenceCard coherence={report.heart_coherence} />

              {/* EMOTIONAL & OPERATIONAL LOAD */}
              <LoadCard
                emotional={report.emotional_load}
                operational={report.operational_load}
              />

              {/* DROUGHT POINTS */}
              <DroughtCard droughtPoints={report.drought_points} />
            </div>

            {/* RIGHT COLUMN - INSIGHTS & RISKS */}
            <div className="space-y-6">
              {/* SOFIA INSIGHTS */}
              <InsightsCard insights={report.sophia_insights} />

              {/* SECURITY RISKS */}
              <RisksCard risks={report.security_risks} />

              {/* RITUAL TRACKING */}
              <RitualCard cycle={report.full_cycle} />

              {/* LAST SYNC */}
              <SyncCard lastSync={report.last_sync_time} />
            </div>
          </div>
        ) : (
          <div className="text-center text-red-400 py-12">
            Error cargando estado del Templo
          </div>
        )}

        {/* FOOTER INFO */}
        <div className="mt-12 text-center text-purple-200 text-sm">
          <p>Anthropos respira cada 60 segundos • Sofia observa cada 30 segundos • Checkup total cada 2 horas</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CARD COMPONENTS
// ============================================================

interface MoodCardProps {
  mood: 'fertile' | 'stressed' | 'fragmented' | 'flowing' | string;
}

function MoodCard({ mood }: MoodCardProps) {
  const moodEmoji: Record<string, string> = {
    fertile: '🌱',
    stressed: '⚡',
    fragmented: '🌀',
    flowing: '🌊'
  };

  const moodColor: Record<string, string> = {
    fertile: 'text-green-400',
    stressed: 'text-red-400',
    fragmented: 'text-yellow-400',
    flowing: 'text-blue-400'
  };

  const moodDesc: Record<string, string> = {
    fertile: 'El sistema crece y se expande con armonía',
    stressed: 'El sistema está bajo presión, enfocado',
    fragmented: 'El sistema está disperso, requiere integración',
    flowing: 'El sistema fluye en su ritmo óptimo'
  };

  return (
    <div className="bg-slate-700/50 backdrop-blur rounded-lg p-6 border border-slate-600 hover:border-purple-500 transition">
      <div className="flex items-center gap-3 mb-4">
        <Heart className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white">Estado de Ánimo</h3>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-5xl">{moodEmoji[mood as keyof typeof moodEmoji] || '❓'}</span>
        <div>
          <p className={`text-3xl font-bold ${moodColor[mood as keyof typeof moodColor]}`}>
            {mood.toUpperCase()}
          </p>
          <p className="text-sm text-gray-300 mt-1">
            {moodDesc[mood as keyof typeof moodDesc] || 'Estado desconocido'}
          </p>
        </div>
      </div>
    </div>
  );
}

interface CoherenceCardProps {
  coherence: number;
}

function CoherenceCard({ coherence }: CoherenceCardProps) {
  const getStatus = (val: number) => {
    if (val >= 80) return { label: 'Excelente', color: 'text-green-400', bg: 'bg-green-400/20' };
    if (val >= 60) return { label: 'Buena', color: 'text-blue-400', bg: 'bg-blue-400/20' };
    if (val >= 40) return { label: 'Regular', color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
    return { label: 'Crítica', color: 'text-red-400', bg: 'bg-red-400/20' };
  };

  const status = getStatus(coherence);

  return (
    <div className="bg-slate-700/50 backdrop-blur rounded-lg p-6 border border-slate-600 hover:border-cyan-500 transition">
      <div className="flex items-center gap-3 mb-4">
        <Brain className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-bold text-white">Coherencia del Corazón</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <span className={`text-4xl font-bold ${status.color}`}>{coherence}%</span>
          <span className={`text-sm font-bold px-3 py-1 rounded ${status.bg} ${status.color}`}>
            {status.label}
          </span>
        </div>

        <div className="w-full bg-slate-600 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              coherence >= 80 ? 'bg-green-500' :
              coherence >= 60 ? 'bg-blue-500' :
              coherence >= 40 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${coherence}%` }}
          />
        </div>

        <p className="text-xs text-gray-400">
          Sincronización entre mente (Sophia) y corazón (HeartEngine)
        </p>
      </div>
    </div>
  );
}

interface LoadCardProps {
  emotional: number;
  operational: number;
}

function LoadCard({ emotional, operational }: LoadCardProps) {
  return (
    <div className="bg-slate-700/50 backdrop-blur rounded-lg p-6 border border-slate-600 hover:border-amber-500 transition">
      <div className="flex items-center gap-3 mb-4">
        <Zap className="w-6 h-6 text-amber-400" />
        <h3 className="text-xl font-bold text-white">Carga del Sistema</h3>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-300">Carga Emocional</p>
            <span className="text-sm font-bold text-amber-400">{emotional}%</span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                emotional <= 50 ? 'bg-green-500' :
                emotional <= 75 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${emotional}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-300">Carga Operativa</p>
            <span className="text-sm font-bold text-blue-400">{operational}%</span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                operational <= 50 ? 'bg-green-500' :
                operational <= 75 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${operational}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface DroughtCardProps {
  droughtPoints: string[];
}

function DroughtCard({ droughtPoints }: DroughtCardProps) {
  return (
    <div className="bg-slate-700/50 backdrop-blur rounded-lg p-6 border border-slate-600 hover:border-red-500 transition">
      <div className="flex items-center gap-3 mb-4">
        <Droplets className="w-6 h-6 text-red-400" />
        <h3 className="text-xl font-bold text-white">Puntos Secos (Vulnerabilidades)</h3>
      </div>

      {droughtPoints && droughtPoints.length > 0 ? (
        <ul className="space-y-2">
          {droughtPoints.map((point, idx) => (
            <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-green-400">✓ No hay puntos secos detectados</p>
      )}
    </div>
  );
}

interface InsightsCardProps {
  insights: Array<{ category: string; insight: string }>;
}

function InsightsCard({ insights }: InsightsCardProps) {
  const getCategoryIcon = (cat: string) => {
    if (cat.includes('financial')) return '💰';
    if (cat.includes('operational')) return '⚙️';
    if (cat.includes('emotional')) return '❤️';
    if (cat.includes('security')) return '🔒';
    return '💡';
  };

  return (
    <div className="bg-slate-700/50 backdrop-blur rounded-lg p-6 border border-slate-600 hover:border-cyan-500 transition">
      <div className="flex items-center gap-3 mb-4">
        <Sun className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-bold text-white">Insights de Sophia</h3>
      </div>

      {insights && insights.length > 0 ? (
        <div className="space-y-3">
          {insights.map((item, idx) => (
            <div key={idx} className="bg-slate-600/50 rounded p-3 border border-slate-500">
              <p className="text-xs text-gray-400 mb-1">
                {getCategoryIcon(item.category)} {item.category}
              </p>
              <p className="text-sm text-white">{item.insight}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">Sophia está observando...</p>
      )}
    </div>
  );
}

interface RisksCardProps {
  risks: Array<{ risk: string; severity: 'low' | 'medium' | 'high' | 'critical' }>;
}

function RisksCard({ risks }: RisksCardProps) {
  const getSeverityColor = (sev: string) => {
    if (sev === 'critical') return 'text-red-500 bg-red-500/20';
    if (sev === 'high') return 'text-orange-500 bg-orange-500/20';
    if (sev === 'medium') return 'text-yellow-500 bg-yellow-500/20';
    return 'text-green-500 bg-green-500/20';
  };

  return (
    <div className="bg-slate-700/50 backdrop-blur rounded-lg p-6 border border-slate-600 hover:border-red-500 transition">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-6 h-6 text-red-400" />
        <h3 className="text-xl font-bold text-white">Riesgos de Seguridad</h3>
      </div>

      {risks && risks.length > 0 ? (
        <div className="space-y-2">
          {risks.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap mt-0.5 ${getSeverityColor(item.severity)}`}>
                {item.severity.toUpperCase()}
              </span>
              <p className="text-sm text-gray-300">{item.risk}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-green-400">✓ Sistema seguro</p>
      )}
    </div>
  );
}

interface RitualCardProps {
  cycle: any;
}

function RitualCard({ cycle }: RitualCardProps) {
  return (
    <div className="bg-slate-700/50 backdrop-blur rounded-lg p-6 border border-slate-600 hover:border-purple-500 transition">
      <div className="flex items-center gap-3 mb-4">
        <Moon className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white">Ciclo Completo</h3>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center p-2 bg-slate-600/50 rounded">
          <span className="text-gray-300">Ultimo ciclo ejecutado:</span>
          <span className="text-white font-mono">{cycle?.timestamp || 'Pendiente'}</span>
        </div>

        <div className="flex justify-between items-center p-2 bg-slate-600/50 rounded">
          <span className="text-gray-300">Estado:</span>
          <span className={cycle?.status === 'complete' ? 'text-green-400' : 'text-yellow-400'}>
            {cycle?.status || 'idle'}
          </span>
        </div>

        <div className="flex justify-between items-center p-2 bg-slate-600/50 rounded">
          <span className="text-gray-300">Duración:</span>
          <span className="text-white">{cycle?.duration_ms || 0}ms</span>
        </div>
      </div>
    </div>
  );
}

interface SyncCardProps {
  lastSync: string | undefined;
}

function SyncCard({ lastSync }: SyncCardProps) {
  return (
    <div className="bg-slate-700/50 backdrop-blur rounded-lg p-6 border border-slate-600">
      <div className="flex items-center gap-3">
        <Clock className="w-6 h-6 text-gray-400" />
        <div>
          <p className="text-xs text-gray-400">Última sincronización</p>
          <p className="text-lg font-bold text-white">
            {lastSync ? new Date(lastSync).toLocaleTimeString() : 'Sin sincronizar'}
          </p>
        </div>
      </div>
    </div>
  );
}
