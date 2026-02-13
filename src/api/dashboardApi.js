import apiClient from './apiClient';

/**
 * Obtener métricas diarias del dashboard
 * GET /api/dashboard/daily
 */
export async function getDailyDashboard() {
  try {
    const data = await apiClient.get('/api/dashboard/daily');
    return data;
  } catch (err) {
    console.error('getDailyDashboard error', err);
    throw err;
  }
}

/**
 * Obtener proyección mensual
 * GET /api/dashboard/projection?month=2&year=2026
 */
export async function getMonthlyProjection(month, year) {
  try {
    const data = await apiClient.get(`/api/dashboard/projection?month=${month}&year=${year}`);
    return data;
  } catch (err) {
    console.error('getMonthlyProjection error', err);
    throw err;
  }
}

/**
 * Obtener resumen de tendencias (últimos 30 días)
 * GET /api/dashboard/trends
 */
export async function getTrends() {
  try {
    const data = await apiClient.get('/api/dashboard/trends');
    return data;
  } catch (err) {
    console.error('getTrends error', err);
    throw err;
  }
}
