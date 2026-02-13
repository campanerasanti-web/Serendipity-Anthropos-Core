/**
 * Layout tipo biblioteca zen - navegación por secciones
 */

import React from 'react';
import { Book, TrendingUp, MessageSquare, Package, Heart, BarChart3, Sparkles } from 'lucide-react';

interface Section {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
}

const SECTIONS: Section[] = [
  { id: 'overview', icon: Book, label: 'Visión General', color: 'text-slate-600' },
  { id: 'metrics', icon: BarChart3, label: 'Métricas', color: 'text-blue-600' },
  { id: 'flow', icon: TrendingUp, label: 'Flujo Temporal', color: 'text-emerald-600' },
  { id: 'wip', icon: Package, label: 'WIP', color: 'text-amber-600' },
  { id: 'inbox', icon: MessageSquare, label: 'Comunicaciones', color: 'text-purple-600' },
  { id: 'tapestry', icon: Sparkles, label: 'Telar de Sabiduría', color: 'text-pink-600' },
  { id: 'rituals', icon: Heart, label: 'Rituales', color: 'text-rose-600' },
];

interface LibraryLayoutProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  children: React.ReactNode;
}

export const LibraryLayout: React.FC<LibraryLayoutProps> = ({
  activeSection,
  onSectionChange,
  children,
}) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-neutral-100">
      {/* Sidebar tipo estantería */}
      <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-light text-slate-800 tracking-wide">
            Biblioteca Sofia
          </h1>
          <p className="text-xs text-slate-500 mt-1">Sistema de recursos vivos</p>
        </div>

        <nav className="p-4 space-y-1">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-slate-100 shadow-sm'
                    : 'hover:bg-slate-50'
                }`}
              >
                <Icon
                  size={20}
                  className={isActive ? section.color : 'text-slate-400'}
                />
                <span
                  className={`text-sm font-medium ${
                    isActive ? 'text-slate-800' : 'text-slate-600'
                  }`}
                >
                  {section.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-white/60">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sistema sincronizado</span>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
