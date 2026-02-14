import { useEffect, useState, useCallback, useRef } from 'react';
import * as Sentry from '@sentry/react';
import { supabase } from '../supabase/supabaseClient';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface UseSupabaseRealtimeOptions<T> {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  onData?: (data: T[]) => void;
  onError?: (error: Error) => void;
}

export function useSupabaseRealtime<T =unknown>(
  options: UseSupabaseRealtimeOptions<T>
) {
  const { table, event = '*', filter, onData, onError } = options;
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Initial fetch
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase.from(table).select('*');

      if (filter) {
        query = query.not('deleted', 'is', true); // Default: exclude deleted
      }

      const { data: result, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setData(result || []);
      onData?.(result || []);

      Sentry.captureMessage(`Supabase fetch success: ${table}`, 'info');
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);

      Sentry.captureException(error, {
        tags: {
          component: 'useSupabaseRealtime',
          table,
          operation: 'fetch',
        },
      });
    } finally {
      setLoading(false);
    }
  }, [table, filter, onData, onError]);

  // Setup realtime subscription
  useEffect(() => {
    fetchInitialData();

    try {
      // Create channel with unique ID
      const channelId = `${table}-${Date.now()}`;
      const channel = supabase.channel(channelId);

      // Subscribe to postgres changes
      channel
        .on(
          'postgres_changes',
          {
            event,
            schema: 'public',
            table,
          },
          (payload: any) => {
            Sentry.addBreadcrumb({
              category: 'supabase.realtime',
              message: `${event} on ${table}`,
              level: 'info',
              data: {
                eventType: payload.eventType,
                table: payload.table,
              },
            });

            // Handle different event types
            switch (payload.eventType) {
              case 'INSERT':
                setData((prev) => [payload.new as T, ...prev]);
                break;
              case 'UPDATE':
                setData((prev) =>
                  prev.map((item) =>
                    (item as any).id === (payload.new as any).id
                      ? (payload.new as T)
                      : item
                  )
                );
                break;
              case 'DELETE':
                setData((prev) =>
                  prev.filter((item) => (item as any).id !== (payload.old as any).id)
                );
                break;
            }
          }
        )
        .subscribe((status: any) => {
          if (status === 'SUBSCRIBED') {
            Sentry.captureMessage(
              `Supabase realtime subscribed: ${table}`,
              'info'
            );
          } else if (status === 'CHANNEL_ERROR') {
            const channelError = new Error(
              `Channel error for ${table}`
            );
            setError(channelError);
            Sentry.captureException(channelError, {
              tags: { component: 'useSupabaseRealtime', status },
            });
          }
        });

      channelRef.current = channel;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      Sentry.captureException(error, {
        tags: {
          component: 'useSupabaseRealtime',
          table,
          operation: 'subscribe',
        },
      });
    }

    // Cleanup
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [table, event, filter, fetchInitialData]);

  const refetch = useCallback(async () => {
    Sentry.captureMessage(
      `Manual refetch triggered: ${table}`,
      'info'
    );
    fetchInitialData();
  }, [fetchInitialData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
