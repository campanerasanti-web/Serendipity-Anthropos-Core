/**
 * MÓDULO KAIZEN - MEJORA CONTINUA 1% DIARIO
 * "Cada día, un paso más cerca de la perfección imposible"
 * 
 * Inspirado en la filosofía Zen de Dōgen y el Kaizen japonés
 */

import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n/I18nContext';

export interface KaizenImprovement {
  id: string;
  date: Date;
  category: 'productivity' | 'quality' | 'cost' | 'safety' | 'morale' | 'efficiency';
  title: string;
  description: string;
  currentState: string;
  targetState: string;
  implementationSteps: string[];
  expectedImpact: number; // Porcentaje de mejora (1% es lo ideal)
  status: 'proposed' | 'in-progress' | 'completed' | 'archived';
  implementedBy?: string;
  completionDate?: Date;
  actualImpact?: number;
  lessons?: string;
}

export interface KaizenStats {
  totalImprovements: number;
  completedImprovements: number;
  cumulativeImpact: number; // Suma de impactos
  averageDailyImprovement: number;
  streak: number; // Días consecutivos con mejoras
}

/**
 * Hook para gestionar mejoras Kaizen
 */
export const useKaizen = () => {
  const [improvements, setImprovements] = useState<KaizenImprovement[]>(() => {
    const saved = localStorage.getItem('serendipity-kaizen-improvements');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((imp: any) => ({
          ...imp,
          date: new Date(imp.date),
          completionDate: imp.completionDate ? new Date(imp.completionDate) : undefined,
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('serendipity-kaizen-improvements', JSON.stringify(improvements));
  }, [improvements]);

  const createImprovement = (
    category: KaizenImprovement['category'],
    title: string,
    description: string,
    currentState: string,
    targetState: string,
    implementationSteps: string[],
    expectedImpact: number
  ): KaizenImprovement => {
    const improvement: KaizenImprovement = {
      id: `kaizen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: new Date(),
      category,
      title,
      description,
      currentState,
      targetState,
      implementationSteps,
      expectedImpact,
      status: 'proposed',
    };

    setImprovements((prev) => [improvement, ...prev]);
    console.log(`📈 Nueva mejora Kaizen propuesta: ${title}`);
    return improvement;
  };

  const updateImprovementStatus = (
    id: string,
    status: KaizenImprovement['status'],
    actualImpact?: number,
    lessons?: string
  ) => {
    setImprovements((prev) =>
      prev.map((imp) =>
        imp.id === id
          ? {
              ...imp,
              status,
              completionDate: status === 'completed' ? new Date() : imp.completionDate,
              actualImpact,
              lessons,
            }
          : imp
      )
    );
  };

  const getStats = (): KaizenStats => {
    const total = improvements.length;
    const completed = improvements.filter((i) => i.status === 'completed').length;
    const cumulativeImpact = improvements
      .filter((i) => i.status === 'completed' && i.actualImpact)
      .reduce((sum, i) => sum + (i.actualImpact || 0), 0);

    // Calcular racha (días consecutivos con mejoras completadas)
    const sortedCompleted = improvements
      .filter((i) => i.status === 'completed')
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedCompleted.length; i++) {
      const impDate = new Date(sortedCompleted[i].completionDate || sortedCompleted[i].date);
      impDate.setHours(0, 0, 0, 0);
      const dayDiff = Math.floor((today.getTime() - impDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dayDiff === i) {
        streak++;
      } else {
        break;
      }
    }

    const averageDailyImprovement = completed > 0 ? cumulativeImpact / completed : 0;

    return {
      totalImprovements: total,
      completedImprovements: completed,
      cumulativeImpact,
      averageDailyImprovement,
      streak,
    };
  };

  const getImprovementsByCategory = (category: KaizenImprovement['category']) => {
    return improvements.filter((i) => i.category === category);
  };

  const getImprovementsByStatus = (status: KaizenImprovement['status']) => {
    return improvements.filter((i) => i.status === status);
  };

  return {
    improvements,
    createImprovement,
    updateImprovementStatus,
    getStats,
    getImprovementsByCategory,
    getImprovementsByStatus,
  };
};

/**
 * Componente visual del módulo Kaizen
 */
export const KaizenModule: React.FC = () => {
  const { t } = useI18n();
  const {
    improvements,
    createImprovement,
    updateImprovementStatus,
    getStats,
    getImprovementsByStatus,
  } = useKaizen();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<KaizenImprovement['status'] | 'all'>('all');

  const stats = getStats();

  const getCategoryIcon = (category: KaizenImprovement['category']) => {
    switch (category) {
      case 'productivity':
        return '⚡';
      case 'quality':
        return '💎';
      case 'cost':
        return '💰';
      case 'safety':
        return '🛡️';
      case 'morale':
        return '😊';
      case 'efficiency':
        return '🎯';
    }
  };

  const getCategoryColor = (category: KaizenImprovement['category']) => {
    switch (category) {
      case 'productivity':
        return '#667eea';
      case 'quality':
        return '#10b981';
      case 'cost':
        return '#f59e0b';
      case 'safety':
        return '#ef4444';
      case 'morale':
        return '#ec4899';
      case 'efficiency':
        return '#06b6d4';
    }
  };

  const filteredImprovements =
    filterStatus === 'all' ? improvements : getImprovementsByStatus(filterStatus);

  return (
    <div className="kaizen-module">
      {/* Header con estadísticas */}
      <div className="kaizen-header">
        <div className="kaizen-title">
          <h2>📈 Módulo Kaizen - 改善</h2>
          <p className="zen-quote">
            🕯️ "Cada día, un paso. Cada paso, una mejora. La perfección es el camino, no el
            destino." - Inspirado en Dōgen Zenji
          </p>
        </div>

        <div className="kaizen-stats-grid">
          <div className="stat-card total">
            <span className="stat-value">{stats.totalImprovements}</span>
            <span className="stat-label">Total Propuestas</span>
          </div>
          <div className="stat-card completed">
            <span className="stat-value">{stats.completedImprovements}</span>
            <span className="stat-label">Completadas</span>
          </div>
          <div className="stat-card impact">
            <span className="stat-value">{stats.cumulativeImpact.toFixed(1)}%</span>
            <span className="stat-label">Mejora Acumulada</span>
          </div>
          <div className="stat-card streak">
            <span className="stat-value">🔥 {stats.streak}</span>
            <span className="stat-label">Racha (días)</span>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="kaizen-controls">
        <button
          className="create-improvement-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? '✕ Cancelar' : '+ Nueva Mejora Kaizen'}
        </button>

        <div className="filter-buttons">
          <button
            className={filterStatus === 'all' ? 'active' : ''}
            onClick={() => setFilterStatus('all')}
          >
            Todas
          </button>
          <button
            className={filterStatus === 'proposed' ? 'active' : ''}
            onClick={() => setFilterStatus('proposed')}
          >
            💡 Propuestas
          </button>
          <button
            className={filterStatus === 'in-progress' ? 'active' : ''}
            onClick={() => setFilterStatus('in-progress')}
          >
            🔨 En Progreso
          </button>
          <button
            className={filterStatus === 'completed' ? 'active' : ''}
            onClick={() => setFilterStatus('completed')}
          >
            ✅ Completadas
          </button>
        </div>
      </div>

      {/* Formulario de creación (simplificado - expandir según necesidad) */}
      {showCreateForm && (
        <div className="create-improvement-form">
          <h3>Nueva Mejora Kaizen</h3>
          <p className="form-note">
            Recuerda: El objetivo es mejorar un 1% cada día. Pequeños pasos llevan a grandes
            transformaciones.
          </p>
          <button
            className="submit-btn"
            onClick={() => {
              createImprovement(
                'efficiency',
                'Mejora de ejemplo',
                'Descripción de la mejora',
                'Estado actual',
                'Estado objetivo',
                ['Paso 1', 'Paso 2'],
                1.0
              );
              setShowCreateForm(false);
            }}
          >
            Crear Mejora (Demo)
          </button>
        </div>
      )}

      {/* Lista de mejoras */}
      <div className="improvements-list">
        {filteredImprovements.length === 0 ? (
          <div className="empty-state">
            <p>
              No hay mejoras{' '}
              {filterStatus !== 'all' ? `con estado ${filterStatus}` : ''}.
            </p>
            <button onClick={() => setShowCreateForm(true)}>Proponer primera mejora</button>
          </div>
        ) : (
          filteredImprovements.map((imp) => (
            <div
              key={imp.id}
              className={`improvement-card ${imp.status}`}
              style={{ borderLeftColor: getCategoryColor(imp.category) }}
            >
              <div className="improvement-header">
                <span className="category-icon">{getCategoryIcon(imp.category)}</span>
                <h4>{imp.title}</h4>
                <span className={`status-badge ${imp.status}`}>
                  {imp.status === 'proposed'
                    ? '💡 Propuesta'
                    : imp.status === 'in-progress'
                    ? '🔨 En Progreso'
                    : imp.status === 'completed'
                    ? '✅ Completada'
                    : '📦 Archivada'}
                </span>
              </div>

              <p className="improvement-description">{imp.description}</p>

              <div className="improvement-details">
                <div className="state-comparison">
                  <div className="state">
                    <strong>📍 Estado Actual:</strong>
                    <p>{imp.currentState}</p>
                  </div>
                  <div className="arrow">→</div>
                  <div className="state">
                    <strong>🎯 Estado Objetivo:</strong>
                    <p>{imp.targetState}</p>
                  </div>
                </div>

                <div className="impact">
                  <strong>📊 Impacto Esperado:</strong>
                  <span className="impact-value">+{imp.expectedImpact}%</span>
                  {imp.actualImpact && (
                    <span className="actual-impact">
                      (Real: +{imp.actualImpact}%)
                    </span>
                  )}
                </div>

                <div className="implementation-steps">
                  <strong>📋 Pasos de Implementación:</strong>
                  <ol>
                    {imp.implementationSteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>

                {imp.lessons && (
                  <div className="lessons">
                    <strong>💡 Lecciones Aprendidas:</strong>
                    <p>{imp.lessons}</p>
                  </div>
                )}
              </div>

              <div className="improvement-actions">
                {imp.status === 'proposed' && (
                  <button
                    onClick={() => updateImprovementStatus(imp.id, 'in-progress')}
                  >
                    🔨 Iniciar
                  </button>
                )}
                {imp.status === 'in-progress' && (
                  <button
                    onClick={() => updateImprovementStatus(imp.id, 'completed', imp.expectedImpact)}
                  >
                    ✅ Completar
                  </button>
                )}
              </div>

              <div className="improvement-meta">
                <span>Creada: {imp.date.toLocaleDateString()}</span>
                {imp.completionDate && (
                  <span>Completada: {imp.completionDate.toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer con sabiduría Zen */}
      <div className="kaizen-footer">
        <p className="zen-wisdom">
          🌸 "Shoshin - Mente de principiante. Cada mejora es el primer paso de un camino eterno."
        </p>
      </div>
    </div>
  );
};
