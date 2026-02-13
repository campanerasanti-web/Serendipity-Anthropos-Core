/**
 * PANEL PERSONAL DE SANTI
 * Muestra cómo la eficiencia de Serendipity impacta la calidad de vida
 * 
 * "Cuando el sistema prospera, el líder encuentra paz"
 */

import React, { useEffect, useState } from 'react';
import { usePersonalFinance, CompanyImpact } from '../hooks/usePersonalFinance';
import { useI18n } from '../i18n/I18nContext';
import { ChineseMedicineBenchmark } from './ChineseMedicineBenchmark';

interface SantiPanelProps {
  companyMetrics?: {
    profitMargin: number;
    revenue: number;
    praraRisk: number;
    qualityErrorRate: number;
    teamSize: number;
    delegationLevel: number;
  };
}

export const SantiPersonalPanel: React.FC<SantiPanelProps> = ({ companyMetrics }) => {
  const { t } = useI18n();
  const {
    personalData,
    updateSalary,
    updateExpenses,
    calculateCompanyImpact,
    generateCorrelationInsights,
    calculateQualityOfLife,
  } = usePersonalFinance('santi');

  const [companyImpact, setCompanyImpact] = useState<CompanyImpact | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Calcular impacto cuando cambien las métricas
  useEffect(() => {
    if (companyMetrics) {
      const impact = calculateCompanyImpact(companyMetrics);
      setCompanyImpact(impact);
      calculateQualityOfLife(impact);
    }
  }, [companyMetrics]);

  // Si no hay métricas, usar valores por defecto
  const defaultMetrics = {
    profitMargin: 60,
    revenue: 45000,
    praraRisk: 25,
    qualityErrorRate: 0.05,
    teamSize: 21,
    delegationLevel: 70,
  };

  useEffect(() => {
    if (!companyMetrics) {
      const impact = calculateCompanyImpact(defaultMetrics);
      setCompanyImpact(impact);
      calculateQualityOfLife(impact);
    }
  }, []);

  const insights = companyImpact ? generateCorrelationInsights(companyImpact) : [];

  // Colores para Quality of Life Score
  const getQoLColor = (score: number) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  return (
    <div className="santi-personal-panel">
      {/* Header */}
      <div className="panel-header">
        <h2>{t.personalPanel.title}</h2>
        <div className="quality-of-life-badge">
          <span className="label">Calidad de Vida:</span>
          <span
            className="score"
            style={{ color: getQoLColor(personalData.qualityOfLifeScore) }}
          >
            {Math.round(personalData.qualityOfLifeScore)}%
          </span>
        </div>
      </div>

      {/* Grid de 3 columnas */}
      <div className="panel-grid">
        {/* Columna 1: Finanzas Personales */}
        <div className="panel-section finances">
          <h3>💰 {t.personalPanel.balance}</h3>
          <div className="metric-card">
            <label>Ingresos Mensuales</label>
            <div className="value positive">${personalData.totalIncome.toLocaleString()}</div>
            <div className="breakdown">
              <span>Salario: ${personalData.monthlySalary.toLocaleString()}</span>
              <span>Adicionales: ${personalData.additionalIncome.toLocaleString()}</span>
            </div>
          </div>

          <div className="metric-card">
            <label>Gastos Mensuales</label>
            <div className="value negative">${personalData.totalExpenses.toLocaleString()}</div>
            <div className="breakdown">
              <span>Vivienda: ${personalData.housing}</span>
              <span>Alimentación: ${personalData.food}</span>
              <span>Transporte: ${personalData.transportation}</span>
              <span>Salud: ${personalData.healthcare}</span>
              <span>Educación: ${personalData.education}</span>
              <span>Ocio: ${personalData.leisure}</span>
              <span>Ahorro: ${personalData.savings}</span>
            </div>
          </div>

          <div className="metric-card highlight">
            <label>Balance Mensual</label>
            <div
              className={`value ${personalData.monthlyBalance >= 0 ? 'positive' : 'negative'}`}
            >
              ${personalData.monthlyBalance.toLocaleString()}
            </div>
            <div className="sub-metric">
              Tasa de ahorro: {personalData.savingsRate.toFixed(1)}%
            </div>
          </div>

          {!isEditMode && (
            <button className="edit-btn" onClick={() => setIsEditMode(true)}>
              ✏️ Editar Finanzas
            </button>
          )}
          {isEditMode && (
            <button className="save-btn" onClick={() => setIsEditMode(false)}>
              ✅ Guardar
            </button>
          )}
        </div>

        {/* Columna 2: Impacto de Serendipity */}
        <div className="panel-section company-impact">
          <h3>🏢 {t.personalPanel.efficiency}</h3>
          {companyImpact && (
            <>
              <div className="metric-card">
                <label>Eficiencia del Equipo</label>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${companyImpact.teamEfficiency}%`,
                      backgroundColor: '#667eea',
                    }}
                  ></div>
                  <span className="progress-value">{Math.round(companyImpact.teamEfficiency)}%</span>
                </div>
              </div>

              <div className="metric-card">
                <label>Nivel de Estrés</label>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${companyImpact.stressLevel}%`,
                      backgroundColor: '#f87171',
                    }}
                  ></div>
                  <span className="progress-value">{Math.round(companyImpact.stressLevel)}%</span>
                </div>
                <div className="sub-metric">
                  {companyImpact.stressLevel < 30
                    ? '✅ Bajo - Excelente'
                    : companyImpact.stressLevel < 60
                    ? '⚠️ Moderado'
                    : '🚨 Alto - Requiere atención'}
                </div>
              </div>

              <div className="metric-card">
                <label>Flexibilidad de Tiempo</label>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${companyImpact.timeFlexibility}%`,
                      backgroundColor: '#10b981',
                    }}
                  ></div>
                  <span className="progress-value">{Math.round(companyImpact.timeFlexibility)}%</span>
                </div>
                <div className="sub-metric">
                  Ganancia proyectada: +{companyImpact.projectedTimeGain}h/semana
                </div>
              </div>

              <div className="metric-card highlight">
                <label>Balance Vida-Trabajo</label>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${companyImpact.workLifeBalance}%`,
                      backgroundColor: getQoLColor(companyImpact.workLifeBalance),
                    }}
                  ></div>
                  <span className="progress-value">{Math.round(companyImpact.workLifeBalance)}%</span>
                </div>
              </div>

              {/* NUEVAS MÉTRICAS: Paz y Presencia */}
              <div className="metric-card peace">
                <label>🕯️ Paz Interior</label>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${companyImpact.peaceScore}%`,
                      backgroundColor: '#a78bfa',
                    }}
                  ></div>
                  <span className="progress-value">{Math.round(companyImpact.peaceScore)}%</span>
                </div>
                <div className="sub-metric">
                  Proyección 6m: +{companyImpact.projectedPeaceIncrease}%
                </div>
              </div>

              <div className="metric-card presence">
                <label>🧘 Horas de Presencia</label>
                <div className="value-large">
                  +{companyImpact.presenceHours.toFixed(1)}h/sem
                </div>
                <div className="sub-metric">
                  Tiempo recuperado gracias a automatización
                </div>
              </div>

              <div className="metric-card automation">
                <label>🤖 Impacto Automatización</label>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${companyImpact.automationImpact}%`,
                      backgroundColor: '#3b82f6',
                    }}
                  ></div>
                  <span className="progress-value">{Math.round(companyImpact.automationImpact)}%</span>
                </div>
                <div className="sub-metric">
                  Tareas que ya no requieren tu atención directa
                </div>
              </div>

              <div className="metric-card mindfulness">
                <label>🌸 Ganancia de Mindfulness</label>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${companyImpact.mindfulnessGain}%`,
                      backgroundColor: '#10b981',
                    }}
                  ></div>
                  <span className="progress-value">{Math.round(companyImpact.mindfulnessGain)}%</span>
                </div>
                <div className="sub-metric">
                  Capacidad de estar presente sin preocupaciones
                </div>
              </div>
            </>
          )}
        </div>

        {/* Columna 3: Correlaciones e Insights */}
        <div className="panel-section correlations">
          <h3>💡 {t.personalPanel.projections}</h3>
          {insights.map((insight, idx) => (
            <div key={idx} className={`insight-card ${insight.trend}`}>
              <div className="insight-header">
                <span className="metric-name">{insight.metric}</span>
                <span className="trend-badge">
                  {insight.trend === 'improving'
                    ? '📈 Mejorando'
                    : insight.trend === 'stable'
                    ? '➡️ Estable'
                    : '📉 Declinando'}
                </span>
              </div>
              <div className="insight-value">
                {typeof insight.companyValue === 'number'
                  ? `${Math.round(insight.companyValue)}${insight.companyValue <= 100 ? '%' : ''}`
                  : insight.companyValue}
              </div>
              <div className="insight-impact">{insight.personalImpact}</div>
              {insight.recommendation && (
                <div className="insight-recommendation">
                  💡 <em>{insight.recommendation}</em>
                </div>
              )}
            </div>
          ))}

          {companyImpact && (
            <div className="projection-summary">
              <h4>Proyección 6 meses:</h4>
              <ul>
                <li>
                  💰 Incremento salarial: <strong>+{companyImpact.projectedSalaryIncrease}%</strong>
                </li>
                <li>
                  😌 Reducción de estrés: <strong>-{companyImpact.projectedStressReduction}%</strong>
                </li>
                <li>
                  ⏰ Tiempo recuperado: <strong>+{companyImpact.projectedTimeGain}h/semana</strong>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Benchmark de Medicina China */}
      <div className="tcm-benchmark-container">
        <ChineseMedicineBenchmark personalFinance={personalData} />
      </div>

      {/* Footer con mensaje motivacional */}
      <div className="panel-footer">
        <p className="wisdom">
          🕯️ "Cuando el sistema respira en armonía, el líder encuentra tiempo para la familia y
          el alma encuentra paz."
        </p>
        <p className="last-updated">
          Última actualización:{' '}
          {personalData.lastUpdated.toLocaleString('es-ES', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </p>
      </div>
    </div>
  );
};
