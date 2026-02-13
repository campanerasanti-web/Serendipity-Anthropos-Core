import React, { useState, useEffect } from 'react';
import { assistantSteps, getStepById, getNextStep, validateField, getSuggestion, analyzeOrdersForAlerts, generateQuickActions } from '../assistant/orderAssistantSteps';
import { createOrderFromAssistant, getOrdersWithAnalysis, startPendingOrders, completeInProgressOrders } from '../api/assistantOrdersApi';

/**
 * Panel principal del asistente inteligente de órdenes
 */
export default function OrderAssistantPanel({ onOrderCreated, onClose }) {
  const [currentStepId, setCurrentStepId] = useState('welcome');
  const [formData, setFormData] = useState({
    customer: '',
    product: '',
    quantity: 1,
    dueDate: '',
    priority: 'normal',
    assignedTo: '',
    notes: '',
  });
  const [validationError, setValidationError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [quickActions, setQuickActions] = useState([]);

  useEffect(() => {
    loadAssistantData();
  }, []);

  async function loadAssistantData() {
    try {
      const { orders, analysis } = await getOrdersWithAnalysis();
      const detectedAlerts = analyzeOrdersForAlerts(orders);
      const actions = generateQuickActions(orders);
      
      setAlerts(detectedAlerts);
      setQuickActions(actions);
    } catch (err) {
      console.error('Error cargando datos del asistente:', err);
    }
  }

  const currentStep = getStepById(currentStepId);

  function handleInputChange(value) {
    if (!currentStep.field) return;

    setFormData(prev => ({
      ...prev,
      [currentStep.field]: value,
    }));

    // Validar en tiempo real
    const error = validateField(currentStepId, value, formData);
    setValidationError(error);
  }

  function handleNext() {
    if (!currentStep) return;

    // Validar paso actual
    if (currentStep.field && !currentStep.optional) {
      const value = formData[currentStep.field];
      const error = validateField(currentStepId, value, formData);
      if (error) {
        setValidationError(error);
        return;
      }
    }

    // Obtener sugerencia si existe
    if (currentStep.suggestion) {
      const suggestion = getSuggestion(currentStepId, formData);
      if (suggestion && currentStep.field) {
        setFormData(prev => ({
          ...prev,
          [currentStep.field]: suggestion[currentStep.field] || prev[currentStep.field],
        }));
      }
    }

    // Avanzar al siguiente paso
    const nextStep = getNextStep(currentStepId);
    if (nextStep) {
      setCurrentStepId(nextStep.id);
      setValidationError(null);
    } else {
      handleSubmit();
    }
  }

  function handleBack() {
    const previousStepIndex = assistantSteps.findIndex(s => s.id === currentStepId) - 1;
    if (previousStepIndex >= 0) {
      setCurrentStepId(assistantSteps[previousStepIndex].id);
      setValidationError(null);
    }
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const order = await createOrderFromAssistant(formData);
      onOrderCreated && onOrderCreated(order);
      
      // Resetear formulario
      setFormData({
        customer: '',
        product: '',
        quantity: 1,
        dueDate: '',
        priority: 'normal',
        assignedTo: '',
        notes: '',
      });
      setCurrentStepId('welcome');
    } catch (err) {
      alert('Error creando orden: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleQuickAction(action) {
    setLoading(true);
    try {
      switch (action) {
        case 'create-order':
          setCurrentStepId('welcome');
          break;

        case 'start-pending':
          await startPendingOrders();
          alert('Órdenes pendientes iniciadas');
          await loadAssistantData();
          break;

        case 'complete-in-progress':
          await completeInProgressOrders();
          alert('Órdenes en progreso completadas');
          await loadAssistantData();
          break;

        case 'view-stats':
          // Podría abrir un modal con estadísticas
          alert('Abrir panel de estadísticas');
          break;

        default:
          break;
      }
    } catch (err) {
      alert('Error ejecutando acción: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  function renderStepContent() {
    if (!currentStep) return null;

    const suggestion = currentStep.suggestion ? getSuggestion(currentStepId, formData) : null;

    switch (currentStep.type) {
      case 'info':
        return (
          <div className="step-info">
            <p>{currentStep.message}</p>
          </div>
        );

      case 'input':
      case 'textarea':
        return (
          <div className="step-input">
            <label>{currentStep.message}</label>
            {currentStep.type === 'input' ? (
              <input
                type="text"
                value={formData[currentStep.field] || ''}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={`Ingresa ${currentStep.title.toLowerCase()}`}
              />
            ) : (
              <textarea
                value={formData[currentStep.field] || ''}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={`Ingresa ${currentStep.title.toLowerCase()}`}
                rows="3"
              />
            )}
            {validationError && (
              <div className="validation-error">
                <span>⚠️</span>
                <p>{validationError}</p>
              </div>
            )}
          </div>
        );

      case 'number':
        return (
          <div className="step-input">
            <label>{currentStep.message}</label>
            <input
              type="number"
              value={formData[currentStep.field] || ''}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="0"
              min="1"
            />
            {validationError && (
              <div className="validation-error">
                <span>⚠️</span>
                <p>{validationError}</p>
              </div>
            )}
          </div>
        );

      case 'date':
        return (
          <div className="step-input">
            <label>{currentStep.message}</label>
            <input
              type="date"
              value={formData[currentStep.field] || ''}
              onChange={(e) => handleInputChange(e.target.value)}
            />
            {validationError && (
              <div className="validation-error">
                <span>⚠️</span>
                <p>{validationError}</p>
              </div>
            )}
          </div>
        );

      case 'select':
        return (
          <div className="step-select">
            <label>{currentStep.message}</label>
            {suggestion && (
              <div className="suggestion-box">
                <span>💡</span>
                <p>{suggestion.reason}</p>
              </div>
            )}
            <div className="options-grid">
              {currentStep.options.map(option => (
                <button
                  key={option.value}
                  className={`option-btn ${formData[currentStep.field] === option.value ? 'selected' : ''}`}
                  onClick={() => handleInputChange(option.value)}
                >
                  <span className="option-emoji">{option.emoji}</span>
                  <span className="option-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'confirm':
        return (
          <div className="step-confirm">
            <p>{currentStep.message}</p>
            <div className="confirmation-summary">
              <div className="summary-item">
                <span className="label">Cliente:</span>
                <span className="value">{formData.customer}</span>
              </div>
              <div className="summary-item">
                <span className="label">Producto:</span>
                <span className="value">{formData.product}</span>
              </div>
              <div className="summary-item">
                <span className="label">Cantidad:</span>
                <span className="value">{formData.quantity}</span>
              </div>
              <div className="summary-item">
                <span className="label">Vencimiento:</span>
                <span className="value">{new Date(formData.dueDate).toLocaleDateString('es-ES')}</span>
              </div>
              <div className="summary-item">
                <span className="label">Prioridad:</span>
                <span className="value">{formData.priority}</span>
              </div>
              {formData.assignedTo && (
                <div className="summary-item">
                  <span className="label">Asignado a:</span>
                  <span className="value">{formData.assignedTo}</span>
                </div>
              )}
              {formData.notes && (
                <div className="summary-item">
                  <span className="label">Notas:</span>
                  <span className="value">{formData.notes}</span>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="order-assistant-panel">
      {/* Alertas */}
      {alerts.length > 0 && currentStepId === 'welcome' && (
        <div className="assistant-alerts">
          <h4>⚠️ Alertas</h4>
          {alerts.map((alert, index) => (
            <div key={index} className={`alert-item ${alert.severity}`}>
              <p>{alert.message}</p>
              <button className="alert-action">{alert.action}</button>
            </div>
          ))}
        </div>
      )}

      {/* Acciones rápidas */}
      {quickActions.length > 0 && currentStepId === 'welcome' && (
        <div className="assistant-quick-actions">
          <h4>⚡ Acciones Rápidas</h4>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="quick-action-btn"
                onClick={() => handleQuickAction(action.action)}
                disabled={loading}
              >
                <span>{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Paso actual */}
      <div className="assistant-step">
        <div className="step-header">
          <h3>{currentStep?.title}</h3>
          <div className="step-progress">
            Paso {assistantSteps.findIndex(s => s.id === currentStepId) + 1} de {assistantSteps.length}
          </div>
        </div>

        <div className="step-content">
          {renderStepContent()}
        </div>

        <div className="step-navigation">
          {currentStepId !== 'welcome' && (
            <button className="nav-btn back" onClick={handleBack}>
              ← Atrás
            </button>
          )}
          <button
            className="nav-btn next"
            onClick={handleNext}
            disabled={loading || (validationError && !currentStep?.optional)}
          >
            {loading ? '⏳ Procesando...' : currentStep?.next ? 'Siguiente →' : '✅ Crear Orden'}
          </button>
        </div>
      </div>
    </div>
  );
}
