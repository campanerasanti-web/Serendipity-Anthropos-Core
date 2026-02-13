import React from 'react';

export const FlowerOfTime: React.FC<{
  dayOfMonth?: number;
  totalDaysInMonth?: number;
  dailyIncome?: number;
  dailyTarget?: number;
}> = ({ dayOfMonth = 1, totalDaysInMonth = 28, dailyIncome = 0, dailyTarget = 1000 }) => {
  const petalsFallen = Math.max(0, dayOfMonth - 1);
  const rootFill = Math.min((dailyIncome / dailyTarget) * 100, 100);
  const petalsRemaining = Math.max(0, totalDaysInMonth - petalsFallen);
  const remainingPct = Math.max(0, 100 - rootFill);

  return (
    <div className="p-4 bg-gradient-to-b from-[#f7f2e5] to-[#d9e9d2] rounded-lg border border-emerald-200 text-center">
      <h3 className="text-lg font-bold text-emerald-700 mb-3">✿ Flor del Tiempo</h3>
      <div className="flex justify-around mb-3 text-sm">
        <div>
          <p className="text-emerald-700">Petalos</p>
          <p className="text-xl font-bold text-emerald-800">{petalsRemaining}🌹</p>
        </div>
        <div>
          <p className="text-emerald-700">Faltante</p>
          <p className="text-xl font-bold text-emerald-800">{remainingPct.toFixed(0)}%</p>
        </div>
      </div>
      <div className="w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-emerald-400 to-green-500 h-full transition-all duration-500"
          style={{ width: `${Math.max(0, 100 - remainingPct)}%` }}
        />
      </div>
    </div>
  );
};
