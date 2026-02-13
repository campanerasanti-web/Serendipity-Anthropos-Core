/**
 * 📊 SISTEMA DE REPORTERÍA DEL GUARDIÁN
 * Genera informes detallados del estado del ecosistema
 * 
 * "La verdad es una lámpara que ilumina el camino, no un garrote que golpea"
 * - Thomas Mann
 */

export interface GuardianReport {
  timestamp: Date;
  summary: ReportSummary;
  validationResults: ValidationSection;
  taskResults: TaskSection;
  systemHealth: SystemHealth;
  recommendations: Recommendation[];
  nextSteps: string[];
}

export interface ReportSummary {
  totalRulesChecked: number;
  rulesPassed: number;
  rulesFailed: number;
  tasksExecuted: number;
  tasksSucceeded: number;
  tasksFailed: number;
  overallHealth: 'excellent' | 'good' | 'degraded' | 'critical';
  completeness: number; // 0-100
}

export interface ValidationSection {
  critical: ValidationItem[];
  warnings: ValidationItem[];
  info: ValidationItem[];
}

export interface ValidationItem {
  id: string;
  name: string;
  passed: boolean;
  message: string;
  affectedFiles?: string[];
}

export interface TaskSection {
  audit: TaskItem[];
  repair: TaskItem[];
  create: TaskItem[];
  optimize: TaskItem[];
  verify: TaskItem[];
}

export interface TaskItem {
  id: string;
  name: string;
  success: boolean;
  message: string;
  filesAffected?: string[];
}

export interface SystemHealth {
  backend: ComponentHealth;
  frontend: ComponentHealth;
  database: ComponentHealth;
  workers: ComponentHealth;
  cicd: ComponentHealth;
  documentation: ComponentHealth;
}

export interface ComponentHealth {
  status: 'active' | 'degraded' | 'inactive' | 'broken';
  completeness: number; // 0-100
  issues: string[];
  strengths: string[];
}

export interface Recommendation {
  priority: 'immediate' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  estimatedEffort: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * 📝 GENERADOR DE REPORTES
 */
export class ReportGenerator {
  static generateMarkdownReport(report: GuardianReport): string {
    const md: string[] = [];

    md.push('# 🛡️ INFORME DEL GUARDIÁN DEL SISTEMA');
    md.push('');
    md.push(`**Fecha:** ${report.timestamp.toLocaleString()}`);
    md.push('**Sistema:** Serendipity + El Mediador de Sofía');
    md.push('');
    md.push('---');
    md.push('');

    // RESUMEN EJECUTIVO
    md.push('## 📊 RESUMEN EJECUTIVO');
    md.push('');
    md.push('```');
    md.push(`Estado General:        ${this.getHealthEmoji(report.summary.overallHealth)} ${this.getOverallLabel(report.summary.overallHealth)}`);
    md.push(`Completitud Total:     ${this.getProgressBar(report.summary.completeness)} ${report.summary.completeness}%`);
    md.push(``);
    md.push(`Reglas Validadas:      ${report.summary.totalRulesChecked}`);
    md.push(`  ✅ Aprobadas:         ${report.summary.rulesPassed}`);
    md.push(`  ❌ Fallidas:          ${report.summary.rulesFailed}`);
    md.push(``);
    md.push(`Tareas Ejecutadas:     ${report.summary.tasksExecuted}`);
    md.push(`  ✅ Exitosas:          ${report.summary.tasksSucceeded}`);
    md.push(`  ❌ Fallidas:          ${report.summary.tasksFailed}`);
    md.push('```');
    md.push('');

    // SALUD DEL SISTEMA
    md.push('## 🏥 SALUD DEL SISTEMA');
    md.push('');
    md.push('| Componente | Estado | Completitud | Issues | Fortalezas |');
    md.push('|---|---|---|---|---|');
    
    const components = [
      { name: 'Backend', health: report.systemHealth.backend },
      { name: 'Frontend', health: report.systemHealth.frontend },
      { name: 'Database', health: report.systemHealth.database },
      { name: 'Workers', health: report.systemHealth.workers },
      { name: 'CI/CD', health: report.systemHealth.cicd },
      { name: 'Docs', health: report.systemHealth.documentation }
    ];

    components.forEach(comp => {
      md.push(`| ${comp.name} | ${this.getStatusEmoji(comp.health.status)} ${comp.health.status} | ${this.getProgressBar(comp.health.completeness)} ${comp.health.completeness}% | ${comp.health.issues.length} | ${comp.health.strengths.length} |`);
    });
    md.push('');

    // VALIDACIONES
    md.push('## ✅ RESULTADOS DE VALIDACIÓN');
    md.push('');

    if (report.validationResults.critical.length > 0) {
      md.push('### 🔴 CRÍTICAS');
      md.push('');
      report.validationResults.critical.forEach(item => {
        md.push(`**${item.id}:** ${item.name}`);
        md.push(`- Estado: ${item.passed ? '✅ OK' : '❌ FALLO'}`);
        md.push(`- ${item.message}`);
        if (item.affectedFiles && item.affectedFiles.length > 0) {
          md.push(`- Archivos: ${item.affectedFiles.join(', ')}`);
        }
        md.push('');
      });
    }

    if (report.validationResults.warnings.length > 0) {
      md.push('### 🟡 ADVERTENCIAS');
      md.push('');
      report.validationResults.warnings.forEach(item => {
        md.push(`**${item.id}:** ${item.name}`);
        md.push(`- Estado: ${item.passed ? '✅ OK' : '⚠️  FALLO'}`);
        md.push(`- ${item.message}`);
        md.push('');
      });
    }

    // TAREAS EJECUTADAS
    md.push('## 🔧 TAREAS EJECUTADAS');
    md.push('');

    const taskCategories = [
      { name: 'Auditoría', tasks: report.taskResults.audit },
      { name: 'Reparación', tasks: report.taskResults.repair },
      { name: 'Creación', tasks: report.taskResults.create },
      { name: 'Optimización', tasks: report.taskResults.optimize },
      { name: 'Verificación', tasks: report.taskResults.verify }
    ];

    taskCategories.forEach(cat => {
      if (cat.tasks.length > 0) {
        md.push(`### ${cat.name} (${cat.tasks.length} tareas)`);
        md.push('');
        cat.tasks.forEach(task => {
          md.push(`- ${task.success ? '✅' : '❌'} **${task.id}:** ${task.name}`);
          md.push(`  ${task.message}`);
        });
        md.push('');
      }
    });

    // RECOMENDACIONES
    md.push('## 💡 RECOMENDACIONES');
    md.push('');

    const groupedRecs = {
      immediate: report.recommendations.filter(r => r.priority === 'immediate'),
      high: report.recommendations.filter(r => r.priority === 'high'),
      medium: report.recommendations.filter(r => r.priority === 'medium'),
      low: report.recommendations.filter(r => r.priority === 'low')
    };

    if (groupedRecs.immediate.length > 0) {
      md.push('### 🚨 ACCIÓN INMEDIATA (Hoy)');
      md.push('');
      groupedRecs.immediate.forEach((rec, i) => {
        md.push(`${i + 1}. **${rec.title}** (${rec.estimatedEffort})`);
        md.push(`   - ${rec.description}`);
        md.push(`   - Impacto: ${this.getImpactEmoji(rec.impact)} ${rec.impact.toUpperCase()}`);
        md.push('');
      });
    }

    if (groupedRecs.high.length > 0) {
      md.push('### 🟠 ALTA PRIORIDAD (Esta Semana)');
      md.push('');
      groupedRecs.high.forEach((rec, i) => {
        md.push(`${i + 1}. **${rec.title}** (${rec.estimatedEffort})`);
        md.push(`   - ${rec.description}`);
        md.push('');
      });
    }

    if (groupedRecs.medium.length > 0) {
      md.push('### 🟡 MEDIA PRIORIDAD (Este Mes)');
      md.push('');
      groupedRecs.medium.forEach((rec, i) => {
        md.push(`${i + 1}. **${rec.title}** (${rec.estimatedEffort})`);
        md.push('');
      });
    }

    // PRÓXIMOS PASOS
    md.push('## 🎯 PRÓXIMOS PASOS');
    md.push('');
    report.nextSteps.forEach((step, i) => {
      md.push(`${i + 1}. ${step}`);
    });
    md.push('');

    // FOOTER
    md.push('---');
    md.push('');
    md.push('*"El guardián no duerme, observa. No corrige con violencia, sino con luz."*');
    md.push('');
    md.push('**Próxima auditoría recomendada:** 7 días');

    return md.join('\n');
  }

  static generateConsoleReport(report: GuardianReport): string {
    const lines: string[] = [];

    lines.push('\n═══════════════════════════════════════════════════════');
    lines.push('🛡️  INFORME DEL GUARDIÁN DEL SISTEMA');
    lines.push('═══════════════════════════════════════════════════════\n');

    lines.push(`📊 ESTADO GENERAL: ${this.getHealthEmoji(report.summary.overallHealth)} ${this.getOverallLabel(report.summary.overallHealth)}`);
    lines.push(`📈 COMPLETITUD:    ${this.getProgressBar(report.summary.completeness)} ${report.summary.completeness}%\n`);

    lines.push(`✅ Reglas Aprobadas:  ${report.summary.rulesPassed}/${report.summary.totalRulesChecked}`);
    lines.push(`❌ Reglas Fallidas:   ${report.summary.rulesFailed}/${report.summary.totalRulesChecked}`);
    lines.push(`✅ Tareas Exitosas:   ${report.summary.tasksSucceeded}/${report.summary.tasksExecuted}`);
    lines.push(`❌ Tareas Fallidas:   ${report.summary.tasksFailed}/${report.summary.tasksExecuted}\n`);

    lines.push('─────────────────────────────────────────────────────');
    lines.push('🏥 SALUD POR COMPONENTE\n');

    lines.push(`Backend:       ${this.getStatusEmoji(report.systemHealth.backend.status)} ${report.systemHealth.backend.completeness}%`);
    lines.push(`Frontend:      ${this.getStatusEmoji(report.systemHealth.frontend.status)} ${report.systemHealth.frontend.completeness}%`);
    lines.push(`Database:      ${this.getStatusEmoji(report.systemHealth.database.status)} ${report.systemHealth.database.completeness}%`);
    lines.push(`Workers:       ${this.getStatusEmoji(report.systemHealth.workers.status)} ${report.systemHealth.workers.completeness}%`);
    lines.push(`CI/CD:         ${this.getStatusEmoji(report.systemHealth.cicd.status)} ${report.systemHealth.cicd.completeness}%`);
    lines.push(`Documentation: ${this.getStatusEmoji(report.systemHealth.documentation.status)} ${report.systemHealth.documentation.completeness}%\n`);

    if (report.validationResults.critical.filter(v => !v.passed).length > 0) {
      lines.push('─────────────────────────────────────────────────────');
      lines.push('🔴 VALIDACIONES CRÍTICAS FALLIDAS\n');
      report.validationResults.critical
        .filter(v => !v.passed)
        .forEach(item => {
          lines.push(`❌ ${item.id}: ${item.name}`);
          lines.push(`   ${item.message}\n`);
        });
    }

    if (report.recommendations.length > 0) {
      lines.push('─────────────────────────────────────────────────────');
      lines.push('💡 RECOMENDACIONES\n');
      report.recommendations.slice(0, 3).forEach((rec, i) => {
        lines.push(`${i + 1}. ${rec.title} (${rec.estimatedEffort})`);
        lines.push(`   ${rec.description}`);
      });
      lines.push('');
    }

    lines.push('─────────────────────────────────────────────────────');
    lines.push('💡 PRÓXIMOS PASOS\n');
    report.nextSteps.slice(0, 5).forEach((step, i) => {
      lines.push(`${i + 1}. ${step}`);
    });

    lines.push('\n═══════════════════════════════════════════════════════');
    lines.push('Ver informe completo en: GUARDIAN_REPORT.md');
    lines.push('═══════════════════════════════════════════════════════\n');

    return lines.join('\n');
  }

  private static getHealthEmoji(health: string): string {
    switch (health) {
      case 'excellent': return '🟢';
      case 'good': return '🟢';
      case 'degraded': return '🟡';
      case 'critical': return '🔴';
      default: return '⚪';
    }
  }

  private static getOverallLabel(health: string): string {
    switch (health) {
      case 'excellent':
      case 'good':
        return 'OK';
      case 'degraded':
        return 'DEGRADED';
      case 'critical':
        return 'CRITICAL';
      default:
        return 'UNKNOWN';
    }
  }

  private static getStatusEmoji(status: string): string {
    switch (status) {
      case 'active': return '🟢';
      case 'degraded': return '🟡';
      case 'inactive': return '🟠';
      case 'broken': return '🔴';
      default: return '⚪';
    }
  }

  private static getImpactEmoji(impact: string): string {
    switch (impact) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  }

  private static getProgressBar(percentage: number): string {
    const filled = Math.floor(percentage / 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }
}
