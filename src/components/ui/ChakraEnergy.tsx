/**
 * Visualización sutil tipo energía de chakras
 * Gráfico circular minimalista con rotación suave
 */

import React from 'react';

interface ChakraEnergyProps {
  value: number; // 0-100
  label: string;
  color?: string;
  size?: number;
}

export const ChakraEnergy: React.FC<ChakraEnergyProps> = ({
  value,
  label,
  color = '#10b981',
  size = 120,
}) => {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Base circle */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          style={{ filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.08))' }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={45}
            stroke="#e2e8f0"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={45}
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 4px ${color}40)`,
            }}
          />
        </svg>

        {/* Inner rotating glow */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            animation: 'spin 8s linear infinite',
          }}
        >
          <div
            className="w-16 h-16 rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle, ${color}, transparent)`,
            }}
          />
        </div>

        {/* Value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-light text-slate-700">{value}%</span>
        </div>
      </div>

      <p className="text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
};
