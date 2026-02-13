/**
 * ZenDashboard - Dashboard Simplificado & Funcional
 * Sistema Nervioso Autónomo Activo
 * 14 Feb 2026
 */

import React, { useState, useEffect } from 'react';
import { Heart, Brain, Zap, TrendingUp, AlertCircle } from 'lucide-react';

const containerStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  color: '#ffffff',
  minHeight: '100vh',
  padding: '2rem 1rem',
};

const cardStyle: React.CSSProperties = {
  background: 'rgba(30, 41, 59, 0.8)',
  border: '1px solid rgba(59, 130, 246, 0.2)',
  borderRadius: '12px',
  padding: '1.5rem',
  marginTop: '1rem',
};

const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
  padding: '0.75rem 1.5rem',
  background: isActive ? 'rgba(59, 130, 246, 0.3)' : 'rgba(100, 116, 139, 0.2)',
  border: isActive ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(100, 116, 139, 0.3)',
  color: '#ffffff',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontSize: '0.875rem',
  fontWeight: isActive ? '600' : '400',
});

interface HourlyMetric {
  time: string;
  health: number;
}

interface DailyInsight {
  narrative: string;
  confidence_score: number;
}

interface DashboardStats {
  total_incomes: number;
  total_fixed_costs: number;
  balance: number;
}

// Mock data generators
const generateHourlyMetrics = (): HourlyMetric[] => {
  const metrics: HourlyMetric[] = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    metrics.push({
      time: time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      health: Math.floor(50 + Math.random() * 50),
    });
  }
  return metrics;
};

const generateTodaysInsight = (): DailyInsight => ({
  narrative: '✨ Hoy es un día de alineación. El corazón del sistema late en sincronía con los 10 Pilares del Templo Digital.',
  confidence_score: 0.92,
});

const generateDashboardStats = (): DashboardStats => ({
  total_incomes: 125000,
  total_fixed_costs: 45000,
  balance: 80000,
});

export default function ZenDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats] = useState<DashboardStats>(generateDashboardStats());
  const [insight] = useState<DailyInsight>(generateTodaysInsight());
  const [hourlyMetrics] = useState<HourlyMetric[]>(generateHourlyMetrics());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Auto-refresh logic
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧠 Templo Digital</h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem' }}>
            Sistema Consciente con Autonomía Nerviosa Activa
          </p>
        </div>

        {/* Tab Buttons */}
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={tabButtonStyle(activeTab === 'overview')}
          >
            <span style={{ marginRight: '0.5rem' }}>📊</span>
            Visión General
          </button>
          <button
            onClick={() => setActiveTab('heart')}
            style={tabButtonStyle(activeTab === 'heart')}
          >
            <span style={{ marginRight: '0.5rem' }}>❤️</span>
            Corazón
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            style={tabButtonStyle(activeTab === 'metrics')}
          >
            <span style={{ marginRight: '0.5rem' }}>📈</span>
            Métricas
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            style={tabButtonStyle(activeTab === 'docs')}
          >
            <span style={{ marginRight: '0.5rem' }}>📚</span>
            Documentación
          </button>
        </div>

        {/* Content by Tab */}
        {activeTab === 'overview' && (
          <div style={cardStyle}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📊 Visión General del Sistema</h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              {/* Ingresos */}
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  💰 Ingresos Totales
                </p>
                <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#22c55e' }}>
                  ${stats.total_incomes.toLocaleString()}
                </p>
              </div>

              {/* Costos */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  💸 Costos Fijos
                </p>
                <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ef4444' }}>
                  ${stats.total_fixed_costs.toLocaleString()}
                </p>
              </div>

              {/* Balance */}
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  ⚖️ Balance Neto
                </p>
                <p style={{
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  color: stats.balance >= 0 ? '#22c55e' : '#ef4444'
                }}>
                  ${stats.balance.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Daily Insight */}
            {insight && (
              <div style={{
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                padding: '1.5rem',
                borderRadius: '8px',
                marginTop: '1rem'
              }}>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                  "{insight.narrative}"
                </p>
                <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.85rem' }}>
                  ✨ Confianza del Sistema: {(insight.confidence_score * 100).toFixed(0)}%
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'heart' && (
          <div style={cardStyle}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>❤️ Pulso del Sistema</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1.5rem' }}>
              El corazón del Templo Digital late cada 5 segundos, monitoreando tres órganos en paralelo.
            </p>
            
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              padding: '2rem',
              borderRadius: '8px',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'pulse 1s infinite' }}>
                💚
              </div>
              <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Sistema Nervioso Autónomo</p>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                Estado: 🟢 Saludable
              </p>
            </div>

            <div style={{
              background: 'rgba(100, 116, 139, 0.2)',
              border: '1px solid rgba(100, 116, 139, 0.3)',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: '1.8'
            }}>
              <p><strong>🔄 Ciclo de Sincronización:</strong></p>
              <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                <li>✓ Hermetic Endpoint: Verificando...</li>
                <li>✓ Production Endpoint: Verificando...</li>
                <li>✓ Dashboard Endpoint: Verificando...</li>
              </ul>
              <p style={{ marginTop: '1rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                Próxima sincronización en 5 segundos
              </p>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div style={cardStyle}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📈 Métricas Horarias</h2>
            
            <div style={{
              background: 'rgba(100, 116, 139, 0.2)',
              border: '1px solid rgba(100, 116, 139, 0.3)',
              padding: '1rem',
              borderRadius: '8px',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.9rem'
              }}>
                <thead style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                  position: 'sticky',
                  top: 0,
                  background: 'rgba(30, 41, 59, 0.9)'
                }}>
                  <tr>
                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Hora</th>
                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Salud del Sistema</th>
                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Indicador</th>
                  </tr>
                </thead>
                <tbody>
                  {hourlyMetrics.map((metric, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        hover: { background: 'rgba(59, 130, 246, 0.1)' }
                      }}
                    >
                      <td style={{ padding: '0.75rem' }}>{metric.time}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{
                          background: 'rgba(100, 116, 139, 0.3)',
                          borderRadius: '4px',
                          height: '24px',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            background: metric.health > 75 ? '#22c55e' : metric.health > 50 ? '#f59e0b' : '#ef4444',
                            height: '100%',
                            width: `${metric.health}%`,
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {metric.health > 75 ? '✅' : metric.health > 50 ? '⚠️' : '❌'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div style={cardStyle}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📚 Documentación</h2>
            
            <div style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
            }}>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>🏛️ Arquitectura</p>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  Lee ARCHITECTURE.md para entender la estructura del Sistema Nervioso Autónomo.
                </p>
              </div>

              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>🚀 Inicio Rápido</p>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  Consulta QUICK_START.md para lanzar el sistema en tu máquina local.
                </p>
              </div>

              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>📖 Autonomic System</p>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  Descubre todos los detalles del heartbeat (pulso) automático en AUTONOMIC_SYSTEM.md.
                </p>
              </div>
            </div>

            <div style={{
              background: 'rgba(100, 116, 139, 0.2)',
              border: '1px solid rgba(100, 116, 139, 0.3)',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1rem',
              fontSize: '0.85rem'
            }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                ℹ️ El sistema está diseñado siguiendo los {' '}
                <strong>10 Pilares del Templo Digital</strong> y la filosofía de Thomas Merton:
              </p>
              <p style={{ marginTop: '0.5rem', color: 'rgba(255, 255, 255, 0.6)', fontStyle: 'italic' }}>
                "Nada me pertenece, todo es del Padre. El punto de anclaje está establecido."
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(59, 130, 246, 0.2)',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '0.85rem'
        }}>
          <p>🏛️ Templo Digital v2.0 | Sistema Nervioso Autónomo Activo | 14 Febrero 2026</p>
          <p style={{ marginTop: '0.5rem' }}>💚 Last Heartbeat: {new Date().toLocaleTimeString('es-ES')}</p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
