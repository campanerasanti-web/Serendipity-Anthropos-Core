/**
 * Línea de tiempo visual de eventos del jardín
 */

import React from 'react';
import { Clock, TrendingUp, TrendingDown, FileText } from 'lucide-react';
import { loadGardenMemory } from '../../services/gardenMemory';

export const GardenTimeline: React.FC = () => {
  const memory = loadGardenMemory();
  
  // Combinar todos los eventos y ordenar por fecha
  const allEvents = [
    ...memory.payments.map((p) => ({
      type: p.type,
      date: p.createdAt,
      amount: p.amount,
      description: p.description,
      icon: p.type === 'ingreso' ? TrendingUp : TrendingDown,
      color: p.type === 'ingreso' ? 'text-green-600' : 'text-red-600',
      bgColor: p.type === 'ingreso' ? 'bg-green-50' : 'bg-red-50',
      borderColor: p.type === 'ingreso' ? 'border-green-200' : 'border-red-200',
    })),
    ...memory.wips.map((w) => ({
      type: 'wip',
      date: w.addedAt,
      amount: 0,
      description: `WIP: ${w.clientName} - ${w.orderNumber}`,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10); // Últimos 10 eventos

  if (allEvents.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-emerald-300/40 bg-gradient-to-b from-[#f7f2e5] to-[#e8f5e3] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="text-emerald-600" size={24} />
        <h3 className="text-xl font-semibold text-emerald-900">
          Memoria Reciente del Jardín
        </h3>
      </div>

      <div className="space-y-3">
        {allEvents.map((event, idx) => {
          const Icon = event.icon;
          const date = new Date(event.date);
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-lg border ${event.bgColor} ${event.borderColor} transition-all hover:shadow-md`}
            >
              <div className={`p-2 rounded-full bg-white ${event.color}`}>
                <Icon size={16} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {event.description}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {isToday ? 'Hoy' : date.toLocaleDateString('es-ES')} •{' '}
                  {date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {event.amount > 0 && (
                <div className="text-right">
                  <p className={`text-sm font-semibold ${event.color}`}>
                    ${event.amount.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-emerald-700 mt-4 text-center">
        Última sincronización: {new Date(memory.lastSync).toLocaleTimeString('es-ES')}
      </p>
    </div>
  );
};
