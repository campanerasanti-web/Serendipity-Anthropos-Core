import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchLast30DaysMetrics } from '../services/queries';
import { TrendingUp } from 'lucide-react';

const TrendChart = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [dataLength, setDataLength] = useState(0);

  // Obtenemos los últimos 30 días de métricas
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['last30DaysMetrics'],
    queryFn: fetchLast30DaysMetrics,
    retry: 1,
    staleTime: 10 * 60 * 1000,
  });

  // Detectar cuando llegan nuevos datos (efecto respiración)
  useEffect(() => {
    const chartData = Array.isArray(data) ? data : [];
    if (chartData.length > dataLength && dataLength > 0) {
      // Nuevo dato recibido → Respiración activada
      setIsBreathing(true);
      setTimeout(() => setIsBreathing(false), 2000); // 2 segundos de respiración
    }
    setDataLength(chartData.length);
  }, [data, dataLength]);

  if (isLoading) {
    return (
      <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2.5rem] space-y-4">
        <div className="flex items-center gap-2 px-2">
          <TrendingUp className="text-indigo-400 animate-pulse" size={20} />
          <h3 className="text-sm font-medium text-slate-300 uppercase tracking-widest">Tendencia de Abundancia</h3>
        </div>
        <div className="h-64 w-full bg-white/5 rounded animate-pulse" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white/[0.02] border border-red-500/20 p-6 rounded-[2.5rem] space-y-4">
        <div className="flex items-center gap-2 px-2">
          <TrendingUp className="text-red-400" size={20} />
          <h3 className="text-sm font-medium text-red-300">Error al cargar grafico</h3>
        </div>
        <p className="text-slate-400 text-sm">{error?.message || 'No se pudieron cargar las metricas'}</p>
      </div>
    );
  }

  const chartData = Array.isArray(data) ? data : [];

  if (chartData.length === 0) {
    return (
      <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2.5rem] space-y-4">
        <div className="flex items-center gap-2 px-2">
          <TrendingUp className="text-indigo-400" size={20} />
          <h3 className="text-sm font-medium text-slate-300 uppercase tracking-widest">Tendencia de Abundancia</h3>
        </div>
        <div className="h-64 w-full flex items-center justify-center text-slate-400">
          <p className="text-sm">Sin datos de los ultimos 30 dias</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white/[0.02] border border-white/5 p-6 rounded-[2.5rem] space-y-4 trend-chart-container ${isBreathing ? 'breathing' : ''}`}>
      <div className="flex items-center gap-2 px-2">
        <TrendingUp className={`text-indigo-400 ${isBreathing ? 'animate-pulse' : ''}`} size={20} />
        <h3 className="text-sm font-medium text-slate-300 uppercase tracking-widest">Electrocardiograma Financiero</h3>
        {isBreathing && <span className="text-xs text-green-400 animate-pulse">💓 Nuevo dato recibido</span>}
      </div>
      
      <div className="h-64 w-full ecg-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={isBreathing ? 0.5 : 0.3}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" className="ecg-grid" />
            <XAxis 
              dataKey="date" 
              hide={true}
            />
            <YAxis hide={true} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }}
              itemStyle={{ color: '#818cf8' }}
              labelClassName="text-slate-400 text-xs"
            />
            <Area 
              type="monotone" 
              dataKey="revenue_today"
              stroke="#818cf8" 
              strokeWidth={isBreathing ? 4 : 3}
              fillOpacity={1} 
              fill="url(#colorValue)"
              dot={false}
              className="ecg-line"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;