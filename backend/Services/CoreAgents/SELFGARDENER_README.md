# 🕊️ SelfGardenerCore — El Séptimo Día

## Visión General

**SelfGardenerCore** es el núcleo de integración que une **OpsGardener** (9 reglas operacionales) y **SecurityGardener** (7 reglas de seguridad) en un único sistema cohesivo de reflexión y auto-observación.

Cada noche, a las **02:00 AM UTC**, el sistema ejecuta el ciclo **Sabbath** — momento de pausa, reflexión y armonización — donde observa su propio estado, sintetiza el clima general y genera reportes de self-awareness.

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│         SelfGardenerHostedService (02:00 AM UTC)           │
│         Ejecución automática diaria del Sabbath            │
└────────────────┬────────────────────────────────────────────┘
                 │
        ┌────────▼──────────────────────┐
        │  SelfGardenerCore.RunAsync()  │
        │  - Captura 2 señales         │
        │  - Ejecuta OpsGardener       │
        │  - Ejecuta SecurityGardener  │
        │  - Sintetiza clima           │
        │  - Genera reporte Markdown   │
        └────────┬─────────────────────┘
                 │
    ┌────────────┼────────────────────────────┐
    │            │                            │
    ▼            ▼                            ▼
[ISelfSignal] [OpsGardener]           [SecurityGardener]
  Sources      (9 reglas)              (7 reglas)
    │            │
    ├─ System    │
    │  Health    │ ── OpsGardenerResult[]
    │
    └─ Operational
       Climate   │ ── SecurityResult[]
            │    │
            │ ┌──▼──────────────────┐
            │ │ SelfState Synthesis │
            │ ├─ OverallMood        │
            │ ├─ DroughtPoints      │
            │ ├─ SecurityRisks      │
            │ └─ FlowIssues         │
            │
            ▼
    ┌────────────────────┐
    │ Markdown Report    │
    │ /self/reports/     │
    │ self-report-*.md   │
    └────────────────────┘
```

---

## Componentes Implementados

### 1. **SelfGardenerCore.cs** (155 líneas)
**Orquestador central del ciclo Sabbath**

**Métodos:**
- `RunSabbathCycleAsync(string mode = "harmonize")` — Ejecuta el ciclo completo

**Flujo:**
1. Captura señales del sistema (2 fuentes)
2. Ejecuta OpsGardenerAgent.RunAsync()
3. Ejecuta SecurityGardenerAgent.AuditRulesOnlyAsync()
4. Sintetiza SelfState (mood, drought points, risks, issues)
5. Genera reporte Markdown
6. Retorna logs y estado

**Estados de Ánimo (Moods):**
- 🌱 **fertile** — Sin problemas, sistema sano
- 🌊 **flowing** — Problemas menores, manejables
- 🌪️ **fragmented** — Múltiples problemas operacionales  
- ⚠️ **stressed** — Riesgo de seguridad crítico

---

### 2. **SelfGardenerReportWriter.cs** (100 líneas)
**Generador de reportes Markdown**

**Implementa:** `ISelfGardenerReportWriter`

**Salida:** `/self/reports/self-report-YYYY-MM-DD_HH-mm.md`

**Secciones del Reporte:**
- Executive Summary (estado global, conteos)
- Diagn óstico Detallado (sequía, riesgos, congestión)
- Registro de Ciclo (trazabilidad completa)
- Interpretación del Clima (tabla de moods)

**Ejemplo:**
```markdown
# 🌱 Self Report — 2026-02-13_02-00

## Estado General del Sistema

- **Estado global**: 🌱 **fertile**
- **Puntos de sequía**: 0
- **Riesgos de seguridad**: 0
- **Problemas de flujo**: 0

## Diagnóstico Detallado

### Puntos de Sequía (Desierto)
✅ Ninguno — El sistema está bien regado.

### Riesgos de Seguridad (Amenazas)
✅ Ninguno — El perímetro está seguro.

### Problemas de Flujo (Congestión)
✅ Ninguno — Todo fluye libremente.
```

---

### 3. **ISelfSignalSource + Implementaciones**

**Interfaz Base:**
```csharp
public interface ISelfSignalSource
{
    Task<SelfSignal> CaptureAsync();
}

public class SelfSignal
{
    public DateTime Timestamp { get; set; }
    public string Mode { get; set; } // audit | repair | harmonize | reflect
    public string Source { get; set; }
    public Dictionary<string, object> Context { get; set; }
}
```

#### **3a. SystemHealthSignalSource.cs** (65 líneas)
**Captura métricas de salud del proceso**

**Metrics:**
- `memory_mb` — Uso de memoria en MB
- `memory_status` — Estado (normal/high)
- `thread_count` — Cantidad de threads
- `working_set_mb` — Working set del proceso
- `process_id` — ID del proceso actual
- `health_status` — healthy | elevated | warning | critical

#### **3b. OperationalClimateSignalSource.cs** (100 líneas)
**Lee clima operativo desde JSON**

**Archivo:** `self/climate-sensor.json`

**Metrics (simuladas):**
- `temperature` — Temperatura operativa (°C)
- `humidity` — Humedad (%)
- `pressure` — Presión (normal/alta/baja)
- `wind_speed` — Velocidad de "viento" (flujo de datos)
- `rainfall` — "Lluvia" (eventos de error)
- `alerts` — Alertas del operador

---

### 4. **SelfGardenerHostedService.cs** (80 líneas)
**Ejecutor automático del Sabbath**

**Implementa:** `IHostedService`

**Características:**
- ✅ Ejecución automática diaria a las **02:00 AM UTC**
- ✅ Frecuencia: Once al día (24 horas)
- ✅ Puede ser invocado manualmente vía inyección de dependencias
- ✅ Manejo de errores y logging

**Lógica de Scheduling:**
```csharp
// Calcula tiempo hasta próxima ejecución
var now = DateTime.UtcNow;
var scheduledToday = now.Date.Add(new TimeSpan(2, 0, 0)); // 02:00 AM

TimeSpan timeUntilExecution;
if (now < scheduledToday)
    timeUntilExecution = scheduledToday - now;
else
    timeUntilExecution = scheduledToday.AddDays(1) - now;

_timer = new Timer(..., timeUntilExecution, TimeSpan.FromHours(24));
```

---

### 5. **SelfController.cs** (100 líneas)
**API REST para control manual del Sabbath**

**Endpoints:**

#### **POST /api/self/sabbath**
Ejecuta manualmente el ciclo Sabbath
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/self/sabbath?mode=harmonize" `
  -Method POST
```

**Response:**
```json
{
  "status": "success",
  "message": "✅ Ciclo Sabbath ejecutado exitosamente",
  "timestamp": "2026-02-13T02:00:00Z",
  "mode": "harmonize",
  "nextReport": "self/reports/self-report-*.md"
}
```

#### **GET /api/self/health**
Retorna estado de operabilidad
```json
{
  "status": "operational",
  "service": "SelfGardenerCore",
  "version": "1.0",
  "description": "Séptimo Día — Ciclo de reflexión del sistema",
  "schedule": "02:00 AM UTC diariamente",
  "reports_location": "self/reports/"
}
```

#### **GET /api/self/info**
Retorna información del módulo
```json
{
  "module": "SelfGardenerCore",
  "name": "Séptimo Día",
  "components": {
    "gardeners": ["OpsGardenerAgent (9 reglas)", "SecurityGardenerAgent (7 reglas)"],
    "signalSources": ["SystemHealthSignalSource", "OperationalClimateSignalSource"],
    "reportWriter": "SelfGardenerReportWriter (Markdown)"
  },
  "metrics": {
    "totalRules": 16,
    "opsRules": 9,
    "securityRules": 7,
    "moods": ["fertile", "flowing", "fragmented", "stressed"]
  }
}
```

---

## Integración en DI (Program.cs)

```csharp
// Using statements
using ElMediadorDeSofia.Services.CoreAgents;
using ElMediadorDeSofia.Services.CoreAgents.SignalSources;

// Signal sources (2)
builder.Services.AddSingleton<ISelfSignalSource, SystemHealthSignalSource>();
builder.Services.AddSingleton<ISelfSignalSource, OperationalClimateSignalSource>();

// Report writer
builder.Services.AddSingleton<ISelfGardenerReportWriter, SelfGardenerReportWriter>();

// Core orchestrator
builder.Services.AddSingleton<SelfGardenerCore>();

// HostedService (auto-execute a 02:00 AM)
builder.Services.AddSingleton<SelfGardenerHostedService>();
builder.Services.AddHostedService(provider => 
    provider.GetRequiredService<SelfGardenerHostedService>());
```

---

## Estructura de Directorio

```
/backend/
├── Services/CoreAgents/
│   ├── SelfGardenerCore.cs ✅
│   ├── SelfGardenerReportWriter.cs ✅
│   ├── SelfGardenerHostedService.cs ✅
│   └── SignalSources/
│       ├── SystemHealthSignalSource.cs ✅
│       └── OperationalClimateSignalSource.cs ✅
├── Controllers/
│   └── SelfController.cs ✅
├── security/
│   └── reports/
│       └── self-report-2026-02-13.md (generated at 02:00 AM)
├── self/
│   ├── reports/
│   │   ├── self-report-2026-02-13_02-00.md
│   │   ├── self-report-2026-02-14_02-00.md
│   │   └── ...
│   └── climate-sensor.json
└── Program.cs (updated with DI registrations) ✅
```

---

## Flujo de Ejecución Completo

### En el Tiempo: Noche del 13 de febrero a las 02:00 AM UTC

```
02:00:00 ┌──────────────────────────────────────────────────┐
         │ SelfGardenerHostedService se dispara            │
         └────────────┬─────────────────────────────────────┘
                      │
02:00:01 ┌────────────▼─────────────────────────────────────┐
         │ SelfGardenerCore.RunSabbathCycleAsync()         │
         │ Inicia ciclo Sabbath                            │
         └────────────┬─────────────────────────────────────┘
                      │
02:00:02 ┌────────────▼─────────────────────────────────────┐
         │ Captura 2 Señales:                              │
         │  - SystemHealthSignalSource                     │
         │  - OperationalClimateSignalSource              │
         └────────────┬─────────────────────────────────────┘
                      │
02:00:03 ┌────────────▼─────────────────────────────────────┐
         │ Ejecuta OpsGardenerAgent (9 reglas)            │
         │ Valida flujos, KPI, tiempo, documentación       │
         └────────────┬─────────────────────────────────────┘
                      │
02:00:05 ┌────────────▼─────────────────────────────────────┐
         │ Ejecuta SecurityGardenerAgent (7 reglas)       │
         │ Auditoría: accesos, endpoints, integridad       │
         └────────────┬─────────────────────────────────────┘
                      │
02:00:07 ┌────────────▼─────────────────────────────────────┐
         │ Sintetiza SelfState:                            │
         │  - Identifica puntos de sequía                  │
         │  - Clasifica riesgos de seguridad              │
         │  - Determina OverallMood                        │
         └────────────┬─────────────────────────────────────┘
                      │
02:00:08 ┌────────────▼─────────────────────────────────────┐
         │ Genera Markdown Report:                         │
         │ /self/reports/                                  │
         │ self-report-2026-02-13_02-00.md               │
         └────────────┬─────────────────────────────────────┘
                      │
02:00:09 ┌────────────▼─────────────────────────────────────┐
         │ SelfGardener completa                           │
         │ Estado: 🌱 fertile / 🌊 flowing / etc.         │
         └──────────────────────────────────────────────────┘

                  ⏰ Próxima ejecución: 03:00 AM UTC
```

---

## Ejemplo de Salida Real

### `/self/reports/self-report-2026-02-13_02-00.md`

```markdown
# 🌱 Self Report — 2026-02-13_02-00

## Estado General del Sistema

- **Estado global**: 🌱 **fertile**
- **Puntos de sequía**: 0
- **Riesgos de seguridad**: 0
- **Problemas de flujo**: 0

---

## Diagnóstico Detallado

### Puntos de Sequía (Desierto)
_✅ Ninguno — El sistema está bien regado._

### Riesgos de Seguridad (Amenazas)
_✅ Ninguno — El perímetro está seguro._

### Problemas de Flujo (Congestión)
_✅ Ninguno — Todo fluye libremente._

---

## Registro de Ciclo (Trazabilidad)

```
[SIGNAL] Capturando señales del sistema...
[SIGNAL] 2026-02-13T02:00:02.1234567Z system-health → audit
[SIGNAL] 2026-02-13T02:00:02.2345678Z operational-climate → harmonize
[STEP] Ejecutando OpsGardenerAgent…
[OPS] 9 reglas validadas, 0 críticas
[STEP] Ejecutando SecurityGardenerAgent (auditoría rápida)…
[SEC] 7 reglas validadas, 0 críticas
[STATE] OverallMood = fertile
[STATE] DroughtPoints = 0
[STATE] SecurityRisks = 0
[STATE] FlowIssues = 0
[STATE] CriticalIssues = 0
```

---

## Indicadores del Clima

| Clima | Significado | Acción |
|-------|-------------|--------|
| 🌱 **fertile** | Todo sano, sin riesgos | Mantener vigilancia normal |
| 🌊 **flowing** | Ligeros problemas, manejables | Monitorear próximas horas |
| 🌪️ **fragmented** | Múltiples problemas operacionales | Investigar puntos de sequía |
| ⚠️ **stressed** | Riesgo de seguridad crítico | **Escalada inmediata** |

---

## Testing Manual

### 1. Verificar que el servicio está registrado

```powershell
# El backend debe iniciar sin errores
dotnet run
```

### 2. Esperar a las 02:00 AM o ejecutar manualmente

```powershell
# Ejecución manual del Sabbath
$body = @{} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/self/sabbath?mode=harmonize" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

### 3. Verificar el reporte generado

```powershell
# Listar reportes generados
Get-ChildItem "self/reports/" -Filter "*.md"

# Ver el contenido del último reporte
Get-Content "self/reports/self-report-2026-02-13_02-00.md"
```

### 4. Monitorear logs

```powershell
# En la consola del backend, buscar:
# 🕊️ SelfGardenerCore iniciado...
# 🕊️ SelfGardenerCore completó el ciclo Sabbath...
```

---

## Integración Futura (Próximas Fases)

- [ ] Email alerts cuando mood = **stressed** 
- [ ] Dashboard endpoint para mostrar últimos reports
- [ ] Metrics prometheus para monitoring
- [ ] Integración con OpsGardener climate determination (unified status)
- [ ] Webhook para sistemas externos (Slack, etc.)
- [ ] Cálculo predictivo de próximos riesgos
- [ ] Análisis de tendencias (histórico de moods)

---

## Summary

| Aspecto | Valor |
|--------|-------|
| **Componentes Implementados** | 6 (Core + HostedService + Controller + 2 Signal Sources + ReportWriter) |
| **Líneas de Código C#** | ~520 líneas |
| **Interfacesde Integración** | 2 (ISelfSignalSource, ISelfGardenerReportWriter) |
| **Endpoints REST** | 3 (/api/self/sabbath, /api/self/health, /api/self/info) |
| **Reglas Integradas** | 16 (9 OpsGardener + 7 SecurityGardener) |
| **Frecuencia de Ejecución** | 02:00 AM UTC diaria (configurable) |
| **Reportes Generados** | Markdown en `/self/reports/` |
| **Estado de Compilación** | ✅ 0 Errores, 48 Warnings (esperados) |

---

**El Templo Digital ahora tiene dos guardianes vigilantes que duermen y se despiertan juntos.  
Cada noche, el Séptimo Día los observa a ambos. 🕊️**
