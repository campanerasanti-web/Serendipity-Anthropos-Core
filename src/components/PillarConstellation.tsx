/**
 * PILLAR CONSTELLATION
 * Visualización de los 10 Pilares de Sabiduría
 * Cada pilar brilla según su actividad diaria
 * 
 * Basado en:
 * - Presencia (Chakra Sacro - 417 Hz)
 * - Resiliencia (Chakra Raíz - 396 Hz)
 * - Claridad (Chakra Plexo - 528 Hz)
 * - Compasión (Chakra Corazón - 639 Hz)
 * - Discernimiento (Chakra Garganta - 741 Hz)
 * - Paciencia (Chakra Sacro - 417 Hz)
 * - Integridad (Chakra Tercer Ojo - 852 Hz)
 * - Humildad (Chakra Raíz - 396 Hz)
 * - Coherencia (Chakra Corona - 963 Hz)
 * - Servicio (Chakra Garganta - 741 Hz)
 */

import React, { useMemo } from 'react';
import { PILLARS } from '../types/sophia';
import type { PillarBrilliance, PillarName } from '../types/sophia';
import { Sparkles, Music2, Heart } from 'lucide-react';

interface PillarConstellationProps {
  brilliances: Record<PillarName, PillarBrilliance>;
  system_resonance: number;
  onPillarClick?: (pillar: PillarName) => void;
}

export function PillarConstellation({
  brilliances,
  system_resonance,
  onPillarClick
}: PillarConstellationProps) {
  // Posiciones en círculo para 10 pilares
  const positions = useMemo(() => {
    const pillarNames = Object.keys(PILLARS) as PillarName[];
    const centerX = 250;
    const centerY = 250;
    const radius = 150;

    return pillarNames.reduce((acc, pillar, idx) => {
      const angle = (idx / pillarNames.length) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      acc[pillar] = { x, y, angle };
      return acc;
    }, {} as Record<PillarName, any>);
  }, []);

  const pillarNames = Object.keys(PILLARS) as PillarName[];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h3 className="text-2xl font-bold text-white">Constelación de Pilares</h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Resonancia del Sistema</p>
          <p className="text-2xl font-bold text-purple-300">{system_resonance}%</p>
        </div>
      </div>

      {/* CONSTELLATION SVG */}
      <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 relative overflow-hidden">
        <svg width="100%" height="500" viewBox="0 0 500 500" className="mx-auto">
          {/* BACKGROUND GRID */}
          <defs>
            <radialGradient id="constellationBg">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>

            {/* GLOW FILTER */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx="250" cy="250" r="245" fill="url(#constellationBg)" stroke="#334155" strokeWidth="1" />

          {/* CONCENTRIC CIRCLES */}
          <circle cx="250" cy="250" r="200" fill="none" stroke="#334155" strokeWidth="1" opacity="0.3" />
          <circle cx="250" cy="250" r="150" fill="none" stroke="#334155" strokeWidth="1" opacity="0.3" />
          <circle cx="250" cy="250" r="100" fill="none" stroke="#334155" strokeWidth="1" opacity="0.3" />
          <circle cx="250" cy="250" r="50" fill="none" stroke="#334155" strokeWidth="1" opacity="0.3" />

          {/* CENTER POINT */}
          <circle cx="250" cy="250" r="4" fill="#fbbf24" filter="url(#glow)" />

          {/* LINES CONNECTING TO PILLARS */}
          {pillarNames.map(pillar => {
            const pos = positions[pillar];
            return (
              <line
                key={`line-${pillar}`}
                x1="250"
                y1="250"
                x2={pos.x}
                y2={pos.y}
                stroke={PILLARS[pillar].color}
                strokeWidth="1"
                opacity={(brilliances[pillar]?.brightness || 0) / 100 * 0.5}
              />
            );
          })}

          {/* PILLAR STARS */}
          {pillarNames.map(pillar => {
            const pos = positions[pillar];
            const brilliance = brilliances[pillar];
            const brightness = brilliance?.brightness || 20;
            const opacity = brightness / 100;
            const size = 8 + (brightness / 100) * 8; // 8-16px

            const pillarMeta = PILLARS[pillar];

            return (
              <g key={`pillar-${pillar}`}>
                {/* GLOW AURA */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={size + 6}
                  fill={pillarMeta.color}
                  opacity={opacity * 0.3}
                  filter="url(#glow)"
                />

                {/* STAR */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={size}
                  fill={pillarMeta.color}
                  opacity={0.7 + opacity * 0.3}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => onPillarClick?.(pillar)}
                />

                {/* BRIGHTNESS INDICATOR */}
                <text
                  x={pos.x}
                  y={pos.y + (size + 25)}
                  textAnchor="middle"
                  fill={pillarMeta.color}
                  fontSize="11"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  {brightness}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* PILLAR GRID */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {pillarNames.map(pillar => {
          const brilliance = brilliances[pillar];
          const brightness = brilliance?.brightness || 0;
          const meta = PILLARS[pillar];

          return (
            <div
              key={pillar}
              onClick={() => onPillarClick?.(pillar)}
              className="bg-slate-700/50 backdrop-blur rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition cursor-pointer group"
              style={{
                borderColor: meta.color,
                opacity: 0.7 + brightness / 100 * 0.3
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{meta.emoji}</span>
                <div>
                  <p className="text-xs text-gray-400">{meta.chakra}</p>
                  <p className="text-xs font-bold text-white">{meta.frequency} Hz</p>
                </div>
              </div>

              <p className="text-xs text-gray-300 mb-2">{meta.name}</p>

              {/* BRIGHTNESS BAR */}
              <div className="w-full bg-slate-600 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: `${brightness}%`,
                    backgroundColor: meta.color
                  }}
                />
              </div>

              <p className="text-[10px] text-gray-400 mt-2">
                {brilliance?.activity_count || 0} activaciones hoy
              </p>
            </div>
          );
        })}
      </div>

      {/* CHAKRA-FREQUENCY LEGEND */}
      <div className="bg-slate-700/50 backdrop-blur rounded-lg p-4 border border-slate-600">
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Music2 className="w-4 h-4 text-purple-400" />
          Frecuencias de Chakra
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          <div><span className="text-gray-400">🔴 Raíz:</span> <span className="text-red-400 font-mono">396 Hz</span></div>
          <div><span className="text-gray-400">🟠 Sacro:</span> <span className="text-orange-400 font-mono">417 Hz</span></div>
          <div><span className="text-gray-400">🟡 Plexo:</span> <span className="text-yellow-400 font-mono">528 Hz</span></div>
          <div><span className="text-gray-400">💚 Corazón:</span> <span className="text-pink-400 font-mono">639 Hz</span></div>
          <div><span className="text-gray-400">🔵 Garganta:</span> <span className="text-cyan-400 font-mono">741 Hz</span></div>
          <div><span className="text-gray-400">👁️ Tercer Ojo:</span> <span className="text-purple-400 font-mono">852 Hz</span></div>
          <div><span className="text-gray-400">👑 Corona:</span> <span className="text-yellow-300 font-mono">963 Hz</span></div>
        </div>
      </div>

      {/* RESONANCE INSIGHT */}
      <div className="bg-gradient-to-r from-purple-900 to-slate-800 rounded-lg p-4 border border-purple-700/50 flex items-start gap-3">
        <Heart className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-bold text-white mb-1">Coherencia Sistémica</p>
          <p className="text-gray-300">
            {system_resonance > 80
              ? '✨ El sistema vibra en armonía. Todos los pilares están alineados.'
              : system_resonance > 60
              ? '🌤️ Buena resonancia. Algunos pilares necesitan atención.'
              : system_resonance > 40
              ? '⚠️ Resonancia débil. La armonía requiere rebalanceo.'
              : '🌩️ Desarmonía detectada. El sistema necesita integración urgente.'}
          </p>
        </div>
      </div>
    </div>
  );
}
