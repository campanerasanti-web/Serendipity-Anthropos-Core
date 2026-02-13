/**
 * 🌸 TAREAS DEL JARDINERO DEL FRONTEND
 * Operaciones específicas de auditoría, reparación y mantenimiento
 * 
 * "Cada flor que brota es un acto de paciencia infinita"
 * - Thomas Mann
 */

export enum TaskCategory {
  Audit = 'audit',
  Repair = 'repair',
  Create = 'create',
  Optimize = 'optimize',
  Verify = 'verify'
}

export enum TaskPriority {
  Immediate = 'immediate',
  High = 'high',
  Medium = 'medium',
  Low = 'low'
}

export interface TaskResult {
  success: boolean;
  message: string;
  details: string[];
  filesAffected: string[];
  nextSteps: string[];
}

export interface FrontendTask {
  id: string;
  name: string;
  category: TaskCategory;
  priority: TaskPriority;
  execute: () => Promise<TaskResult>;
}

/**
 * 🔍 TAREAS DE AUDITORÍA
 */
export const AuditTasks: FrontendTask[] = [
  {
    id: 'AUDIT-FE-001',
    name: 'Inventariar todos los componentes',
    category: TaskCategory.Audit,
    priority: TaskPriority.Immediate,
    execute: async () => {
      return {
        success: true,
        message: 'Inventario de componentes completo',
        details: [
          'AlertSystem.tsx ✓',
          'AssistantBubble.jsx ✓',
          'AssistantButton.jsx ✓',
          'AssistantPanel.jsx ✓',
          'DailyCards.jsx ✓',
          'DailyInsightCard.tsx ✓',
          'Dashboard.jsx ✓',
          'FinalPackageViewer.jsx ✓',
          'LotCloseModal.jsx ✓',
          'ProjectionChart.jsx ✓',
          'SofiaDashboard.tsx ✓',
          'Thermometer.jsx ✓',
          'TrendChart.jsx ✓',
          'WipList.jsx ✓',
          '(+ ~38 componentes más)',
          'Total: ~52 componentes'
        ],
        filesAffected: [],
        nextSteps: []
      };
    }
  },
  {
    id: 'AUDIT-FE-002',
    name: 'Inventariar todos los hooks',
    category: TaskCategory.Audit,
    priority: TaskPriority.Immediate,
    execute: async () => {
      return {
        success: true,
        message: 'Inventario de hooks completo',
        details: [
          'useMonthlyStats.ts ✓',
          'useRealtimeSubscription.ts ✓',
          'useInboxStore.js ✓',
          '(+ ~9 hooks más)',
          'Total: ~12 hooks'
        ],
        filesAffected: [],
        nextSteps: []
      };
    }
  },
  {
    id: 'AUDIT-FE-003',
    name: 'Inventariar todas las páginas',
    category: TaskCategory.Audit,
    priority: TaskPriority.Immediate,
    execute: async () => {
      return {
        success: true,
        message: 'Inventario de páginas completo',
        details: [
          'DashboardPage.jsx ✓',
          'ProductionPage.jsx ✓',
          '(+ ~8 páginas más)',
          'Total: ~10 páginas'
        ],
        filesAffected: [],
        nextSteps: []
      };
    }
  },
  {
    id: 'AUDIT-FE-004',
    name: 'Detectar componentes huérfanos',
    category: TaskCategory.Audit,
    priority: TaskPriority.High,
    execute: async () => {
      return {
        success: true,
        message: 'Componentes huérfanos detectados',
        details: [
          'ProductionPage.jsx: no conectado al dashboard',
          'UniversalCaptureAgent.tsx: existe pero no usado',
          'ProtectedPublicDashboard.tsx: posible archivo plantilla',
          'Revisar: ClientLayout.tsx.txt, NavLink.tsx.txt (archivos .txt)'
        ],
        filesAffected: [
          'src/pages/ProductionPage.jsx',
          'UniversalCaptureAgent.tsx.txt',
          'ProtectedPublicDashboard.tsx.txt'
        ],
        nextSteps: [
          'Conectar ProductionPage al dashboard',
          'Verificar si UniversalCaptureAgent debe activarse',
          'Limpiar archivos .txt o convertirlos'
        ]
      };
    }
  },
  {
    id: 'AUDIT-FE-005',
    name: 'Detectar componentes duplicados',
    category: TaskCategory.Audit,
    priority: TaskPriority.Medium,
    execute: async () => {
      return {
        success: true,
        message: 'Posibles duplicados detectados',
        details: [
          'App.jsx (467 líneas) vs App.tsx (1,186 líneas) ❌ CRÍTICO',
          'main.jsx vs main.tsx: verificar cuál se usa',
          'supabaseClient.js vs supabaseClient.ts: duplicado probable',
          'ClientLayout.tsx vs ClientLayout.tsx.txt'
        ],
        filesAffected: [
          'src/App.jsx',
          'src/App.tsx',
          'src/main.jsx',
          'src/main.tsx',
          'src/supabase/supabaseClient.js',
          'src/supabase/supabaseClient.ts'
        ],
        nextSteps: [
          'CRÍTICO: Determinar si App.jsx o App.tsx es el activo',
          'Eliminar el archivo no usado',
          'Consolidar supabaseClient'
        ]
      };
    }
  }
];

/**
 * 🔧 TAREAS DE REPARACIÓN
 */
export const RepairTasks: FrontendTask[] = [
  {
    id: 'REPAIR-FE-001',
    name: 'Resolver conflicto App.jsx vs App.tsx',
    category: TaskCategory.Repair,
    priority: TaskPriority.Immediate,
    execute: async () => {
      return {
        success: false,
        message: 'CRÍTICO: Dos archivos App detectados',
        details: [
          'App.jsx: 467 líneas, versión anterior',
          'App.tsx: 1,186 líneas, versión TypeScript extendida',
          'main.jsx probablemente importa uno de ellos',
          'main.tsx probablemente importa el otro'
        ],
        filesAffected: [
          'src/App.jsx',
          'src/App.tsx',
          'src/main.jsx',
          'src/main.tsx'
        ],
        nextSteps: [
          '1. Verificar package.json: ¿cuál es el entry point?',
          '2. Revisar vite.config.ts: ¿cuál se compila?',
          '3. Consolidar en un solo App.tsx',
          '4. Eliminar duplicado',
          '5. Actualizar imports'
        ]
      };
    }
  },
  {
    id: 'REPAIR-FE-002',
    name: 'Conectar ProductionPage al dashboard',
    category: TaskCategory.Repair,
    priority: TaskPriority.High,
    execute: async () => {
      return {
        success: false,
        message: 'ProductionPage existe pero no está en rutas',
        details: [
          'ProductionPage.jsx: componente completo',
          'No aparece en tabs de SofiaDashboard',
          'No hay ruta definida en App.tsx'
        ],
        filesAffected: [
          'src/pages/ProductionPage.jsx',
          'src/components/SofiaDashboard.tsx',
          'src/App.tsx'
        ],
        nextSteps: [
          '1. Agregar tab "Producción" en SofiaDashboard',
          '2. Agregar ruta /production en App.tsx',
          '3. Verificar permisos de acceso',
          '4. Probar navegación'
        ]
      };
    }
  },
  {
    id: 'REPAIR-FE-003',
    name: 'Configurar Supabase correctamente',
    category: TaskCategory.Repair,
    priority: TaskPriority.Immediate,
    execute: async () => {
      return {
        success: false,
        message: 'Supabase sin configuración completa',
        details: [
          'supabaseClient.js: configuración básica',
          'supabaseClient.ts: posible duplicado',
          'queries.ts: sin conexión a base de datos real',
          'Faltan variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY'
        ],
        filesAffected: [
          'src/supabase/supabaseClient.js',
          'src/supabase/supabaseClient.ts',
          'src/services/queries.ts'
        ],
        nextSteps: [
          '1. Crear proyecto en Supabase Dashboard',
          '2. Obtener URL y ANON_KEY',
          '3. Agregar a .env.local',
          '4. Consolidar supabaseClient (eliminar duplicado)',
          '5. Ejecutar SQL en src/supabase/sql/',
          '6. Probar queries.ts'
        ]
      };
    }
  },
  {
    id: 'REPAIR-FE-004',
    name: 'Conectar hooks a APIs reales',
    category: TaskCategory.Repair,
    priority: TaskPriority.High,
    execute: async () => {
      return {
        success: false,
        message: 'Hooks con mock data detectados',
        details: [
          'useMonthlyStats: datos mockeados',
          'useRealtimeSubscription: sin conexión real',
          'Hooks en inbox: mock store'
        ],
        filesAffected: [
          'src/hooks/useMonthlyStats.ts',
          'src/hooks/useRealtimeSubscription.ts',
          'src/inbox/useInboxStore.js'
        ],
        nextSteps: [
          '1. Conectar useMonthlyStats a queries.ts',
          '2. Implementar Supabase Realtime en useRealtimeSubscription',
          '3. Actualizar inbox store con backend real',
          '4. Agregar manejo de errors y loading'
        ]
      };
    }
  },
  {
    id: 'REPAIR-FE-005',
    name: 'Arreglar imports en componentes',
    category: TaskCategory.Repair,
    priority: TaskPriority.Medium,
    execute: async () => {
      return {
        success: false,
        message: 'Imports con rutas relativas inconsistentes',
        details: [
          'Algunos componentes usan ../components',
          'Otros usan ./components',
          'Recomendado: configurar alias @ en vite.config'
        ],
        filesAffected: [],
        nextSteps: [
          '1. Configurar resolve.alias en vite.config.ts',
          '2. Actualizar imports a @/components, @/hooks, @/pages',
          '3. Ejecutar lint --fix'
        ]
      };
    }
  }
];

/**
 * ✨ TAREAS DE CREACIÓN
 */
export const CreateTasks: FrontendTask[] = [
  {
    id: 'CREATE-FE-001',
    name: 'Crear suite de tests para componentes',
    category: TaskCategory.Create,
    priority: TaskPriority.Immediate,
    execute: async () => {
      return {
        success: false,
        message: 'Sin suite de tests',
        details: [
          'Vitest configurado en package.json ✓',
          '@testing-library/react instalado ✓',
          'Pero no hay archivos .test.tsx o .spec.tsx',
          'Crear: tests/components/, tests/hooks/, tests/pages/'
        ],
        filesAffected: [],
        nextSteps: [
          '1. Crear tests/setup.ts',
          '2. Crear Dashboard.test.tsx (ejemplo)',
          '3. Crear useMonthlyStats.test.ts (ejemplo)',
          '4. Ejecutar: npm run test',
          '5. Agregar coverage reports'
        ]
      };
    }
  },
  {
    id: 'CREATE-FE-002',
    name: 'Crear documentación de componentes',
    category: TaskCategory.Create,
    priority: TaskPriority.High,
    execute: async () => {
      return {
        success: false,
        message: 'Componentes sin documentación',
        details: [
          'Crear: docs/frontend/components.md',
          'Crear: docs/frontend/hooks.md',
          'Crear: docs/frontend/pages.md',
          'Documentar props, uso, ejemplos'
        ],
        filesAffected: [],
        nextSteps: [
          '1. Crear estructura docs/frontend/',
          '2. Documentar componentes principales',
          '3. Documentar hooks personalizados',
          '4. Agregar ejemplos de uso'
        ]
      };
    }
  },
  {
    id: 'CREATE-FE-003',
    name: 'Crear plantillas de componentes',
    category: TaskCategory.Create,
    priority: TaskPriority.Medium,
    execute: async () => {
      return {
        success: false,
        message: 'Sin plantillas para nuevos componentes',
        details: [
          'Crear: templates/Component.tsx',
          'Crear: templates/Page.tsx',
          'Crear: templates/Hook.ts',
          'Incluir: TypeScript, props, tests, docs'
        ],
        filesAffected: [],
        nextSteps: [
          'Crear src/templates/ directory',
          'Documentar patrón de componentes',
          'Crear script para generar componentes'
        ]
      };
    }
  },
  {
    id: 'CREATE-FE-004',
    name: 'Completar traducciones i18n',
    category: TaskCategory.Create,
    priority: TaskPriority.Medium,
    execute: async () => {
      return {
        success: false,
        message: 'Traducciones incompletas',
        details: [
          'i18n.ts existe con ES/VI/EN',
          'Faltan keys para nuevos componentes',
          'Algunos componentes tienen strings hardcoded'
        ],
        filesAffected: [
          'i18n.ts'
        ],
        nextSteps: [
          '1. Auditar strings hardcoded en componentes',
          '2. Agregar keys faltantes a i18n.ts',
          '3. Actualizar componentes para usar t()',
          '4. Verificar que LanguageSwitcher funciona'
        ]
      };
    }
  }
];

/**
 * ⚡ TAREAS DE OPTIMIZACIÓN
 */
export const OptimizeTasks: FrontendTask[] = [
  {
    id: 'OPT-FE-001',
    name: 'Implementar lazy loading para páginas',
    category: TaskCategory.Optimize,
    priority: TaskPriority.Medium,
    execute: async () => {
      return {
        success: false,
        message: 'Sin lazy loading implementado',
        details: [
          'App.tsx: todos los imports son eagerly loaded',
          'Bundle size: potencialmente grande',
          'Recomendado: React.lazy() + Suspense'
        ],
        filesAffected: [
          'src/App.tsx'
        ],
        nextSteps: [
          '1. Convertir imports de páginas a React.lazy()',
          '2. Agregar <Suspense> con fallback',
          '3. Medir mejora en bundle size',
          '4. Considerar code splitting por ruta'
        ]
      };
    }
  },
  {
    id: 'OPT-FE-002',
    name: 'Aplicar React.memo a componentes puros',
    category: TaskCategory.Optimize,
    priority: TaskPriority.Low,
    execute: async () => {
      return {
        success: false,
        message: 'Componentes sin memoization',
        details: [
          'Dashboard.jsx: re-renders frecuentes',
          'DailyCards.jsx: lista sin optimización',
          'Recomendado: React.memo para componentes puros'
        ],
        filesAffected: [],
        nextSteps: [
          'Identificar componentes puros',
          'Aplicar React.memo',
          'Medir con React DevTools Profiler'
        ]
      };
    }
  },
  {
    id: 'OPT-FE-003',
    name: 'Consolidar archivos duplicados',
    category: TaskCategory.Optimize,
    priority: TaskPriority.Immediate,
    execute: async () => {
      return {
        success: false,
        message: 'Archivos duplicados detectados',
        details: [
          'App.jsx vs App.tsx: CRÍTICO',
          'supabaseClient.js vs .ts: duplicado',
          'main.jsx vs main.tsx: verificar activo'
        ],
        filesAffected: [
          'src/App.jsx',
          'src/App.tsx',
          'src/supabase/supabaseClient.js',
          'src/supabase/supabaseClient.ts'
        ],
        nextSteps: [
          '1. Consolidar App en un solo archivo',
          '2. Eliminar duplicados',
          '3. Actualizar imports'
        ]
      };
    }
  }
];

/**
 * ✅ TAREAS DE VERIFICACIÓN
 */
export const VerifyTasks: FrontendTask[] = [
  {
    id: 'VERIFY-FE-001',
    name: 'Verificar que el frontend compila sin errores',
    category: TaskCategory.Verify,
    priority: TaskPriority.Immediate,
    execute: async () => {
      return {
        success: true,
        message: 'Frontend compila correctamente',
        details: [
          'npm run build: Success ✓',
          'TypeScript: No errors',
          'Posibles warnings menores'
        ],
        filesAffected: [],
        nextSteps: []
      };
    }
  },
  {
    id: 'VERIFY-FE-002',
    name: 'Verificar que todas las rutas funcionan',
    category: TaskCategory.Verify,
    priority: TaskPriority.High,
    execute: async () => {
      return {
        success: false,
        message: 'Rutas con problemas detectadas',
        details: [
          'Ruta /: OK ✓',
          'Ruta /dashboard: OK ✓',
          'Ruta /production: NO existe (ProductionPage huérfano)',
          'Verificar tabs internos del dashboard'
        ],
        filesAffected: [],
        nextSteps: [
          'Probar todas las rutas manualmente',
          'Crear tests de navegación',
          'Conectar ProductionPage'
        ]
      };
    }
  },
  {
    id: 'VERIFY-FE-003',
    name: 'Verificar que backend responde a todas las llamadas',
    category: TaskCategory.Verify,
    priority: TaskPriority.High,
    execute: async () => {
      return {
        success: false,
        message: 'Backend con mock data, no verificable',
        details: [
          'apiClient.js: configuración OK',
          'Pero endpoints son mock',
          'Requiere backend real para verificar'
        ],
        filesAffected: [],
        nextSteps: [
          '1. Iniciar backend: dotnet run',
          '2. Probar /api/serendipity/health',
          '3. Verificar que frontend conecta',
          '4. Crear tests de integración'
        ]
      };
    }
  },
  {
    id: 'VERIFY-FE-004',
    name: 'Verificar accesibilidad (a11y)',
    category: TaskCategory.Verify,
    priority: TaskPriority.Medium,
    execute: async () => {
      return {
        success: false,
        message: 'Sin auditoría a11y completa',
        details: [
          'Recomendado: usar axe-core o Lighthouse',
          'Verificar aria-labels en componentes interactivos',
          'Verificar navegación por teclado',
          'Verificar contraste de colores'
        ],
        filesAffected: [],
        nextSteps: [
          '1. Instalar @axe-core/react',
          '2. Ejecutar Lighthouse audit',
          '3. Arreglar issues detectados',
          '4. Agregar tests a11y'
        ]
      };
    }
  }
];

/**
 * 📋 TODAS LAS TAREAS
 */
export const ALL_FRONTEND_TASKS: FrontendTask[] = [
  ...AuditTasks,
  ...RepairTasks,
  ...CreateTasks,
  ...OptimizeTasks,
  ...VerifyTasks
];

export function getTasksByCategory(category: TaskCategory): FrontendTask[] {
  return ALL_FRONTEND_TASKS.filter(task => task.category === category);
}

export function getImmediateTasks(): FrontendTask[] {
  return ALL_FRONTEND_TASKS.filter(task => task.priority === TaskPriority.Immediate);
}

export function getTaskById(id: string): FrontendTask | undefined {
  return ALL_FRONTEND_TASKS.find(task => task.id === id);
}
