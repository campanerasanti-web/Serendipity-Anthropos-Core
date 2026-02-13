/**
 * 🫀 AUTONOMIC NERVOUS SYSTEM
 * 
 * Funciona como el cuerpo humano:
 * - Latido cardíaco = peticiones periódicas al backend
 * - Homeostasis = auto-reparación ante fallos
 * - Respuesta simpática = acción ante cambios
 * - Sistema parasimpático = relajación y sincronización
 */

interface HealthCheck {
  timestamp: number;
  status: 'healthy' | 'degraded' | 'critical';
  responseTime: number;
  lastError?: string;
}

interface OrganSystem {
  name: string;
  endpoint: string;
  healthy: boolean;
  lastCheck: number;
  failureCount: number;
}

export class AutonomicSystem {
  private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  private heartbeatInterval = 5000; // 5 segundos = latido cardíaco
  private organs: Map<string, OrganSystem> = new Map();
  private health: HealthCheck = {
    timestamp: Date.now(),
    status: 'healthy',
    responseTime: 0
  };
  private listeners: Set<(health: HealthCheck) => void> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private isRunning = false;

  constructor() {
    this.initializeOrgans();
  }

  private initializeOrgans() {
    // Registra los sistemas del cuerpo digital
    this.organs.set('hermetic', {
      name: 'Hermetic Body',
      endpoint: '/api/hermetic/health',
      healthy: false,
      lastCheck: 0,
      failureCount: 0
    });

    this.organs.set('production', {
      name: 'Production System',
      endpoint: '/api/production/wip',
      healthy: false,
      lastCheck: 0,
      failureCount: 0
    });

    this.organs.set('dashboard', {
      name: 'Dashboard',
      endpoint: '/api/dashboard/daily',
      healthy: false,
      lastCheck: 0,
      failureCount: 0
    });
  }

  /**
   * Inicia el latido cardíaco - pulso autónomo
   */
  public async startHeartbeat() {
    if (this.isRunning) return;
    this.isRunning = true;

    console.log('🫀 Autonomic System iniciando...');

    // Latido inicial
    await this.pulse();

    // Latidos continuos
    setInterval(() => this.pulse(), this.heartbeatInterval);
  }

  /**
   * Latido = verificación de todos los órganos
   */
  private async pulse() {
    const startTime = performance.now();
    let healthyOrgans = 0;
    const organResults: any[] = [];

    try {
      // Verifica todos los órganos en paralelo (como el cuerpo respira todo a la vez)
      const checks = Array.from(this.organs.values()).map(organ => 
        this.checkOrgan(organ)
      );

      const results = await Promise.allSettled(checks);

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          healthyOrgans++;
        }
        organResults.push({
          name: Array.from(this.organs.values())[index]?.name || 'unknown',
          healthy: result.status === 'fulfilled' && result.value
        });
      });

      // Calcula salud global
      const totalOrgans = this.organs.size;
      const healthPercentage = (healthyOrgans / totalOrgans) * 100;

      this.health = {
        timestamp: Date.now(),
        status: healthPercentage === 100 ? 'healthy' : 
                healthPercentage >= 66 ? 'degraded' : 'critical',
        responseTime: performance.now() - startTime,
        lastError: healthyOrgans === totalOrgans ? undefined : 
                   `${totalOrgans - healthyOrgans}/${totalOrgans} órganos inactivos`
      };

      // Notifica a los monitores (listeners)
      this.notifyListeners();

      // Auto-reparación: si está crítico, intenta reconectar
      if (this.health.status === 'critical') {
        await this.autoRepair();
      } else {
        this.reconnectAttempts = 0;
      }

    } catch (error) {
      this.health.status = 'critical';
      this.health.lastError = String(error);
      this.notifyListeners();
      await this.autoRepair();
    }
  }

  /**
   * Verifica salud de un órgano (endpoint)
   */
  private async checkOrgan(organ: OrganSystem): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // Timeout de 3 segundos
      
      const response = await fetch(`${this.baseUrl}${organ.endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        organ.healthy = true;
        organ.failureCount = 0;
        organ.lastCheck = Date.now();
        return true;
      } else {
        organ.failureCount++;
        organ.healthy = false;
        return false;
      }
    } catch (error) {
      organ.failureCount++;
      organ.healthy = false;
      return false;
    }
  }

  /**
   * Sistema parasimpático: reposo y sincronización
   */
  private async autoRepair() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Sistema crítico: no se pudo reconectar');
      return;
    }

    this.reconnectAttempts++;
    const backoffTime = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000);

    console.warn(`⚠️ Auto-reparación #${this.reconnectAttempts} en ${backoffTime}ms`);

    return new Promise(resolve => {
      setTimeout(() => {
        this.reconnectOrgans();
        resolve(null);
      }, backoffTime);
    });
  }

  /**
   * Reconecta órganos fallidos
   */
  private reconnectOrgans() {
    this.organs.forEach(organ => {
      if (!organ.healthy && organ.failureCount > 0) {
        organ.failureCount = Math.max(0, organ.failureCount - 1);
      }
    });
  }

  /**
   * Notifica a los escuchadores (UI) del estado de salud
   */
  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.health);
      } catch (error) {
        console.error('Error notificando listener:', error);
      }
    });
  }

  /**
   * Registra un monitor de salud
   */
  public onHealthChange(callback: (health: HealthCheck) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Obtiene el estado actual de salud
   */
  public getHealth(): HealthCheck {
    return { ...this.health };
  }

  /**
   * Obtiene el estado de todos los órganos
   */
  public getOrgans() {
    return Array.from(this.organs.values());
  }

  /**
   * Detiene el latido
   */
  public stopHeartbeat() {
    this.isRunning = false;
  }

  /**
   * Fuerza una sincronización inmediata
   */
  public async syncNow() {
    return this.pulse();
  }
}

// Instancia global del sistema nervioso
let autonomicSystem: AutonomicSystem | null = null;

export function getAutonomicSystem(): AutonomicSystem {
  if (!autonomicSystem) {
    autonomicSystem = new AutonomicSystem();
  }
  return autonomicSystem;
}

export function initializeAutonomicSystem(): AutonomicSystem {
  const system = getAutonomicSystem();
  system.startHeartbeat();
  return system;
}
