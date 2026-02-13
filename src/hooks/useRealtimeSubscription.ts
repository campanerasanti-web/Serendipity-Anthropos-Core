import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';

export interface RealtimeEvent<T = any> {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  new: T;
  old: T;
  timestamp: Date;
}

interface UseRealtimeSubscriptionOptions {
  schema?: string;
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  onEvent?: (event: RealtimeEvent) => void;
  invalidateQueries?: boolean;
  invalidateQueryKey?: string[];
}

/**
 * Hook para suscribirse a cambios reales en Supabase
 * Automáticamente invalida React Query cache cuando hay cambios
 * 
 * Ejemplo:
 * ```ts
 * useRealtimeSubscription({
 *   table: 'invoices',
 *   event: 'INSERT',
 *   onEvent: (event) => console.log('Nueva factura:', event.new),
 *   invalidateQueries: true,
 *   invalidateQueryKey: ['monthly-stats']
 * });
 * ```
 */
export const useRealtimeSubscription = (
  options: UseRealtimeSubscriptionOptions
) => {
  const {
    schema = 'public',
    table,
    event = '*',
    filter,
    onEvent,
    invalidateQueries = true,
    invalidateQueryKey = [`${table}-changes`],
  } = options;

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();
  const channelRef: React.MutableRefObject<RealtimeChannel | null> = {
    current: null,
  };

  const handleEvent = useCallback(
    (payload: any) => {
      const realtimeEvent: RealtimeEvent = {
        type: payload.eventType,
        table,
        new: payload.new,
        old: payload.old,
        timestamp: new Date(),
      };

      // Callback personalizado del usuario
      if (onEvent) {
        onEvent(realtimeEvent);
      }

      // Invalidar queries automáticamente
      if (invalidateQueries) {
        queryClient.invalidateQueries({
          queryKey: invalidateQueryKey,
        });
      }
    },
    [onEvent, table, invalidateQueries, invalidateQueryKey, queryClient]
  );

  useEffect(() => {
    // Crear canal de escucha
    const channel = supabase
      .channel(`${schema}.${table}`)
      .on(
        'postgres_changes',
        {
          event,
          schema,
          table,
          filter,
        },
        handleEvent
      )
      .subscribe((status: unknown) => {
        if (status === 'SUBSCRIBED') {
          setIsSubscribed(true);
          setError(null);
        } else if (status === 'CHANNEL_ERROR') {
          setError(new Error(`Error subscribing to realtime: ${status}`));
        }
      });

    channelRef.current = channel;

    // Cleanup: desuscribirse al desmontar
    return () => {
      supabase.removeChannel(channel);
      setIsSubscribed(false);
    };
  }, [schema, table, event, filter, handleEvent]);

  return {
    isSubscribed,
    error,
    unsubscribe: () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        setIsSubscribed(false);
      }
    },
  };
};

/**
 * Hook específico para monitorear cambios en invoices
 * Auto-invalida monthly-stats cuando hay cambios
 */
export const useInvoicesRealtime = (onEvent?: (event: RealtimeEvent) => void) => {
  return useRealtimeSubscription({
    table: 'invoices',
    event: '*',
    onEvent,
    invalidateQueries: true,
    invalidateQueryKey: ['monthly-stats'],
  });
};

/**
 * Hook específico para monitorear cambios en fixed_costs
 */
export const useFixedCostsRealtime = (onEvent?: (event: RealtimeEvent) => void) => {
  return useRealtimeSubscription({
    table: 'fixed_costs',
    event: '*',
    onEvent,
    invalidateQueries: true,
    invalidateQueryKey: ['monthly-stats'],
  });
};
