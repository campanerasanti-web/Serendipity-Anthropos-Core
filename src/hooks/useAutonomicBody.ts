/**
 * 🧠 useAutonomicBody
 * 
 * Hook de React que conecta componentes al Sistema Nervioso Autónomo
 * Proporciona sincronización automática con el backend
 */

import { useState, useEffect, useCallback } from 'react';
import { initializeAutonomicSystem, getAutonomicSystem } from '../services/autonomic-system';

interface UseAutonomicBodyReturn {
  isHealthy: boolean;
  healthStatus: 'healthy' | 'degraded' | 'critical';
  responseTime: number;
  lastError?: string;
  organs: Array<{
    name: string;
    endpoint: string;
    healthy: boolean;
    lastCheck: number;
    failureCount: number;
  }>;
  syncNow: () => Promise<void>;
}

export function useAutonomicBody(): UseAutonomicBodyReturn {
  const [health, setHealth] = useState({
    status: 'healthy' as const,
    responseTime: 0,
    lastError: undefined
  });

  const [organs, setOrgans] = useState<any[]>([]);

  useEffect(() => {
    console.log('🫀 useAutonomicBody: Inicializando Sistema Nervioso...');
    
    // Inicializa el sistema nervioso
    const system = initializeAutonomicSystem();

    // Registra listener para cambios de salud
    const unsubscribe = system.onHealthChange((newHealth) => {
      console.log('💓 Latido detectado:', {
        status: newHealth.status,
        time: `${newHealth.responseTime.toFixed(2)}ms`,
        timestamp: new Date().toLocaleTimeString('es-ES')
      });

      setHealth({
        status: newHealth.status,
        responseTime: newHealth.responseTime,
        lastError: newHealth.lastError
      });
      
      // Actualiza estado de órganos
      const organList = system.getOrgans();
      setOrgans(organList);

      // Log de diagnóstico
      console.log('💓 Latido:', {
        status: newHealth.status,
        time: `${newHealth.responseTime.toFixed(2)}ms`,
        organs: organList.map(o => `${o.name}: ${o.healthy ? '✓' : '✗'}`)
      });
    });

    // Actualiza órganos inicialmente
    setOrgans(system.getOrgans());

    return unsubscribe;
  }, []);

  const syncNow = useCallback(async () => {
    console.log('🔄 Sincronización manual requestada...');
    const system = getAutonomicSystem();
    await system.syncNow();
  }, []);

  return {
    isHealthy: health.status === 'healthy',
    healthStatus: health.status,
    responseTime: health.responseTime,
    lastError: health.lastError,
    organs,
    syncNow
  };
}
