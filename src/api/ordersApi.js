/**
 * API Client para el sistema de Órdenes con QR
 * Consume los endpoints REST del backend
 */

const API_BASE_URL = 'http://localhost:5000/api';

// ========================================
// ORDERS API
// ========================================

/**
 * Crear nueva orden
 */
export async function createOrder(orderData) {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error creando orden');
  }

  return await response.json();
}

/**
 * Obtener orden por ID
 */
export async function getOrderById(orderId) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error obteniendo orden');
  }

  return await response.json();
}

/**
 * Obtener todas las órdenes (opcionalmente filtradas por estado)
 */
export async function getAllOrders(status = null) {
  const url = status
    ? `${API_BASE_URL}/orders?status=${status}`
    : `${API_BASE_URL}/orders`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error obteniendo órdenes');
  }

  return await response.json();
}

/**
 * Obtener órdenes vencidas
 */
export async function getOverdueOrders() {
  const response = await fetch(`${API_BASE_URL}/orders/overdue`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error obteniendo órdenes vencidas');
  }

  return await response.json();
}

/**
 * Actualizar orden
 */
export async function updateOrder(orderId, updates) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error actualizando orden');
  }

  return await response.json();
}

/**
 * Cambiar estado de orden
 */
export async function changeOrderStatus(orderId, newStatus, reason = null, changedBy = null) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newStatus, reason, changedBy }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error cambiando estado');
  }

  return await response.json();
}

/**
 * Obtener historial de estados de una orden
 */
export async function getOrderHistory(orderId) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/history`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error obteniendo historial');
  }

  return await response.json();
}

/**
 * Eliminar orden (soft delete)
 */
export async function deleteOrder(orderId, deletedBy = null) {
  const url = deletedBy
    ? `${API_BASE_URL}/orders/${orderId}?deletedBy=${deletedBy}`
    : `${API_BASE_URL}/orders/${orderId}`;

  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error eliminando orden');
  }

  return await response.json();
}

/**
 * Obtener estadísticas de órdenes
 */
export async function getOrderStats() {
  const response = await fetch(`${API_BASE_URL}/orders/stats`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error obteniendo estadísticas');
  }

  return await response.json();
}

// ========================================
// QR API
// ========================================

/**
 * Obtener orden por código QR
 */
export async function getOrderByQrCode(qrCode) {
  const response = await fetch(`${API_BASE_URL}/qr/${qrCode}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Código QR no encontrado');
  }

  return await response.json();
}

/**
 * Registrar escaneo de código QR
 */
export async function registerQrScan(qrCode, scannedBy = null, location = null, device = null) {
  const response = await fetch(`${API_BASE_URL}/qr/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qrCode, scannedBy, location, device }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error registrando escaneo');
  }

  return await response.json();
}

/**
 * Obtener historial de escaneos de un código QR
 */
export async function getQrScanHistory(qrCode) {
  const response = await fetch(`${API_BASE_URL}/qr/${qrCode}/history`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error obteniendo historial de escaneos');
  }

  return await response.json();
}

/**
 * Obtener escaneos recientes
 */
export async function getRecentScans(limit = 100) {
  const response = await fetch(`${API_BASE_URL}/qr/scans/recent?limit=${limit}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error obteniendo escaneos recientes');
  }

  return await response.json();
}

/**
 * Obtener estadísticas de escaneos
 */
export async function getScanStats() {
  const response = await fetch(`${API_BASE_URL}/qr/stats`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error obteniendo estadísticas de escaneos');
  }

  return await response.json();
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Obtiene el color del semáforo según estado y vencimiento
 */
export function getTrafficLightColor(status, dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  const daysUntilDue = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

  // Si está completada o cancelada, siempre es verde
  if (status === 'completed') return 'green';
  if (status === 'cancelled') return 'gray';

  // Si está vencida, rojo
  if (daysUntilDue < 0) return 'red';

  // Si faltan menos de 3 días, amarillo
  if (daysUntilDue <= 3) return 'amber';

  // Si está en progreso, amarillo
  if (status === 'in-progress') return 'amber';

  // Por defecto, verde
  return 'green';
}

/**
 * Obtiene el emoji del semáforo
 */
export function getTrafficLightEmoji(color) {
  switch (color) {
    case 'red': return '🔴';
    case 'amber': return '🟡';
    case 'green': return '🟢';
    default: return '⚪';
  }
}

/**
 * Formatea una fecha a string legible
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Obtiene el texto de prioridad traducido
 */
export function getPriorityLabel(priority) {
  const labels = {
    urgent: 'Urgente',
    high: 'Alta',
    normal: 'Normal',
    low: 'Baja',
  };
  return labels[priority] || priority;
}

/**
 * Obtiene el texto de estado traducido
 */
export function getStatusLabel(status) {
  const labels = {
    pending: 'Pendiente',
    'in-progress': 'En Progreso',
    completed: 'Completada',
    cancelled: 'Cancelada',
  };
  return labels[status] || status;
}
