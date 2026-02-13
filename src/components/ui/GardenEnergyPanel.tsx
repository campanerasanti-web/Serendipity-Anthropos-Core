import React from 'react';

interface GardenEnergyPanelProps {
  totalIncomes: number;
  totalFixedCosts: number;
  wipCount?: number;
  wipTarget?: number;
  highlightIncome?: boolean;
}

export const GardenEnergyPanel: React.FC<GardenEnergyPanelProps> = ({
  totalIncomes,
  totalFixedCosts,
  wipCount = 0,
  wipTarget = 40,
  highlightIncome = false,
}) => {
  const bonus = totalIncomes > 0 ? 5 : 0;
  const shieldPct = Math.max(0, Math.min(100, (wipCount / (wipTarget || 1)) * 100));

  return (
    <div className="rounded-2xl border border-emerald-300/40 bg-gradient-to-b from-[#f7f2e5] to-[#e8f5e3] p-6">
      <p className={`text-emerald-900 text-lg leading-relaxed ${highlightIncome ? 'animate-pulse' : ''}`}>
        El jardin mantiene un escudo WIP en {shieldPct.toFixed(0)}% y sostiene un bonus vivo de {bonus}%.
        Cada ingreso nuevo fortalece la esperanza.
      </p>
    </div>
  );
};
