import apiClient from './apiClient';

/**
 * Obtener órdenes en WIP
 * GET /api/production/wip
 */
export async function getWipList() {
  try {
    const data = await apiClient.get('/api/production/wip');
    return data;
  } catch (err) {
    console.error('getWipList error', err);
    throw err;
  }
}

/**
 * Crear nueva orden de producción
 * POST /api/production/create
 */
export async function createProductionOrder(dto) {
  try {
    const data = await apiClient.post('/api/production/create', dto);
    return data;
  } catch (err) {
    console.error('createProductionOrder error', err);
    throw err;
  }
}

/**
 * Cerrar orden de producción (deprecated: use lotsApi.closeLot)
 * POST /api/production/close/{lotId}
 */
export async function closeProductionOrder(lotId) {
  try {
    const data = await apiClient.post(`/api/production/close/${lotId}`);
    return data;
  } catch (err) {
    console.error('closeProductionOrder error', err);
    throw err;
  }
}
