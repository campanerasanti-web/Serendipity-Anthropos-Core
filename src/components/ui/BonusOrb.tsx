import React from 'react';

interface BonusOrbProps {
  bonusPct: number;
  highlight: boolean;
}

export const BonusOrb: React.FC<BonusOrbProps> = ({ bonusPct, highlight }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-40 h-40">
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br from-emerald-300/40 via-lime-400/30 to-emerald-600/60 blur-2xl ${
            highlight ? 'animate-pulse' : ''
          }`}
        />
        <div
          className={`absolute inset-4 rounded-full bg-gradient-to-br from-emerald-300 to-green-600 shadow-[0_0_25px_rgba(16,185,129,0.7)] ${
            highlight ? 'scale-105' : 'scale-100'
          } transition-transform duration-700`}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <p className="text-xs uppercase tracking-widest text-emerald-100">Bonus</p>
          <p className="text-4xl font-bold">{bonusPct}%</p>
          <p className="text-[10px] text-emerald-100">Ordenes sin reclamo</p>
        </div>
      </div>
    </div>
  );
};
