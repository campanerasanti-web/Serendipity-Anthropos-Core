# 🌱 AGENTE JARDINERO DEL BACKEND

**Sistema autónomo de auditoría, reparación, prevención y mantenimiento del backend .NET**

## 📋 Propósito

El Agente Jardinero del Backend es un sistema autónomo que audita, repara, previene y mantiene la salud del backend de El Mediador de Sofía. Su misión es asegurar que el backend esté siempre sano, coherente, funcional y fértil para nuevas expansiones.

> "El jardinero no impone, observa. No fuerza, facilita. No controla las flores, las protege."  
> — Thomas Merton

## 🏗️ Estructura

```
backend/BackendAgents/
├── BackendGardenerAgent.cs       # Agente principal - orquestación
├── BackendGardenerRules.cs       # 17 reglas de validación
├── BackendGardenerTasks.cs       # 16 tareas ejecutables
├── BackendGardenerReport.cs      # Sistema de reportería
└── README.md                     # Esta documentación
```

## 🚀 Uso

### 1. Modo Programático

```csharp
using ElMediadorDeSofia.BackendAgents;

// Auditoría solamente
var report = await BackendGardenerAgent.RunAuditAsync();

// Auditoría + Reparación
var report = await BackendGardenerAgent.RunFullAsync();

// Configuración personalizada
var config = new BackendGardenerConfig
{
    Mode = AgentMode.Full,
    AutoFix = true,
    Priorities = new() { TaskPriority.Immediate, TaskPriority.High },
    Categories = new() { RuleCategory.Architecture, RuleCategory.Security },
    OutputFormat = "both" // "markdown" | "console" | "both"
};

var agent = new BackendGardenerAgent(config);
var report = await agent.RunAsync();
```

### 2. Modo Worker (Scheduled)

```csharp
// En Program.cs
builder.Services.AddHostedService<BackendGardenerWorker>();

// BackendGardenerWorker.cs
public class BackendGardenerWorker : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await BackendGardenerAgent.RunAuditAsync();
            await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
        }
    }
}
```

### 3. Endpoint Manual

```csharp
// En un controller
[HttpPost("gardener/run")]
public async Task<IActionResult> RunGardener()
{
    var report = await BackendGardenerAgent.RunFullAsync();
    return Ok(report);
}
```

## 📊 Reglas de Validación (17 reglas)

### 🏛️ Architecture (3 reglas)
- **ARCH-BE-001**: Todos los servicios registrados en DI
- **ARCH-BE-002**: Workers correctamente configurados
- **ARCH-BE-003**: Controllers tienen endpoints documentados

### 💉 Dependency Injection (2 reglas)
- **DI-BE-001**: Servicios tienen interfaces
- **DI-BE-002**: Servicios con DbContext son Scoped

### 📊 Event Sourcing (3 reglas)
- **ES-BE-001**: Event store operacional
- **ES-BE-002**: EventDispatcher funciona
- **ES-BE-003**: Projections activas

### 💾 Database (3 reglas)
- **DB-BE-001**: Todas las entidades tienen DbSet
- **DB-BE-002**: Migraciones aplicadas
- **DB-BE-003**: Índices optimizados

### 🔗 Consistency (2 reglas)
- **CONS-BE-001**: Convenciones de nombres
- **CONS-BE-002**: No código duplicado

### 🔒 Security (2 reglas)
- **SEC-BE-001**: No secrets en código
- **SEC-BE-002**: CORS configurado correctamente

### 🔌 Integration (2 reglas)
- **INT-BE-001**: Controllers mapean a servicios
- **INT-BE-002**: Respuestas API consistentes

## 🔧 Tareas Ejecutables (16 tareas)

### 🔍 Audit (4 tareas)
- **AUDIT-BE-001**: Inventariar servicios
- **AUDIT-BE-002**: Inventariar controllers
- **AUDIT-BE-003**: Detectar servicios no usados
- **AUDIT-BE-004**: Detectar implementaciones incompletas

### 🔧 Repair (4 tareas)
- **REPAIR-BE-001**: Activar workers inactivos
- **REPAIR-BE-002**: Completar mapeo de entidades
- **REPAIR-BE-003**: Implementar Google OAuth real
- **REPAIR-BE-004**: Agregar persistencia a EventDispatcher

### ✨ Create (3 tareas)
- **CREATE-BE-001**: Crear suite de tests
- **CREATE-BE-002**: Crear documentación API completa
- **CREATE-BE-003**: Crear plantillas de servicios

### ⚡ Optimize (2 tareas)
- **OPT-BE-001**: Consolidar lógica de Orders
- **OPT-BE-002**: Optimizar queries de database

### ✅ Verify (3 tareas)
- **VERIFY-BE-001**: Verificar compilación
- **VERIFY-BE-002**: Verificar inyección de dependencias
- **VERIFY-BE-003**: Verificar que endpoints responden

## 📈 Reportes

El agente genera dos formatos de reporte:

### 1. Markdown (`BACKEND_GARDENER_REPORT.md`)
Reporte completo con:
- Resumen ejecutivo
- Salud por componente
- Resultados de validación
- Resultados de tareas
- Recomendaciones priorizadas
- Próximos pasos

### 2. Console
Reporte compacto con:
- Estado general
- Completitud total
- Issues críticos
- Top 3 recomendaciones
- Próximos 3 pasos

## 🎯 Capacidades

### ✅ Audita
- 14 servicios
- 11 controllers (56+ endpoints)
- 2 workers
- 10 entidades
- Event sourcing (store + dispatcher + projections)
- Database (entities + migrations + indexes)
- Dependency injection
- Integración frontend-backend
- Seguridad (CORS + secrets)

### ✅ Detecta
- Servicios no usados
- Implementaciones incompletas
- Workers inactivos
- Entidades sin DbSet
- Migraciones sin aplicar
- Índices faltantes
- Código duplicado
- CORS inseguro
- Secrets hardcoded

### ✅ Repara (manual-guided)
- Activa workers inactivos
- Completa entidades faltantes
- Implementa integraciones OAuth
- Agrega persistencia a eventos
- Crea suite de tests
- Optimiza índices
- Consolida código duplicado

### ✅ Previene
- Valida convenciones de código
- Verifica DI correcta
- Verifica compilación
- Verifica endpoints activos
- Detecta problemas tempranos

### ✅ Mantiene
- Monitoreo continuo si se usa como worker
- Reportes periódicos
- Alertas de degradación
- Tracking de completitud

### ✅ Prepara
- Plantillas de servicios
- Plantillas de controllers
- Plantillas de tests
- Documentación de patrones

## 🎨 Filosofía

El Agente Jardinero opera bajo principios contemplativos:

1. **Observación antes que acción**: Audita primero, repara después
2. **No violencia**: No elimina código sin confirmación
3. **Facilitación**: Guía reparaciones, no fuerza cambios
4. **Fertilidad**: Prepara el terreno para nuevas semillas
5. **Ciclos naturales**: Respeta los tiempos del desarrollo

## 📊 Métricas de Salud

### Componentes Monitoreados
- **Services**: 14 servicios (80% completitud)
- **Controllers**: 11 controllers (95% completitud)
- **Workers**: 2 workers (40% completitud - CRÍTICO)
- **Event Sourcing**: Store + Dispatcher + Projections (65% completitud)
- **Database**: Entities + Migrations (70% completitud)
- **Integration**: Tests + Docs + CI/CD (50% completitud)

### Estado General
- **EXCELLENT**: ≥85% completitud, 0 fallos críticos
- **GOOD**: ≥70% completitud, ≤2 fallos críticos
- **DEGRADED**: ≥50% completitud, ≤5 fallos críticos
- **WARNING**: ≥30% completitud
- **CRITICAL**: <30% completitud

## 🛠️ Extensibilidad

### Agregar Nueva Regla

```csharp
public class CustomRule : IValidationRule
{
    public string Id => "CUST-001";
    public string Name => "Mi regla personalizada";
    public RuleSeverity Severity => RuleSeverity.Warning;
    public RuleCategory Category => RuleCategory.Custom;

    public async Task<ValidationResult> ValidateAsync()
    {
        // Tu lógica aquí
        return new ValidationResult { Passed = true };
    }

    public Task<FixResult>? AutoFixAsync() => null;
}

// Agregar a AllBackendRules.GetAll()
```

### Agregar Nueva Tarea

```csharp
public class CustomTask : IBackendTask
{
    public string Id => "CUST-TASK-001";
    public string Name => "Mi tarea personalizada";
    public TaskCategory Category => TaskCategory.Custom;
    public TaskPriority Priority => TaskPriority.Medium;

    public async Task<TaskResult> ExecuteAsync()
    {
        // Tu lógica aquí
        return new TaskResult { Success = true };
    }
}

// Agregar a AllBackendTasks.GetAll()
```

## 🔄 Integración CI/CD

### GitHub Actions

```yaml
name: Backend Gardener

on:
  schedule:
    - cron: '0 0 * * 0' # Cada domingo
  workflow_dispatch:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Backend Gardener
        run: |
          dotnet run --project backend/BackendAgents/
      - name: Upload Report
        uses: actions/upload-artifact@v3
        with:
          name: backend-gardener-report
          path: BACKEND_GARDENER_REPORT.md
```

## 📝 Roadmap

### v1.0 (Actual)
- ✅ 17 reglas de validación
- ✅ 16 tareas ejecutables
- ✅ Sistema de reportería
- ✅ Modo audit + repair
- ✅ Output markdown + console

### v1.1 (Próximo)
- 🔲 Auto-fix real (crear archivos, modificar código)
- 🔲 Integración con issue tracker
- 🔲 Métricas históricas
- 🔲 Dashboard web

### v2.0 (Futuro)
- 🔲 ML para detección de anomalías
- 🔲 Predicción de fallos
- 🔲 Auto-deployment de fixes
- 🔲 Integración con APM

---

**"Nada me pertenece, todo es del Padre. El jardinero sirve al jardín."**
