/**
 * 🔧 TAREAS DEL GUARDIÁN
 * Operaciones específicas de auditoría, reparación y mantenimiento
 * 
 * "El trabajo del jardinero no es crear las flores, sino preparar la tierra"
 * - Thomas Merton
 */

import * as fs from 'fs';
import * as path from 'path';

export interface Task {
  id: string;
  name: string;
  category: 'audit' | 'repair' | 'create' | 'optimize' | 'verify';
  priority: 'immediate' | 'high' | 'medium' | 'low';
  execute: () => Promise<TaskResult>;
}

export interface TaskResult {
  success: boolean;
  message: string;
  details?: string[];
  filesAffected?: string[];
    nextSteps?: string[];
  }

  const workspaceRoot = path.resolve(process.cwd());
  let autoFixEnabled = false;

  export function setGuardianAutoFix(value: boolean): void {
    autoFixEnabled = value;
  }

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

  function getAppEntryFile(): string | null {
    if (fileExists('src/App.tsx')) return 'src/App.tsx';
    if (fileExists('src/App.jsx')) return 'src/App.jsx';
    return null;
  }

  function findBrokenRoutes(): string[] {
    const appFile = getAppEntryFile();
    if (!appFile) return ['App principal no encontrado'];

    const content = readFileContent(appFile);
    const pages = listFiles('src/pages', '.tsx').concat(listFiles('src/pages', '.jsx'));
    const missing: string[] = [];

    for (const pageFile of pages) {
      const pageName = path.basename(pageFile, path.extname(pageFile));
      if (!content.includes(pageName)) {
        missing.push(pageName);
      }
    }

    return missing;
  }

  function findControllersWithoutEndpoints(): string[] {
    const controllers = listFiles('backend/Controllers', '.cs');
    const missing: string[] = [];
    for (const controller of controllers) {
      const content = readFileContent(controller);
      const count = content.match(/\[(HttpGet|HttpPost|HttpPut|HttpDelete|HttpPatch)\]/g)?.length || 0;
      if (count === 0) {
        missing.push(path.basename(controller));
      }
    }
    return missing;
  }

  function findBrokenImports(): { importer: string; importPath: string; defaultImport?: string }[] {
    const sourceFiles = listFiles('src', '.ts')
      .concat(listFiles('src', '.tsx'))
      .concat(listFiles('src', '.js'))
      .concat(listFiles('src', '.jsx'));

    const missing: { importer: string; importPath: string; defaultImport?: string }[] = [];

    for (const file of sourceFiles) {
      const content = readFileContent(file);
      const importRegex = /import\s+([^'"\n]+)\s+from\s+['"]([^'"]+)['"]/g;
      const requireRegex = /require\(['"]([^'"]+)['"]\)/g;

      let match: RegExpExecArray | null;
      while ((match = importRegex.exec(content)) !== null) {
        const importStatement = match[1].trim();
        const importPath = match[2].trim();
        if (!importPath.startsWith('.')) continue;

        const resolved = resolveImportPath(importPath, file);
        if (!resolved) {
          const defaultImport = /^[A-Za-z0-9_$]+$/.test(importStatement) ? importStatement : undefined;
          missing.push({ importer: file, importPath, defaultImport });
        }
      }

      while ((match = requireRegex.exec(content)) !== null) {
        const importPath = match[1].trim();
        if (!importPath.startsWith('.')) continue;
        const resolved = resolveImportPath(importPath, file);
        if (!resolved) {
          missing.push({ importer: file, importPath });
        }
      }
    }

    return missing;
  }

  function createStubFile(targetPath: string, defaultExport?: string): void {
    const fullPath = path.join(workspaceRoot, targetPath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(fullPath)) return;

    const isTsx = targetPath.endsWith('.tsx') || targetPath.endsWith('.jsx');
    const safeName = defaultExport || 'Stub';
    const content = isTsx
      ? `export default function ${safeName}() { return null; }\n`
      : `const ${safeName} = {};\nexport default ${safeName};\n`;

    fs.writeFileSync(fullPath, content, 'utf-8');
  }

  function inferStubPath(importPath: string, importer: string, defaultImport?: string): string | null {
    if (/\.(css|scss|sass|less|svg|png|jpg|jpeg|gif|webp)$/i.test(importPath)) return null;

    const importerDir = path.dirname(importer);
    const base = path.normalize(path.join(importerDir, importPath));
    if (path.extname(base)) return base;

    const prefersTsx = (defaultImport && /^[A-Z]/.test(defaultImport)) || /components|pages/i.test(base);
    return prefersTsx ? `${base}.tsx` : `${base}.ts`;
  }

  /**
   * 🔍 TAREAS DE AUDITORÍA
   */
  export const AUDIT_TASKS: Task[] = [
    {
      id: 'AUDIT-001',
      name: 'Escanear árbol de archivos',
      category: 'audit',
      priority: 'immediate',
      execute: async () => {
        const controllers = listFiles('backend/Controllers', '.cs');
        const services = listFiles('backend/Services', '.cs');
        const workers = listFiles('backend/Workers', '.cs');
        const models = listFiles('backend/Models', '.cs');
        const components = listFiles('src/components', '.tsx').concat(listFiles('src/components', '.jsx'));
        const pages = listFiles('src/pages', '.tsx').concat(listFiles('src/pages', '.jsx'));
        const hooks = listFiles('src/hooks', '.ts').concat(listFiles('src/hooks', '.tsx'));
        const apiClients = listFiles('src/api', '.ts').concat(listFiles('src/api', '.js'));
        const workflows = listFiles('.github/workflows', '.yml').concat(listFiles('.github/workflows', '.yaml'));
        const docs = listFiles('.', '.md');
        const migrations = listFiles('src/supabase/sql', '.sql');

        return {
          success: true,
          message: 'Inventario completo',
          details: [
            `Backend: ${controllers.length} controllers, ${services.length} services, ${workers.length} workers, ${models.length} models`,
            `Frontend: ${components.length} components, ${pages.length} pages, ${hooks.length} hooks, ${apiClients.length} api clients`,
            `Infra: ${workflows.length} workflows, ${docs.length} docs, ${migrations.length} migrations`
          ]
        };
      }
    },
    {
      id: 'AUDIT-002',
      name: 'Detectar imports rotos',
      category: 'audit',
      priority: 'high',
      execute: async () => {
        const missing = findBrokenImports();
        if (missing.length === 0) {
          return { success: true, message: 'No hay imports rotos detectados' };
        }

        return {
          success: false,
          message: `${missing.length} imports rotos detectados`,
          details: missing.slice(0, 8).map(item => `${item.importer} -> ${item.importPath}`)
        };
      }
    },
    {
      id: 'AUDIT-003',
      name: 'Detectar rutas rotas',
      category: 'audit',
      priority: 'high',
      execute: async () => {
        const missingRoutes = findBrokenRoutes();
        if (missingRoutes.length === 0) {
          return { success: true, message: 'Todas las páginas tienen rutas activas' };
        }

        if (missingRoutes.includes('App principal no encontrado')) {
          return { success: false, message: 'App principal no encontrado' };
        }

        return {
          success: false,
          message: `${missingRoutes.length} páginas sin rutas activas`,
          details: missingRoutes
        };
      }
    },
    {
      id: 'AUDIT-004',
      name: 'Detectar endpoints inexistentes',
      category: 'audit',
      priority: 'medium',
      execute: async () => {
        const missingEndpoints = findControllersWithoutEndpoints();
        if (missingEndpoints.length === 0) {
          return { success: true, message: 'Todos los controllers tienen endpoints' };
        }

        return {
          success: false,
          message: `${missingEndpoints.length} controllers sin endpoints`,
          details: missingEndpoints
        };
      }
    }
  ];

  /**
   * 🔧 TAREAS DE REPARACIÓN
   */
  export const REPAIR_TASKS: Task[] = [
    {
      id: 'REPAIR-001',
      name: 'Crear stubs seguros para imports rotos',
      category: 'repair',
      priority: 'immediate',
      execute: async () => {
        const missing = findBrokenImports();
        if (missing.length === 0) {
          return { success: true, message: 'No hay imports rotos que reparar' };
        }

        if (!autoFixEnabled) {
          return {
            success: false,
            message: 'Auto-fix deshabilitado. No se crean stubs.',
            details: missing.slice(0, 8).map(item => `${item.importer} -> ${item.importPath}`),
            nextSteps: ['Ejecutar con autoFix: true para crear stubs seguros']
          };
        }

        const created: string[] = [];
        const skipped: string[] = [];

        for (const item of missing) {
          if (!item.defaultImport) {
            skipped.push(`${item.importer} -> ${item.importPath}`);
            continue;
          }

          const stubPath = inferStubPath(item.importPath, item.importer, item.defaultImport);
          if (!stubPath) {
            skipped.push(`${item.importer} -> ${item.importPath}`);
            continue;
          }

          if (!fileExists(stubPath)) {
            createStubFile(stubPath, item.defaultImport);
            created.push(stubPath);
          }
        }

        return {
          success: created.length > 0,
          message: created.length > 0 ? `Stubs creados: ${created.length}` : 'No se crearon stubs',
          details: created.slice(0, 8),
          filesAffected: created,
          nextSteps: skipped.length > 0 ? ['Revisar imports con named exports no auto-fijados'] : undefined
        };
      }
    },
    {
      id: 'REPAIR-002',
      name: 'Resolver duplicados criticos (manual)',
      category: 'repair',
      priority: 'medium',
      execute: async () => {
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
          return { success: true, message: 'No se detectaron duplicados criticos' };
        }

        return {
          success: false,
          message: `${duplicates.length} duplicados requieren resolucion manual`,
          details: duplicates,
          nextSteps: ['Consolidar archivos y actualizar imports']
        };
      }
    },
    {
      id: 'REPAIR-003',
      name: 'Normalizar nombres de archivos (manual)',
      category: 'repair',
      priority: 'medium',
      execute: async () => {
        const components = listFiles('src/components', '.tsx').concat(listFiles('src/components', '.jsx'));
        const violations: string[] = [];
        for (const component of components) {
          const basename = path.basename(component, path.extname(component));
          if (!/^[A-Z]/.test(basename)) {
            violations.push(component);
          }
        }

        if (violations.length === 0) {
          return { success: true, message: 'Nombres de componentes consistentes' };
        }

        return {
          success: false,
          message: `${violations.length} archivos requieren normalizacion`,
          details: violations.slice(0, 8),
          nextSteps: ['Renombrar a PascalCase y actualizar imports']
        };
      }
    }
  ];

  /**
   * ✨ TAREAS DE CREACIÓN
   */
  export const CREATE_TASKS: Task[] = [
    {
      id: 'CREATE-001',
      name: 'Crear plantillas base (components, services, tests)',
      category: 'create',
      priority: 'medium',
      execute: async () => {
        if (!autoFixEnabled) {
          return {
            success: false,
            message: 'Auto-fix deshabilitado. No se crean plantillas.',
            nextSteps: ['Ejecutar con autoFix: true para crear plantillas base']
          };
        }

        const templatesDir = path.join(workspaceRoot, 'src/templates');
        if (!fs.existsSync(templatesDir)) {
          fs.mkdirSync(templatesDir, { recursive: true });
        }

        const files: { name: string; content: string }[] = [
          {
            name: 'ComponentTemplate.tsx',
            content: `export default function ComponentTemplate() { return null; }\n`
          },
          {
            name: 'HookTemplate.ts',
            content: `export function useTemplate() { return {}; }\n`
          },
          {
            name: 'ServiceTemplate.ts',
            content: `export class ServiceTemplate {}\n`
          },
          {
            name: 'TestTemplate.test.ts',
            content: `import { describe, it, expect } from 'vitest';\n\n` +
              `describe('template', () => { it('works', () => { expect(true).toBe(true); }); });\n`
          }
        ];

        const created: string[] = [];
        for (const file of files) {
          const target = path.join(templatesDir, file.name);
          if (!fs.existsSync(target)) {
            fs.writeFileSync(target, file.content, 'utf-8');
            created.push(path.relative(workspaceRoot, target));
          }
        }

        return {
          success: true,
          message: `Plantillas creadas: ${created.length}`,
          filesAffected: created
        };
      }
    },
    {
      id: 'CREATE-002',
      name: 'Generar GUARDIAN_REPORT.md',
      category: 'create',
      priority: 'low',
      execute: async () => {
        const reportPath = path.join(workspaceRoot, 'GUARDIAN_REPORT.md');
        if (fs.existsSync(reportPath)) {
          return { success: true, message: 'GUARDIAN_REPORT.md ya existe' };
        }

        if (!autoFixEnabled) {
          return {
            success: false,
            message: 'Reporte no generado (autoFix deshabilitado)',
            nextSteps: ['Ejecutar modo full para generar reporte']
          };
        }

        const content = '# GUARDIAN_REPORT\n\nReporte generado automaticamente.\n';
        fs.writeFileSync(reportPath, content, 'utf-8');
        return {
          success: true,
          message: 'GUARDIAN_REPORT.md creado',
          filesAffected: ['GUARDIAN_REPORT.md']
        };
      }
    }
  ];

  /**
   * ⚡ TAREAS DE OPTIMIZACIÓN
   */
  export const OPTIMIZE_TASKS: Task[] = [
    {
      id: 'OPT-001',
      name: 'Recomendar consolidación de duplicados',
      category: 'optimize',
      priority: 'low',
      execute: async () => {
        return {
          success: true,
          message: 'Recomendaciones generadas',
          details: [
            'Consolidar dashboards duplicados en un hook',
            'Reducir mock data disperso en múltiples lugares'
          ]
        };
      }
    }
  ];

  /**
   * ✅ TAREAS DE VERIFICACIÓN
   */
  export const VERIFY_TASKS: Task[] = [
    {
      id: 'VERIFY-001',
      name: 'Verificar scripts de build',
      category: 'verify',
      priority: 'immediate',
      execute: async () => {
        if (!fileExists('package.json')) {
          return { success: false, message: 'package.json no encontrado' };
        }

        const pkg = JSON.parse(readFileContent('package.json'));
        const hasBuild = Boolean(pkg?.scripts?.build);
        return {
          success: hasBuild,
          message: hasBuild ? 'Script build encontrado' : 'Script build no encontrado'
        };
      }
    },
    {
      id: 'VERIFY-002',
      name: 'Verificar workflows CI/CD',
      category: 'verify',
      priority: 'high',
      execute: async () => {
        const workflows = listFiles('.github/workflows', '.yml').concat(listFiles('.github/workflows', '.yaml'));
        if (workflows.length > 0) {
          return { success: true, message: `${workflows.length} workflows CI/CD detectados` };
        }
        return { success: false, message: 'No se detectaron workflows CI/CD' };
      }
    }
  ];

  /**
   * 📊 TODAS LAS TAREAS
   */
  export const ALL_TASKS: Task[] = [
    ...AUDIT_TASKS,
    ...REPAIR_TASKS,
    ...CREATE_TASKS,
    ...OPTIMIZE_TASKS,
    ...VERIFY_TASKS
  ];

  export const TASKS_BY_CATEGORY = {
    audit: AUDIT_TASKS,
    repair: REPAIR_TASKS,
    create: CREATE_TASKS,
    optimize: OPTIMIZE_TASKS,
    verify: VERIFY_TASKS
  };

  export const IMMEDIATE_TASKS = ALL_TASKS.filter(t => t.priority === 'immediate');
  export const HIGH_PRIORITY_TASKS = ALL_TASKS.filter(t => t.priority === 'high');
