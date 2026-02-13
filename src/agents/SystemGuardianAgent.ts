/**
 * 🛡️ AGENTE GUARDIÁN DEL SISTEMA SERENDIPITY
 * Sistema autónomo de vigilancia, reparación y mantenimiento continuo
 * 
 * "El guardián no posee el jardín, lo sirve. No controla las flores, las protege."
 * - Thomas Merton
 */

import {
  ALL_RULES,
  RULES_BY_CATEGORY,
  ValidationRule,
  ValidationResult
} from './SystemGuardianRules';

import {
  ALL_TASKS,
  Task,
  TaskResult,
  setGuardianAutoFix
} from './SystemGuardianTasks';

import {
  GuardianReport,
  ReportSummary,
  ValidationSection,
  TaskSection,
  SystemHealth,
  Recommendation,
  ReportGenerator
} from './SystemGuardianReport';

import * as fs from 'fs';

/**
 * 🎯 CONFIGURACIÓN DEL GUARDIÁN
 */
export interface GuardianConfig {
  mode: 'audit' | 'repair' | 'full';
  autoFix: boolean;
  priorities: ('immediate' | 'high' | 'medium' | 'low')[];
  categories: ('architecture' | 'consistency' | 'integration' | 'security' | 'performance' | 'completeness')[];
  outputFormat: 'console' | 'markdown' | 'both';
  saveReport: boolean;
  reportPath?: string;
}

/**
 * 🛡️ CLASE PRINCIPAL DEL GUARDIÁN
 */
export class SystemGuardianAgent {
  private config: GuardianConfig;
  private validationResults: Map<string, ValidationResult>;
  private taskResults: Map<string, TaskResult>;

  constructor(config?: Partial<GuardianConfig>) {
    this.config = {
      mode: config?.mode || 'audit',
      autoFix: config?.autoFix ?? false,
      priorities: config?.priorities || ['immediate', 'high', 'medium', 'low'],
      categories: config?.categories || [
        'architecture',
        'consistency',
        'integration',
        'security',
        'performance',
        'completeness'
      ],
      outputFormat: config?.outputFormat || 'both',
      saveReport: config?.saveReport ?? true,
      reportPath: config?.reportPath || './GUARDIAN_REPORT.md'
    };

    this.validationResults = new Map();
    this.taskResults = new Map();
  }

  /**
   * 🚀 EJECUTAR GUARDIÁN
   */
  async run(): Promise<GuardianReport> {
    console.log('\n🛡️  Iniciando Guardián del Sistema...\n');

    await this.audit();

    if (this.config.mode === 'repair') {
      await this.repair();
    }

    if (this.config.mode === 'full') {
      await this.repair();
      await this.optimize();
    }

    const report = this.generateReport();
    await this.outputReport(report);

    console.log('\n✅ Guardián completado\n');
    return report;
  }

  /**
   * 🔍 AUDITORÍA
   */
  async audit(): Promise<void> {
    console.log('📋 FASE 1: AUDITORÍA DEL SISTEMA\n');
    const rulesToCheck = this.filterRulesByConfig();

    console.log(`Validando ${rulesToCheck.length} reglas...\n`);

    for (const rule of rulesToCheck) {
      try {
        console.log(`⏳ ${rule.id}: ${rule.name}...`);
        const result = await rule.validate();
        this.validationResults.set(rule.id, result);

        const status = result.passed ? '✅' :
          rule.severity === 'critical' ? '🔴' :
          rule.severity === 'warning' ? '🟡' : 'ℹ️';

        console.log(`${status} ${rule.id}: ${result.message}`);

        if (!result.passed && this.config.autoFix && rule.autoFix) {
          console.log('   🔧 Intentando auto-reparación...');
          const fixResult = await rule.autoFix();
          console.log(fixResult.success ? `   ✅ ${fixResult.message}` : `   ⚠️  ${fixResult.message}`);
        }
      } catch (error) {
        this.validationResults.set(rule.id, {
          passed: false,
          message: `Error durante validación: ${error}`
        });
      }
    }

    const auditTasks = this.filterTasksByCategory(['audit']);
    await this.runTasks(auditTasks);

    console.log('\n✅ Auditoría completada\n');
  }

  /**
   * 🔧 REPARACIÓN
   */
  async repair(): Promise<void> {
    console.log('🔧 FASE 2: REPARACIÓN Y MANTENIMIENTO\n');
    setGuardianAutoFix(this.config.autoFix);

    const tasksToRun = this.filterTasksByCategory(['repair', 'verify', 'audit']);
    await this.runTasks(tasksToRun);

    console.log('\n✅ Reparación completada\n');
  }

  /**
   * ⚡ OPTIMIZACIÓN
   */
  async optimize(): Promise<void> {
    console.log('⚡ FASE 3: OPTIMIZACIÓN\n');
    setGuardianAutoFix(this.config.autoFix);

    const tasksToRun = this.filterTasksByCategory(['optimize', 'create', 'verify']);
    await this.runTasks(tasksToRun);

    console.log('\n✅ Optimización completada\n');
  }

  /**
   * 📊 GENERAR REPORTE
   */
  generateReport(): GuardianReport {
    const summary = this.calculateSummary();
    const validationResults = this.groupValidations();
    const taskResults = this.groupTasks();
    const systemHealth = this.calculateSystemHealth();
    const recommendations = this.generateRecommendations();
    const nextSteps = this.generateNextSteps();

    return {
      timestamp: new Date(),
      summary,
      validationResults,
      taskResults,
      systemHealth,
      recommendations,
      nextSteps
    };
  }

  private async runTasks(tasksToRun: Task[]): Promise<void> {
    console.log(`Ejecutando ${tasksToRun.length} tareas...\n`);

    for (const task of tasksToRun) {
      try {
        console.log(`⏳ ${task.id}: ${task.name}...`);
        const result = await task.execute();
        this.taskResults.set(task.id, result);

        const status = result.success ? '✅' : '❌';
        console.log(`${status} ${task.id}: ${result.message}`);

        result.details?.forEach(detail => console.log(`   - ${detail}`));
      } catch (error) {
        this.taskResults.set(task.id, {
          success: false,
          message: `Error durante ejecución: ${error}`
        });
      }
    }
  }

  /**
   * 📈 CALCULAR RESUMEN
   */
  private calculateSummary(): ReportSummary {
    const validationArray = Array.from(this.validationResults.values());
    const taskArray = Array.from(this.taskResults.values());

    const rulesPassed = validationArray.filter(v => v.passed).length;
    const rulesFailed = validationArray.length - rulesPassed;

    const tasksSucceeded = taskArray.filter(t => t.success).length;
    const tasksFailed = taskArray.length - tasksSucceeded;

    const completeness = this.calculateCompleteness(rulesPassed, validationArray.length, tasksSucceeded, taskArray.length);

    const criticalFailed = Array.from(this.validationResults.entries())
      .filter(([id, result]) => {
        const rule = ALL_RULES.find(r => r.id === id);
        return rule?.severity === 'critical' && !result.passed;
      }).length;

    const overallHealth = criticalFailed > 2
      ? 'critical'
      : criticalFailed > 0
        ? 'degraded'
        : completeness > 80
          ? 'excellent'
          : 'good';

    return {
      totalRulesChecked: validationArray.length,
      rulesPassed,
      rulesFailed,
      tasksExecuted: taskArray.length,
      tasksSucceeded,
      tasksFailed,
      overallHealth,
      completeness
    };
  }

  private calculateCompleteness(rulesPassed: number, rulesTotal: number, tasksSucceeded: number, tasksTotal: number): number {
    const rulesScore = rulesTotal > 0 ? (rulesPassed / rulesTotal) * 70 : 0;
    const tasksScore = tasksTotal > 0 ? (tasksSucceeded / tasksTotal) * 30 : 0;
    return Math.round(rulesScore + tasksScore);
  }

  private calculateSystemHealth(): SystemHealth {
    const getRuleRate = (ruleIds: string[]): number => {
      if (ruleIds.length === 0) return 0;
      const passed = ruleIds.filter(id => this.validationResults.get(id)?.passed).length;
      return Math.round((passed / ruleIds.length) * 100);
    };

    const architectureRules = RULES_BY_CATEGORY.architecture.map(r => r.id);
    const consistencyRules = RULES_BY_CATEGORY.consistency.map(r => r.id);
    const integrationRules = RULES_BY_CATEGORY.integration.map(r => r.id);
    const performanceRules = RULES_BY_CATEGORY.performance.map(r => r.id);
    const completenessRules = RULES_BY_CATEGORY.completeness.map(r => r.id);

    const backendScore = getRuleRate(architectureRules);
    const frontendScore = getRuleRate([...consistencyRules, ...integrationRules]);
    const databaseScore = getRuleRate([...performanceRules, 'COMP-004']);
    const workersScore = getRuleRate(['ARCH-003']);
    const cicdScore = getRuleRate(['COMP-003']);
    const docsScore = getRuleRate(['COMP-002']);

    const statusFromScore = (score: number) => {
      if (score >= 80) return 'active';
      if (score >= 50) return 'degraded';
      if (score >= 25) return 'inactive';
      return 'broken';
    };

    const failedMessages = (ruleIds: string[]) => ruleIds
      .filter(id => !this.validationResults.get(id)?.passed)
      .map(id => this.validationResults.get(id)?.message || id)
      .slice(0, 4);

    const passedMessages = (ruleIds: string[]) => ruleIds
      .filter(id => this.validationResults.get(id)?.passed)
      .map(id => this.validationResults.get(id)?.message || id)
      .slice(0, 3);

    return {
      backend: {
        status: statusFromScore(backendScore),
        completeness: backendScore,
        issues: failedMessages(architectureRules),
        strengths: passedMessages(architectureRules)
      },
      frontend: {
        status: statusFromScore(frontendScore),
        completeness: frontendScore,
        issues: failedMessages([...consistencyRules, ...integrationRules]),
        strengths: passedMessages([...consistencyRules, ...integrationRules])
      },
      database: {
        status: statusFromScore(databaseScore),
        completeness: databaseScore,
        issues: failedMessages([...performanceRules, 'COMP-004']),
        strengths: passedMessages([...performanceRules, 'COMP-004'])
      },
      workers: {
        status: statusFromScore(workersScore),
        completeness: workersScore,
        issues: failedMessages(['ARCH-003']),
        strengths: passedMessages(['ARCH-003'])
      },
      cicd: {
        status: statusFromScore(cicdScore),
        completeness: cicdScore,
        issues: failedMessages(['COMP-003']),
        strengths: passedMessages(['COMP-003'])
      },
      documentation: {
        status: statusFromScore(docsScore),
        completeness: docsScore,
        issues: failedMessages(['COMP-002']),
        strengths: passedMessages(['COMP-002'])
      }
    };
  }

  private generateRecommendations(): Recommendation[] {
    const recommendations: Recommendation[] = [];

    const failedRules = Array.from(this.validationResults.entries())
      .filter(([_, result]) => !result.passed)
      .map(([id, result]) => ({ id, result }));

    for (const { id, result } of failedRules) {
      const rule = ALL_RULES.find(r => r.id === id);
      if (!rule) continue;

      recommendations.push({
        priority: rule.severity === 'critical' ? 'immediate' : rule.severity === 'warning' ? 'high' : 'medium',
        category: rule.category,
        title: rule.name,
        description: result.message,
        estimatedEffort: rule.severity === 'critical' ? '1-2 horas' : '2-4 horas',
        impact: rule.severity === 'critical' ? 'critical' : rule.severity === 'warning' ? 'high' : 'medium'
      });
    }

    return recommendations.slice(0, 8);
  }

  private generateNextSteps(): string[] {
    const steps: string[] = [];
    const failedCritical = Array.from(this.validationResults.entries())
      .filter(([id, result]) => {
        const rule = ALL_RULES.find(r => r.id === id);
        return rule?.severity === 'critical' && !result.passed;
      })
      .slice(0, 5);

    for (const [id, result] of failedCritical) {
      steps.push(`${id}: ${result.message}`);
    }

    if (steps.length === 0) {
      steps.push('Re-ejecutar guardián en 7 días');
    }

    return steps;
  }

  private async outputReport(report: GuardianReport): Promise<void> {
    console.log('\n📊 GENERANDO REPORTE...\n');

    if (this.config.outputFormat === 'console' || this.config.outputFormat === 'both') {
      const consoleReport = ReportGenerator.generateConsoleReport(report);
      console.log(consoleReport);
    }

    if (this.config.saveReport) {
      const markdownReport = ReportGenerator.generateMarkdownReport(report);
      const reportPath = this.config.reportPath || './GUARDIAN_REPORT.md';

      try {
        fs.writeFileSync(reportPath, markdownReport, 'utf-8');
        console.log(`\n✅ Reporte guardado en: ${reportPath}\n`);
      } catch (error) {
        console.error(`\n❌ Error al guardar reporte: ${error}\n`);
      }
    }
  }

  private filterRulesByConfig(): ValidationRule[] {
    let rules = ALL_RULES;
    if (this.config.categories.length > 0) {
      rules = rules.filter(r => this.config.categories.includes(r.category));
    }
    return rules;
  }

  private filterTasksByCategory(categories: Task['category'][]): Task[] {
    let tasks = ALL_TASKS.filter(task => categories.includes(task.category));

    if (this.config.priorities.length > 0) {
      tasks = tasks.filter(task => this.config.priorities.includes(task.priority));
    }

    return tasks;
  }

  private groupValidations(): ValidationSection {
    const critical: any[] = [];
    const warnings: any[] = [];
    const info: any[] = [];

    this.validationResults.forEach((result, id) => {
      const rule = ALL_RULES.find(r => r.id === id);
      if (!rule) return;

      const item = {
        id: rule.id,
        name: rule.name,
        passed: result.passed,
        message: result.message,
        affectedFiles: result.affectedFiles
      };

      if (rule.severity === 'critical') {
        critical.push(item);
      } else if (rule.severity === 'warning') {
        warnings.push(item);
      } else {
        info.push(item);
      }
    });

    return { critical, warnings, info };
  }

  private groupTasks(): TaskSection {
    const audit: any[] = [];
    const repair: any[] = [];
    const create: any[] = [];
    const optimize: any[] = [];
    const verify: any[] = [];

    this.taskResults.forEach((result, id) => {
      const task = ALL_TASKS.find(t => t.id === id);
      if (!task) return;

      const item = {
        id: task.id,
        name: task.name,
        success: result.success,
        message: result.message,
        filesAffected: result.filesAffected
      };

      switch (task.category) {
        case 'audit': audit.push(item); break;
        case 'repair': repair.push(item); break;
        case 'create': create.push(item); break;
        case 'optimize': optimize.push(item); break;
        case 'verify': verify.push(item); break;
      }
    });

    return { audit, repair, create, optimize, verify };
  }
}

export default SystemGuardianAgent;
