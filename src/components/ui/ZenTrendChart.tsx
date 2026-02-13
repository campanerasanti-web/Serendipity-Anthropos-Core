/**
 * Gráfico de tendencia sutil tipo energía
 */

import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, Line } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface ZenTrendChartProps {
  data: Array<{
    date: string;
    ingresos: number;
    gastos: number;
    balance: number;
  }>;
  title?: string;
  subtitle?: string;
  accentColor?: string;
  showDetailLines?: boolean;
}

export const ZenTrendChart: React.FC<ZenTrendChartProps> = ({
  data,
  title = 'Flujo de Energía',
  subtitle = 'Últimos 30 días de actividad',
  accentColor = '#10b981',
  showDetailLines = true,
}) => {
  const hasData = data.some((row) => row.ingresos !== 0 || row.gastos !== 0);
  const gradientId = `zenGradient-${accentColor.replace('#', '')}`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-1">{title}</h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        <TrendingUp className="text-slate-400" size={20} />
      </div>

      {hasData ? (
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={accentColor} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: number, name: string) => [`$${value.toFixed(0)}`, name]}
                labelFormatter={(label: string) => label}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke={accentColor}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                animationDuration={1500}
                name="Balance"
              />
              {showDetailLines && (
                <Line type="monotone" dataKey="ingresos" stroke="#2563eb" strokeWidth={1.5} name="Ingresos" />
              )}
              {showDetailLines && (
                <Line type="monotone" dataKey="gastos" stroke="#ef4444" strokeWidth={1.5} name="Gastos" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center">
          <p className="text-xs text-slate-500">Sin montos detectados para graficar.</p>
        </div>
      )}
    </div>
  );
};
