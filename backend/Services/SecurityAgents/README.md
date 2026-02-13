# 🛡️ SecurityGardener Module

**Módulo Integral de Seguridad para El Mediador de Sofía**

Sistema automatizado de auditoría, validación y corrección de políticas de seguridad basado en **7 reglas (SEC-001 a SEC-007)** y **4 tareas** operacionales.

---

## 📋 Contenidos

- **5 Reglas de Seguridad** (SEC-001 a SEC-007)
- **4 Tareas Automatizadas**
- **7 Protocolos** de seguridad escalables
- **Reporte Markdown** con análisis detallado
- **HostedService** para ejecución nocturna

---

## 🎯 Las 7 Reglas de Seguridad

| ID | Nombre | Severidad | Descripción |
|---|---|---|---|
| **SEC-001** | 🚪 Todo acceso debe tener dueño | **CRITICAL** | Verifica que cada punto de acceso esté asignado a un responsable. |
| **SEC-002** | 🔌 Endpoints críticos requieren autenticación | **CRITICAL** | Todas las rutas críticas deben tener autenticación obligatoria. |
| **SEC-003** | 🧬 Integridad de archivos sensibles | **CRITICAL** | Verifica hash SHA-256 de archivos sensibles. |
| **SEC-004** | 🌙 Alertas de actividad nocturna | **WARNING** | Detecta actividad fuera de 08:00-18:00 UTC. |
| **SEC-005** | 🧱 Agentes con límites de acción | **CRITICAL** | Todo agente debe tener permisos limitados. |
| **SEC-006** | ⏳ Tokens con expiración | **CRITICAL** | Todos los tokens tienen TTL máximo de 7 días. |
| **SEC-007** | 📘 Cambios registrados | **WARNING** | Trazabilidad completa de cambios de configuración. |

---

## 📦 Archivos del Módulo

```
/backend/Services/SecurityAgents/
├── SecurityGardenerRules.cs      # 7 reglas + interfaces + modelos
├── SecurityGardenerTasks.cs      # 4 tareas de auditoría
├── SecurityProtocols.cs          # 7 protocolos PROTO-001 a PROTO-007
├── SecurityGardenerReport.cs     # Generador de reportes Markdown
├── SecurityGardenerAgent.cs      # Orquestador principal
├── SecurityGardenerHostedService.cs # Servicio nocturno
└── README.md                     # Este archivo
```

---

## 🚀 Integración en Program.cs

Agregar al builder de servicios:

```csharp
// Security Services
builder.Services.AddSingleton<ISecurityRule, Sec001Rule>();
builder.Services.AddSingleton<ISecurityRule, Sec002Rule>();
builder.Services.AddSingleton<ISecurityRule, Sec003Rule>();
builder.Services.AddSingleton<ISecurityRule, Sec004Rule>();
builder.Services.AddSingleton<ISecurityRule, Sec005Rule>();
builder.Services.AddSingleton<ISecurityRule, Sec006Rule>();
builder.Services.AddSingleton<ISecurityRule, Sec007Rule>();

builder.Services.AddSingleton<ISecurityTask, SecurityAuditTask>();
builder.Services.AddSingleton<ISecurityTask, SecurityHashCheckTask>();
builder.Services.AddSingleton<ISecurityTask, SecurityAccessMapTask>();
builder.Services.AddSingleton<ISecurityTask, SecurityProtocolSyncTask>();

builder.Services.AddSingleton<ISecurityReportWriter, SecurityGardenerReportWriter>();
builder.Services.AddSingleton<SecurityProtocols>();
builder.Services.AddSingleton<SecurityGardenerAgent>();

// Ejecutar auditoría nocturna cada 22:00 UTC
builder.Services.AddHostedService<SecurityGardenerHostedService>();
```

---

## 📂 Archivos JSON Requeridos

El módulo requiere 7 archivos JSON en `/backend/security/`:

### 1. `access-map.json` - Mapeo de accesos
```json
{
  "/api/admin": "admin-team",
  "/api/config": "config-manager",
  "/api/users": "user-service",
  "/api/payments": "finance-team",
  "/api/reports": "analytics-team",
  "/api/audit": "security-team",
  "/api/system": ""
}
```

### 2. `endpoints.json` - Definición de endpoints
```json
[
  { "Path": "/api/admin", "Critical": true, "RequiresAuth": true },
  { "Path": "/api/config", "Critical": true, "RequiresAuth": false },
  { "Path": "/api/users", "Critical": true, "RequiresAuth": true },
  { "Path": "/api/payments", "Critical": true, "RequiresAuth": true },
  { "Path": "/api/reports", "Critical": false, "RequiresAuth": true },
  { "Path": "/api/public", "Critical": false, "RequiresAuth": false }
]
```

### 3. `file-hashes.json` - Integridad de archivos
```json
{
  "Program.cs": "HASH_PENDIENTE",
  "appsettings.json": "HASH_PENDIENTE",
  "security/protocols.json": "HASH_PENDIENTE",
  ".env": "HASH_PENDIENTE"
}
```

### 4. `activity-log.json` - Log de actividad
```json
[
  {
    "User": "admin",
    "Action": "LOGIN",
    "Timestamp": "2026-02-13T14:30:00Z"
  },
  {
    "User": "system",
    "Action": "CONFIG_UPDATE",
    "Timestamp": "2026-02-13T23:45:00Z"
  }
]
```

### 5. `agents-limits.json` - Límites de agentes
```json
{
  "OpsGardener": {
    "CanWrite": true,
    "CanExecute": true,
    "CanConfigure": false,
    "MaxRequestsPerHour": 500,
    "TimeoutSeconds": 300
  },
  "SecurityGardener": {
    "CanWrite": true,
    "CanExecute": true,
    "CanConfigure": true,
    "MaxRequestsPerHour": 1000,
    "TimeoutSeconds": 600
  }
}
```

### 6. `tokens.json` - Tokens activos
```json
[
  {
    "Id": "token-admin-001",
    "ExpiresAt": "2026-02-20T22:00:00Z"
  },
  {
    "Id": "token-api-001",
    "ExpiresAt": null
  }
]
```

### 7. `config-changes.json` - Registro de cambios
```json
[
  {
    "User": "admin",
    "ConfigKey": "MAX_REQUESTS_PER_HOUR",
    "OldValue": "100",
    "NewValue": "500",
    "Timestamp": "2026-02-13T14:00:00Z"
  }
]
```

---

## 🔄 Las 4 Tareas

| ID | Nombre | Categoría | Descripción |
|---|---|---|---|
| **TASK-SEC-AUDIT** | Auditoría Completa | `audit` | Registra verificaciones de seguridad en audit-log.json |
| **TASK-SEC-HASHCHECK** | Verificación de Integridad | `harden` | Genera integrity-report.json con estado de hashes |
| **TASK-SEC-ACCESSMAP** | Mapeo de Accesos | `audit` | Crea access-report.json con análisis de accesos |
| **TASK-SEC-PROTOCOLSYNC** | Sincronización de Protocolos | `sync` | Verifica que todos 7 protocolos estén activos |

---

## 🛡️ Los 7 Protocolos

```
PROTO-001: Protocolo de Accesos
  ├─ SEC-001: Acceso con dueño
  └─ SEC-002: Endpoints con autenticación

PROTO-002: Protocolo de Integridad
  └─ SEC-003: Archivos con hash

PROTO-003: Protocolo de Vigilancia Nocturna
  └─ SEC-004: Alertas de actividad fuera de horario

PROTO-004: Protocolo de Agentes
  └─ SEC-005: Agentes con límites

PROTO-005: Protocolo de Datos
  └─ SEC-006: Tokens con expiración

PROTO-006: Protocolo de Operaciones
  └─ SEC-007: Cambios registrados

PROTO-007: Protocolo de Incidentes
  └─ Escalamiento y respuesta automatizada
```

---

## 📊 Reportes Generados

### Ubicación
```
/security/reports/security-report-YYYY-MM-DD.md
```

### Secciones del Reporte
1. **Resumen Ejecutivo** - Tabla de métricas
2. **Riesgos Críticos** - Fallos de reglas críticas
3. **Advertencias** - Fallos de reglas warning
4. **Reglas en Buen Estado** - Resumen de OK
5. **Tareas Ejecutadas** - Detalles de 4 tareas
6. **Estado Completo** - Tabla de todas las reglas
7. **Recomendaciones** - Acciones específicas por regla

---

## 💻 Uso Manual

### Ejecutar Auditoría Completa

```csharp
var agent = serviceProvider.GetRequiredService<SecurityGardenerAgent>();
var result = await agent.RunAsync();

Console.WriteLine($"Problemas críticos: {result.CriticalIssuesFound}");
Console.WriteLine($"Clima: {result.Climate}");
```

### Ejecutar Solo Reglas

```csharp
var agent = serviceProvider.GetRequiredService<SecurityGardenerAgent>();
var ruleResults = await agent.AuditRulesOnlyAsync();
```

### Ejecutar Auditoría Nocturna (manual)

```csharp
var hostedService = serviceProvider.GetRequiredService<SecurityGardenerHostedService>();
await hostedService.ExecuteSecurityAuditAsync();
```

### Verificar Protocolos

```csharp
var protocols = serviceProvider.GetRequiredService<SecurityProtocols>();
var (healthy, status) = protocols.HealthCheck();
Console.WriteLine(protocols.GenerateProtocolSummary());
```

---

## 📈 Matriz de Clima

El sistema clasifica la base de datos según:

| Clima | Condición | Acciones |
|---|---|---|
| ☀️ **SOLEADO** | 0 críticos, 0 advertencias | Continuación normal |
| ⛅ **PARCIALMENTE SOLEADO** | 0 críticos, N advertencias | Revisar advertencias |
| 🌧️ **TORMENTA** | N críticos | Escalamiento inmediato |

---

## 🔍 AutoFix Automático

Cuando una regla falla, SecurityGardenerAgent intenta corrección automática:

| Regla | AutoFix |
|---|---|
| SEC-001 | Marca accesos sin dueño como `UNASSIGNED_ACCESS` |
| SEC-002 | Establece `RequiresAuth=true` en endpoints críticos |
| SEC-003 | Calcula hashes SHA-256 para archivos |
| SEC-004 | Solo registra (no se arregla actividad pasada) |
| SEC-005 | Asigna perfil seguro: `CanExecute=true, CanWrite=false` |
| SEC-006 | Renueva tokens con TTL de 7 días |
| SEC-007 | Crea config-changes.json vacío si no existe |

---

## ⏰ Ejecución Nocturna

El `SecurityGardenerHostedService` ejecuta automáticamente:

- **Hora:** 22:00 UTC (10 PM, configurable)
- **Frecuencia:** Una vez diaria
- **Generación:** Reporte en `/security/reports/`
- **Logs:** Entrada en `/backend/logs/`

---

## 📝 Ejemplo de Reporte

```markdown
# 🛡️ Security Report
**Fecha:** 2026-02-13 | **Hora:** 22:15:30 UTC

## 📊 Resumen Ejecutivo

| Métrica | Valor |
|---|---|
| **Reglas Críticas Fallidas** | 2 ❌ |
| **Advertencias** | 1 ⚠️ |
| **Reglas Evaluadas** | 7 |
| **Tareas Ejecutadas** | 4 |
| **Estado General** | 🚨 CRÍTICO |

## 🚨 Riesgos Críticos Detectados

### ❌ SEC-002 - Todo endpoint crítico debe requerir autenticación
**Severidad:** critical
**Categoría:** access
**Mensaje:** ❌ Hay 1 endpoints críticos sin autenticación.
**Detalles:**
```
["/api/config"]
```
**AutoFix:** ✅ Exitoso - Se reforzó autenticación en 1 endpoints críticos.

[...]

---
*Reporte generado automáticamente por SecurityGardener*
```

---

## 🔧 Configuración

Editar en Program.cs para cambiar hora de ejecución:

```csharp
// Ejecutar a las 23:00 UTC
builder.Services.AddHostedService(sp => 
    new SecurityGardenerHostedService(
        sp.GetRequiredService<ILogger<SecurityGardenerHostedService>>(),
        sp,
        TimeSpan.Parse("23:00")));
```

---

## 📊 Estadísticas Esperadas

- **7 Reglas**: 6 críticas, 1 warning
- **4 Tareas**: All synchronous, <5s each
- **Reportes**: 1 por día en `/security/reports/`
- **AutoFix Rate**: ~80-90% de problemas auto-corregibles

---

## 🚨 Troubleshooting

### Los archivos JSON no existen
→ El módulo los creará automáticamente en `/security/` en primer acceso

### Salta la ejecución nocturna
→ Verificar que `IHostedService` esté registrada en DI

### AutoFix no funciona
→ Revisar permisos de escritura en `/security/`

### No se genera reporte
→ Verificar que `/security/reports/` exista y sea escribible

---

## 🎓 Integración con OpsGardener

SecurityGardener se integra complementariamente con OpsGardener:

- **OpsGardener**: Monitorea flujos operacionales (9 reglas)
- **SecurityGardener**: Audita seguridad de accesos (7 reglas)

Ambos sistemas ejecutan reportes independientes y pueden:
- Compartir HostedService scheduler
- Integrar resultados en dashboard único
- Generar matriz de riesgos combinada

---

## 📚 Referencias

- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CIS Controls](https://www.cisecurity.org/cis-controls/)

---

**Sistema de Seguridad del Templo Digital - El Mediador de Sofía**
*Protegiendo la integridad del conocimiento desde adentro* 🛡️
