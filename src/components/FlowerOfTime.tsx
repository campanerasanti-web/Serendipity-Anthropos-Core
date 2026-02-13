import React from 'react';

interface FlowerOfTimeProps {
  dayOfMonth?: number;
  totalDaysInMonth?: number;
  dailyIncome?: number;
  dailyTarget?: number;
}

export const FlowerOfTime: React.FC<FlowerOfTimeProps> = ({
  dayOfMonth = 1,
  totalDaysInMonth = 28,
  dailyIncome = 0,
  dailyTarget = 1000,
}) => {
  const petalsRemaining = totalDaysInMonth - dayOfMonth + 1;
  const rootFill = dailyTarget > 0 ? Math.min((dailyIncome / dailyTarget) * 100, 100) : 0;
  const remainingPct = (petalsRemaining / totalDaysInMonth) * 100;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-1">Pétalos del Mes</h3>
          <p className="text-xs text-slate-500">Tiempo y cobertura de costos</p>
        </div>
        <span className="text-2xl">✿</span>
      </div>

      <div className="space-y-6">
        {/* Pétalos restantes */}
        <div>
          <div className="flex items-end gap-2 mb-2">
            <p className="text-3xl font-light text-slate-700">{petalsRemaining}</p>
            <p className="text-sm text-slate-500 pb-1">de {totalDaysInMonth} días</p>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500"
              style={{ width: `${remainingPct}%` }}
            />
          </div>
        </div>

        {/* Cobertura de gastos */}
        <div>
          <p className="text-xs text-slate-600 mb-2">Cobertura de costos hoy</p>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500"
              style={{ width: `${rootFill}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">{rootFill.toFixed(0)}% alcanzado</p>
        </div>
      </div>
    </div>
  );
};
