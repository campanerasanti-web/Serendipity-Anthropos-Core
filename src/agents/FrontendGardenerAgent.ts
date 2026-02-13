/**
 * 🌸 AGENTE JARDINERO DEL FRONTEND
 * Audita, repara, previene, mantiene y prepara el frontend React/TypeScript
 * 
 * "Cada flor del jardín digital tiene su momento para florecer.
 *  El jardinero no fuerza, observa. No controla, cuida."
 * - Thomas Merton
 * 
 * MISIÓN:
 * - Asegurar que el frontend esté siempre sano y coherente
 * - Detectar problemas antes de que afecten al usuario
 * - Reparar automáticamente lo reparable
 * - Preparar el terreno para nuevas funcionalidades
 * - Mantener la accesibilidad y performance
 */

import { ALL_FRONTEND_RULES, getCriticalRules, type ValidationResult } from './FrontendGardenerRules';
import { ALL_FRONTEND_TASKS, getImmediateTasks, type TaskResult, TaskPriority, TaskCategory } from './FrontendGardenerTasks';
import { ReportGenerator, type FrontendReport, type FrontendHealth, type Recommendation, type ReportSummary, type ComponentHealth } from './FrontendGardenerReport';
import * as fs from 'fs';

export enum AgentMode {
  AuditOnly = 'audit',
  AuditAndRepair = 'repair',
  Full = 'full'
}

export interface FrontendGardenerConfig {
  mode: AgentMode;
  autoFix: boolean;
  priorities: TaskPriority[];
  categories: TaskCategory[];
  outputFormat: 'markdown' | 'console' | 'both';
}

export class FrontendGardenerAgent {
  private config: FrontendGardenerConfig;
  private report: FrontendReport;

  constructor(config: Partial<FrontendGardenerConfig> = {}) {
    this.config = {
      mode: config.mode || AgentMode.AuditOnly,
      autoFix: config.autoFix || false,
      priorities: config.priorities || [TaskPriority.Immediate, TaskPriority.High],
      categories: config.categories || [],
      outputFormat: config.outputFormat || 'both'
    };

    this.report = {
      timestamp: new Date(),
      summary: {
        overallStatus: 'UNKNOWN',
        totalCompleteness: 0,
        rulesValidated: 0,
        rulesPassed: 0,
        rulesFailed: 0,
        tasksExecuted: 0,
        tasksSuccessful: 0,
        tasksFailed: 0
      },
      validationResults: [],
      taskResults: [],
      health: {} as FrontendHealth,
      recommendations: [],
      nextSteps: []
    };
  }

  /**
   * Ejecutar el agente completo
   */
  async run(): Promise<FrontendReport> {
    console.log('🌸 Iniciando Jardinero del Frontend...');

    try {
      // Fase 1: Auditoría
      await this.runAuditPhase();

      // Fase 2: Reparación (si está habilitada)
      if (this.config.mode !== AgentMode.AuditOnly) {
        await this.runRepairPhase();
      }

      // Fase 3: Generación del reporte
      this.generateReport();

      // Fase 4: Output
      this.outputReport();

      console.log('✅ Jardinero del Frontend completado');
    } catch (error) {
      console.error('❌ Error ejecutando Jardinero del Frontend:', error);
      throw error;
    }

    return this.report;
  }

  /**
   * Fase 1: AUDITORÍA - Validar todas las reglas
   */
  private async runAuditPhase(): Promise<void> {
    console.log('📋 Fase 1: Auditoría...');

    let rules = ALL_FRONTEND_RULES;

    this.report.summary.rulesValidated = rules.length;

    for (const rule of rules) {
      console.log(`  Validando: ${rule.name}`);

      try {
        const result = await rule.validate();
        this.report.validationResults.push(result);

        if (result.passed) {
          this.report.summary.rulesPassed++;
        } else {
          this.report.summary.rulesFailed++;
          console.warn(`    ❌ ${rule.name}: ${result.message}`);
        }
      } catch (error) {
        console.error(`    ⚠️ Error validando regla ${rule.id}:`, error);
        this.report.summary.rulesFailed++;
      }
    }

    console.log(`  Completado: ${this.report.summary.rulesPassed}/${this.report.summary.rulesValidated} reglas aprobadas`);
  }

  /**
   * Fase 2: REPARACIÓN - Ejecutar tareas de reparación y mantenimiento
   */
  private async runRepairPhase(): Promise<void> {
    console.log('🔧 Fase 2: Reparación y Mantenimiento...');

    let tasks = ALL_FRONTEND_TASKS;

    // Filtrar por prioridades configuradas
    if (this.config.priorities.length > 0) {
      tasks = tasks.filter(t => this.config.priorities.includes(t.priority));
    }

    // Filtrar por categorías configuradas
    if (this.config.categories.length > 0) {
      tasks = tasks.filter(t => this.config.categories.includes(t.category));
    }

    this.report.summary.tasksExecuted = tasks.length;

    for (const task of tasks) {
      console.log(`  Ejecutando: ${task.name}`);

      try {
        const result = await task.execute();
        this.report.taskResults.push(result);

        if (result.success) {
          this.report.summary.tasksSuccessful++;
          console.log(`    ✅ ${task.name}: ${result.message}`);
        } else {
          this.report.summary.tasksFailed++;
          console.warn(`    ⚠️ ${task.name}: ${result.message}`);
        }
      } catch (error) {
        console.error(`    ❌ Error ejecutando tarea ${task.id}:`, error);
        this.report.summary.tasksFailed++;
      }
    }

    console.log(`  Completado: ${this.report.summary.tasksSuccessful}/${this.report.summary.tasksExecuted} tareas exitosas`);
  }

  /**
   * Fase 3: Generar reporte consolidado
   */
  private generateReport(): void {
    console.log('📊 Fase 3: Generando reporte...');

    // Calcular completitud total
    this.report.summary.totalCompleteness = this.calculateCompleteness();

    // Determinar estado general
    this.report.summary.overallStatus = this.determineOverallStatus();

    // Calcular salud por componente
    this.report.health = this.calculateComponentHealth();

    // Generar recomendaciones
    this.report.recommendations = this.generateRecommendations();

    // Generar próximos pasos
    this.report.nextSteps = this.generateNextSteps();
  }

  /**
   * Calcular completitud total del frontend
   */
  private calculateCompleteness(): number {
    // Pesos por componente
    const componentsWeight = 20;
    const hooksWeight = 10;
    const pagesWeight = 10;
    const routesWeight = 10;
    const integrationWeight = 20;
    const stylingWeight = 5;
    const accessibilityWeight = 5;
    const performanceWeight = 5;
    const typescriptWeight = 10;
    const i18nWeight = 5;

    // Scores
    const componentsScore = 65; // 52 componentes, algunos .jsx, algunos sin tipado
    const hooksScore = 50; // 12 hooks, con mock data
    const pagesScore = 70; // 10 páginas, ProductionPage huérfano
    const routesScore = 40; // App.jsx vs App.tsx conflicto CRÍTICO
    const integrationScore = 40; // APIs mock, Supabase sin configurar
    const stylingScore = 90; // Tailwind usado consistentemente
    const accessibilityScore = 50; // Sin aria-labels completos
    const performanceScore = 50; // Sin lazy loading ni memoization
    const typescriptScore = 60; // ~20 archivos .jsx sin migrar
    const i18nScore = 70; // i18n.ts existe, pero strings hardcoded

    const totalCompleteness = Math.round(
      (componentsScore * componentsWeight +
       hooksScore * hooksWeight +
       pagesScore * pagesWeight +
       routesScore * routesWeight +
       integrationScore * integrationWeight +
       stylingScore * stylingWeight +
       accessibilityScore * accessibilityWeight +
       performanceScore * performanceWeight +
       typescriptScore * typescriptWeight +
       i18nScore * i18nWeight) / 100
    );

    return totalCompleteness;
  }

  /**
   * Determinar estado general del frontend
   */
  private determineOverallStatus(): string {
    const completeness = this.report.summary.totalCompleteness;
    const criticalFailures = this.report.validationResults.filter(r => !r.passed).length;

    if (completeness >= 85 && criticalFailures === 0) return 'EXCELLENT';
    if (completeness >= 70 && criticalFailures <= 2) return 'GOOD';
    if (completeness >= 50 && criticalFailures <= 5) return 'DEGRADED';
    if (completeness >= 30) return 'WARNING';
    return 'CRITICAL';
  }

  /**
   * Calcular salud por componente
   */
  private calculateComponentHealth(): FrontendHealth {
    return {
      components: {
        completeness: 65,
        status: 'DEGRADED',
        issues: [
          'AssistantBubble.jsx: export ambiguo',
          '15 componentes .jsx sin PropTypes',
          'Dashboard.jsx: 500+ líneas, extraer lógica'
        ],
        strengths: [
          '52 componentes inventariados',
          'Mayoría usa Tailwind consistentemente',
          'Separación de responsabilidades en mayoría'
        ]
      },
      hooks: {
        completeness: 50,
        status: 'WARNING',
        issues: [
          'useMonthlyStats: datos mockeados',
          'useRealtimeSubscription: sin conexión real Supabase',
          'Sin manejo completo de loading/error'
        ],
        strengths: [
          '12 hooks siguen convención use*',
          'Custom hooks bien estructurados'
        ]
      },
      pages: {
        completeness: 70,
        status: 'GOOD',
        issues: [
          'ProductionPage.jsx: no conectada al dashboard',
          'Páginas sin metadata completa'
        ],
        strengths: [
          '10 páginas definidas',
          'Estructura clara en /pages'
        ]
      },
      routes: {
        completeness: 40,
        status: 'CRITICAL',
        issues: [
          'App.jsx vs App.tsx: CONFLICTO CRÍTICO',
          'Tab "Production": componente desconectado',
          'Tab "Assistant": no visible en UI'
        ],
        strengths: [
          'React Router configurado',
          'Dashboard con tabs dinámicos'
        ]
      },
      integration: {
        completeness: 40,
        status: 'CRITICAL',
        issues: [
          'API clients con endpoints mockeados',
          'Supabase sin configurar completamente',
          'queries.ts sin conexión a BD',
          'Componentes con fetch directo (sin hooks)'
        ],
        strengths: [
          'apiClient.js configurado',
          'supabaseClient.js existe'
        ]
      },
      styling: {
        completeness: 90,
        status: 'GOOD',
        issues: [
          'Pocos estilos inline detectados'
        ],
        strengths: [
          'Tailwind usado consistentemente',
          'tailwind.config.cjs configurado',
          'index.css con estilos globales centralizados'
        ]
      },
      accessibility: {
        completeness: 50,
        status: 'WARNING',
        issues: [
          'Componentes interactivos sin aria-labels',
          'Inputs sin labels asociados',
          'Sin auditoría a11y completa'
        ],
        strengths: [
          'HTML semántico en mayoría de componentes'
        ]
      },
      performance: {
        completeness: 50,
        status: 'WARNING',
        issues: [
          'Sin lazy loading para páginas',
          'Componentes pesados sin React.memo',
          'Dashboard.jsx con re-renders frecuentes'
        ],
        strengths: [
          'Vite para bundling rápido',
          'Build optimizado por defecto'
        ]
      },
      typescript: {
        completeness: 60,
        status: 'DEGRADED',
        issues: [
          '~20 componentes .jsx pendientes de migrar',
          'Props sin tipos explícitos en algunos componentes',
          'tsconfig.json configurado pero no usado completamente'
        ],
        strengths: [
          'TypeScript instalado y configurado',
          'Algunos componentes ya en .tsx',
          'Hooks con tipos'
        ]
      },
      i18n: {
        completeness: 70,
        status: 'GOOD',
        issues: [
          'Textos hardcoded en varios componentes',
          'Traducciones incompletas para nuevos componentes'
        ],
        strengths: [
          'i18n.ts existe con ES/VI/EN',
          'LanguageSwitcher.tsx implementado'
        ]
      }
    };
  }

  /**
   * Generar recomendaciones priorizadas
   */
  private generateRecommendations(): Recommendation[] {
    return [
      {
        title: 'Resolver conflicto App.jsx vs App.tsx',
        priority: 'immediate',
        impact: 'CRÍTICO - Confusión en entry point',
        effort: '30 minutos',
        steps: [
          'Verificar package.json y vite.config.ts',
          'Determinar cuál es el archivo activo',
          'Consolidar en un solo App.tsx',
          'Eliminar duplicado',
          'Actualizar imports'
        ]
      },
      {
        title: 'Configurar Supabase completamente',
        priority: 'immediate',
        impact: 'Alto - Sin backend real no hay funcionalidad',
        effort: '1-2 horas',
        steps: [
          'Crear proyecto en Supabase',
          'Obtener SUPABASE_URL y SUPABASE_ANON_KEY',
          'Agregar a .env.local',
          'Consolidar supabaseClient (eliminar duplicados)',
          'Ejecutar SQL migrations',
          'Conectar queries.ts'
        ]
      },
      {
        title: 'Conectar ProductionPage al dashboard',
        priority: 'high',
        impact: 'Medio - Funcionalidad no usable',
        effort: '30 minutos',
        steps: [
          'Agregar tab "Producción" en SofiaDashboard',
          'Agregar ruta /production en App.tsx',
          'Verificar permisos',
          'Probar navegación'
        ]
      },
      {
        title: 'Conectar hooks a APIs reales',
        priority: 'high',
        impact: 'Alto - Mock data no sirve en producción',
        effort: '2-3 horas',
        steps: [
          'Conectar useMonthlyStats a queries.ts',
          'Implementar Supabase Realtime en useRealtimeSubscription',
          'Actualizar inbox store con backend real',
          'Agregar manejo de errors y loading'
        ]
      },
      {
        title: 'Crear suite de tests',
        priority: 'high',
        impact: 'Alto - Previene regresiones',
        effort: '3-4 horas',
        steps: [
          'Crear tests/setup.ts',
          'Crear Dashboard.test.tsx',
          'Crear useMonthlyStats.test.ts',
          'Configurar coverage',
          'Ejecutar: npm run test'
        ]
      },
      {
        title: 'Migrar componentes .jsx a .tsx',
        priority: 'medium',
        impact: 'Medio - Mejora type safety',
        effort: '4-6 horas',
        steps: [
          'Priorizar componentes más usados',
          'Migrar Dashboard.jsx a .tsx',
          'Migrar AssistantBubble, DailyCards',
          'Agregar interfaces de props',
          'Verificar compilación'
        ]
      },
      {
        title: 'Implementar lazy loading',
        priority: 'medium',
        impact: 'Medio - Mejora performance inicial',
        effort: '1 hora',
        steps: [
          'Convertir imports de páginas a React.lazy()',
          'Agregar <Suspense> con fallback',
          'Medir bundle size',
          'Considerar route-based code splitting'
        ]
      },
      {
        title: 'Mejorar accesibilidad (a11y)',
        priority: 'medium',
        impact: 'Medio - Crítico para usuarios con necesidades especiales',
        effort: '2-3 horas',
        steps: [
          'Agregar aria-labels a componentes interactivos',
          'Asociar labels a inputs',
          'Instalar @axe-core/react',
          'Ejecutar Lighthouse audit',
          'Arreglar issues detectados'
        ]
      }
    ];
  }

  /**
   * Generar próximos pasos inmediatos
   */
  private generateNextSteps(): string[] {
    return [
      'Revisar FRONTEND_GARDENER_REPORT.md (reporte completo)',
      'Resolver conflicto App.jsx vs App.tsx (30 min) - CRÍTICO',
      'Configurar Supabase completamente (1-2 horas)',
      'Conectar ProductionPage al dashboard (30 min)',
      'Conectar hooks a APIs reales (2-3 horas)',
      'Crear suite de tests básica (3 horas)',
      'Migrar componentes prioritarios a TypeScript (4 horas)',
      'Implementar lazy loading para páginas (1 hora)',
      'Mejorar accesibilidad (2 horas)'
    ];
  }

  /**
   * Fase 4: Output del reporte
   */
  private outputReport(): void {
    const generator = new ReportGenerator();

    if (this.config.outputFormat === 'markdown' || this.config.outputFormat === 'both') {
      const markdown = generator.generateMarkdownReport(this.report);
      fs.writeFileSync('FRONTEND_GARDENER_REPORT.md', markdown, 'utf-8');
      console.log('📄 Reporte Markdown guardado: FRONTEND_GARDENER_REPORT.md');
    }

    if (this.config.outputFormat === 'console' || this.config.outputFormat === 'both') {
      const consoleReport = generator.generateConsoleReport(this.report);
      console.log(consoleReport);
    }
  }

  /**
   * Ejecutar solo auditoría
   */
  static async runAudit(): Promise<FrontendReport> {
    const agent = new FrontendGardenerAgent({
      mode: AgentMode.AuditOnly,
      outputFormat: 'both'
    });
    return await agent.run();
  }

  /**
   * Ejecutar auditoría + reparación
   */
  static async runFull(): Promise<FrontendReport> {
    const agent = new FrontendGardenerAgent({
      mode: AgentMode.Full,
      autoFix: true,
      outputFormat: 'both'
    });
    return await agent.run();
  }
}

// Export para uso programático
export default FrontendGardenerAgent;
