/**
 * 📊 REPORTES DEL JARDINERO DEL FRONTEND
 * Sistema de generación de reportes y visualización
 * 
 * "La belleza surge cuando cada elemento encuentra su lugar"
 * - Thomas Merton
 */

import type { ValidationResult } from './FrontendGardenerRules';
import type { TaskResult } from './FrontendGardenerTasks';

export interface FrontendReport {
  timestamp: Date;
  summary: ReportSummary;
  validationResults: ValidationResult[];
  taskResults: TaskResult[];
  health: FrontendHealth;
  recommendations: Recommendation[];
  nextSteps: string[];
}

export interface ReportSummary {
  overallStatus: string;
  totalCompleteness: number;
  rulesValidated: number;
  rulesPassed: number;
  rulesFailed: number;
  tasksExecuted: number;
  tasksSuccessful: number;
  tasksFailed: number;
}

export interface FrontendHealth {
  components: ComponentHealth;
  hooks: ComponentHealth;
  pages: ComponentHealth;
  routes: ComponentHealth;
  integration: ComponentHealth;
  styling: ComponentHealth;
  accessibility: ComponentHealth;
  performance: ComponentHealth;
  typescript: ComponentHealth;
  i18n: ComponentHealth;
}

export interface ComponentHealth {
  completeness: number;
  status: string;
  issues: string[];
  strengths: string[];
}

export interface Recommendation {
  title: string;
  priority: string;
  impact: string;
  effort: string;
  steps: string[];
}

export class ReportGenerator {
  generateMarkdownReport(report: FrontendReport): string {
    let markdown = '';

    markdown += '# 🌸 REPORTE DEL JARDINERO DEL FRONTEND\n\n';
    markdown += `**Fecha:** ${report.timestamp.toISOString().split('T')[0]}\n\n`;

    // Summary
    markdown += '## 📊 RESUMEN EJECUTIVO\n\n';
    markdown += `**Estado General:** ${this.getStatusEmoji(report.summary.overallStatus)} ${report.summary.overallStatus}\n`;
    markdown += `**Completitud Total:** ${this.getProgressBar(report.summary.totalCompleteness)} ${report.summary.totalCompleteness}%\n\n`;
    
    markdown += '### Validación de Reglas\n';
    markdown += `- Total validadas: **${report.summary.rulesValidated}**\n`;
    markdown += `- ✅ Aprobadas: **${report.summary.rulesPassed}**\n`;
    markdown += `- ❌ Fallidas: **${report.summary.rulesFailed}**\n\n`;
    
    markdown += '### Ejecución de Tareas\n';
    markdown += `- Total ejecutadas: **${report.summary.tasksExecuted}**\n`;
    markdown += `- ✅ Exitosas: **${report.summary.tasksSuccessful}**\n`;
    markdown += `- ❌ Fallidas: **${report.summary.tasksFailed}**\n\n`;

    // Health
    markdown += '## 🏥 SALUD POR COMPONENTE\n\n';
    markdown += '| Componente | Completitud | Estado | Issues |\n';
    markdown += '|------------|-------------|--------|--------|\n';
    markdown += `| Componentes | ${this.getProgressBar(report.health.components.completeness)} ${report.health.components.completeness}% | ${this.getHealthEmoji(report.health.components.status)} | ${report.health.components.issues.length} |\n`;
    markdown += `| Hooks | ${this.getProgressBar(report.health.hooks.completeness)} ${report.health.hooks.completeness}% | ${this.getHealthEmoji(report.health.hooks.status)} | ${report.health.hooks.issues.length} |\n`;
    markdown += `| Páginas | ${this.getProgressBar(report.health.pages.completeness)} ${report.health.pages.completeness}% | ${this.getHealthEmoji(report.health.pages.status)} | ${report.health.pages.issues.length} |\n`;
    markdown += `| Rutas | ${this.getProgressBar(report.health.routes.completeness)} ${report.health.routes.completeness}% | ${this.getHealthEmoji(report.health.routes.status)} | ${report.health.routes.issues.length} |\n`;
    markdown += `| Integración | ${this.getProgressBar(report.health.integration.completeness)} ${report.health.integration.completeness}% | ${this.getHealthEmoji(report.health.integration.status)} | ${report.health.integration.issues.length} |\n`;
    markdown += `| Estilos | ${this.getProgressBar(report.health.styling.completeness)} ${report.health.styling.completeness}% | ${this.getHealthEmoji(report.health.styling.status)} | ${report.health.styling.issues.length} |\n`;
    markdown += `| Accesibilidad | ${this.getProgressBar(report.health.accessibility.completeness)} ${report.health.accessibility.completeness}% | ${this.getHealthEmoji(report.health.accessibility.status)} | ${report.health.accessibility.issues.length} |\n`;
    markdown += `| Performance | ${this.getProgressBar(report.health.performance.completeness)} ${report.health.performance.completeness}% | ${this.getHealthEmoji(report.health.performance.status)} | ${report.health.performance.issues.length} |\n`;
    markdown += `| TypeScript | ${this.getProgressBar(report.health.typescript.completeness)} ${report.health.typescript.completeness}% | ${this.getHealthEmoji(report.health.typescript.status)} | ${report.health.typescript.issues.length} |\n`;
    markdown += `| i18n | ${this.getProgressBar(report.health.i18n.completeness)} ${report.health.i18n.completeness}% | ${this.getHealthEmoji(report.health.i18n.status)} | ${report.health.i18n.issues.length} |\n\n`;

    // Validation Results (failed only)
    const failedRules = report.validationResults.filter(r => !r.passed);
    if (failedRules.length > 0) {
      markdown += '## ❌ REGLAS FALLIDAS\n\n';
      for (const rule of failedRules) {
        markdown += `### ${rule.message}\n`;
        if (rule.details.length > 0) {
          for (const detail of rule.details) {
            markdown += `- ${detail}\n`;
          }
        }
        markdown += '\n';
      }
    }

    // Task Results (failed only)
    const failedTasks = report.taskResults.filter(t => !t.success);
    if (failedTasks.length > 0) {
      markdown += '## ⚠️ TAREAS PENDIENTES\n\n';
      for (const task of failedTasks) {
        markdown += `### ${task.message}\n`;
        if (task.nextSteps.length > 0) {
          markdown += 'Pasos siguientes:\n';
          for (const step of task.nextSteps) {
            markdown += `- ${step}\n`;
          }
        }
        markdown += '\n';
      }
    }

    // Recommendations
    if (report.recommendations.length > 0) {
      markdown += '## 💡 RECOMENDACIONES\n\n';
      for (const rec of report.recommendations) {
        markdown += `### ${this.getPriorityEmoji(rec.priority)} ${rec.title}\n`;
        markdown += `**Prioridad:** ${rec.priority} | **Impacto:** ${rec.impact} | **Esfuerzo:** ${rec.effort}\n\n`;
        if (rec.steps.length > 0) {
          for (const step of rec.steps) {
            markdown += `- ${step}\n`;
          }
        }
        markdown += '\n';
      }
    }

    // Next Steps
    if (report.nextSteps.length > 0) {
      markdown += '## 🎯 PRÓXIMOS PASOS\n\n';
      for (let i = 0; i < report.nextSteps.length; i++) {
        markdown += `${i + 1}. ${report.nextSteps[i]}\n`;
      }
      markdown += '\n';
    }

    markdown += '---\n';
    markdown += '*Generado por el Jardinero del Frontend - El Mediador de Sofía*\n';

    return markdown;
  }

  generateConsoleReport(report: FrontendReport): string {
    let output = '';

    output += '\n';
    output += '╔══════════════════════════════════════════════════════════════╗\n';
    output += '║  🌸 JARDINERO DEL FRONTEND - REPORTE                         ║\n';
    output += '╚══════════════════════════════════════════════════════════════╝\n';
    output += '\n';

    output += '📊 RESUMEN EJECUTIVO\n';
    output += `Estado General:    ${this.getStatusEmoji(report.summary.overallStatus)} ${report.summary.overallStatus}\n`;
    output += `Completitud Total: ${this.getProgressBar(report.summary.totalCompleteness)} ${report.summary.totalCompleteness}%\n`;
    output += '\n';

    output += `Reglas Validadas:  ${report.summary.rulesValidated}\n`;
    output += `  ✅ Aprobadas:     ${report.summary.rulesPassed}\n`;
    output += `  ❌ Fallidas:      ${report.summary.rulesFailed}\n`;
    output += '\n';

    output += `Tareas Ejecutadas: ${report.summary.tasksExecuted}\n`;
    output += `  ✅ Exitosas:      ${report.summary.tasksSuccessful}\n`;
    output += `  ❌ Fallidas:      ${report.summary.tasksFailed}\n`;
    output += '\n';

    output += '🏥 SALUD POR COMPONENTE\n';
    output += `components      ${this.getHealthEmoji(report.health.components.status)} ${this.getProgressBar(report.health.components.completeness)} ${report.health.components.completeness}%\n`;
    output += `hooks           ${this.getHealthEmoji(report.health.hooks.status)} ${this.getProgressBar(report.health.hooks.completeness)} ${report.health.hooks.completeness}%\n`;
    output += `pages           ${this.getHealthEmoji(report.health.pages.status)} ${this.getProgressBar(report.health.pages.completeness)} ${report.health.pages.completeness}%\n`;
    output += `routes          ${this.getHealthEmoji(report.health.routes.status)} ${this.getProgressBar(report.health.routes.completeness)} ${report.health.routes.completeness}%\n`;
    output += `integration     ${this.getHealthEmoji(report.health.integration.status)} ${this.getProgressBar(report.health.integration.completeness)} ${report.health.integration.completeness}%\n`;
    output += `styling         ${this.getHealthEmoji(report.health.styling.status)} ${this.getProgressBar(report.health.styling.completeness)} ${report.health.styling.completeness}%\n`;
    output += `accessibility   ${this.getHealthEmoji(report.health.accessibility.status)} ${this.getProgressBar(report.health.accessibility.completeness)} ${report.health.accessibility.completeness}%\n`;
    output += `performance     ${this.getHealthEmoji(report.health.performance.status)} ${this.getProgressBar(report.health.performance.completeness)} ${report.health.performance.completeness}%\n`;
    output += `typescript      ${this.getHealthEmoji(report.health.typescript.status)} ${this.getProgressBar(report.health.typescript.completeness)} ${report.health.typescript.completeness}%\n`;
    output += `i18n            ${this.getHealthEmoji(report.health.i18n.status)} ${this.getProgressBar(report.health.i18n.completeness)} ${report.health.i18n.completeness}%\n`;
    output += '\n';

    // Critical issues
    const criticalIssues: string[] = [];
    criticalIssues.push(...report.health.routes.issues.slice(0, 1));
    criticalIssues.push(...report.health.integration.issues.slice(0, 2));
    criticalIssues.push(...report.health.hooks.issues.slice(0, 1));

    if (criticalIssues.length > 0) {
      output += '🔴 ISSUES CRÍTICOS\n';
      for (let i = 0; i < Math.min(5, criticalIssues.length); i++) {
        output += `${i + 1}. ${criticalIssues[i]}\n`;
      }
      output += '\n';
    }

    // Top recommendations
    if (report.recommendations.length > 0) {
      output += '💡 RECOMENDACIONES TOP\n';
      const topRecs = report.recommendations.slice(0, 3);
      for (const rec of topRecs) {
        output += `${this.getPriorityEmoji(rec.priority)} ${rec.title}\n`;
      }
      output += '\n';
    }

    // Next steps
    if (report.nextSteps.length > 0) {
      output += '🎯 PRÓXIMOS PASOS\n';
      for (let i = 0; i < Math.min(3, report.nextSteps.length); i++) {
        output += `${i + 1}. ${report.nextSteps[i]}\n`;
      }
      output += '\n';
    }

    output += '══════════════════════════════════════════════════════════════\n';

    return output;
  }

  private getStatusEmoji(status: string): string {
    const statusMap: Record<string, string> = {
      'EXCELLENT': '🟢',
      'GOOD': '🟢',
      'DEGRADED': '🟡',
      'WARNING': '🟠',
      'CRITICAL': '🔴'
    };
    return statusMap[status.toUpperCase()] || '⚪';
  }

  private getHealthEmoji(status: string): string {
    const statusMap: Record<string, string> = {
      'ACTIVE': '🟢',
      'GOOD': '🟢',
      'DEGRADED': '🟡',
      'WARNING': '🟠',
      'INACTIVE': '🔴',
      'CRITICAL': '🔴'
    };
    return statusMap[status.toUpperCase()] || '⚪';
  }

  private getPriorityEmoji(priority: string): string {
    const priorityMap: Record<string, string> = {
      'immediate': '🔴',
      'high': '🟠',
      'medium': '🟡',
      'low': '🟢'
    };
    return priorityMap[priority.toLowerCase()] || '⚪';
  }

  private getProgressBar(percentage: number): string {
    const filled = Math.floor(percentage / 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }
}
