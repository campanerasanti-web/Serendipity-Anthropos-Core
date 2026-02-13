import apiClient from './apiClient';

export async function getNextStep(context) {
  try {
    const res = await apiClient.post('/assistant/next-step', context);
    return res.data;
  } catch (err) {
    console.error('getNextStep error', err);
    throw err;
  }
}
