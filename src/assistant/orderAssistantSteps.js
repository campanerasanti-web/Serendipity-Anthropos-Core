/**
 * Pasos del asistente guiado para órdenes
 * Define la lógica de validación y sugerencias
 */

export const assistantSteps = [
  {
    id: 'welcome',
    title: 'Bienvenido al Asistente de Órdenes',
    message: '¡Hola! 👋 Te ayudaré a crear una orden paso a paso. ¿Comenzamos?',
    type: 'info',
    next: 'customer',
  },
  {
    id: 'customer',
    title: 'Cliente',
    message: '¿Cuál es el nombre del cliente?',
    type: 'input',
    field: 'customer',
    validation: (value) => {
      if (!value || value.trim().length === 0) {
        return 'El nombre del cliente es obligatorio';
      }
      if (value.length < 3) {
        return 'El nombre debe tener al menos 3 caracteres';
      }
      return null;
    },
    next: 'product',
  },
  {
    id: 'product',
    title: 'Producto/Servicio',
    message: '¿Qué producto o servicio necesita el cliente?',
    type: 'input',
    field: 'product',
    validation: (value) => {
      if (!value || value.trim().length === 0) {
        return 'La descripción del producto es obligatoria';
      }
      return null;
    },
    next: 'quantity',
  },
  {
    id: 'quantity',
    title: 'Cantidad',
    message: '¿Cuántas unidades se necesitan?',
    type: 'number',
    field: 'quantity',
    validation: (value) => {
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 1) {
        return 'La cantidad debe ser al menos 1';
      }
      return null;
    },
    next: 'dueDate',
  },
  {
    id: 'dueDate',
    title: 'Fecha de Vencimiento',
    message: '¿Cuándo debe estar lista la orden?',
    type: 'date',
    field: 'dueDate',
    validation: (value) => {
      if (!value) {
        return 'La fecha de vencimiento es obligatoria';
      }
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        return 'La fecha no puede ser anterior a hoy';
      }
      return null;
    },
    next: 'priority',
  },
  {
    id: 'priority',
    title: 'Prioridad',
    message: '¿Qué prioridad tiene esta orden?',
    type: 'select',
    field: 'priority',
    options: [
      { value: 'low', label: 'Baja - Puede esperar', emoji: '🟢' },
      { value: 'normal', label: 'Normal - Estándar', emoji: '🔵' },
      { value: 'high', label: 'Alta - Importante', emoji: '🟡' },
      { value: 'urgent', label: 'Urgente - Crítica', emoji: '🔴' },
    ],
    suggestion: (formData) => {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

      if (daysUntilDue <= 1) {
        return {
          priority: 'urgent',
          reason: `La orden vence en ${daysUntilDue} día(s). Sugerencia: URGENTE`,
        };
      } else if (daysUntilDue <= 3) {
        return {
          priority: 'high',
          reason: `La orden vence en ${daysUntilDue} días. Sugerencia: ALTA`,
        };
      } else if (daysUntilDue > 14) {
        return {
          priority: 'low',
          reason: `La orden vence en ${daysUntilDue} días. Sugerencia: BAJA`,
        };
      }
      return {
        priority: 'normal',
        reason: 'Prioridad estándar recomendada',
      };
    },
    next: 'assignedTo',
  },
  {
    id: 'assignedTo',
    title: 'Asignación',
    message: '¿A quién quieres asignar esta orden? (Opcional)',
    type: 'input',
    field: 'assignedTo',
    optional: true,
    next: 'notes',
  },
  {
    id: 'notes',
    title: 'Notas',
    message: '¿Alguna instrucción adicional? (Opcional)',
    type: 'textarea',
    field: 'notes',
    optional: true,
    next: 'confirm',
  },
  {
    id: 'confirm',
    title: 'Confirmación',
    message: '¡Perfecto! Revisa los datos y confirma la creación.',
    type: 'confirm',
    next: null, // End of flow
  },
];

/**
 * Obtiene un paso por ID
 */
export function getStepById(stepId) {
  return assistantSteps.find(step => step.id === stepId);
}

/**
 * Obtiene el siguiente paso
 */
export function getNextStep(currentStepId) {
  const currentStep = getStepById(currentStepId);
  if (!currentStep || !currentStep.next) return null;
  return getStepById(currentStep.next);
}

/**
 * Valida un campo específico
 */
export function validateField(stepId, value, formData = {}) {
  const step = getStepById(stepId);
  if (!step || !step.validation) return null;
  return step.validation(value, formData);
}

/**
 * Obtiene sugerencias para un paso
 */
export function getSuggestion(stepId, formData) {
  const step = getStepById(stepId);
  if (!step || !step.suggestion) return null;
  return step.suggestion(formData);
}

/**
 * Detecta órdenes que requieren atención urgente
 */
export function analyzeOrdersForAlerts(orders) {
  const alerts = [];

  const now = new Date();

  // Órdenes vencidas
  const overdue = orders.filter(
    o => new Date(o.dueDate) < now && o.status !== 'completed' && o.status !== 'cancelled'
  );
  if (overdue.length > 0) {
    alerts.push({
      type: 'overdue',
      severity: 'high',
      message: `Tienes ${overdue.length} orden(es) vencida(s)`,
      action: 'Ver órdenes vencidas',
      orders: overdue,
    });
  }

  // Órdenes urgentes pendientes
  const urgentPending = orders.filter(
    o => o.priority === 'urgent' && o.status === 'pending'
  );
  if (urgentPending.length > 0) {
    alerts.push({
      type: 'urgent',
      severity: 'medium',
      message: `${urgentPending.length} orden(es) urgente(s) sin iniciar`,
      action: 'Iniciar órdenes urgentes',
      orders: urgentPending,
    });
  }

  // Órdenes que vencen pronto (próximas 24 horas)
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const dueSoon = orders.filter(
    o => new Date(o.dueDate) <= tomorrow && 
         new Date(o.dueDate) > now &&
         o.status !== 'completed' && 
         o.status !== 'cancelled'
  );
  if (dueSoon.length > 0) {
    alerts.push({
      type: 'due-soon',
      severity: 'medium',
      message: `${dueSoon.length} orden(es) vencen en menos de 24 horas`,
      action: 'Revisar órdenes próximas',
      orders: dueSoon,
    });
  }

  // Órdenes sin asignar
  const unassigned = orders.filter(
    o => !o.assignedTo && o.status !== 'completed' && o.status !== 'cancelled'
  );
  if (unassigned.length > 0) {
    alerts.push({
      type: 'unassigned',
      severity: 'low',
      message: `${unassigned.length} orden(es) sin asignar`,
      action: 'Asignar órdenes',
      orders: unassigned,
    });
  }

  return alerts.sort((a, b) => {
    const severityOrder = { high: 3, medium: 2, low: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
}

/**
 * Genera recomendaciones de acción rápida
 */
export function generateQuickActions(orders) {
  const actions = [];

  // Contadores
  const pending = orders.filter(o => o.status === 'pending').length;
  const inProgress = orders.filter(o => o.status === 'in-progress').length;

  if (pending > 0) {
    actions.push({
      icon: '▶️',
      label: `Iniciar ${pending} orden(es) pendiente(s)`,
      action: 'start-pending',
    });
  }

  if (inProgress > 0) {
    actions.push({
      icon: '✅',
      label: `Completar ${inProgress} orden(es) en progreso`,
      action: 'complete-in-progress',
    });
  }

  actions.push({
    icon: '➕',
    label: 'Crear nueva orden',
    action: 'create-order',
  });

  actions.push({
    icon: '📊',
    label: 'Ver estadísticas',
    action: 'view-stats',
  });

  return actions;
}
