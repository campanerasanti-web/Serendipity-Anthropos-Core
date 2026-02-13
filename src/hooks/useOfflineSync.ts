/**
 * MODO OFFLINE/ONLINE - Sistema de Sincronización
 * Datos core funcionan sin internet, sync automático al reconectar
 * 
 * "La luz fluye incluso en la oscuridad de la desconexión"
 */

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';

export type EntityType = 'financial' | 'team' | 'alert' | 'recommendation' | 'order' | 'chat';
export type OperationType = 'create' | 'update' | 'delete';

export interface SyncQueueItem {
  id: string;
  operation: OperationType;
  entity: EntityType;
  data: any;
  timestamp: Date;
  synced: boolean;
  retries: number;
  error?: string;
}

export interface OfflineState {
  isOnline: boolean;
  lastSyncTime: Date | null;
  pendingSync: number;
  isSyncing: boolean;
  syncErrors: number;
}

/**
 * Hook para gestión de modo offline y sincronización
 */
export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(() => {
    // Recuperar cola de sincronización de localStorage
    const saved = localStorage.getItem('serendipity-sync-queue');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(() => {
    const saved = localStorage.getItem('serendipity-last-sync');
    return saved ? new Date(saved) : null;
  });

  const [isSyncing, setIsSyncing] = useState(false);

  // Persistir cola en localStorage
  useEffect(() => {
    localStorage.setItem('serendipity-sync-queue', JSON.stringify(syncQueue));
  }, [syncQueue]);

  // Persistir última sincronización
  useEffect(() => {
    if (lastSyncTime) {
      localStorage.setItem('serendipity-last-sync', lastSyncTime.toISOString());
    }
  }, [lastSyncTime]);

  // Escuchar eventos de conexión/desconexión
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Conexión restaurada → Iniciando sincronización...');
      setIsOnline(true);
      syncPendingChanges(); // Auto-sync al reconectar
    };

    const handleOffline = () => {
      console.log('📵 Conexión perdida → Modo offline activado');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Añade una operación a la cola de sincronización
   */
  const queueSync = (
    operation: OperationType,
    entity: EntityType,
    data: any
  ): string => {
    const id = `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const item: SyncQueueItem = {
      id,
      operation,
      entity,
      data,
      timestamp: new Date(),
      synced: false,
      retries: 0,
    };

    setSyncQueue((prev) => [...prev, item]);

    // Si estamos online, intentar sincronizar inmediatamente
    if (isOnline) {
      syncPendingChanges();
    }

    console.log(`📥 Cola de sync: ${operation} ${entity} → ${id}`);
    return id;
  };

  /**
   * Sincroniza todos los cambios pendientes
   */
  const syncPendingChanges = useCallback(async () => {
    const pending = syncQueue.filter((item) => !item.synced);
    if (pending.length === 0) {
      console.log('✅ No hay cambios pendientes de sincronización');
      return;
    }

    if (!isOnline) {
      console.log('📵 Offline: sincronización pospuesta');
      return;
    }

    setIsSyncing(true);
    console.log(`🔄 Sincronizando ${pending.length} cambios...`);

    for (const item of pending) {
      try {
        // Simular llamada a API (reemplazar con llamada real)
        await syncItemToBackend(item);

        // Marcar como sincronizado
        setSyncQueue((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, synced: true, error: undefined } : i
          )
        );

        console.log(`✅ Sincronizado: ${item.operation} ${item.entity} → ${item.id}`);
      } catch (error: any) {
        // Incrementar reintentos y registrar error
        setSyncQueue((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  retries: i.retries + 1,
                  error: error.message || 'Error desconocido',
                }
              : i
          )
        );

        console.error(`❌ Error al sincronizar ${item.id}:`, error.message);

        // Si falla más de 3 veces, marcar como error permanente
        if (item.retries >= 3) {
          console.error(`⚠️ Item ${item.id} excedió reintentos máximos`);
        }
      }
    }

    setLastSyncTime(new Date());
    setIsSyncing(false);
    console.log('🌟 Sincronización completada');
  }, [syncQueue, isOnline]);

  /**
   * Simula sincronización con backend (reemplazar con API real)
   */
  const syncItemToBackend = async (item: SyncQueueItem): Promise<void> => {
    if (item.entity === 'order') {
      if (item.operation === 'create') {
        await apiClient.post('/api/orders', item.data);
        return;
      }

      if (item.operation === 'update') {
        if (item.data?.status) {
          await apiClient.patch(`/api/orders/${item.data.id}/status`, {
            newStatus: item.data.status,
            reason: item.data.reason,
            changedBy: item.data.updatedBy,
            metadata: item.data.metadata,
          });
          return;
        }

        await apiClient.patch(`/api/orders/${item.data.id}`, item.data);
        return;
      }

      if (item.operation === 'delete') {
        await apiClient.delete(`/api/orders/${item.data.id}`);
        return;
      }
    }

    // Fallback: simular latencia para entidades no integradas
    await new Promise((resolve) => setTimeout(resolve, 300));
  };

  /**
   * Limpia elementos ya sincronizados (más de 7 días)
   */
  const cleanSyncedItems = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    setSyncQueue((prev) =>
      prev.filter((item) => !item.synced || item.timestamp > sevenDaysAgo)
    );
  };

  /**
   * Limpia toda la cola de sincronización (usar con precaución)
   */
  const clearSyncQueue = () => {
    setSyncQueue([]);
    localStorage.removeItem('serendipity-sync-queue');
    console.log('🗑️ Cola de sincronización limpiada');
  };

  /**
   * Reintenta sincronizar elementos fallidos
   */
  const retryFailedSyncs = async () => {
    const failed = syncQueue.filter((item) => !item.synced && item.retries > 0);
    if (failed.length === 0) {
      console.log('✅ No hay sincronizaciones fallidas');
      return;
    }

    console.log(`🔄 Reintentando ${failed.length} sincronizaciones fallidas...`);
    await syncPendingChanges();
  };

  /**
   * Obtiene estadísticas de sincronización
   */
  const getSyncStats = () => {
    const total = syncQueue.length;
    const synced = syncQueue.filter((item) => item.synced).length;
    const pending = syncQueue.filter((item) => !item.synced).length;
    const errors = syncQueue.filter((item) => !item.synced && item.retries > 0).length;

    return {
      total,
      synced,
      pending,
      errors,
      lastSyncTime,
    };
  };

  /**
   * Obtiene estado offline completo
   */
  const getOfflineState = (): OfflineState => {
    const stats = getSyncStats();
    return {
      isOnline,
      lastSyncTime,
      pendingSync: stats.pending,
      isSyncing,
      syncErrors: stats.errors,
    };
  };

  /**
   * Verifica si una entidad específica está sincronizada
   */
  const isEntitySynced = (entityType: EntityType, entityId: string): boolean => {
    const entityItems = syncQueue.filter(
      (item) => item.entity === entityType && item.data.id === entityId
    );
    return entityItems.length === 0 || entityItems.every((item) => item.synced);
  };

  return {
    isOnline,
    isSyncing,
    lastSyncTime,
    syncQueue,
    queueSync,
    syncPendingChanges,
    cleanSyncedItems,
    clearSyncQueue,
    retryFailedSyncs,
    getSyncStats,
    getOfflineState,
    isEntitySynced,
  };
};

/**
 * Hook simplificado para solo verificar estado online
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
