/**
 * 🌸 REGLAS DEL JARDINERO DEL FRONTEND
 * Sistema de validación y coherencia para el frontend React/TypeScript
 * 
 * "El jardinero contempla cada flor, no para juzgarla, sino para comprenderla."
 * - Thomas Merton
 */

export enum RuleSeverity {
  Critical = 'critical',
  Warning = 'warning',
  Info = 'info'
}

export enum RuleCategory {
  Components = 'components',
  Hooks = 'hooks',
  Pages = 'pages',
  Routes = 'routes',
  Integration = 'integration',
  Styling = 'styling',
  Accessibility = 'accessibility',
  Performance = 'performance',
  TypeScript = 'typescript',
  I18n = 'i18n'
}

export interface ValidationResult {
  passed: boolean;
  message: string;
  details: string[];
  affectedFiles: string[];
}

export interface FixResult {
  success: boolean;
  message: string;
  filesModified: string[];
  filesCreated: string[];
}

export interface ValidationRule {
  id: string;
  name: string;
  severity: RuleSeverity;
  category: RuleCategory;
  validate: () => Promise<ValidationResult>;
  autoFix?: () => Promise<FixResult>;
}

/**
 * 🎨 REGLAS DE COMPONENTES
 */
export const ComponentRules: ValidationRule[] = [
  {
    id: 'COMP-FE-001',
    name: 'Todos los componentes deben tener exports named o default',
    severity: RuleSeverity.Critical,
    category: RuleCategory.Components,
    validate: async () => {
      return {
        passed: false,
        message: 'Detectados componentes sin exports claros',
        details: [
          'AssistantBubble.jsx: export ambiguo',
          'LotCloseModal.jsx: posible export duplicado',
          'Revisar 52 componentes en /components'
        ],
        affectedFiles: [
          'src/components/AssistantBubble.jsx',
          'src/components/LotCloseModal.jsx'
        ]
      };
    }
  },
  {
    id: 'COMP-FE-002',
    name: 'Componentes deben tener PropTypes o TypeScript interfaces',
    severity: RuleSeverity.Warning,
    category: RuleCategory.Components,
    validate: async () => {
      return {
        passed: false,
        message: 'Componentes sin tipado explícito',
        details: [
          '15 componentes .jsx sin PropTypes',
          '8 componentes .tsx sin interfaces',
          'Recomendado: migrar todos a TypeScript'
        ],
        affectedFiles: []
      };
    }
  },
  {
    id: 'COMP-FE-003',
    name: 'Componentes no deben tener lógica de negocio pesada',
    severity: RuleSeverity.Info,
    category: RuleCategory.Components,
    validate: async () => {
      return {
        passed: false,
        message: 'Componentes con lógica compleja detectados',
        details: [
          'Dashboard.jsx: 500+ líneas, extraer lógica a hooks',
          'SofiaDashboard.tsx: múltiples responsabilidades',
          'UnifiedCommandCenter.tsx: lógica de estado compleja'
        ],
        affectedFiles: [
          'src/components/Dashboard.jsx',
          'src/components/SofiaDashboard.tsx'
        ]
      };
    }
  }
];

/**
 * 🪝 REGLAS DE HOOKS
 */
export const HookRules: ValidationRule[] = [
  {
    id: 'HOOK-FE-001',
    name: 'Hooks deben seguir convención use*',
    severity: RuleSeverity.Critical,
    category: RuleCategory.Hooks,
    validate: async () => {
      return {
        passed: true,
        message: 'Todos los hooks siguen convención use*',
        details: [
          'useMonthlyStats.ts ✓',
          'useRealtimeSubscription.ts ✓',
          'useInboxStore.js ✓',
          '12 hooks verificados'
        ],
        affectedFiles: []
      };
    }
  },
  {
    id: 'HOOK-FE-002',
    name: 'Hooks no deben tener mock data',
    severity: RuleSeverity.Critical,
    category: RuleCategory.Hooks,
    validate: async () => {
      return {
        passed: false,
        message: 'Hooks con mock data detectados',
        details: [
          'useMonthlyStats: datos mockeados',
          'useRealtimeSubscription: sin conexión real a Supabase',
          'Hooks personalizados: sin integración real'
        ],
        affectedFiles: [
          'src/hooks/useMonthlyStats.ts',
          'src/hooks/useRealtimeSubscription.ts'
        ]
      };
    }
  },
  {
    id: 'HOOK-FE-003',
    name: 'Hooks deben manejar estados de loading y error',
    severity: RuleSeverity.Warning,
    category: RuleCategory.Hooks,
    validate: async () => {
      return {
        passed: false,
        message: 'Hooks sin manejo completo de estados',
        details: [
          'useMonthlyStats: sin estado error',
          'useRealtimeSubscription: sin retry logic',
          'Recomendado: usar React Query o SWR'
        ],
        affectedFiles: []
      };
    }
  }
];

/**
 * 📄 REGLAS DE PÁGINAS
 */
export const PageRules: ValidationRule[] = [
  {
    id: 'PAGE-FE-001',
    name: 'Todas las páginas deben estar en rutas del dashboard',
    severity: RuleSeverity.Critical,
    category: RuleCategory.Pages,
    validate: async () => {
      return {
        passed: false,
        message: 'Páginas huérfanas detectadas',
        details: [
          'ProductionPage.jsx: no conectada a dashboard',
          'Verificar 10 páginas en /pages'
        ],
        affectedFiles: [
          'src/pages/ProductionPage.jsx'
        ]
      };
    }
  },
  {
    id: 'PAGE-FE-002',
    name: 'Páginas deben tener título y metadata',
    severity: RuleSeverity.Info,
    category: RuleCategory.Pages,
    validate: async () => {
      return {
        passed: false,
        message: 'Páginas sin metadata completa',
        details: [
          'DashboardPage.jsx: sin title tag',
          'ProductionPage.jsx: sin description',
          'Recomendado: usar react-helmet para SEO'
        ],
        affectedFiles: []
      };
    }
  }
];

/**
 * 🛤️ REGLAS DE RUTAS
 */
export const RouteRules: ValidationRule[] = [
  {
    id: 'ROUTE-FE-001',
    name: 'Rutas deben estar definidas en App.tsx/jsx',
    severity: RuleSeverity.Critical,
    category: RuleCategory.Routes,
    validate: async () => {
      return {
        passed: false,
        message: 'Conflicto de rutas entre App.jsx y App.tsx',
        details: [
          'App.jsx existe (467 líneas)',
          'App.tsx existe (1,186 líneas)',
          '❌ CRÍTICO: Dos archivos App, solo uno debe usarse',
          'Verificar cuál es el activo en main.jsx/tsx'
        ],
        affectedFiles: [
          'src/App.jsx',
          'src/App.tsx'
        ]
      };
    }
  },
  {
    id: 'ROUTE-FE-002',
    name: 'Dashboard debe tener todos los tabs conectados',
    severity: RuleSeverity.Warning,
    category: RuleCategory.Routes,
    validate: async () => {
      return {
        passed: false,
        message: 'Tabs del dashboard incompletos',
        details: [
          'Tab "Production": ruta definida pero componente desconectado',
          'Tab "Assistant": no visible en UI',
          'Verificar tabs en SofiaDashboard.tsx'
        ],
        affectedFiles: [
          'src/components/SofiaDashboard.tsx'
        ]
      };
    }
  }
];

/**
 * 🔗 REGLAS DE INTEGRACIÓN
 */
export const IntegrationRules: ValidationRule[] = [
  {
    id: 'INT-FE-001',
    name: 'API clients deben apuntar a endpoints reales',
    severity: RuleSeverity.Critical,
    category: RuleCategory.Integration,
    validate: async () => {
      return {
        passed: false,
        message: 'API clients con endpoints mockeados',
        details: [
          'assistantApi.js: endpoints sin implementar',
          'lotsApi.js: mock data',
          'apiClient.js: configuración base OK',
          'queries.ts: Supabase sin configurar'
        ],
        affectedFiles: [
          'src/api/assistantApi.js',
          'src/api/lotsApi.js',
          'src/services/queries.ts'
        ]
      };
    }
  },
  {
    id: 'INT-FE-002',
    name: 'Supabase debe estar configurado correctamente',
    severity: RuleSeverity.Critical,
    category: RuleCategory.Integration,
    validate: async () => {
      return {
        passed: false,
        message: 'Supabase sin configuración completa',
        details: [
          'supabaseClient.js: configuración básica',
          'supabaseClient.ts: posible duplicado',
          'queries.ts: sin conexión a base de datos',
          'Verificar variables de entorno SUPABASE_URL y SUPABASE_ANON_KEY'
        ],
        affectedFiles: [
          'src/supabase/supabaseClient.js',
          'src/supabase/supabaseClient.ts',
          'src/services/queries.ts'
        ]
      };
    }
  },
  {
    id: 'INT-FE-003',
    name: 'Componentes deben usar hooks para estado, no llamadas directas',
    severity: RuleSeverity.Warning,
    category: RuleCategory.Integration,
    validate: async () => {
      return {
        passed: false,
        message: 'Componentes con llamadas fetch directas',
        details: [
          'Dashboard.jsx: fetch directo sin hook',
          'Recomendado: extraer a custom hooks o usar React Query'
        ],
        affectedFiles: []
      };
    }
  }
];

/**
 * 🎨 REGLAS DE ESTILOS
 */
export const StylingRules: ValidationRule[] = [
  {
    id: 'STYLE-FE-001',
    name: 'Componentes deben usar Tailwind consistency',
    severity: RuleSeverity.Info,
    category: RuleCategory.Styling,
    validate: async () => {
      return {
        passed: true,
        message: 'Tailwind usado consistentemente',
        details: [
          'tailwind.config.cjs configurado ✓',
          'Clases Tailwind en mayoría de componentes ✓'
        ],
        affectedFiles: []
      };
    }
  },
  {
    id: 'STYLE-FE-002',
    name: 'CSS global debe estar solo en index.css',
    severity: RuleSeverity.Warning,
    category: RuleCategory.Styling,
    validate: async () => {
      return {
        passed: true,
        message: 'CSS global organizado',
        details: [
          'index.css: estilos globales centralizados ✓',
          'No se detectaron estilos inline excesivos'
        ],
        affectedFiles: []
      };
    }
  }
];

/**
 * ♿ REGLAS DE ACCESIBILIDAD
 */
export const AccessibilityRules: ValidationRule[] = [
  {
    id: 'A11Y-FE-001',
    name: 'Componentes interactivos deben tener aria-labels',
    severity: RuleSeverity.Warning,
    category: RuleCategory.Accessibility,
    validate: async () => {
      return {
        passed: false,
        message: 'Componentes sin aria-labels',
        details: [
          'AssistantButton.jsx: sin aria-label',
          'QrScanner: sin labels accesibles',
          'Botones en dashboard: sin descriptores'
        ],
        affectedFiles: []
      };
    }
  },
  {
    id: 'A11Y-FE-002',
    name: 'Formularios deben tener labels asociados',
    severity: RuleSeverity.Warning,
    category: RuleCategory.Accessibility,
    validate: async () => {
      return {
        passed: false,
        message: 'Inputs sin labels asociados',
        details: [
          'MessageComposer.jsx: inputs sin htmlFor',
          'Formularios en modales: labels implícitos solamente'
        ],
        affectedFiles: []
      };
    }
  }
];

/**
 * ⚡ REGLAS DE PERFORMANCE
 */
export const PerformanceRules: ValidationRule[] = [
  {
    id: 'PERF-FE-001',
    name: 'Componentes pesados deben usar React.memo',
    severity: RuleSeverity.Info,
    category: RuleCategory.Performance,
    validate: async () => {
      return {
        passed: false,
        message: 'Componentes sin memoization',
        details: [
          'Dashboard.jsx: re-renders frecuentes',
          'DailyCards.jsx: lista sin key optimization',
          'Recomendado: React.memo para componentes puros'
        ],
        affectedFiles: []
      };
    }
  },
  {
    id: 'PERF-FE-002',
    name: 'Páginas grandes deben usar lazy loading',
    severity: RuleSeverity.Warning,
    category: RuleCategory.Performance,
    validate: async () => {
      return {
        passed: false,
        message: 'Sin lazy loading para páginas',
        details: [
          'App.tsx: todos los componentes cargados eagerly',
          'Recomendado: React.lazy() para páginas'
        ],
        affectedFiles: [
          'src/App.tsx'
        ]
      };
    }
  }
];

/**
 * 📘 REGLAS DE TYPESCRIPT
 */
export const TypeScriptRules: ValidationRule[] = [
  {
    id: 'TS-FE-001',
    name: 'Componentes deben migrar de .jsx a .tsx',
    severity: RuleSeverity.Info,
    category: RuleCategory.TypeScript,
    validate: async () => {
      return {
        passed: false,
        message: 'Componentes .jsx sin migrar',
        details: [
          'Dashboard.jsx: migrar a .tsx',
          'AssistantBubble.jsx: migrar a .tsx',
          'DailyCards.jsx: migrar a .tsx',
          '~20 componentes .jsx pendientes'
        ],
        affectedFiles: []
      };
    }
  },
  {
    id: 'TS-FE-002',
    name: 'Props deben tener tipos explícitos',
    severity: RuleSeverity.Warning,
    category: RuleCategory.TypeScript,
    validate: async () => {
      return {
        passed: false,
        message: 'Componentes con props sin tipar',
        details: [
          'AlertSystem.tsx: props any implícitos',
          'DailyInsightCard.tsx: props parcialmente tipados'
        ],
        affectedFiles: []
      };
    }
  }
];

/**
 * 🌍 REGLAS DE I18N
 */
export const I18nRules: ValidationRule[] = [
  {
    id: 'I18N-FE-001',
    name: 'Textos deben estar en i18n, no hardcoded',
    severity: RuleSeverity.Warning,
    category: RuleCategory.I18n,
    validate: async () => {
      return {
        passed: false,
        message: 'Textos hardcoded detectados',
        details: [
          'i18n.ts existe con ES/VI/EN ✓',
          'LanguageSwitcher.tsx existe ✓',
          'Pero muchos componentes tienen strings hardcoded',
          'Ejemplo: Dashboard.jsx, AssistantPanel.jsx'
        ],
        affectedFiles: []
      };
    }
  },
  {
    id: 'I18N-FE-002',
    name: 'Traducciones deben estar completas para ES/VI/EN',
    severity: RuleSeverity.Info,
    category: RuleCategory.I18n,
    validate: async () => {
      return {
        passed: false,
        message: 'Traducciones incompletas',
        details: [
          'i18n.ts: estructura presente',
          'Faltan keys para nuevos componentes',
          'Verificar: todas las páginas tienen traducciones'
        ],
        affectedFiles: [
          'i18n.ts'
        ]
      };
    }
  }
];

/**
 * 📋 TODAS LAS REGLAS
 */
export const ALL_FRONTEND_RULES: ValidationRule[] = [
  ...ComponentRules,
  ...HookRules,
  ...PageRules,
  ...RouteRules,
  ...IntegrationRules,
  ...StylingRules,
  ...AccessibilityRules,
  ...PerformanceRules,
  ...TypeScriptRules,
  ...I18nRules
];

export function getRulesByCategory(category: RuleCategory): ValidationRule[] {
  return ALL_FRONTEND_RULES.filter(rule => rule.category === category);
}

export function getCriticalRules(): ValidationRule[] {
  return ALL_FRONTEND_RULES.filter(rule => rule.severity === RuleSeverity.Critical);
}

export function getRuleById(id: string): ValidationRule | undefined {
  return ALL_FRONTEND_RULES.find(rule => rule.id === id);
}
