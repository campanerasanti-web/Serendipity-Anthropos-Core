import React, { useState, useEffect } from 'react';
import { getOrderStats } from '../api/ordersApi';

/**
 * Panel de estadísticas de órdenes
 */
export default function OrderStatsPanel() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      const data = await getOrderStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="stats-panel loading">
        <span className="spinner">⏳</span>
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-panel error">
        <span>❌</span>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="order-stats-panel">
      <h3>📊 Estadísticas de Órdenes</h3>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Órdenes</div>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{stats.byStatus.pending}</div>
            <div className="stat-label">Pendientes</div>
          </div>
        </div>

        <div className="stat-card in-progress">
          <div className="stat-icon">⚙️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.byStatus.inProgress}</div>
            <div className="stat-label">En Progreso</div>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.byStatus.completed}</div>
            <div className="stat-label">Completadas</div>
          </div>
        </div>

        <div className="stat-card overdue">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.overdue}</div>
            <div className="stat-label">Vencidas</div>
          </div>
        </div>

        <div className="stat-card urgent">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.byPriority.urgent}</div>
            <div className="stat-label">Urgentes</div>
          </div>
        </div>
      </div>

      <button className="refresh-btn" onClick={loadStats}>
        🔄 Actualizar
      </button>
    </div>
  );
}
