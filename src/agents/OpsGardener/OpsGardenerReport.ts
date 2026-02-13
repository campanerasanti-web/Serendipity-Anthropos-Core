/**
 * 📊 INFORME DEL JARDINERO
 * "Cada reporte es una semilla de conocimiento"
 * 
 * Genera el Reporte de Clima Financiero basado en las observaciones del Jardinero
 */

import type { OpsMode } from "./OpsGardenerAgent";
import * as fs from "fs";
import * as path from "path";

export interface ReportData {
  rule?: any;
  validation?: any;
  task?: any;
  result?: any;
  fix?: any;
}

export class OpsGardenerReport {
  private timestamp: Date;

  constructor(
    private results: ReportData[],
    private mode: OpsMode
  ) {
    this.timestamp = new Date();
  }

  /**
   * Genera el informe completo
   */
  async generate(): Promise<void> {
    const summary = this.buildSummary();
    const markdown = this.buildMarkdown();

    console.log(summary);
    
    await this.writeToFile(markdown);
  }

  /**
   * Construye el resumen en consola
   */
  private buildSummary(): string {
    const ruleResults = this.results.filter(r => r.rule && r.validation);
    const taskResults = this.results.filter(r => r.task && r.result);
    const fixes = this.results.filter(r => r.fix);

    const failedRules = ruleResults.filter(r => !r.validation?.passed);
    const criticalIssues = failedRules.filter(r => r.rule?.severity === "critical");
    const successfulTasks = taskResults.filter(t => t.result?.success);

    // Determinar el "clima"
    const climateStatus = this.determineClimateStatus(criticalIssues.length, failedRules.length);

    return `
═══════════════════════════════════════════════════════════════
🛡️  INFORME DEL AGENTE JARDINERO DE OPERACIONES
═══════════════════════════════════════════════════════════════

📅 FECHA: ${this.timestamp.toLocaleDateString("es-ES", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    })}
⏰ HORA: ${this.timestamp.toLocaleTimeString("es-ES")}
🌱 MODO: ${this.mode.toUpperCase()}

${climateStatus.icon} CLIMA FINANCIERO: ${climateStatus.status}
${climateStatus.description}

═══════════════════════════════════════════════════════════════

📊 ESTADÍSTICAS DEL RECORRIDO:

   Reglas evaluadas: ${ruleResults.length}
   ├─ ✅ Aprobadas: ${ruleResults.length - failedRules.length}
   ├─ ⚠️  Fallidas: ${failedRules.length}
   └─ 🚨 Críticas: ${criticalIssues.length}

   Tareas ejecutadas: ${taskResults.length}
   ├─ ✅ Exitosas: ${successfulTasks.length}
   └─ ❌ Fallidas: ${taskResults.length - successfulTasks.length}

   Reparaciones automáticas: ${fixes.length}
   └─ ✅ Exitosas: ${fixes.filter(f => f.fix?.success).length}

═══════════════════════════════════════════════════════════════

🌵 PUNTOS DE SEQUÍA (Procesos sin dueño):

${this.buildDroughtPointsList(failedRules)}

═══════════════════════════════════════════════════════════════

🌿 TAREAS COMPLETADAS:

${this.buildTasksList(successfulTasks)}

═══════════════════════════════════════════════════════════════

💧 RECOMENDACIONES:

${this.buildRecommendations(criticalIssues, failedRules)}

═══════════════════════════════════════════════════════════════

💚 "El sistema es una semilla plantada con amor"
   Los puntos de sequía son invitaciones a crecer
   
   - El Jardinero
═══════════════════════════════════════════════════════════════
`;
  }

  /**
   * Determina el estado del clima financiero
   */
  private determineClimateStatus(critical: number, failed: number): {
    icon: string;
    status: string;
    description: string;
  } {
    if (critical > 0) {
      return {
        icon: "🚨",
        status: "TORMENTA",
        description: "Hay flujos críticos sin guardián. Se requiere acción inmediata."
      };
    }

    if (failed > 2) {
      return {
        icon: "🌧️",
        status: "NUBLADO",
        description: "Múltiples puntos de mejora detectados. Monitoreo requerido."
      };
    }

    if (failed > 0) {
      return {
        icon: "⛅",
        status: "PARCIALMENTE SOLEADO",
        description: "El sistema está estable con oportunidades de optimización."
      };
    }

    return {
      icon: "☀️",
      status: "SOLEADO",
      description: "Todos los sistemas en armonía. La cosecha está asegurada."
    };
  }

  /**
   * Construye la lista de puntos de sequía
   */
  private buildDroughtPointsList(failedRules: ReportData[]): string {
    if (failedRules.length === 0) {
      return "   ✅ No se detectaron puntos de sequía. Todos los flujos tienen guardián.\n";
    }

    return failedRules
      .map((r, index) => {
        const severity = r.rule?.severity === "critical" ? "🚨" : "⚠️";
        return `   ${index + 1}. ${severity} ${r.rule?.name || "Regla sin nombre"}
      └─ ${r.validation?.message || "Sin mensaje"}
      └─ ID: ${r.rule?.id || "N/A"}`;
      })
      .join("\n\n") + "\n";
  }

  /**
   * Construye la lista de tareas completadas
   */
  private buildTasksList(successfulTasks: ReportData[]): string {
    if (successfulTasks.length === 0) {
      return "   ⏳ No se ejecutaron tareas en este ciclo.\n";
    }

    return successfulTasks
      .map((t, index) => `   ${index + 1}. ✅ ${t.task?.name || "Tarea sin nombre"}
      └─ ${t.result?.message || "Sin mensaje"}
      └─ ID: ${t.task?.id || "N/A"}`)
      .join("\n\n") + "\n";
  }

  /**
   * Construye las recomendaciones
   */
  private buildRecommendations(criticalIssues: ReportData[], allFailed: ReportData[]): string {
    const recommendations: string[] = [];

    if (criticalIssues.length > 0) {
      recommendations.push(
        "   🚨 URGENTE: Asignar responsables a los flujos críticos antes de continuar operaciones."
      );
    }

    if (allFailed.length > 3) {
      recommendations.push(
        "   📋 Programar sesión de armonización entre áreas (Backend, Frontend, Operaciones)."
      );
    }

    const languageIssues = allFailed.filter(r => r.rule?.category === "language");
    if (languageIssues.length > 0) {
      recommendations.push(
        "   📝 Ejecutar TASK-HARMONIZE-LANGUAGE para normalizar vocabulario."
      );
    }

    const mqttIssues = allFailed.filter(r => r.rule?.category === "mqtt");
    if (mqttIssues.length > 0) {
      recommendations.push(
        "   📡 Verificar conectividad del Gateway IoT antes de iniciar jornada."
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        "   ✨ El sistema está en armonía. Continuar con el flujo natural de operaciones."
      );
    }

    return recommendations.join("\n\n") + "\n";
  }

  /**
   * Construye el reporte en formato Markdown
   */
  private buildMarkdown(): string {
    const summary = this.buildSummary();
    
    return `# 🛡️ Informe del Jardinero - ${this.timestamp.toLocaleDateString("es-ES")}

${summary}

---

## 📋 Detalles Completos

### Reglas Evaluadas

${this.results
  .filter(r => r.rule && r.validation)
  .map(r => {
    const icon = r.validation?.passed ? "✅" : "❌";
    return `- ${icon} **${r.rule?.id}**: ${r.rule?.name}
  - Severidad: ${r.rule?.severity}
  - Categoría: ${r.rule?.category}
  - Resultado: ${r.validation?.message}`;
  })
  .join("\n\n")}

### Tareas Ejecutadas

${this.results
  .filter(r => r.task && r.result)
  .map(r => {
    const icon = r.result?.success ? "✅" : "❌";
    return `- ${icon} **${r.task?.id}**: ${r.task?.name}
  - Prioridad: ${r.task?.priority}
  - Resultado: ${r.result?.message}`;
  })
  .join("\n\n")}

---

*Generado por OpsGardenerAgent en modo ${this.mode} a las ${this.timestamp.toISOString()}*
`;
  }

  /**
   * Escribe el reporte en un archivo
   */
  private async writeToFile(content: string): Promise<void> {
    try {
      const reportsDir = path.join(process.cwd(), "ops", "reports");
      
      // Crear directorio si no existe
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const filename = `gardener-report-${this.timestamp.toISOString().split("T")[0]}.md`;
      const filepath = path.join(reportsDir, filename);

      fs.writeFileSync(filepath, content, "utf-8");

      console.log(`\n📄 Reporte guardado en: ${filepath}\n`);

    } catch (error) {
      console.error(`❌ Error al guardar reporte: ${error}`);
    }
  }

  /**
   * Genera datos JSON para integración con otros sistemas
   */
  toJSON() {
    const ruleResults = this.results.filter(r => r.rule && r.validation);
    const taskResults = this.results.filter(r => r.task && r.result);
    const failedRules = ruleResults.filter(r => !r.validation?.passed);
    const criticalIssues = failedRules.filter(r => r.rule?.severity === "critical");

    return {
      timestamp: this.timestamp.toISOString(),
      mode: this.mode,
      climate: this.determineClimateStatus(criticalIssues.length, failedRules.length),
      stats: {
        rules: {
          total: ruleResults.length,
          passed: ruleResults.length - failedRules.length,
          failed: failedRules.length,
          critical: criticalIssues.length
        },
        tasks: {
          total: taskResults.length,
          successful: taskResults.filter(t => t.result?.success).length
        }
      },
      droughtPoints: failedRules.map(r => ({
        id: r.rule?.id,
        name: r.rule?.name,
        severity: r.rule?.severity,
        message: r.validation?.message
      })),
      completedTasks: taskResults
        .filter(t => t.result?.success)
        .map(t => ({
          id: t.task?.id,
          name: t.task?.name,
          message: t.result?.message,
          data: t.result?.data
        }))
    };
  }
}
