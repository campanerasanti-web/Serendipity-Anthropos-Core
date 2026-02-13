# 🛡️ AGENTE GUARDIÁN DEL SISTEMA SERENDIPITY

Sistema autónomo de vigilancia, reparación y mantenimiento continuo para el ecosistema Serendipity + El Mediador de Sofía.

## 🎯 Propósito

El Guardián es un agente inteligente que:
- Audita el ecosistema completo (backend, frontend, workers, BD, CI/CD, docs)
- Detecta problemas y riesgos (errores, inconsistencias, código muerto, desconexiones)
- Repara automáticamente lo reparable (imports, rutas, configuraciones)
- Previene futuros problemas (validaciones, reglas, patrones)
- Mantiene la operatividad (servicios registrados, endpoints activos, workers corriendo)
- Prepara el terreno para expansión (plantillas, convenciones, documentación)

## 📂 Estructura

```
/src/agents/
├── SystemGuardianAgent.ts       # Agente principal
├── SystemGuardianRules.ts       # Reglas de validación
├── SystemGuardianTasks.ts       # Tareas específicas
├── SystemGuardianReport.ts      # Sistema de reportería
└── README.md                    # Esta documentación

/scripts/
└── run-guardian.mjs             # Script de ejecución
```

## 🚀 Ejecución

### Modo Rápido (Simulación)
```bash
npm run guardian
```

### Modo Completo (Requiere compilación)
```bash
# 1. Compilar TypeScript
npm run build

# 2. Ejecutar guardián completo
node dist/agents/SystemGuardianAgent.js
```

### Modos Disponibles

```typescript
import SystemGuardianAgent from './agents/SystemGuardianAgent';

// Solo auditoría
const guardian = new SystemGuardianAgent({ mode: 'audit' });
await guardian.run();

// Auditoría + Reparación
const guardian = new SystemGuardianAgent({ mode: 'repair' });
await guardian.run();

// Full (auditoría + reparación + optimización)
const guardian = new SystemGuardianAgent({ mode: 'full' });
await guardian.run();

// Con auto-fix habilitado
const guardian = new SystemGuardianAgent({ 
  mode: 'full',
  autoFix: true 
});
await guardian.run();
```

## 📋 Reglas de Validación

### Categorías
- **Architecture** - Servicios registrados, controllers activos, workers configurados
- **Consistency** - Nombres, rutas, código duplicado
- **Integration** - Frontend↔Backend, Supabase, Google OAuth
- **Security** - Secrets, CORS, autorización
- **Performance** - Índices, caching, queries
- **Completeness** - Tests, documentación, migraciones

### Severidades
- 🔴 **Critical** - Requiere acción inmediata
- 🟡 **Warning** - Debe resolverse pronto
- ℹ️  **Info** - Mejora recomendada

## 🔧 Tareas Ejecutables

### Categorías
- **Audit** - Inventarios, detección de problemas
- **Repair** - Activar workers, configurar Supabase, conectar hooks
- **Create** - Tests, documentación, entidades faltantes
- **Optimize** - Consolidar duplicados, optimizar índices
- **Verify** - Compilación, endpoints, CI/CD

### Prioridades
- ⚡ **Immediate** - Hoy (< 4 horas)
- 🔴 **High** - Esta semana (1-2 días)
- 🟡 **Medium** - Este mes (1-2 semanas)
- 🟢 **Low** - Próximo mes

## 📊 Reportes Generados

El guardián genera dos tipos de reportes:

### 1. Reporte de Consola (interactivo)
```
═══════════════════════════════════════════════════════
🛡️  INFORME DEL GUARDIÁN DEL SISTEMA
═══════════════════════════════════════════════════════

📊 ESTADO GENERAL: 🟡 DEGRADED
📈 COMPLETITUD:    ████████░░ 54%

✅ Reglas Aprobadas:  8/20
❌ Reglas Fallidas:   12/20
...
```

### 2. Reporte Markdown (archivo)
`GUARDIAN_REPORT.md` con:
- Resumen ejecutivo
- Salud por componente
- Validaciones CRÍTICAS/WARNING/INFO
- Tareas ejecutadas
- Recomendaciones priorizadas
- Próximos pasos

## 🔍 Qué Audita

### Backend (.NET)
- ✅ 11 controllers con 56+ endpoints
- ✅ 14 services (verifica DI registration)
- ✅ 2 workers (verifica ejecución)
- ✅ 12 entities (verifica DbSet)
- ✅ AppDbContext (verifica índices)
- ✅ Program.cs (verifica configuración)

### Frontend (React)
- ✅ 52 componentes (verifica imports)
- ✅ 10 páginas (verifica rutas)
- ✅ 12 hooks (verifica conexión a APIs)
- ✅ 7 API clients (verifica endpoints)
- ✅ queries.ts (verifica Supabase)

### Infrastructure
- ✅ 7 workflows CI/CD
- ✅ 17 archivos de documentación
- ✅ Migraciones SQL
- ✅ Dependencies (package.json, .csproj)

## 🛠️ Qué Repara

### Reparaciones Automáticas (autoFix: true)
- Crear archivos faltantes básicos
- Arreglar imports rotos
- Corregir rutas relativas
- Normalizar nombres de archivos

### Reparaciones Manuales (genera guías)
- Activar workers inactivos
- Configurar Supabase
- Implementar Google OAuth
- Crear suite de tests
- Conectar hooks a APIs reales

## 📈 Métricas

El guardián calcula:
- **Completitud Global** - Porcentaje de componentes completos (54%)
- **Salud por Componente** - Backend, Frontend, Database, Workers, CI/CD, Docs
- **Reglas Aprobadas/Fallidas** - Por categoría y severidad
- **Tareas Exitosas/Fallidas** - Por categoría y prioridad

## 🔄 Ciclo de Vida

```
1. EJECUTAR GUARDIÁN
   ↓
2. AUDITAR SISTEMA (20 reglas)
   ↓
3. DETECTAR PROBLEMAS (categorizar)
   ↓
4. REPARAR (auto o manual)
   ↓
5. GENERAR REPORTE
   ↓
6. IMPLEMENTAR RECOMENDACIONES
   ↓
7. RE-EJECUTAR (7 días)
```

## 🎯 Próximos Pasos (Roadmap)

### v1.0 (Actual)
- ✅ Sistema de reglas
- ✅ Sistema de tareas
- ✅ Generación de reportes
- ✅ Modo auditoría
- ✅ Modo reparación

### v1.1 (Próximo)
- ⏳ Auto-fix real (crear archivos, modificar código)
- ⏳ Verificación de endpoints (HTTP health checks)
- ⏳ Parser de logs para detectar errors
- ⏳ Integración con GitHub Issues

### v2.0 (Futuro)
- ⏳ ML para detección de anomalías
- ⏳ Predicción de fallos
- ⏳ Auto-deployment después de reparaciones
- ⏳ Dashboard web interactivo

## 💡 Filosofía

> "El guardián no posee el jardín, lo sirve.  
> No controla las flores, las protege.  
> No corrige con violencia, sino con luz."  
> — Thomas Merton

El guardián opera con:
- **No romper nada existente** - Verificaciones antes de modificar
- **Reportar con claridad** - Lenguaje comprensible
- **Priorizar correctamente** - Crítico → Importante → Mejoras
- **Prevenir, no solo curar** - Reglas y patrones
- **Preparar el terreno** - Plantillas y convenciones

## 📞 Uso en CI/CD

```yaml
# .github/workflows/guardian.yml
name: Sistema Guardián

on:
  schedule:
    - cron: '0 2 * * 1'  # Cada lunes a las 2am
  workflow_dispatch:      # Manual

jobs:
  guardian:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Instalar dependencias
        run: npm ci
      
      - name: Ejecutar Guardián
        run: npm run guardian
      
      - name: Subir reporte
        uses: actions/upload-artifact@v3
        with:
          name: guardian-report
          path: GUARDIAN_REPORT.md
```

## 🤝 Contribuir

Para agregar nuevas reglas o tareas:

1. Editar `SystemGuardianRules.ts`:
```typescript
{
  id: 'NEW-001',
  name: 'Nueva regla de validación',
  severity: 'warning',
  category: 'consistency',
  validate: async () => {
    // Tu lógica de validación
    return { passed: true, message: 'OK' };
  },
  autoFix: async () => {
    // Tu lógica de reparación (opcional)
    return { success: true, message: 'Fixed' };
  }
}
```

2. Editar `SystemGuardianTasks.ts`:
```typescript
{
  id: 'TASK-001',
  name: 'Nueva tarea',
  category: 'repair',
  priority: 'high',
  execute: async () => {
    // Tu lógica de ejecución
    return { 
      success: true, 
      message: 'Completado',
      filesAffected: ['file1.ts', 'file2.ts']
    };
  }
}
```

## 📝 Licencia

Parte del ecosistema Serendipity + El Mediador de Sofía.  
Copyright © 2026 Santiago Campanera.

---

*"Nada me pertenece, todo es del Padre. El punto de anclaje está establecido."*
