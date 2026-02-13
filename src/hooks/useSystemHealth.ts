/**
 * useSystemHealth - Monitoreo de los 10 Agentes del Sistema
 * Agrega estados de salud y determina el resplandor del Dashboard
 * 
 * "El corazón del sistema late cuando todos los órganos respiran"
 */

import { useState, useEffect } from 'react';

export interface AgentHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'critical';
  lastHeartbeat: Date;
  message: string;
}

export interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'critical';
  agents: {
    corazon: AgentHealth;
    anclaje: AgentHealth;
    queries: AgentHealth;
    suscriptor: AgentHealth;
    dashboard: AgentHealth;
    service: AgentHealth;
    controller: AgentHealth;
    pwa: AgentHealth;
    health: AgentHealth;
    starter: AgentHealth;
  };
  healthyCount: number;
  apiEndpointsHealthy: number; // 6 APIs de salud
  shouldGlowGreen: boolean; // true si todas las 6 APIs dan OK
}

const API_BASE = 'http://localhost:5000';
const HEALTH_CHECK_INTERVAL = 10000; // 10 segundos

export const useSystemHealth = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 'healthy',
    agents: {
      corazon: { name: 'Corazón', status: 'healthy', lastHeartbeat: new Date(), message: 'Core logic operativo' },
      anclaje: { name: 'Anclaje', status: 'healthy', lastHeartbeat: new Date(), message: 'Data anchor estable' },
      queries: { name: 'Queries', status: 'healthy', lastHeartbeat: new Date(), message: 'Database queries fluidas' },
      suscriptor: { name: 'Suscriptor', status: 'healthy', lastHeartbeat: new Date(), message: 'Subscriptions activas' },
      dashboard: { name: 'Dashboard', status: 'healthy', lastHeartbeat: new Date(), message: 'UI rendering con latidos' },
      service: { name: 'Service', status: 'healthy', lastHeartbeat: new Date(), message: 'Business logic respirando' },
      controller: { name: 'Controller', status: 'healthy', lastHeartbeat: new Date(), message: 'API routes respondiendo' },
      pwa: { name: 'PWA', status: 'healthy', lastHeartbeat: new Date(), message: 'Progressive web app listo' },
      health: { name: 'Health', status: 'healthy', lastHeartbeat: new Date(), message: 'Health monitor latiendo' },
      starter: { name: 'Starter', status: 'healthy', lastHeartbeat: new Date(), message: 'Setup automation preparado' },
    },
    healthyCount: 10,
    apiEndpointsHealthy: 0,
    shouldGlowGreen: false,
  });

  useEffect(() => {
    const checkSystemHealth = async () => {
      try {
        // Verificar 6 endpoints de la API
        const endpoints = [
          '/api/serendipity/health',
          '/api/serendipity/financial',
          '/api/serendipity/team',
          '/api/serendipity/alerts',
          '/api/serendipity/recommendations',
          '/api/serendipity/dashboard',
        ];

        const healthChecks = await Promise.allSettled(
          endpoints.map(ep => 
            fetch(`${API_BASE}${ep}`, { method: 'GET', signal: AbortSignal.timeout(3000) })
              .then(res => res.ok)
          )
        );

        const healthyEndpoints = healthChecks.filter(
          (result): result is PromiseFulfilledResult<boolean> => 
            result.status === 'fulfilled' && result.value === true
        ).length;

        // Actualizar estado de agentes basado en endpoints
        const updatedAgents = { ...systemHealth.agents };

        // Controller: Depende de que los endpoints respondan
        updatedAgents.controller = {
          name: 'Controller',
          status: healthyEndpoints >= 4 ? 'healthy' : healthyEndpoints >= 2 ? 'degraded' : 'critical',
          lastHeartbeat: new Date(),
          message: `${healthyEndpoints}/6 endpoints respondiendo`,
        };

        // Service: Verifica el endpoint de health específicamente
        const healthEndpointOk = healthChecks[0].status === 'fulfilled' && healthChecks[0].value;
        updatedAgents.service = {
          name: 'Service',
          status: healthEndpointOk ? 'healthy' : 'critical',
          lastHeartbeat: new Date(),
          message: healthEndpointOk ? 'Mock API operativo' : 'Mock API no responde',
        };

        // Health Monitor
        updatedAgents.health = {
          name: 'Health',
          status: healthEndpointOk ? 'healthy' : 'critical',
          lastHeartbeat: new Date(),
          message: healthEndpointOk ? 'Health endpoint latiendo' : 'Health check failed',
        };

        // Dashboard: Siempre healthy si está renderizando
        updatedAgents.dashboard = {
          name: 'Dashboard',
          status: 'healthy',
          lastHeartbeat: new Date(),
          message: 'Renderizando con latidos visibles',
        };

        // Contar agentes saludables
        const healthyCount = Object.values(updatedAgents).filter(
          agent => agent.status === 'healthy'
        ).length;

        // Determinar overall health
        const criticalCount = Object.values(updatedAgents).filter(
          agent => agent.status === 'critical'
        ).length;

        const overall = criticalCount > 3 ? 'critical' : 
                       criticalCount > 0 ? 'degraded' : 
                       'healthy';

        setSystemHealth({
          overall,
          agents: updatedAgents,
          healthyCount,
          apiEndpointsHealthy: healthyEndpoints,
          shouldGlowGreen: healthyEndpoints === 6, // Glow verde solo si TODAS las 6 APIs OK
        });

      } catch (error) {
        console.error('❌ System health check failed:', error);
        
        // Degradar sistema si el check falla
        setSystemHealth(prev => ({
          ...prev,
          overall: 'degraded',
          apiEndpointsHealthy: 0,
          shouldGlowGreen: false,
        }));
      }
    };

    // Check inicial
    checkSystemHealth();

    // Check periódico cada 10 segundos
    const interval = setInterval(checkSystemHealth, HEALTH_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return systemHealth;
};
