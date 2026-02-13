# 🌱 OpsGardener Backend Integration

## Visión General

El **OpsGardener Agent** backend (.NET) trabaja en paralelo con el agente TypeScript frontend para proporcionar vigilancia operativa de dos capas:

- **Frontend TypeScript**: Monitorea flujos de código, compilación, reglas de armonía, MQTT, lenguaje
- **Backend .NET**: Monitorea base de datos, servicios, eventos operativos, auditoría de datos

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    OpsGardenerAgent (.NET)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  IOpsRule Interface                                  │  │
│  │  ├─ Validate() → OpsRuleResult                      │  │
│  │  └─ AutoFix() → OpsFixResult                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  IOpsTask Interface                                 │  │
│  │  ├─ ExecuteAsync() → OpsTaskResult                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  OpsGardenerAgent.RunAsync()                         │  │
│  │  ├─ Valida todas las reglas                         │  │
│  │  ├─ Auto-repara si falla                           │  │
│  │  ├─ Ejecuta tareas según modo                       │  │
│  │  └─ Genera reporte con IOpsReportWriter             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Webhooks para Eventos Externos                      │  │
│  │  ├─ HandleUnusualEnergyAsync()  (MQTT)              │  │
│  │  └─ HandleQrEventAsync()        (QR Scanner)        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoints

### Auditoría

```http
POST /api/ops/audit
Content-Type: application/json

{}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Auditoría completada",
  "resultsCount": 7,
  "timestamp": "2026-02-13T02:50:00Z"
}
```

El audit se ejecuta en modo `OpsMode.Audit` por defecto, validando todas las reglas sin auto-reparaciones.

### Evento de Energía Inusual

```http
POST /api/ops/energy-event
Content-Type: application/json

{
  "topic": "serendipity/sensors/vibration",
  "payload": "{\"value\": 8.5, \"unit\": \"hz\"}",
  "timestamp": "2026-02-13T02:50:15Z"
}
```

Se dispara cuando un sensor detecta "Energía Inusual" (equipamiento funcionando fuera de horarios, vibraciones anormales, etc).

### Evento de QR Scanner

```http
POST /api/ops/qr-event
Content-Type: application/json

{
  "jobCardId": "JOB-2026-001",
  "timestamp": "2026-02-13T02:50:30Z"
}
```

Se registra cada vez que un Job Card es escaneado en el taller.

### Status

```http
GET /api/ops/status
```

## Configuración

En `Program.cs`:

```csharp
// OpsGardener configuration
builder.Services.AddSingleton(new OpsGardenerConfig 
{ 
    Mode = OpsMode.Audit,      // Audit | Repair | Harmonize | Full
    AutoFix = false              // true para auto-reparaciones
});

builder.Services.AddScoped<IOpsReportWriter, ConsoleOpsReportWriter>();
builder.Services.AddScoped<OpsGardenerAgent>();
```

## Modes

- **Audit**: Solo valida reglas, sin cambios
- **Repair**: Valida y auto-repara fallos detectados
- **Harmonize**: Auditoría + armonización de datos y lenguaje
- **Full**: Todas las tareas habilitadas

## Integración con Base de Datos

Cuando implementes las reglas específicas, el OpsGardener consultará:

```csharp
// Conectar a Supabase mismo que TypeScript
var supabase = createClient(supabaseUrl, supabaseKey);

// Validaciones posibles
- SELECT * FROM operational_processes WHERE responsible IS NULL  // FLOW-001
- SELECT * FROM iot_alerts WHERE acknowledged = false           // MQTT-001
- SELECT * FROM language_mappings WHERE verified = false        // LANG-001
```

## Próximos Pasos

1. **Implementar reglas específicas:**
   - `DatabaseIntegrityRule` - Validar integridad de datos
   - `ServiceHealthRule` - Health check de servicios
   - `ApiResponseTimeRule` - Monitoreo de latencia

2. **Implementar tareas:**
   - `GenerateOperationalReportTask` - Generar reportes diarios
   - `BackupDatabaseTask` - Backup automático
   - `OptimizeQueriesTask` - Optimización de queries lentas

3. **Integración MQTT:**
   - Suscribirse a topics de eventos operativos
   - Procesar alertas en tiempo real
   - Triggerear auto-fixes ante anomalías

4. **Dashboard Integration:**
   - Exponer climate status en endpoint
   - Mostrar últimos eventos en UI
   - Permitir triggering manual de auditorías

## Logging

El agente usa `ILogger<OpsGardenerAgent>` para logging estructurado:

```
🌱 OpsGardener iniciado en modo Audit (AutoFix: False)
Regla FLOW-001 → ✅ OK: Todos los flujos tienen un guardián asignado.
Regla MQTT-001 → ❌ FAIL: Gateway no conectado
...
✨ OpsGardener completado en 245ms
```

---

**El Jardinero vigila. El sistema florece.** 🌾

