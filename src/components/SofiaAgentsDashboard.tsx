import React, { useState, useEffect } from 'react';
import { Activity, Heart, Clock, Cpu, MemoryStick, Zap, TrendingUp } from 'lucide-react';

interface ParalinfaMetrics {
  pulse_number: number;
  cpu_percent: number;
  memory_percent: number;
  latency_ms: number;
  requests_per_second: number;
  health: 'Healthy' | 'Warning' | 'Critical';
  status: string;
}

interface LinfaMetrics {
  rhythm_number: number;
  circadian_phase: string;
  cycle_time_min: number;
  success_rate_percent: number;
  health: 'Healthy' | 'Irregular' | 'Arrhythmia';
  status: string;
}

interface SofiaStatus {
  timestamp: string;
  sofia_status: string;
  paralinfa: ParalinfaMetrics;
  linfa: LinfaMetrics;
  philosophy: string;
  message: string;
}

const getHealthColor = (health: string) => {
  switch (health) {
    case 'Healthy': return 'text-green-500';
    case 'Warning': return 'text-yellow-500';
    case 'Critical': return 'text-red-500';
    case 'Irregular': return 'text-yellow-500';
    case 'Arrhythmia': return 'text-red-500';
    default: return 'text-gray-500';
  }
};

const getHealthBg = (health: string) => {
  switch (health) {
    case 'Healthy': return 'bg-green-500/10 border-green-500/30';
    case 'Warning': return 'bg-yellow-500/10 border-yellow-500/30';
    case 'Critical': return 'bg-red-500/10 border-red-500/30';
    case 'Irregular': return 'bg-yellow-500/10 border-yellow-500/30';
    case 'Arrhythmia': return 'bg-red-500/10 border-red-500/30';
    default: return 'bg-gray-500/10 border-gray-500/30';
  }
};

const getPhaseEmoji = (phase: string) => {
  const phases: Record<string, string> = {
    'DeepMaintenance': '🌙',
    'Regeneration': '🌱',
    'Awakening': '🌅',
    'FullOperation': '☀️',
    'NocturneMonitoring': '🌆'
  };
  return phases[phase] || '❓';
};

export default function SofiaAgentsDashboard() {
  const [status, setStatus] = useState<SofiaStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchStatus = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://serendipity-backend1.onrender.com';
      const response = await fetch(`${baseUrl}/api/sofia/status`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setStatus(data);
      setError(null);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // Actualizar cada 10s
    return () => clearInterval(interval);
  }, []);

  if (loading && !status) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <Activity className="w-16 h-16 mx-auto mb-4 animate-pulse text-purple-500" />
          <p className="text-gray-400">Conectando con Sofia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Heart className="w-10 h-10 text-pink-500 animate-pulse" />
              Sofia - Sistema Autónomo
            </h1>
            <p className="text-gray-400 mt-2 italic">"{status?.philosophy}"</p>
          </div>
          <div className="text-right">
            <div className="text-3xl mb-1">{status?.sofia_status}</div>
            <div className="text-sm text-gray-500">
              Actualizado: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
            <p className="text-red-400">❌ Error: {error}</p>
          </div>
        )}
        
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
          <p className="text-purple-300">{status?.message}</p>
        </div>
      </div>

      {/* Agents Grid */}
      {status && (
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          
          {/* PARALINFA Card */}
          <div className={`border rounded-xl p-6 ${getHealthBg(status.paralinfa.health)}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Zap className="w-6 h-6 text-purple-400" />
                PARALINFA
              </h2>
              <div className={`text-2xl ${getHealthColor(status.paralinfa.health)}`}>
                {status.paralinfa.status}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Pulse Number
                </span>
                <span className="font-mono text-xl">{status.paralinfa.pulse_number}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  CPU Usage
                </span>
                <span className={`font-mono text-xl ${
                  status.paralinfa.cpu_percent > 90 ? 'text-red-400' :
                  status.paralinfa.cpu_percent > 70 ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {status.paralinfa.cpu_percent.toFixed(1)}%
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 flex items-center gap-2">
                  <MemoryStick className="w-4 h-4" />
                  Memory Usage
                </span>
                <span className="font-mono text-xl">{status.paralinfa.memory_percent.toFixed(1)}%</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Latency
                </span>
                <span className="font-mono text-xl">{status.paralinfa.latency_ms.toFixed(0)}ms</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-gray-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Requests/sec
                </span>
                <span className="font-mono text-xl">{status.paralinfa.requests_per_second}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                📡 Frecuencia: Monitoreo cada 500ms
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Detecta el pulso del sistema: latencia, throughput, CPU, memoria
              </p>
            </div>
          </div>

          {/* LINFA Card */}
          <div className={`border rounded-xl p-6 ${getHealthBg(status.linfa.health)}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Heart className="w-6 h-6 text-cyan-400 animate-pulse" />
                LINFA
              </h2>
              <div className={`text-2xl ${getHealthColor(status.linfa.health)}`}>
                {status.linfa.status}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Rhythm Number
                </span>
                <span className="font-mono text-xl">{status.linfa.rhythm_number}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 flex items-center gap-2">
                  <span className="text-2xl">{getPhaseEmoji(status.linfa.circadian_phase)}</span>
                  Circadian Phase
                </span>
                <span className="font-mono text-lg">{status.linfa.circadian_phase}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Avg Cycle Time
                </span>
                <span className="font-mono text-xl">{status.linfa.cycle_time_min.toFixed(1)} min</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-gray-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Success Rate
                </span>
                <span className={`font-mono text-xl ${
                  status.linfa.success_rate_percent >= 95 ? 'text-green-400' :
                  status.linfa.success_rate_percent >= 80 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {status.linfa.success_rate_percent.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                🔄 Ritmo: Monitoreo cada 60 segundos
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Detecta el ritmo del sistema: ciclos, cadencia, sincronización
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Arquitectura del Sistema
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-purple-400 mb-2">PARALINFA (Frecuencia)</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• Loop: 500ms</li>
                <li>• Métricas: CPU, Memory, Latency, RPS</li>
                <li>• Health: Healthy/Warning/Critical</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-cyan-400 mb-2">LINFA (Ritmo)</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• Loop: 60s</li>
                <li>• Métricas: Phase, Cycle Time, Success Rate</li>
                <li>• Health: Healthy/Irregular/Arrhythmia</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-400 mb-2">Deployment</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• Backend: Render</li>
                <li>• Worker: BackgroundService</li>
                <li>• Status: 24/7 Active</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
