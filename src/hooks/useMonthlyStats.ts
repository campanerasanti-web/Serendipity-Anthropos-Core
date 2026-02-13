import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '../supabase/supabaseClient';

export interface MonthlyStats {
  totalRevenue: number;
  fixedCosts: number;
  netFlow: number;
  peaceFund: number;
  progressPercent: number;
  status: 'PEACE' | 'WORKING' | 'CRISIS';
}

/**
 * Custom hook para obtener estadísticas mensuales con caché automático
 * Usa React Query para:
 * - Caché inteligente (staleTime: 5 min)
 * - Refetch automático
 * - Invalidación fácil
 * - Deduplicación de requests
 */
export const useMonthlyStats = (
  month?: number,
  year?: number
): UseQueryResult<MonthlyStats, Error> => {
  const now = new Date();
  const queryMonth = month || now.getMonth() + 1;
  const queryYear = year || now.getFullYear();

  return useQuery<MonthlyStats, Error>({
    queryKey: ['monthly-stats', queryMonth, queryYear],
    queryFn: async () => {
      // Usar RPC consolidado en lugar de múltiples queries
      const { data, error } = await supabase.rpc(
        'get_unified_dashboard',
        {
          p_month: queryMonth,
          p_year: queryYear,
        }
      );

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('No data found for the requested month');
      }

      const result = data[0];

      return {
        totalRevenue: result.total_revenue || 0,
        fixedCosts: result.fixed_costs || 0,
        netFlow: result.net_flow || 0,
        peaceFund: result.peace_fund || 0,
        progressPercent: result.progress_percent || 0,
        status: result.status || 'WORKING',
      };
    },
    // Estrategia de caché optimizada
    staleTime: 5 * 60 * 1000, // 5 minutos - datos jóvenes
    gcTime: 30 * 60 * 1000, // 30 minutos en memoria
    refetchOnWindowFocus: false, // No refetch al cambiar ventana
    retry: 2, // Reintentar 2 veces en error
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

/**
 * Hook para obtener estadísticas del mes actual
 */
export const useCurrentMonthStats = (): UseQueryResult<MonthlyStats, Error> => {
  const now = new Date();
  return useMonthlyStats(now.getMonth() + 1, now.getFullYear());
};