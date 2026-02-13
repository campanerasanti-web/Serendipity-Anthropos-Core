/**
 * 🌱 AGENTE JARDINERO DE OPERACIONES
 * "El que cuida los flujos, cuida la cosecha"
 * 
 * Vigila que los procesos operativos estén alineados con el lenguaje del Dashboard,
 * que cada flujo tenga su guardián, y que la armonía entre lo físico y lo digital
 * nunca se rompa.
 */

import { rules } from "./OpsGardenerRules";
import { tasks } from "./OpsGardenerTasks";
import { OpsGardenerReport } from "./OpsGardenerReport";

export type OpsMode = "audit" | "repair" | "harmonize" | "full";

export interface OpsGardenerConfig {
  mode: OpsMode;
  autoFix?: boolean;
  mqttEnabled?: boolean;
  scheduledTime?: string; // "08:00" format
  silentMode?: boolean; // Vigilancia silenciosa
}

export interface ValidationResult {
  passed: boolean;
  message: string;
  severity?: "critical" | "warning" | "info";
}

export interface RuleResult {
  rule: any;
  validation: ValidationResult;
}

export interface FixResult {
  success: boolean;
  message: string;
  filesAffected?: string[];
}

export interface TaskResult {
  task: any;
  result: {
    success: boolean;
    message: string;
    filesAffected?: string[];
    data?: any;
  };
}

export class OpsGardenerAgent {
  private startTime: Date;
  private results: Array<RuleResult | TaskResult | { fix: FixResult }> = [];

  constructor(private config: OpsGardenerConfig) {
    this.startTime = new Date();
    
    if (this.config.silentMode) {
      console.log("🌙 Jardinero entrando en Vigilancia Silenciosa...");
    } else {
      console.log(`🌱 Jardinero despertando en modo: ${this.config.mode.toUpperCase()}`);
    }
  }

  /**
   * Ejecuta el ciclo completo del Jardinero
   */
  async run(): Promise<Array<RuleResult | TaskResult | { fix: FixResult }>> {
    this.logActivity("🌅 Iniciando recorrido del taller digital...");

    // FASE 1: Validación de Reglas (el Jardinero inspecciona)
    await this.validateRules();

    // FASE 2: Ejecución de Tareas (el Jardinero trabaja)
    await this.executeTasks();

    // FASE 3: Generación de Informe (el Jardinero reporta)
    const report = new OpsGardenerReport(this.results, this.config.mode);
    await report.generate();

    this.logActivity(`✨ Recorrido completado en ${this.getElapsedTime()}ms`);

    return this.results;
  }

  /**
   * Valida todas las reglas aplicables
   */
  private async validateRules(): Promise<void> {
    this.logActivity("🔍 Inspeccionando reglas de armonía...");

    for (const rule of rules) {
      try {
        const validation = await rule.validate();
        
        const ruleResult: RuleResult = { 
          rule: {
            id: rule.id,
            name: rule.name,
            severity: rule.severity,
            category: rule.category
          }, 
          validation 
        };
        
        this.results.push(ruleResult);

        // Si la regla falla y tenemos autoFix habilitado
        if (!validation.passed && this.config.autoFix && rule.autoFix) {
          this.logActivity(`🔧 Auto-reparando: ${rule.id}`);
          
          const fix = await rule.autoFix();
          this.results.push({ fix });
          
          if (fix.success) {
            this.logActivity(`✅ Reparación exitosa: ${rule.id}`);
          }
        }

        // Alertas especiales para reglas críticas
        if (!validation.passed && rule.severity === "critical") {
          this.emitAlert("🚨 ENERGÍA INUSUAL", rule.name, validation.message);
        }

      } catch (error) {
        console.error(`❌ Error evaluando regla ${rule.id}:`, error);
      }
    }
  }

  /**
   * Ejecuta las tareas según el modo configurado
   */
  private async executeTasks(): Promise<void> {
    this.logActivity("⚙️ Ejecutando tareas de armonización...");

    for (const task of tasks) {
      if (this.shouldRunTask(task.category)) {
        try {
          this.logActivity(`📋 Tarea: ${task.name}`);
          
          const result = await task.execute();
          
          const taskResult: TaskResult = { 
            task: {
              id: task.id,
              name: task.name,
              category: task.category,
              priority: task.priority
            }, 
            result 
          };
          
          this.results.push(taskResult);

          if (result.success) {
            this.logActivity(`✅ ${task.name} completada`);
          }

          // Lógica especial para TASK-FLOWMAP
          if (task.id === "TASK-FLOWMAP" && result.success && result.data) {
            this.logActivity(`📊 Mapa de flujos generado: ${result.data.flowCount} flujos encontrados`);
          }

        } catch (error) {
          console.error(`❌ Error ejecutando tarea ${task.id}:`, error);
        }
      }
    }
  }

  /**
   * Determina si una tarea debe ejecutarse según el modo
   */
  private shouldRunTask(category: string): boolean {
    if (this.config.mode === "audit") return category === "audit";
    if (this.config.mode === "repair") return ["audit", "repair"].includes(category);
    if (this.config.mode === "harmonize") return ["audit", "harmonize"].includes(category);
    return true; // full mode
  }

  /**
   * Emite una alerta para el sistema
   */
  private emitAlert(type: string, title: string, message: string): void {
    const alert = {
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      source: "OpsGardenerAgent"
    };

    // En producción, esto enviaría a un sistema de alertas real
    console.warn(`\n${type}: ${title}`);
    console.warn(`└─ ${message}\n`);

    // Aquí se podría integrar con el EventDispatcher del backend
    // o con un sistema de notificaciones externo
  }

  /**
   * Log condicional según modo silencioso
   */
  private logActivity(message: string): void {
    if (!this.config.silentMode) {
      console.log(message);
    }
  }

  /**
   * Calcula el tiempo transcurrido desde el inicio
   */
  private getElapsedTime(): number {
    return Date.now() - this.startTime.getTime();
  }

  /**
   * Obtiene estadísticas del último recorrido
   */
  getStats() {
    const ruleResults = this.results.filter((r): r is RuleResult => 'rule' in r);
    const taskResults = this.results.filter((r): r is TaskResult => 'task' in r);
    const fixes = this.results.filter(r => 'fix' in r);

    return {
      mode: this.config.mode,
      duration: this.getElapsedTime(),
      rules: {
        total: ruleResults.length,
        passed: ruleResults.filter(r => r.validation.passed).length,
        failed: ruleResults.filter(r => !r.validation.passed).length,
        critical: ruleResults.filter(r => 
          !r.validation.passed && r.rule.severity === "critical"
        ).length
      },
      tasks: {
        total: taskResults.length,
        successful: taskResults.filter(t => t.result.success).length,
        failed: taskResults.filter(t => !t.result.success).length
      },
      fixes: {
        total: fixes.length,
        successful: fixes.filter(f => f.fix.success).length
      },
      timestamp: this.startTime.toISOString()
    };
  }
}
