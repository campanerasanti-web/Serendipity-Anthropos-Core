/**
 * Lista WIP minimalista con tarjetas zen
 */

import React from 'react';
import { Package, Clock, User } from 'lucide-react';
import { loadGardenMemory } from '../../services/gardenMemory';

export const ZenWipList: React.FC = () => {
  const memory = loadGardenMemory();
  const wips = memory.wips.filter((w) => w.status === 'WIP');
  const jobCards = (memory.jobCards || []).filter((job) => job.status !== 'completado');
  const statusLabels: Record<string, string> = {
    grabado: 'Marcado',
    planchado: 'Termofijado',
    hablandado: 'Ablandado',
    medicion: 'Control de Medicion',
    reproceso: 'Reproceso',
  };

  if (wips.length === 0 && jobCards.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <div className="text-center">
          <Package className="mx-auto text-slate-300 mb-3" size={32} />
          <p className="text-sm text-slate-500">No hay órdenes en proceso</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {jobCards.map((job) => {
        const daysSinceAdded = Math.floor(
          (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        );

        return (
          <div
            key={job.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="text-slate-400 group-hover:text-emerald-500 transition-colors" size={16} />
                  <h4 className="text-sm font-medium text-slate-700">{job.title}</h4>
                </div>
                <p className="text-xs text-slate-500 mb-3">JobCard · {statusLabels[job.status] || job.status}</p>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{daysSinceAdded}d en proceso</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>{job.assignedAgent === 'ops_gardener' ? 'OpsGardener' : 'AnthroposCore'}</span>
                  </div>
                </div>
              </div>

              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        );
      })}
      {wips.map((wip) => {
        const daysSinceAdded = Math.floor(
          (Date.now() - new Date(wip.addedAt).getTime()) / (1000 * 60 * 60 * 24)
        );

        return (
          <div
            key={wip.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="text-slate-400 group-hover:text-emerald-500 transition-colors" size={16} />
                  <h4 className="text-sm font-medium text-slate-700">{wip.clientName}</h4>
                </div>
                <p className="text-xs text-slate-500 mb-3">{wip.orderNumber}</p>
                
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{daysSinceAdded}d en proceso</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>En taller</span>
                  </div>
                </div>
              </div>

              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
