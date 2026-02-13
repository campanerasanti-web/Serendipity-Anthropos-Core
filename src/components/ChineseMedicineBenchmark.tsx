/**
 * COMPONENTE: BENCHMARK DE MEDICINA CHINA
 * 
 * Visualiza el análisis del Qi financiero según principios de TCM
 * Muestra balance Yin-Yang, chakras bloqueados y fugas de energía
 */

import React, { useEffect } from 'react';
import { useChineseMedicineAnalysis, QiState, ElementType } from '../hooks/useChineseMedicineAnalysis';
import { PersonalFinance } from '../hooks/usePersonalFinance';

interface Props {
  personalFinance: PersonalFinance;
}

const QI_STATE_COLORS: Record<QiState, string> = {
  flowing: '#10b981',    // green
  stagnant: '#f59e0b',   // amber
  deficient: '#3b82f6',  // blue
  excessive: '#ef4444',  // red
};

const ELEMENT_COLORS: Record<ElementType, string> = {
  wood: '#10b981',   // Verde
  fire: '#ef4444',   // Rojo
  earth: '#f59e0b',  // Amarillo/Ámbar
  metal: '#d1d5db',  // Gris/Plata
  water: '#3b82f6',  // Azul
};

const ELEMENT_EMOJI: Record<ElementType, string> = {
  wood: '🌳',
  fire: '🔥',
  earth: '🌍',
  metal: '⚙️',
  water: '💧',
};

export const ChineseMedicineBenchmark: React.FC<Props> = ({ personalFinance }) => {
  const { report, generateReport } = useChineseMedicineAnalysis();

  useEffect(() => {
    if (personalFinance) {
      generateReport(personalFinance);
    }
  }, [personalFinance]);

  if (!report) {
    return (
      <div className="chinese-medicine-benchmark loading">
        <div className="spinner">☯️</div>
        <p>Analizando el flujo del Qi financiero...</p>
      </div>
    );
  }

  return (
    <div className="chinese-medicine-benchmark">
      {/* Header con Qi Score general */}
      <div className="tcm-header">
        <h2>☯️ Benchmark de Medicina China</h2>
        <div className="qi-score">
          <div className="score-circle" style={{ borderColor: QI_STATE_COLORS[report.overallQi] }}>
            <span className="score-value">{report.qiScore.toFixed(0)}</span>
            <span className="score-label">Qi Score</span>
          </div>
          <div className="qi-state">
            <span className="state-label">Estado General:</span>
            <span className="state-value" style={{ color: QI_STATE_COLORS[report.overallQi] }}>
              {report.overallQi === 'flowing' && '✅ Fluye Armoniosamente'}
              {report.overallQi === 'stagnant' && '⚠️ Estancado'}
              {report.overallQi === 'deficient' && '🔵 Deficiente'}
              {report.overallQi === 'excessive' && '🔴 Excesivo'}
            </span>
          </div>
        </div>
      </div>

      {/* Balance Yin-Yang */}
      <section className="yin-yang-section">
        <h3>☯️ Balance Yin-Yang Financiero</h3>
        <div className="yin-yang-container">
          <div className="yin-bar">
            <div className="bar-label">🌙 Yin (Ahorro/Estabilidad)</div>
            <div className="progress-bar">
              <div
                className="progress-fill yin"
                style={{ width: `${report.yinYang.yin}%` }}
              />
              <span className="progress-value">{report.yinYang.yin.toFixed(0)}%</span>
            </div>
          </div>
          <div className="yang-bar">
            <div className="bar-label">☀️ Yang (Gasto/Acción)</div>
            <div className="progress-bar">
              <div
                className="progress-fill yang"
                style={{ width: `${report.yinYang.yang}%` }}
              />
              <span className="progress-value">{report.yinYang.yang.toFixed(0)}%</span>
            </div>
          </div>
          <div className="balance-indicator">
            <div className="balance-line">
              <div
                className={`balance-marker ${report.yinYang.state}`}
                style={{
                  left: `${50 + report.yinYang.balance / 2}%`,
                }}
              >
                ☯️
              </div>
            </div>
            <div className="balance-labels">
              <span>Yin Excess</span>
              <span>Balanced</span>
              <span>Yang Excess</span>
            </div>
          </div>
          <div className="yin-yang-recommendation">
            <p>{report.yinYang.recommendation}</p>
          </div>
        </div>
      </section>

      {/* Chakras Financieros */}
      <section className="chakras-section">
        <h3>🔮 Chakras Financieros (Flujo por Categoría)</h3>
        <div className="chakras-grid">
          {report.chakras.map((chakra) => (
            <div
              key={chakra.name}
              className={`chakra-card ${chakra.isBlocked ? 'blocked' : ''}`}
              style={{ borderLeftColor: ELEMENT_COLORS[chakra.element] }}
            >
              <div className="chakra-header">
                <span className="chakra-element">{ELEMENT_EMOJI[chakra.element]}</span>
                <span className="chakra-name">{chakra.name}</span>
                {chakra.isBlocked && <span className="blocked-badge">🚫 Bloqueado</span>}
              </div>
              <div className="chakra-qi-level">
                <div className="qi-bar">
                  <div
                    className="qi-fill"
                    style={{
                      width: `${chakra.qiLevel}%`,
                      backgroundColor: ELEMENT_COLORS[chakra.element],
                    }}
                  />
                </div>
                <span className="qi-value">Qi: {chakra.qiLevel.toFixed(0)}</span>
              </div>
              {chakra.leakage > 0 && (
                <div className="leakage-warning">
                  ⚠️ Fuga de energía: {chakra.leakage.toFixed(0)}%
                </div>
              )}
              {chakra.recommendation && (
                <div className="chakra-recommendation">
                  <small>{chakra.recommendation}</small>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Fugas de Energía */}
      {report.energyLeaks.length > 0 && (
        <section className="energy-leaks-section">
          <h3>⚠️ Fugas de Energía Detectadas</h3>
          <div className="leaks-list">
            {report.energyLeaks.map((leak, index) => (
              <div key={index} className="leak-card">
                <div className="leak-header">
                  <span className="leak-category">{leak.category}</span>
                  <span className="leak-amount">${leak.amount.toFixed(0)}/mes</span>
                </div>
                <div className="leak-percentage">
                  Exceso: {leak.percentage.toFixed(1)}% sobre umbral saludable
                </div>
                <div className="leak-reason">{leak.reason}</div>
                <div className="leak-solution">
                  <strong>💡 Solución:</strong> {leak.solution}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recomendaciones por Elemento */}
      <section className="elements-section">
        <h3>🌿 Recomendaciones por Elemento</h3>
        <div className="elements-grid">
          {report.elementRecommendations
            .filter((rec) => rec.priority !== 'low' || rec.issues.length > 0)
            .map((recommendation) => (
              <div
                key={recommendation.element}
                className={`element-card priority-${recommendation.priority}`}
                style={{ borderTopColor: ELEMENT_COLORS[recommendation.element] }}
              >
                <div className="element-header">
                  <span className="element-icon">{ELEMENT_EMOJI[recommendation.element]}</span>
                  <span className="element-name">{recommendation.element.toUpperCase()}</span>
                  <span className={`priority-badge priority-${recommendation.priority}`}>
                    {recommendation.priority === 'high' && '🔴 Alta'}
                    {recommendation.priority === 'medium' && '🟡 Media'}
                    {recommendation.priority === 'low' && '🟢 Baja'}
                  </span>
                </div>
                {recommendation.issues.length > 0 && (
                  <div className="element-issues">
                    <strong>⚠️ Problemas:</strong>
                    <ul>
                      {recommendation.issues.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="element-solutions">
                  <strong>💡 Soluciones:</strong>
                  <ul>
                    {recommendation.solutions.map((solution, i) => (
                      <li key={i}>{solution}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Footer con sabiduría TCM */}
      <footer className="tcm-footer">
        <p>
          🕯️ <em>"El dinero es energía. Su flujo sano nutre el sistema; su bloqueo lo enferma."</em>
        </p>
        <p className="tcm-date">
          Análisis realizado: {new Date(report.analyzedAt).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </footer>
    </div>
  );
};
