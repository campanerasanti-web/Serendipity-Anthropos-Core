/**
 * API para el asistente de órdenes
 * Funciones auxiliares para el flujo guiado
 */

import { createOrder, getAllOrders, changeOrderStatus } from '../api/ordersApi';

/**
 * Crea una orden usando los datos del asistente
 */
export async function createOrderFromAssistant(formData) {
  return await createOrder({
    ...formData,
    createdBy: 'Santiago Campanera (Asistente)',
  });
}

/**
 * Obtiene órdenes con análisis para el asistente
 */
export async function getOrdersWithAnalysis() {
  const orders = await getAllOrders();
  
  const now = new Date();
  
  const analysis = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => o.status === 'in-progress').length,
    completed: orders.filter(o => o.status === 'completed').length,
    overdue: orders.filter(
      o => new Date(o.dueDate) < now && o.status !== 'completed' && o.status !== 'cancelled'
    ).length,
    urgent: orders.filter(o => o.priority === 'urgent').length,
  };

  return { orders, analysis };
}

/**
 * Inicia todas las órdenes pendientes
 */
export async function startPendingOrders() {
  const orders = await getAllOrders();
  const pending = orders.filter(o => o.status === 'pending');

  const promises = pending.map(order =>
    changeOrderStatus(order.id, 'in-progress', 'Iniciado por asistente', 'Santiago Campanera')
  );

  return await Promise.all(promises);
}

/**
 * Completa todas las órdenes en progreso
 */
export async function completeInProgressOrders() {
  const orders = await getAllOrders();
  const inProgress = orders.filter(o => o.status === 'in-progress');

  const promises = inProgress.map(order =>
    changeOrderStatus(order.id, 'completed', 'Completado por asistente', 'Santiago Campanera')
  );

  return await Promise.all(promises);
}

/**
 * Sugerencias de búsqueda inteligente
 */
export function getSearchSuggestions(query, orders) {
  if (!query || query.length < 2) return [];

  const lowerQuery = query.toLowerCase();

  const suggestions = [];

  // Búsqueda por cliente
  const customerMatches = orders.filter(
    o => o.customer.toLowerCase().includes(lowerQuery)
  );
  if (customerMatches.length > 0) {
    suggestions.push({
      type: 'customer',
      label: `Cliente: "${customerMatches[0].customer}"`,
      count: customerMatches.length,
      icon: '👤',
    });
  }

  // Búsqueda por producto
  const productMatches = orders.filter(
    o => o.product.toLowerCase().includes(lowerQuery)
  );
  if (productMatches.length > 0) {
    suggestions.push({
      type: 'product',
      label: `Producto: "${productMatches[0].product}"`,
      count: productMatches.length,
      icon: '📦',
    });
  }

  // Búsqueda por QR
  const qrMatches = orders.filter(
    o => o.qrCode.toLowerCase().includes(lowerQuery)
  );
  if (qrMatches.length > 0) {
    suggestions.push({
      type: 'qr',
      label: `QR: "${qrMatches[0].qrCode}"`,
      count: qrMatches.length,
      icon: '🔍',
    });
  }

  return suggestions.slice(0, 5);
}

/**
 * Análisis de rendimiento de órdenes
 */
export function analyzePerformance(orders) {
  const completed = orders.filter(o => o.status === 'completed');

  if (completed.length === 0) {
    return {
      averageCompletionTime: 0,
      onTimeRate: 0,
      totalCompleted: 0,
    };
  }

  // Calcular tiempo promedio de completación
  let totalTime = 0;
  let onTime = 0;

  completed.forEach(order => {
    const created = new Date(order.createdAt);
    const updated = new Date(order.updatedAt);
    const due = new Date(order.dueDate);

    const completionTime = (updated - created) / (1000 * 60 * 60 * 24); // días
    totalTime += completionTime;

    if (updated <= due) {
      onTime++;
    }
  });

  return {
    averageCompletionTime: Math.round(totalTime / completed.length * 10) / 10,
    onTimeRate: Math.round((onTime / completed.length) * 100),
    totalCompleted: completed.length,
  };
}
