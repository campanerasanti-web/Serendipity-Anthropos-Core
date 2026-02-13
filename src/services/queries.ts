// ============================================================
// QUERY & MUTATION SERVICES - INTELLIGENT DASHBOARD + ANTHROPOS
// ============================================================
// Updated to work with Express backend + Anthropos Core
// Supports financial data, manual input, and super agent checkup

import {
  Stats,
  Metric,
  Prediction,
  TodaysInsight,
  PeriodAnalytics,
  AnthroposReport,
  ManualInputResponse,
  CheckupResponse
} from '../types';

// API Base URL - configure for your environment
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ============================================================
// FINANCIAL DATA QUERIES
// ============================================================

export const fetchUnifiedDashboard = async (): Promise<Stats> => {
  const res = await fetch(`${API_BASE}/api/unified-dashboard`);
  if (!res.ok) throw new Error('Failed to fetch unified dashboard');
  return res.json();
};

export const fetchMonthlyInvoices = async (limit: number = 50, offset: number = 0) => {
  try {
    const res = await fetch(`${API_BASE}/api/invoices?limit=${limit}&offset=${offset}`);
    if (!res.ok) throw new Error('Failed to fetch invoices');
    return res.json();
  } catch {
    return { data: [], total: 0 };
  }
};

export const fetchMonthlyFixedCosts = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/fixed-costs`);
    if (!res.ok) throw new Error('Failed to fetch fixed costs');
    return res.json();
  } catch {
    return { total: 0 };
  }
};

export const fetchLast30DaysMetrics = async (): Promise<Metric[]> => {
  const res = await fetch(`${API_BASE}/api/last-30-days-metrics`);
  if (!res.ok) throw new Error('Failed to fetch metrics');
  return res.json();
};

export const fetchCashFlowPrediction = async (): Promise<Prediction> => {
  const res = await fetch(`${API_BASE}/api/cashflow-prediction`);
  if (!res.ok) throw new Error('Failed to fetch prediction');
  return res.json();
};

export const fetchTodaysInsight = async (): Promise<TodaysInsight> => {
  const res = await fetch(`${API_BASE}/api/todays-insight`);
  if (!res.ok) throw new Error('Failed to fetch today\'s insight');
  return res.json();
};

export const fetchPeriodAnalytics = async (): Promise<PeriodAnalytics> => {
  const res = await fetch(`${API_BASE}/api/period-analytics`);
  if (!res.ok) throw new Error('Failed to fetch period analytics');
  return res.json();
};

// ============================================================
// ANTHROPOS & SUPER AGENT QUERIES
// ============================================================

export const fetchLastAnthroposReport = async (): Promise<AnthroposReport> => {
  const res = await fetch(`${API_BASE}/api/anthropos/last-report`);
  if (!res.ok) throw new Error('Failed to fetch Anthropos report');
  return res.json();
};

// ============================================================
// MUTATIONS - MANUAL DATA & SUPER AGENT
// ============================================================

/**
 * Submit manual financial data with optional file attachments
 * @param income - Monthly income
 * @param costs - Monthly costs
 * @param description - Optional description
 * @param file - Optional attachment (Excel, PDF, image)
 * @returns Response with processed data and recommendations
 */
export const submitManualData = async (
  income: number,
  costs: number,
  description?: string,
  file?: File
): Promise<ManualInputResponse> => {
  const formData = new FormData();
  formData.append('income', income.toString());
  formData.append('costs', costs.toString());
  if (description) formData.append('description', description);
  if (file) formData.append('attachment', file);

  const res = await fetch(`${API_BASE}/api/manual-input`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Failed to submit manual data');
  return res.json();
};

/**
 * Run full Super Agent checkup
 * Executes all agents in parallel: OpsGardener, SecurityGardener, etc.
 * @returns Comprehensive Anthropos system report with all measurements
 */
export const runFullCheckup = async (): Promise<CheckupResponse> => {
  const res = await fetch(`${API_BASE}/api/anthropos/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  if (!res.ok) throw new Error('Failed to run full checkup');
  return res.json();
};

// ============================================================
// LOCAL DATA SERVICE - Client-side cache for resilience
// ============================================================

export const localDataService = {
  save: (key: string, data: any) => {
    try {
      localStorage.setItem(`serendipity_${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn(`Failed to save ${key}:`, e);
    }
  },

  load: (key: string) => {
    try {
      const item = localStorage.getItem(`serendipity_${key}`);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.warn(`Failed to load ${key}:`, e);
      return null;
    }
  },

  clear: (key: string) => {
    try {
      localStorage.removeItem(`serendipity_${key}`);
    } catch (e) {
      console.warn(`Failed to clear ${key}:`, e);
    }
  },

  fetchInvoices: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/invoices?limit=50&offset=0`);
      if (!res.ok) return { facturas: [] };
      return res.json();
    } catch (e) {
      console.warn('Failed to fetch invoices:', e);
      return { facturas: [] };
    }
  },

  fetchFixedCosts: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/fixed-costs`);
      if (!res.ok) return { costosFijos: [] };
      return res.json();
    } catch (e) {
      console.warn('Failed to fetch fixed costs:', e);
      return { costosFijos: [] };
    }
  }
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Helper to invalidate all React Query caches after mutations
 * Use this after manual input or checkup to refetch all data
 */
export const invalidateAllQueries = (queryClient: any) => {
  queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  queryClient.invalidateQueries({ queryKey: ['metrics'] });
  queryClient.invalidateQueries({ queryKey: ['prediction'] });
  queryClient.invalidateQueries({ queryKey: ['insight'] });
  queryClient.invalidateQueries({ queryKey: ['period'] });
  queryClient.invalidateQueries({ queryKey: ['anthropos'] });
};
