/**
 * SOPHIA MESSAGE CARD
 * Tarjeta que muestra mensajes de sabiduría del sistema
 * Los mensajes vienen directamente de la carpeta /sofia
 */

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { SophiaInsight } from '../types/sophia';
import { Sparkles, Zap, AlertCircle, Volume2 } from 'lucide-react';

interface SophiaMessageCardProps {
  context?: string;
  onRefresh?: () => void;
}

const fetchSophiaInsight = async (): Promise<SophiaInsight> => {
  // Get context de algún lugar (por ahora genérico)
  const res = await fetch('/api/sophia/insight?type=presencia&signal=flujo-normal');
  if (!res.ok) throw new Error('Failed to fetch Sophia insight');
  return res.json();
};

export function SophiaMessageCard({ context, onRefresh }: SophiaMessageCardProps) {
  const { data: insight, isLoading, refetch } = useQuery({
    queryKey: ['sophia-insight'],
    queryFn: fetchSophiaInsight,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const [isPlaying, setIsPlaying] = useState(false);

  // Reproducir frecuencia como sonido (opcional, requiere Web Audio API)
  const playFrequency = (frequency: number) => {
    if (!window.AudioContext && !(window as any).webkitAudioContext) {
      alert('Web Audio API no disponible en tu navegador');
      return;
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 2);

    oscillator.start(now);
    oscillator.stop(now + 2);

    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-slate-700/50 backdrop-blur rounded-lg p-6 border border-purple-600/30 animate-pulse">
        <p className="text-gray-400 text-sm">Cargando sabiduría de Sophia...</p>
      </div>
    );
  }

  if (!insight) {
    return null;
  }

  const pillarMeta = insight.pillar_metadata;

  return (
    <div
      className="bg-gradient-to-br from-slate-700/50 to-purple-900/30 backdrop-blur rounded-lg p-6 border"
      style={{ borderColor: pillarMeta.color + '50' }}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: pillarMeta.color + '20' }}
          >
            <span className="text-lg">{pillarMeta.emoji}</span>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">
              Pilar: {pillarMeta.name}
            </p>
            <p className="text-xs text-gray-500">Chakra {pillarMeta.chakra}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => playFrequency(pillarMeta.frequency)}
            disabled={isPlaying}
            className="p-2 hover:bg-slate-600 disabled:opacity-50 rounded transition"
            title={`Reproducir ${pillarMeta.frequency} Hz`}
          >
            <Volume2 className="w-4 h-4 text-gray-300" />
          </button>
          <button
            onClick={() => refetch()}
            className="p-2 hover:bg-slate-600 rounded transition"
            title="Obtener nuevo insight"
          >
            <Zap className="w-4 h-4 text-purple-400" />
          </button>
        </div>
      </div>

      {/* MESSAGE */}
      <div className="mb-4">
        <p className="text-sm leading-relaxed text-gray-100 whitespace-pre-wrap">
          {insight.message}
        </p>
      </div>

      {/* SOURCES */}
      {insight.sources && insight.sources.length > 0 && (
        <div className="border-t border-slate-600 pt-3 mb-3">
          <p className="text-xs text-gray-500 mb-1">Fuente(s):</p>
          <div className="flex flex-wrap gap-1">
            {insight.sources.map((source, idx) => (
              <span
                key={idx}
                className="inline-block text-xs bg-slate-600 text-gray-300 px-2 py-0.5 rounded"
              >
                📄 {source}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <Sparkles className="w-3 h-3" style={{ color: pillarMeta.color }} />
          <span className="text-gray-400">
            Confianza: {Math.round((insight.confidence || 0.5) * 100)}%
          </span>
        </div>
        <span className="text-gray-500">🎵 {pillarMeta.frequency} Hz</span>
      </div>
    </div>
  );
}

/**
 * Sophia Stats - Mostrar estadísticas de cobertura de sabiduría
 */
export function SophiaStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['sophia-statistics'],
    queryFn: async () => {
      const res = await fetch('/api/sophia/statistics');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
    staleTime: 1 * 60 * 60 * 1000, // 1 hour
  });

  if (isLoading) return null;

  return (
    <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 text-xs">
      <p className="text-gray-400 mb-2 flex items-center gap-2">
        <AlertCircle className="w-4 h-4" />
        Base de Sabiduría
      </p>
      {stats && (
        <div className="space-y-1 text-gray-300">
          <p>📚 {stats.total_documents} documentos cargados</p>
          <p>⭐ {stats.pillars_covered.length}/10 pilares cubiertos</p>
        </div>
      )}
    </div>
  );
}
