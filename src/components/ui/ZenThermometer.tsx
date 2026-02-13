/**
 * Termómetro zen - días de cobertura con diseño minimalista
 */

import React from 'react';
import { Droplet } from 'lucide-react';

interface ZenThermometerProps {
  balance: number;
  burnRate: number; // Gasto promedio diario
}

export const ZenThermometer: React.FC<ZenThermometerProps> = ({
  balance,
  burnRate,
}) => {
  const daysOfCoverage = burnRate > 0 ? Math.floor(balance / burnRate) : 0;
  const maxDays = 90;
  const fillPercent = Math.min(100, (daysOfCoverage / maxDays) * 100);

  const getColor = () => {
    if (daysOfCoverage >= 60) return { bg: 'bg-emerald-500', text: 'text-emerald-700' };
    if (daysOfCoverage >= 30) return { bg: 'bg-amber-500', text: 'text-amber-700' };
    return { bg: 'bg-rose-500', text: 'text-rose-700' };
  };

  const colors = getColor();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-1">Días de Cobertura</h3>
          <p className="text-xs text-slate-500">Autonomía con reservas actuales</p>
        </div>
        <Droplet className="text-slate-400" size={20} />
      </div>

      <div className="flex items-end gap-6">
        {/* Termómetro vertical */}
        <div className="relative h-48 w-16 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`absolute bottom-0 left-0 right-0 ${colors.bg} transition-all duration-1000 ease-out`}
            style={{
              height: `${fillPercent}%`,
              boxShadow: `0 -4px 12px ${colors.bg}40`,
            }}
          />
          
          {/* Marcadores */}
          <div className="absolute inset-0 flex flex-col justify-between py-4 px-2">
            <div className="h-px bg-slate-300" />
            <div className="h-px bg-slate-300" />
            <div className="h-px bg-slate-300" />
          </div>
        </div>

        {/* Métricas */}
        <div className="flex-1 space-y-4">
          <div>
            <p className={`text-4xl font-light ${colors.text}`}>
              {daysOfCoverage}
            </p>
            <p className="text-xs text-slate-500 mt-1">días disponibles</p>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Reserva:</span>
              <span className="font-medium">${balance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Gasto diario:</span>
              <span className="font-medium">${burnRate.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
