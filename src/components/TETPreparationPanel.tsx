/**
 * COMPONENTE: PANEL DE PREPARACIÓN TET
 * 
 * Interfaz para la Prueba Piloto del Año Nuevo Lunar
 * - Importación masiva de órdenes
 * - Monitoreo de readiness
 * - Generación de reportes
 * - Activación del protocolo
 */

import React, { useState, useEffect, useRef } from 'react';
import { useTETProtocol } from '../hooks/useTETProtocol';
import { useI18n } from '../i18n/I18nContext';

export const TETPreparationPanel: React.FC = () => {
  const { t, currentLanguage } = useI18n();
  const {
    isReady,
    stats,
    lastImport,
    importFromCSV,
    generateTestOrders,
    activateTETProtocol,
    generateTETReport,
  } = useTETProtocol();

  const [showImportModal, setShowImportModal] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [importResult, setImportResult] = useState<string | null>(null);
  const [activationMessage, setActivationMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCsvText(text);
    };
    reader.readAsText(file);
  };

  const handleImportCSV = () => {
    if (!csvText.trim()) {
      setImportResult('❌ No hay datos para importar');
      return;
    }

    try {
      const result = importFromCSV(csvText);
      setImportResult(
        `✅ Importación completada:\n` +
        `   - Total procesadas: ${result.totalOrders}\n` +
        `   - Exitosas: ${result.successfulImports}\n` +
        `   - Fallidas: ${result.failedImports}\n` +
        `${result.errors.length > 0 ? `   Errores:\n${result.errors.map((e) => `     Fila ${e.row}: ${e.reason}`).join('\n')}` : ''}`
      );
      setCsvText('');
      setShowImportModal(false);
    } catch (error) {
      setImportResult(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const handleGenerateTest = () => {
    const result = generateTestOrders(20);
    setImportResult(
      `✅ Órdenes de prueba generadas:\n` +
      `   - Total: ${result.totalOrders}\n` +
      `   - Listas: ${result.successfulImports}`
    );
  };

  const handleActivate = () => {
    const result = activateTETProtocol();
    setActivationMessage(result.message);
  };

  const handleDownloadReport = () => {
    const report = generateTETReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TET_REPORT_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getReadinessLevel = (): 'low' | 'medium' | 'high' => {
    if (stats.readinessScore >= 80) return 'high';
    if (stats.readinessScore >= 60) return 'medium';
    return 'low';
  };

  return (
    <div className="tet-preparation-panel">
      {/* Header */}
      <div className="tet-header">
        <h2>🎊 Protocolo TET - Año Nuevo Lunar {new Date().getFullYear()}</h2>
        <div className="tet-subtitle">
          Preparación para Prueba Piloto - Viernes 13 de Febrero
        </div>
      </div>

      {/* Readiness Score */}
      <section className="readiness-section">
        <div className="readiness-card">
          <div className="readiness-label">Readiness Score</div>
          <div className={`readiness-score ${getReadinessLevel()}`}>
            <div className="score-circle">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke={
                    getReadinessLevel() === 'high'
                      ? '#10b981'
                      : getReadinessLevel() === 'medium'
                      ? '#f59e0b'
                      : '#ef4444'
                  }
                  strokeWidth="12"
                  strokeDasharray={`${(stats.readinessScore / 100) * 339.3} 339.3`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="score-value">{stats.readinessScore}%</div>
            </div>
          </div>
          <div className="readiness-status">
            {isReady ? (
              <div className="status-ready">
                ✅ Sistema listo para activar
              </div>
            ) : (
              <div className="status-not-ready">
                ⚠️ Requiere {70 - stats.readinessScore}% más para activar
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-value">{stats.totalOrders}</div>
            <div className="stat-label">Total Órdenes</div>
          </div>
          <div className="stat-card red">
            <div className="stat-icon">🔴</div>
            <div className="stat-value">{stats.redCount}</div>
            <div className="stat-label">Urgentes</div>
          </div>
          <div className="stat-card amber">
            <div className="stat-icon">🟡</div>
            <div className="stat-value">{stats.amberCount}</div>
            <div className="stat-label">En Proceso</div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">🟢</div>
            <div className="stat-value">{stats.greenCount}</div>
            <div className="stat-label">Completadas</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-value">{stats.overdueCount}</div>
            <div className="stat-label">Vencidas</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👷</div>
            <div className="stat-value">{stats.assignedToVietnamese}</div>
            <div className="stat-label">Asignadas (VN)</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-value">{stats.avgCompletionTime}h</div>
            <div className="stat-label">Tiempo Promedio</div>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="actions-section">
        <h3>🚀 Acciones</h3>
        <div className="actions-grid">
          <button className="action-btn import" onClick={() => setShowImportModal(true)}>
            📥 Importar desde CSV
          </button>
          <button className="action-btn generate" onClick={handleGenerateTest}>
            🎲 Generar Órdenes de Prueba
          </button>
          <button className="action-btn report" onClick={handleDownloadReport}>
            📄 Descargar Reporte
          </button>
          <button
            className={`action-btn activate ${isReady ? 'ready' : 'disabled'}`}
            onClick={handleActivate}
            disabled={!isReady}
          >
            {isReady ? '✅ Activar Protocolo TET' : '⚠️ No Listo para Activar'}
          </button>
        </div>
      </section>

      {/* Last Import */}
      {lastImport && (
        <section className="last-import-section">
          <h3>📥 Última Importación</h3>
          <div className="import-info">
            <div className="import-detail">
              <span className="label">Batch ID:</span>
              <span className="value">{lastImport.id}</span>
            </div>
            <div className="import-detail">
              <span className="label">Fecha:</span>
              <span className="value">
                {lastImport.timestamp.toLocaleString(currentLanguage === 'vi' ? 'vi-VN' : 'es-ES')}
              </span>
            </div>
            <div className="import-detail">
              <span className="label">Total:</span>
              <span className="value">{lastImport.totalOrders}</span>
            </div>
            <div className="import-detail">
              <span className="label">Exitosas:</span>
              <span className="value success">{lastImport.successfulImports}</span>
            </div>
            {lastImport.failedImports > 0 && (
              <div className="import-detail">
                <span className="label">Fallidas:</span>
                <span className="value error">{lastImport.failedImports}</span>
              </div>
            )}
          </div>
          {lastImport.errors.length > 0 && (
            <div className="import-errors">
              <strong>Errores:</strong>
              <ul>
                {lastImport.errors.map((error, i) => (
                  <li key={i}>
                    Fila {error.row}: {error.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Messages */}
      {importResult && (
        <div className="message-box">
          <pre>{importResult}</pre>
          <button onClick={() => setImportResult(null)}>✕</button>
        </div>
      )}
      {activationMessage && (
        <div className={`message-box ${isReady ? 'success' : 'warning'}`}>
          {activationMessage}
          <button onClick={() => setActivationMessage(null)}>✕</button>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="modal-content tet-import-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowImportModal(false)}>
              ✕
            </button>
            <h3>📥 Importar Órdenes desde CSV</h3>
            <div className="import-instructions">
              <p>El archivo CSV debe tener estas columnas:</p>
              <code>customer,product,quantity,dueDate,priority,assignedTo,notes</code>
              <p>
                <strong>Ejemplo:</strong>
              </p>
              <code>
                PRARA,Caja Premium,500,2026-02-15T10:00:00,high,Nguyen Van A,Orden especial TET
              </code>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{ marginBottom: '1rem' }}
            />
            <textarea
              className="csv-input"
              placeholder="O pega el contenido CSV aquí..."
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={10}
            />
            <div className="modal-actions">
              <button className="import-btn" onClick={handleImportCSV}>
                Importar
              </button>
              <button className="cancel-btn" onClick={() => setShowImportModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="tet-footer">
        <p>
          🕯️ <em>"El Tết es el momento de comenzar con energía renovada"</em>
        </p>
        <p>
          Sistema preparado para operarios vietnamitas. Interfaz en idioma{' '}
          <strong>Vietnamita (VI)</strong> activa en dashboard.
        </p>
      </footer>
    </div>
  );
};
