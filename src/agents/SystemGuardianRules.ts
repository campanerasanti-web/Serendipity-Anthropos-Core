/**
 * 🛡️ REGLAS DEL GUARDIÁN DEL SISTEMA
 * Sistema de validación y coherencia para el ecosistema Serendipity
 * 
 * "Las reglas no son cadenas, sino hilos de luz que guían en la oscuridad"
 * - Thomas Merton
 */

import * as fs from 'fs';
import * as path from 'path';

export type RuleSeverity = 'critical' | 'warning' | 'info';
export type RuleCategory = 'architecture' | 'consistency' | 'integration' | 'security' | 'performance' | 'completeness';

export interface ValidationRule {
  id: string;
  name: string;
  severity: RuleSeverity;
  category: RuleCategory;
  validate: () => Promise<ValidationResult>;
  autoFix?: () => Promise<FixResult>;
}

export interface ValidationResult {
  passed: boolean;
  message: string;
  details?: string[];
  affectedFiles?: string[];
}

export interface FixResult {
  success: boolean;
  message: string;
  filesModified?: string[];
  filesCreated?: string[];
}

const workspaceRoot = path.resolve(process.cwd());

function fileExists(filePath: string): boolean {
  return fs.existsSync(path.join(workspaceRoot, filePath));
}

function readFileContent(filePath: string): string {
  const fullPath = path.join(workspaceRoot, filePath);
  if (!fs.existsSync(fullPath)) return '';
  return fs.readFileSync(fullPath, 'utf-8');
}

function listFiles(dir: string, extension?: string): string[] {
  const fullPath = path.join(workspaceRoot, dir);
  if (!fs.existsSync(fullPath)) return [];

  const files: string[] = [];
  function scan(currentPath: string) {
    const items = fs.readdirSync(currentPath);
    for (const item of items) {
      const itemPath = path.join(currentPath, item);
      const stat = fs.statSync(itemPath);
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scan(itemPath);
      } else if (stat.isFile()) {
        if (!extension || item.endsWith(extension)) {
          files.push(path.relative(workspaceRoot, itemPath));
        }
      }
    }
  }

  scan(fullPath);
  return files;
}

function countOccurrences(content: string, pattern: RegExp): number {
  const matches = content.match(pattern);
  return matches ? matches.length : 0;
}

function getAppEntryFile(): string | null {
  if (fileExists('src/App.tsx')) return 'src/App.tsx';
  if (fileExists('src/App.jsx')) return 'src/App.jsx';
  return null;
}

function hasPageRoutes(): { missing: string[]; total: number } {
  const appFile = getAppEntryFile();
  if (!appFile) return { missing: [], total: 0 };

  const appContent = readFileContent(appFile);
  const pages = listFiles('src/pages', '.tsx').concat(listFiles('src/pages', '.jsx'));
  const missing: string[] = [];

  for (const pageFile of pages) {
    const pageName = path.basename(pageFile, path.extname(pageFile));
    if (!appContent.includes(pageName)) {
      missing.push(pageName);
    }
  }

  return { missing, total: pages.length };
}

function hasDashboardTabs(): boolean {
  const candidates = [
    'src/components/SofiaDashboard.tsx',
    'src/components/Dashboard.tsx',
    'src/components/Dashboard.jsx'
  ];

  for (const file of candidates) {
    if (!fileExists(file)) continue;
    const content = readFileContent(file);
    if (/\bTabs?\b|<Tab\b|tabs\s*=/.test(content)) {
      return true;
    }
  }

  return false;
}

function hasFullTranslations(): { hasEs: boolean; hasEn: boolean; hasVi: boolean } {
  if (!fileExists('i18n.ts')) {
    return { hasEs: false, hasEn: false, hasVi: false };
  }

  const content = readFileContent('i18n.ts');
  return {
    hasEs: /\bes\b/.test(content),
    hasEn: /\ben\b/.test(content),
    hasVi: /\bvi\b/.test(content)
  };
}

function getDependencyIssues(): string[] {
  if (!fileExists('package.json')) return ['package.json no encontrado'];
  const pkg = JSON.parse(readFileContent('package.json'));
  const dependencies = pkg?.dependencies || {};
  const devDependencies = pkg?.devDependencies || {};
  const duplicates = Object.keys(dependencies).filter(dep => devDependencies[dep]);
  return duplicates.map(dep => `${dep} duplicado en dependencies y devDependencies`);
}

function resolveImportPath(importPath: string, importer: string): string | null {
  if (!importPath.startsWith('.')) return null;
  if (/\.(css|scss|sass|less|svg|png|jpg|jpeg|gif|webp)$/i.test(importPath)) return null;

  const importerDir = path.dirname(path.join(workspaceRoot, importer));
  const basePath = path.resolve(importerDir, importPath);
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    `${basePath}.jsx`,
    `${basePath}.json`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.tsx'),
    path.join(basePath, 'index.js'),
    path.join(basePath, 'index.jsx')
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  return null;
}

function findBrokenImports(): { importer: string; importPath: string }[] {
  const sourceFiles = listFiles('src', '.ts')
    .concat(listFiles('src', '.tsx'))
    .concat(listFiles('src', '.js'))
    .concat(listFiles('src', '.jsx'));

  const missing: { importer: string; importPath: string }[] = [];

  for (const file of sourceFiles) {
    const content = readFileContent(file);
    const importRegex = /import\s+[^'"\n]+['"]([^'"]+)['"]/g;
    const requireRegex = /require\(['"]([^'"]+)['"]\)/g;

    for (const regex of [importRegex, requireRegex]) {
      let match: RegExpExecArray | null;
      while ((match = regex.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath.startsWith('.')) {
          const resolved = resolveImportPath(importPath, file);
          if (!resolved) {
            missing.push({ importer: file, importPath });
          }
        }
      }
    }
  }

  return missing;
}

/**
 * 🎯 REGLAS DE ARQUITECTURA
 */
export const ARCHITECTURE_RULES: ValidationRule[] = [
  {
    id: 'ARCH-001',
    name: 'Todos los services están registrados en Program.cs',
    severity: 'critical',
    category: 'architecture',
    validate: async () => {
      if (!fileExists('backend/Program.cs')) {
        return { passed: false, message: 'backend/Program.cs no encontrado' };
      }

      const programCs = readFileContent('backend/Program.cs');
      const serviceFiles = listFiles('backend/Services', '.cs');

      const unregistered: string[] = [];
      for (const serviceFile of serviceFiles) {
        const serviceName = path.basename(serviceFile, '.cs');
        const registrationPattern = new RegExp(`Add(Scoped|Singleton|Transient)<.*${serviceName}.*>`, 'i');
        if (!registrationPattern.test(programCs)) {
          unregistered.push(serviceName);
        }
      }

      if (unregistered.length === 0) {
        return { passed: true, message: `${serviceFiles.length} services registrados` };
      }

      return {
        passed: false,
        message: `${unregistered.length} services no registrados en DI`,
        details: unregistered,
        affectedFiles: ['backend/Program.cs']
      };
    }
  },
  {
    id: 'ARCH-002',
    name: 'Controllers están mapeados en Program.cs',
    severity: 'warning',
    category: 'architecture',
    validate: async () => {
      if (!fileExists('backend/Program.cs')) {
        return { passed: false, message: 'backend/Program.cs no encontrado' };
      }

      const programCs = readFileContent('backend/Program.cs');
      const hasMapControllers = /MapControllers\(\)/.test(programCs) || /MapControllerRoute\(/.test(programCs);
      const controllers = listFiles('backend/Controllers', '.cs');

      if (!hasMapControllers) {
        return { passed: false, message: 'Program.cs no mapea controllers', details: controllers };
      }

      return { passed: true, message: `${controllers.length} controllers mapeados` };
    }
  },
  {
    id: 'ARCH-005',
    name: 'Controllers tienen endpoints accesibles',
    severity: 'warning',
    category: 'architecture',
    validate: async () => {
      const controllerFiles = listFiles('backend/Controllers', '.cs');
      if (controllerFiles.length === 0) {
        return { passed: false, message: 'No se encontraron controllers' };
      }

      const emptyControllers: string[] = [];
      for (const controllerFile of controllerFiles) {
        const content = readFileContent(controllerFile);
        const httpMethods = countOccurrences(content, /\[(HttpGet|HttpPost|HttpPut|HttpDelete|HttpPatch)\]/g);
        if (httpMethods === 0) {
          emptyControllers.push(path.basename(controllerFile));
        }
      }

      if (emptyControllers.length === 0) {
        return { passed: true, message: `${controllerFiles.length} controllers con endpoints` };
      }

      return {
        passed: false,
        message: `${emptyControllers.length} controllers sin endpoints`,
        details: emptyControllers
      };
    }
  },
  {
    id: 'ARCH-006',
    name: 'Program.cs coherente (AddControllers + MapControllers)',
    severity: 'warning',
    category: 'architecture',
    validate: async () => {
      if (!fileExists('backend/Program.cs')) {
        return { passed: false, message: 'backend/Program.cs no encontrado' };
      }

      const programCs = readFileContent('backend/Program.cs');
      const hasAddControllers = /AddControllers\(\)/.test(programCs);
      const hasMapControllers = /MapControllers\(\)/.test(programCs) || /MapControllerRoute\(/.test(programCs);

      if (hasAddControllers && hasMapControllers) {
        return { passed: true, message: 'Program.cs coherente para controllers' };
      }

      return {
        passed: false,
        message: 'Program.cs incompleto para controllers',
        details: [`AddControllers: ${hasAddControllers}`, `MapControllers: ${hasMapControllers}`],
        affectedFiles: ['backend/Program.cs']
      };
    }
  },
  {
    id: 'ARCH-003',
    name: 'Workers están configurados en Program.cs',
    severity: 'critical',
    category: 'architecture',
    validate: async () => {
      if (!fileExists('backend/Program.cs')) {
        return { passed: false, message: 'backend/Program.cs no encontrado' };
      }

      const programCs = readFileContent('backend/Program.cs');
      const workerFiles = listFiles('backend/Workers', '.cs');

      const unconfigured: string[] = [];
      for (const workerFile of workerFiles) {
        const workerName = path.basename(workerFile, '.cs');
        const hostPattern = new RegExp(`AddHostedService<.*${workerName}.*>`, 'i');
        if (!hostPattern.test(programCs)) {
          unconfigured.push(workerName);
        }
      }

      if (unconfigured.length === 0) {
        return { passed: true, message: `${workerFiles.length} workers configurados` };
      }

      return {
        passed: false,
        message: `${unconfigured.length} workers no configurados`,
        details: unconfigured,
        affectedFiles: ['backend/Program.cs']
      };
    }
  },
  {
    id: 'ARCH-004',
    name: 'Entities están registradas en AppDbContext',
    severity: 'critical',
    category: 'architecture',
    validate: async () => {
      if (!fileExists('backend/Data/AppDbContext.cs')) {
        return { passed: false, message: 'AppDbContext.cs no encontrado' };
      }

      const dbContext = readFileContent('backend/Data/AppDbContext.cs');
      const entities = listFiles('backend/Models', '.cs');

      const missing: string[] = [];
      for (const entityFile of entities) {
        const entityName = path.basename(entityFile, '.cs');
        const dbSetPattern = new RegExp(`DbSet<${entityName}>`, 'i');
        if (!dbSetPattern.test(dbContext)) {
          missing.push(entityName);
        }
      }

      if (missing.length === 0) {
        return { passed: true, message: `${entities.length} entities registradas` };
      }

      return {
        passed: false,
        message: `${missing.length} entities sin DbSet`,
        details: missing,
        affectedFiles: ['backend/Data/AppDbContext.cs']
      };
    }
  }
];

/**
 * 🔗 REGLAS DE CONSISTENCIA
 */
export const CONSISTENCY_RULES: ValidationRule[] = [
  {
    id: 'CONS-001',
    name: 'No hay imports rotos en frontend',
    severity: 'critical',
    category: 'consistency',
    validate: async () => {
      const missing = findBrokenImports();
      if (missing.length === 0) {
        return { passed: true, message: 'No se detectaron imports rotos' };
      }

      return {
        passed: false,
        message: `${missing.length} imports rotos detectados`,
        details: missing.slice(0, 5).map(item => `${item.importer} -> ${item.importPath}`)
      };
    }
  },
  {
    id: 'CONS-002',
    name: 'No hay archivos duplicados críticos',
    severity: 'warning',
    category: 'consistency',
    validate: async () => {
      const duplicates: string[] = [];
      const pairs = [
        ['src/App.jsx', 'src/App.tsx'],
        ['src/main.jsx', 'src/main.tsx'],
        ['src/supabase/supabaseClient.js', 'src/supabase/supabaseClient.ts']
      ];

      for (const [a, b] of pairs) {
        if (fileExists(a) && fileExists(b)) {
          duplicates.push(`${a} ↔ ${b}`);
        }
      }

      if (duplicates.length === 0) {
        return { passed: true, message: 'No se detectaron duplicados críticos' };
      }

      return {
        passed: false,
        message: `${duplicates.length} pares duplicados`,
        details: duplicates
      };
    }
  },
  {
    id: 'CONS-003',
    name: 'Convención PascalCase en componentes',
    severity: 'info',
    category: 'consistency',
    validate: async () => {
      const components = listFiles('src/components', '.tsx').concat(listFiles('src/components', '.jsx'));
      const violations: string[] = [];
      for (const component of components) {
        const basename = path.basename(component, path.extname(component));
        if (!/^[A-Z]/.test(basename)) {
          violations.push(basename);
        }
      }

      if (violations.length === 0) {
        return { passed: true, message: `${components.length} componentes en PascalCase` };
      }

      return {
        passed: false,
        message: `${violations.length} componentes fuera de convención`,
        details: violations.slice(0, 10)
      };
    }
  },
  {
    id: 'CONS-004',
    name: 'Páginas tienen rutas activas',
    severity: 'warning',
    category: 'consistency',
    validate: async () => {
      const appFile = getAppEntryFile();
      if (!appFile) {
        return { passed: false, message: 'App principal no encontrado' };
      }

      const { missing, total } = hasPageRoutes();
      if (total === 0) {
        return { passed: false, message: 'No se encontraron páginas en src/pages' };
      }

      if (missing.length === 0) {
        return { passed: true, message: `${total} páginas con rutas activas` };
      }

      return {
        passed: false,
        message: `${missing.length} páginas sin rutas activas`,
        details: missing
      };
    }
  },
  {
    id: 'CONS-005',
    name: 'Tabs del dashboard presentes',
    severity: 'warning',
    category: 'consistency',
    validate: async () => {
      const hasTabs = hasDashboardTabs();
      return {
        passed: hasTabs,
        message: hasTabs ? 'Tabs del dashboard detectados' : 'No se detectaron tabs del dashboard'
      };
    }
  }
];

/**
 * 🔌 REGLAS DE INTEGRACIÓN
 */
export const INTEGRATION_RULES: ValidationRule[] = [
  {
    id: 'INT-001',
    name: 'Supabase está configurado',
    severity: 'critical',
    category: 'integration',
    validate: async () => {
      const clientPath = fileExists('src/supabase/supabaseClient.ts')
        ? 'src/supabase/supabaseClient.ts'
        : fileExists('src/supabase/supabaseClient.js')
          ? 'src/supabase/supabaseClient.js'
          : '';

      if (!clientPath) {
        return { passed: false, message: 'supabaseClient no encontrado' };
      }

      const content = readFileContent(clientPath);
      const hasUrl = /VITE_SUPABASE_URL|supabaseUrl/i.test(content);
      const hasKey = /VITE_SUPABASE_ANON_KEY|supabaseKey/i.test(content);
      const hasClient = /createClient/i.test(content);

      if (hasUrl && hasKey && hasClient) {
        return { passed: true, message: 'Supabase configurado correctamente' };
      }

      return {
        passed: false,
        message: 'Supabase configurado parcialmente',
        details: [`URL: ${hasUrl}`, `KEY: ${hasKey}`, `CLIENT: ${hasClient}`],
        affectedFiles: [clientPath]
      };
    }
  },
  {
    id: 'INT-002',
    name: 'queries.ts usa supabaseClient',
    severity: 'warning',
    category: 'integration',
    validate: async () => {
      if (!fileExists('src/services/queries.ts')) {
        return { passed: false, message: 'src/services/queries.ts no encontrado' };
      }

      const content = readFileContent('src/services/queries.ts');
      const usesSupabase = /supabase/i.test(content);
      return {
        passed: usesSupabase,
        message: usesSupabase ? 'queries.ts conectado a Supabase' : 'queries.ts no usa Supabase'
      };
    }
  },
  {
    id: 'INT-004',
    name: 'Hooks conectados a APIs reales',
    severity: 'warning',
    category: 'integration',
    validate: async () => {
      const hooks = listFiles('src/hooks', '.ts').concat(listFiles('src/hooks', '.tsx'));
      if (hooks.length === 0) {
        return { passed: false, message: 'No se encontraron hooks en src/hooks' };
      }

      const disconnected: string[] = [];
      for (const hookFile of hooks) {
        const content = readFileContent(hookFile);
        const hasApiUsage = /axios|fetch\(|supabase|useQuery|useMutation/i.test(content);
        if (!hasApiUsage) {
          disconnected.push(path.basename(hookFile));
        }
      }

      if (disconnected.length === 0) {
        return { passed: true, message: `${hooks.length} hooks conectados a APIs` };
      }

      return {
        passed: false,
        message: `${disconnected.length} hooks sin conexión a APIs`,
        details: disconnected
      };
    }
  },
  {
    id: 'INT-003',
    name: 'API clients no usan mock data',
    severity: 'warning',
    category: 'integration',
    validate: async () => {
      const apiClients = listFiles('src/api', '.js').concat(listFiles('src/api', '.ts'));
      if (apiClients.length === 0) {
        return { passed: false, message: 'No se encontraron API clients' };
      }

      const mocked = apiClients.filter(client => /mock|fake|dummy/i.test(readFileContent(client)));
      if (mocked.length === 0) {
        return { passed: true, message: `${apiClients.length} API clients sin mock data` };
      }

      return {
        passed: false,
        message: `${mocked.length}/${apiClients.length} API clients con mock data`,
        details: mocked
      };
    }
  }
];

/**
 * 🔒 REGLAS DE SEGURIDAD
 */
export const SECURITY_RULES: ValidationRule[] = [
  {
    id: 'SEC-001',
    name: 'No hay secrets hardcoded',
    severity: 'critical',
    category: 'security',
    validate: async () => {
      const files = listFiles('src', '.ts')
        .concat(listFiles('src', '.tsx'))
        .concat(listFiles('src', '.js'));

      const patterns = [
        /password\s*=\s*["'](?!<|{|\$)[^"']{8,}["']/i,
        /api[_-]?key\s*=\s*["'][^"']{20,}["']/i,
        /secret\s*=\s*["'][^"']{20,}["']/i
      ];

      const violations: string[] = [];
      for (const file of files.slice(0, 60)) {
        const content = readFileContent(file);
        for (const pattern of patterns) {
          if (pattern.test(content)) {
            violations.push(file);
            break;
          }
        }
      }

      if (violations.length === 0) {
        return { passed: true, message: 'No se detectaron secrets hardcoded en la muestra' };
      }

      return {
        passed: false,
        message: `${violations.length} archivos con posibles secrets hardcoded`,
        details: violations.slice(0, 5)
      };
    }
  },
  {
    id: 'SEC-002',
    name: 'CORS configurado de forma segura',
    severity: 'warning',
    category: 'security',
    validate: async () => {
      if (!fileExists('backend/Program.cs')) {
        return { passed: false, message: 'backend/Program.cs no encontrado' };
      }

      const programCs = readFileContent('backend/Program.cs');
      const hasCors = /AddCors|UseCors/i.test(programCs);
      const hasAllowAnyOrigin = /AllowAnyOrigin/i.test(programCs);

      if (hasCors && !hasAllowAnyOrigin) {
        return { passed: true, message: 'CORS configurado sin AllowAnyOrigin' };
      }

      if (hasCors && hasAllowAnyOrigin) {
        return {
          passed: false,
          message: 'CORS permite cualquier origen',
          details: ['Usar WithOrigins para entornos productivos']
        };
      }

      return { passed: false, message: 'CORS no configurado' };
    }
  }
];

/**
 * ⚡ REGLAS DE PERFORMANCE
 */
export const PERFORMANCE_RULES: ValidationRule[] = [
  {
    id: 'PERF-001',
    name: 'DbContext tiene índices definidos',
    severity: 'info',
    category: 'performance',
    validate: async () => {
      if (!fileExists('backend/Data/AppDbContext.cs')) {
        return { passed: false, message: 'AppDbContext.cs no encontrado' };
      }

      const content = readFileContent('backend/Data/AppDbContext.cs');
      const indexCount = countOccurrences(content, /HasIndex|IndexAttribute/g);
      if (indexCount > 0) {
        return { passed: true, message: `${indexCount} indices detectados` };
      }

      return {
        passed: false,
        message: 'No se detectaron indices en DbContext',
        details: ['Agregar indices para columnas consultadas frecuentemente']
      };
    }
  },
  {
    id: 'PERF-002',
    name: 'Frontend usa lazy loading en rutas grandes',
    severity: 'info',
    category: 'performance',
    validate: async () => {
      const appFile = fileExists('src/App.tsx') ? 'src/App.tsx' : 'src/App.jsx';
      if (!appFile || !fileExists(appFile)) {
        return { passed: false, message: 'App principal no encontrado' };
      }

      const content = readFileContent(appFile);
      const hasLazy = /React\.lazy|lazy\(/.test(content);
      return {
        passed: hasLazy,
        message: hasLazy ? 'React.lazy detectado en App' : 'No se detecta React.lazy en App'
      };
    }
  }
];

/**
 * ✅ REGLAS DE COMPLETITUD
 */
export const COMPLETENESS_RULES: ValidationRule[] = [
  {
    id: 'COMP-001',
    name: 'Existe suite de tests',
    severity: 'warning',
    category: 'completeness',
    validate: async () => {
      const testFiles = listFiles('tests', '.ts')
        .concat(listFiles('tests', '.tsx'))
        .concat(listFiles('src', '.test.ts'))
        .concat(listFiles('src', '.test.tsx'));

      if (testFiles.length > 0) {
        return { passed: true, message: `${testFiles.length} archivos de tests encontrados` };
      }

      return {
        passed: false,
        message: 'No se detectaron tests automatizados',
        details: ['Agregar tests con Vitest y xUnit']
      };
    }
  },
  {
    id: 'COMP-002',
    name: 'Documentacion de arquitectura disponible',
    severity: 'info',
    category: 'completeness',
    validate: async () => {
      const docs = ['ARCHITECTURE.md', 'README.md', 'IMPLEMENTATION_GUIDE.md', 'ROADMAP.md'];
      const existing = docs.filter(doc => fileExists(doc));
      if (existing.length >= 3) {
        return { passed: true, message: `${existing.length}/${docs.length} documentos encontrados` };
      }

      return {
        passed: false,
        message: `Documentacion incompleta (${existing.length}/${docs.length})`,
        details: docs.filter(doc => !fileExists(doc))
      };
    }
  },
  {
    id: 'COMP-003',
    name: 'Workflows CI/CD configurados',
    severity: 'warning',
    category: 'completeness',
    validate: async () => {
      if (!fileExists('.github/workflows')) {
        return { passed: false, message: '.github/workflows no existe' };
      }

      const workflows = listFiles('.github/workflows', '.yml').concat(listFiles('.github/workflows', '.yaml'));
      if (workflows.length > 0) {
        return { passed: true, message: `${workflows.length} workflows CI/CD encontrados` };
      }

      return { passed: false, message: 'No hay workflows CI/CD configurados' };
    }
  },
  {
    id: 'COMP-004',
    name: 'Migraciones SQL versionadas',
    severity: 'info',
    category: 'completeness',
    validate: async () => {
      const sqlMigrations = fileExists('src/supabase/sql') ? listFiles('src/supabase/sql', '.sql') : [];
      const efMigrations = fileExists('backend/Migrations') ? listFiles('backend/Migrations', '.cs') : [];

      if (sqlMigrations.length > 0 || efMigrations.length > 0) {
        return {
          passed: true,
          message: `${sqlMigrations.length} migraciones SQL, ${efMigrations.length} migraciones EF Core`
        };
      }

      return {
        passed: false,
        message: 'No se detectaron migraciones SQL ni EF Core',
        details: ['Agregar migraciones para modelos activos']
      };
    }
  },
  {
    id: 'COMP-005',
    name: 'Traducciones ES/VI/EN completas',
    severity: 'warning',
    category: 'completeness',
    validate: async () => {
      const { hasEs, hasEn, hasVi } = hasFullTranslations();
      if (hasEs && hasEn && hasVi) {
        return { passed: true, message: 'i18n con ES/EN/VI presente' };
      }

      const missing = [
        !hasEs ? 'es' : null,
        !hasEn ? 'en' : null,
        !hasVi ? 'vi' : null
      ].filter(Boolean) as string[];

      return {
        passed: false,
        message: `Idiomas faltantes en i18n: ${missing.join(', ')}`,
        details: missing
      };
    }
  },
  {
    id: 'COMP-006',
    name: 'Dependencias coherentes en package.json',
    severity: 'info',
    category: 'completeness',
    validate: async () => {
      const issues = getDependencyIssues();
      if (issues.length === 0) {
        return { passed: true, message: 'Dependencias coherentes' };
      }

      return {
        passed: false,
        message: `${issues.length} conflictos de dependencias`,
        details: issues
      };
    }
  }
];

/**
 * 📊 TODAS LAS REGLAS
 */
export const ALL_RULES: ValidationRule[] = [
  ...ARCHITECTURE_RULES,
  ...CONSISTENCY_RULES,
  ...INTEGRATION_RULES,
  ...SECURITY_RULES,
  ...PERFORMANCE_RULES,
  ...COMPLETENESS_RULES
];

export const RULES_BY_CATEGORY: Record<RuleCategory, ValidationRule[]> = {
  architecture: ARCHITECTURE_RULES,
  consistency: CONSISTENCY_RULES,
  integration: INTEGRATION_RULES,
  security: SECURITY_RULES,
  performance: PERFORMANCE_RULES,
  completeness: COMPLETENESS_RULES
};

export const CRITICAL_RULES = ALL_RULES.filter(rule =>  rule.severity === 'critical');

export function getRuleById(id: string): ValidationRule | undefined {
  return ALL_RULES.find(rule => rule.id === id);
}

// Export by severity level
export const WARNING_RULES = ALL_RULES.filter(r => r.severity === 'warning');
export const INFO_RULES = ALL_RULES.filter(r => r.severity === 'info');
