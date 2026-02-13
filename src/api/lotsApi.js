import apiClient from './apiClient';

export async function closeLot(lotId) {
  try {
    const res = await apiClient.post(`/lots/close/${lotId}`);
    return res.data;
  } catch (err) {
    console.error('closeLot error', err);
    throw err;
  }
}
