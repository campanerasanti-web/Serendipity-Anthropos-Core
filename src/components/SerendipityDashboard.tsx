import React, { useState, useEffect, useCallback } from 'react';
import './SerendipityDashboard.tsx.css';
import { useSystemHealth } from '../hooks/useSystemHealth';
import { useEmergencyMode } from '../hooks/useEmergencyMode';
import { useFinancialClimate } from '../hooks/useFinancialClimate';
import { RainDrops } from './RainDrops';
import { useI18n, LanguageSelector, RoleSelector } from '../i18n/I18nContext';
import { SentimentChatbot } from './SentimentChatbot';
import { QRTrackingPanel } from './QRTrackingPanel';
import { SantiPersonalPanel } from './SantiPersonalPanel';
import { OfflineIndicator, OfflineIndicatorCompact } from './OfflineIndicator';
import { KaizenModule } from './KaizenModule';
import { GoogleWorkspaceAssistant } from './GoogleWorkspaceAssistant';
import { TETPreparationPanel } from './TETPreparationPanel';
import OperationalPlanPage from '../pages/OperationalPlanPage';
import ExecutiveSummaryPage from '../pages/ExecutiveSummaryPage';
import TechnicalManualPage from '../pages/TechnicalManualPage';
import ChecklistsPage from '../pages/ChecklistsPage';
import KPIDashboardPage from '../pages/KPIDashboardPage';
import GlobalAssistantBubble from './GlobalAssistantBubble';
import apiClient from '../api/apiClient';
import { fetchSerendipityDashboard } from '../services/queries';
import { useFixedCostsRealtime, useInvoicesRealtime } from '../hooks/useRealtimeSubscription';
import SerendipityReportDashboard from './SerendipityReportDashboard';

interface FinancialState {
  monthlyRevenue: number;
  monthlyExpenses: number;
  profitMargin: number;
  monthlyPayroll: number;
  praraRevenuePercentage: number;
  totalCustomers: number;
  qualityErrorRate: number;
  onTimeDeliveryRate: number;
}

interface TeamMember {
  name: string;
  role: string;
  salary: number;
  tier: string;
  valueContribution: number;
  equityScore: number;
}

interface Alert {
  severity: string;
  category: string;
  message: string;
  recommendation: string;
  injusticeType: string;
}

interface Recommendation {
  priority: number;
  title: string;
  description: string;
  impact: string;
  ethicalAlignment: string;
  actionItems: string[];
  timeline: string;
}

export const SerendipityDashboard: React.FC = () => {
  const [financial, setFinancial] = useState<FinancialState | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'financial' | 'team' | 'alerts' | 'recommendations' | 'qr-tracking' | 'personal-panel' | 'kaizen' | 'google-workspace' | 'tet-preparation' | 'operational-plan' | 'executive-report' | 'technical-manual' | 'checklists' | 'kpi-dashboard'>('financial');
  const [heartCoherence, setHeartCoherence] = useState<'coherent' | 'incoherent' | 'stressed' | 'unknown'>('unknown');
  
  // 🌐 Hook de traducción
  const { t, currentRole } = useI18n();

  // 🌟 HOOKS BIO-DIGITALES
  const systemHealth = useSystemHealth();
  const emergencyMode = useEmergencyMode(financial || undefined);
  
  // Preparar datos para Oráculo Meteorológico
  const climateProjection = useFinancialClimate(
    financial ? {
      dailyRevenues: Array(31).fill(financial.monthlyRevenue / 31), // Simulado
      dailyExpenses: Array(31).fill(financial.monthlyExpenses / 31),
      currentBalance: financial.monthlyRevenue - financial.monthlyExpenses,
      profitMargin: financial.profitMargin,
    } : undefined
  );

  useEffect(() => {
    let mounted = true;

    const fetchPulse = async () => {
      try {
        const data = await apiClient.get('/api/anthropos/pulse');
        if (mounted) {
          const coherence = data?.coherence || 'unknown';
          setHeartCoherence(coherence);
        }
      } catch (err) {
        if (mounted) setHeartCoherence('unknown');
      }
    };

    fetchPulse();
    const intervalId = window.setInterval(fetchPulse, 30000);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchSerendipityDashboard();
      
      setFinancial(data.financial);
      setTeam(data.team);
      setAlerts(data.alerts);
      setRecommendations(data.recommendations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching Serendipity data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRealtimeUpdate = useCallback(() => {
    void fetchDashboardData();
  }, [fetchDashboardData]);

  useInvoicesRealtime(handleRealtimeUpdate);
  useFixedCostsRealtime(handleRealtimeUpdate);

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(2) + 'B VND';
    }
    if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1) + 'M VND';
    }
    return value.toLocaleString() + ' VND';
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return '#ff4444';
      case 'HIGH': return '#ff9800';
      case 'OPPORTUNITY': return '#4caf50';
      default: return '#2196f3';
    }
  };

  if (loading) {
    return (
      <div className="serendipity-dashboard loading">
        <div className="loader">{t.dashboard.loading}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="serendipity-dashboard error">
        <div className="error-message">
          <h2>{t.dashboard.error}</h2>
          <p>{error}</p>
          <button onClick={fetchDashboardData}>{t.dashboard.refresh}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`serendipity-dashboard bio-digital ${emergencyMode.isEmergency ? 'is-emergency' : ''} ${systemHealth.shouldGlowGreen ? 'system-healthy-glow' : ''}`} data-emergency-severity={emergencyMode.severity}>
      
      {/* Gotas de Luz cuando entra ingreso grande */}
      <RainDrops isActive={climateProjection.shouldShowRainAnimation} />
      
      <header className="dashboard-header heartbeat-header">
        <div className="system-heartbeat">
          <div className="heartbeat-icon animate-pulse"></div>
          <div className="system-status">
            <span className={`status-indicator ${systemHealth.overall === 'healthy' ? 'active' : systemHealth.overall === 'degraded' ? 'warning' : 'critical'}`}></span>
            <span className="status-text">
              {systemHealth.overall === 'healthy' ? t.systemHealth.healthy : 
               systemHealth.overall === 'degraded' ? t.systemHealth.degraded : 
               t.systemHealth.critical}
            </span>
          </div>
          <div className={`anthropos-heart ${heartCoherence}`}>
            <span className="heart-icon">❤</span>
            <span className="heart-label">Coherencia: {heartCoherence}</span>
          </div>
          <div className="agents-status">
            <span className="agents-count">{systemHealth.healthyCount}/10 {t.systemHealth.agents}</span>
            <span className="api-count">{systemHealth.apiEndpointsHealthy}/6 {t.systemHealth.apis}</span>
          </div>
        </div>
        
        {/* Selectores de idioma y rol */}
        <div className="header-controls">
          <OfflineIndicatorCompact />
          <LanguageSelector />
          <RoleSelector />
        </div>
        
        {/* Modo Emergencia Banner */}
        {emergencyMode.isEmergency && (
          <div className="emergency-banner">
            <span className="emergency-icon">🚨</span>
            <span className="emergency-message">{emergencyMode.message}</span>
            {emergencyMode.unpaidInvoicesCount > 0 && (
              <span className="unpaid-invoices">{emergencyMode.unpaidInvoicesCount} facturas impagadas</span>
            )}
          </div>
        )}

        {/* Oráculo Meteorológico */}
        <div className="climate-oracle">
          <span className="climate-icon">{climateProjection.icon}</span>
          <div className="climate-info">
            <h2 className="climate-season">🌟 El Mediador de Sofía - {climateProjection.season === 'cosecha' ? 'Época de Cosecha' : 
                                                                      climateProjection.season === 'siembra' ? 'Época de Siembra' :
                                                                      climateProjection.season === 'sequia' ? 'Tierra Seca' :
                                                                      'Tormenta Inminente'}</h2>
            <p className="climate-narrative">{climateProjection.narrative}</p>
          </div>
        </div>

        <div className="vital-signs">
          <span className="vital">💓 Latidos: {team.length} células</span>
          <span className="vital">🚨 Alertas: {alerts.length}</span>
          <span className="vital">✨ Recomendaciones: {recommendations.length}</span>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button
          className={`nav-btn ${activeTab === 'financial' ? 'active' : ''}`}
          onClick={() => setActiveTab('financial')}
        >
          💰 {t.tabs.financial}
        </button>
        <button
          className={`nav-btn ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          👥 {t.tabs.team} ({team.length})
        </button>
        <button
          className={`nav-btn ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          🚨 {t.tabs.alerts} ({alerts.length})
        </button>
        <button
          className={`nav-btn ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          ✨ {t.tabs.recommendations} ({recommendations.length})
        </button>
        <button
          className={`nav-btn ${activeTab === 'qr-tracking' ? 'active' : ''}`}
          onClick={() => setActiveTab('qr-tracking')}
        >
          📱 {t.tabs.qrTracking}
        </button>
        {currentRole === 'admin' && (
          <button
            className={`nav-btn ${activeTab === 'personal-panel' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal-panel')}
          >
            👤 {t.tabs.personalPanel}
          </button>
        )}
        <button
          className={`nav-btn ${activeTab === 'kaizen' ? 'active' : ''}`}
          onClick={() => setActiveTab('kaizen')}
        >
          📈 Kaizen 改善
        </button>
        {currentRole === 'admin' && (
          <>
            <button
              className={`nav-btn ${activeTab === 'google-workspace' ? 'active' : ''}`}
              onClick={() => setActiveTab('google-workspace')}
            >
              📧 Google Workspace
            </button>
            <button
              className={`nav-btn ${activeTab === 'tet-preparation' ? 'active' : ''}`}
              onClick={() => setActiveTab('tet-preparation')}
            >
              🎊 Protocolo TET
            </button>
          </>
        )}
        
        {/* NUEVOS TABS DEL PLAN OPERATIVO */}
        <button
          className={`nav-btn ${activeTab === 'operational-plan' ? 'active' : ''}`}
          onClick={() => setActiveTab('operational-plan')}
        >
          🗓️ Plan Operativo
        </button>
        <button
          className={`nav-btn ${activeTab === 'executive-report' ? 'active' : ''}`}
          onClick={() => setActiveTab('executive-report')}
        >
          📊 Executive Report
        </button>
        <button
          className={`nav-btn ${activeTab === 'technical-manual' ? 'active' : ''}`}
          onClick={() => setActiveTab('technical-manual')}
        >
          🛠️ Manual Técnico
        </button>
        <button
          className={`nav-btn ${activeTab === 'checklists' ? 'active' : ''}`}
          onClick={() => setActiveTab('checklists')}
        >
          ☑️ Checklists
        </button>
        <button
          className={`nav-btn ${activeTab === 'kpi-dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('kpi-dashboard')}
        >
          📈 KPIs Globales
        </button>
      </nav>

      <main className="dashboard-content">
        {/* FINANCIAL TAB */}
        {activeTab === 'financial' && financial && (
          <section className="section financial-section">
            <h2>📊 Estado Financiero - Corazón del Sistema</h2>
            
            <div className="metrics-grid">
              <div className="metric-card revenue animate-pulse-slow">
                <div className="heartbeat-indicator"></div>
                <h3>Ingresos Mensuales</h3>
                <p className="amount">{formatCurrency(financial.monthlyRevenue * 1000000)}</p>
                <div className="pulse-wave"></div>
              </div>

              <div className="metric-card expenses">
                <h3>Gastos Mensuales</h3>
                <p className="amount">{formatCurrency(financial.monthlyExpenses * 1000000)}</p>
                <progress value={financial.monthlyExpenses / financial.monthlyRevenue * 100} max={100} />
              </div>

              <div className="metric-card margin animate-pulse-slow">
                <div className="heartbeat-indicator"></div>
                <h3>Margen Bruto</h3>
                <p className="amount">{financial.profitMargin}%</p>
                <p className="percentage">{formatCurrency((financial.monthlyRevenue - financial.monthlyExpenses) * 1000000)}</p>
              </div>

              <div className="metric-card payroll">
                <h3>Nómina Total</h3>
                <p className="amount">{formatCurrency(financial.monthlyPayroll * 1000000)}</p>
                <p className="percentage">({(financial.monthlyPayroll / financial.monthlyRevenue * 100).toFixed(1)}% ingresos)</p>
              </div>
            </div>

            {/* PRARA Risk Analysis */}
            <div className="risk-analysis critical-pulse">
              <h3>🎯 Análisis de Riesgo - PRARA (Latido Crítico)</h3>
              <div className="prara-info">
                <div className="prara-stat">
                  <span className="label">Revenue PRARA:</span>
                  <span className="value">{formatCurrency(financial.monthlyRevenue * financial.praraRevenuePercentage / 100 * 1000000)}</span>
                </div>
                <div className="prara-stat">
                  <span className="label">Concentración:</span>
                  <span className={`value ${financial.praraRevenuePercentage > 75 ? 'critical animate-ping' : 'warning'}`}>
                    {financial.praraRevenuePercentage.toFixed(1)}%
                  </span>
                </div>
                <div
                  className="prara-bar heartbeat-bar"
                  style={{
                    // @ts-ignore
                    '--prara-bar-bg': `linear-gradient(to right, ${financial.praraRevenuePercentage > 75 ? '#ff4444' : '#ff9800'} 0%, ${financial.praraRevenuePercentage > 75 ? '#ff4444' : '#ff9800'} ${financial.praraRevenuePercentage}%, #e0e0e0 ${financial.praraRevenuePercentage}%, #e0e0e0 100%)`
                  }}
                />
              </div>
            </div>

            {/* Quality Metrics */}
            <div className="quality-metrics">
              <div className="quality-card">
                <h4>Error Rate</h4>
                <p className="rate">{financial.qualityErrorRate}%</p>
                <span className={financial.qualityErrorRate < 5 ? 'good' : 'warning animate-pulse'}>
                  {financial.qualityErrorRate < 5 ? '✅ Excelente' : '⚠️ Necesita mejora'}
                </span>
              </div>
              <div className="quality-card">
                <h4>On-Time Delivery</h4>
                <p className="rate">{financial.onTimeDeliveryRate}%</p>
                <span className={financial.onTimeDeliveryRate > 85 ? 'good' : 'warning'}>
                  {financial.onTimeDeliveryRate > 85 ? '✅ Muy bueno' : '⚠️ Regular'}
                </span>
              </div>
              <div className="quality-card">
                <h4>Clientes Activos</h4>
                <p className="rate">{financial.totalCustomers}</p>
                <span className="good">Base de clientes</span>
              </div>
            </div>
          </section>
        )}

        {/* TEAM TAB */}
        {activeTab === 'team' && (
          <section className="section team-section">
            <h2>👥 Equipo de Serendipity Bros - Células Vivas ({team.length})</h2>
            
            <div className="team-list">
              {team.map((member, idx) => {
                // Indicador de Productividad (simula alerta de Team Agent)
                const hasProductivityAlert = member.equityScore < 60;
                
                return (
                  <div key={idx} className={`team-member-card bio-cell ${hasProductivityAlert ? 'productivity-alert animate-pulse' : ''}`}>
                    <div className="cell-pulse"></div>
                    {hasProductivityAlert && (
                      <div className="productivity-warning">
                        ⚠️ Alerta de Equidad
                      </div>
                    )}
                  <div className="member-header">
                    <h4>{member.name}</h4>
                    <span className="role">{member.role}</span>
                  </div>
                  <div className="member-stats">
                    <div className="stat">
                      <span className="label">Salario:</span>
                      <span className="value">{formatCurrency(member.salary * 1000000)}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Tier:</span>
                      <span className="tier">{member.tier}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Valor:</span>
                      <span className="contribution">{member.valueContribution}/20</span>
                    </div>
                    <div className="stat">
                      <span className="label">Equidad Salarial:</span>
                      <span className={`equity ${member.equityScore > 70 ? 'fair' : member.equityScore > 50 ? 'warning' : 'critical animate-ping'}`}>
                        {member.equityScore.toFixed(0)}/100
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </section>
        )}

        {/* ALERTS TAB */}
        {activeTab === 'alerts' && (
          <section className="section alerts-section">
            <h2>🚨 Alertas Éticas - Pulsaciones Críticas ({alerts.length})</h2>
            
            {emergencyMode.isEmergency && (
              <div className="emergency-mode-notice">
                <h3>⚡ MODO EMERGENCIA ACTIVADO</h3>
                <p>Facturas impagadas priorizadas y expandidas automáticamente</p>
                <p className="runway">Runway: {emergencyMode.daysUntilCritical} días | Balance: {emergencyMode.balancePercentage}% de costos mensuales</p>
              </div>
            )}
            
            <div className="alerts-list">
              {alerts
                .sort((a, b) => {
                  // Priorizar alertas en modo emergencia
                  if (emergencyMode.isEmergency) {
                    if (a.severity === 'CRITICAL') return -1;
                    if (b.severity === 'CRITICAL') return 1;
                  }
                  return 0;
                })
                .map((alert, idx) => {
                  const isExpanded = emergencyMode.isEmergency && alert.severity === 'CRITICAL';
                  
                  return (
                    <div 
                      key={idx} 
                      className={`alert-card ${alert.severity === 'CRITICAL' ? 'critical-heartbeat' : alert.severity === 'HIGH' ? 'high-pulse' : ''} ${isExpanded ? 'expanded' : ''}`}
                      style={{
                        // @ts-ignore
                        '--alert-border-color': getAlertColor(alert.severity)
                      }}
                    >
                      {alert.severity === 'CRITICAL' && <div className="alert-pulse"></div>}
                  <div className="alert-header">
                    <h4>{alert.category}</h4>
                    <span className={`severity ${alert.severity.toLowerCase()} ${alert.severity === 'CRITICAL' ? 'animate-pulse' : ''}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <div className="alert-content">
                    <p className="message">{alert.message}</p>
                    <div className="recommendation">
                      <strong>💡 Recomendación:</strong>
                      <p>{alert.recommendation}</p>
                    </div>
                    {alert.injusticeType && <span className="injustice-type">Tipo: {alert.injusticeType}</span>}
                  </div>
                </div>
              );
            })}
            </div>
          </section>
        )}

        {/* RECOMMENDATIONS TAB */}
        {activeTab === 'recommendations' && (
          <section className="section recommendations-section">
            <h2>✨ {t.recommendations.title} - {t.recommendations.heartbeatsOfHope} ({recommendations.length})</h2>
            <p className="subtitle">Decisiones alineadas con el bien común</p>
            
            <div className="recommendations-list">
              {recommendations.map((rec, idx) => (
                <div key={idx} className={`recommendation-card priority-${rec.priority} ${rec.priority === 1 ? 'urgent-pulse' : ''}`}>
                  {rec.priority === 1 && <div className="priority-pulse"></div>}
                  <div className="rec-header">
                    <h4>
                      <span className={`priority-badge ${rec.priority === 1 ? 'animate-bounce' : ''}`}>{rec.priority}</span>
                      {rec.title}
                    </h4>
                    <span className="timeline">{rec.timeline}</span>
                  </div>
                  <p className="description">{rec.description}</p>
                  <div className="rec-details">
                    <div className="impact">
                      <strong>💪 Impacto:</strong>
                      <p>{rec.impact}</p>
                    </div>
                    <div className="ethical">
                      <strong>🕯️ Alineamiento Ético:</strong>
                      <p>{rec.ethicalAlignment}</p>
                    </div>
                  </div>
                  <div className="action-items">
                    <strong>📋 Pasos:</strong>
                    <ul>
                      {rec.actionItems.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* QR TRACKING TAB */}
        {activeTab === 'qr-tracking' && (
          <section className="section qr-tracking-section">
            <QRTrackingPanel />
          </section>
        )}
        
        {/* PERSONAL PANEL TAB (Solo Admin) */}
        {activeTab === 'personal-panel' && currentRole === 'admin' && financial && (
          <section className="section personal-panel-section">
            <SantiPersonalPanel
              companyMetrics={{
                profitMargin: financial.profitMargin,
                revenue: financial.monthlyRevenue,
                praraRisk: financial.praraRevenuePercentage,
                qualityErrorRate: financial.qualityErrorRate,
                teamSize: team.length,
                delegationLevel: 70, // Calcular según lógica real
              }}
            />
          </section>
        )}
        
        {/* KAIZEN MODULE TAB */}
        {activeTab === 'kaizen' && (
          <section className="section kaizen-section">
            <KaizenModule />
          </section>
        )}

        {/* GOOGLE WORKSPACE TAB (Solo Admin) */}
        {activeTab === 'google-workspace' && currentRole === 'admin' && (
          <section className="section google-workspace-section">
            <GoogleWorkspaceAssistant />
          </section>
        )}

        {/* TET PREPARATION TAB (Solo Admin) */}
        {activeTab === 'tet-preparation' && currentRole === 'admin' && (
          <section className="section tet-preparation-section">
            <TETPreparationPanel />
          </section>
        )}
      </main>

      <footer className="dashboard-footer">
        <p>Última actualización: {new Date().toLocaleString()}</p>
        <button onClick={fetchDashboardData} className="refresh-btn">🔄 {t.dashboard.refresh}</button>
      </footer>
      
      {/* Componentes flotantes */}
      <SentimentChatbot
        userId={currentRole || 'user-1'}
        userName={currentRole === 'admin' ? 'Santiago' : 'Usuario'}
        userRole={currentRole || 'worker'}
      />
      
      {/* NUEVAS SECCIONES */}
      {activeTab === 'operational-plan' && <OperationalPlanPage />}
      {activeTab === 'executive-report' && <ExecutiveSummaryPage />}
      {activeTab === 'technical-manual' && <TechnicalManualPage />}
      {activeTab === 'checklists' && <ChecklistsPage />}
      {activeTab === 'kpi-dashboard' && <KPIDashboardPage />}
      
      {/* ASISTENTE GLOBAL */}
      <GlobalAssistantBubble />
      
      <OfflineIndicator />
    </div>
  );
};

export default SerendipityDashboard;
