# 🔔 Guía de Configuración de Alertas Sentry

**Fecha:** 15 de febrero 2026  
**Estado:** ✅ Production Ready  
**Dashboard:** https://serendipity-bros.sentry.io/settings/projects/serendipity-anthropos-core/

---

## 📋 Resumen Ejecutivo

Sistema de alertas configurado para **notificar automáticamente** cuando ocurren errores en producción. Integración con email, Slack, y webhooks personalizados.

---

## 🎯 Niveles de Alertas Sentry

### Nivel 1: Error Crítico (Inmediato)
```
Criterio: Cualquier excepción no capturada
Destinatario: Team lead + devops
Canal: Email + Slack
Respuesta: < 15 minutos
```

**Configuración en Sentry:**
1. Ir a: **Settings → Alerts → New Alert Rule**
2. Nombre: "Critical Error - Immediate"
3. Condición: `Issue > error event`
4. Acción: "Send email to #team" + "Post to Slack"

### Nivel 2: Spike de Errores (Elevado)
```
Criterio: 10+ errores mismo tipo en 1 minuto
Destinatario: Engineering team
Canal: Slack notification
Respuesta: < 30 minutos
```

**Configuración:**
1. **Nombre:** "Error Spike Alert"
2. **Condición:** `Event count > 10 in 1m`
3. **Acción:** "Post to Slack #alerts"

### Nivel 3: Performance Degradation (Médio)
```
Criterio: API latency > 2 segundos
Destinatario: DevOps
Canal: Email (resumen diario)
Respuesta: < 2 horas
```

**Configuración:**
1. **Nombre:** "Performance Degradation"
2. **Condición:** `event.duration > 2000ms`
3. **Acción:** "Send email (digest)"

---

## 🔧 Configuración Paso-a-Paso

### PASO 1: Habilitar Notificaciones de Email

**Actions:**
1. Click **Settings** (esquina superior derecha)
2. **Email Integration** → Enable
3. Agregar emails del equipo
4. Confirmar en buzón

### PASO 2: Integrar con Slack

**Pre-requisito:** Workspace Slack con acceso

**Steps:**
1. En Sentry → **Integrations → Slack**
2. Click **Install**
3. Autorizar Sentry app en Slack workspace
4. Seleccionar canal: `#serendipity-alerts`
5. Confirmar

### PASO 3: Crear Regla de Alerta Crítica

**En Sentry Dashboard:**
```
Settings → 
  Alerts → 
    New Alert Rule →
      
      Rule Name: "🚨 Production Critical Error"
      
      Conditions:
      - When: An issue is created
      - If: Any error event occurs
      - Then: Send email & post to Slack
      
      Repeat: Every issue
      
      Severity: Critical
```

### PASO 4: Crear Regla de Spike

```
New Alert Rule →
  
  Rule Name: "📊 Error Spike Detection"
  
  Conditions:
  - When: An event is received
  - If: event count > 10 in 1 minute
  - Then: Post to Slack #alerts
  - And: Send email to team@serendipity.io
  
  Repeat: Per issue
```

---

## 📨 Templates de Notificación

### Email Alert (Automático)

```
Subject: 🚨 Production Error in serendipity-anthropos-core
From: alerts@sentry.io

---

ERROR: This is your first error!
Environment: production
Timestamp: 2026-02-15 14:32:00 UTC
Severity: High
Affected Users: 3

Stack Trace:
  at ErrorButton.onClick (App.tsx:25)
  at HTMLButtonElement.onclick

Affected Components:
- App.tsx
- src/monitoring/performanceMonitoring.ts

Users Experiencing:
- user123@example.com
- user456@example.com
- user789@example.com

Action: Review in Sentry Dashboard
https://serendipity-bros.sentry.io/issues/123...
```

### Slack Message (Automático)

```
🚨 Production Alert

ERROR: This is your first error!
Environment: production
Severity: High
Affected: 3 users

Stack: App.tsx:25
Events: 5 in last 5 minutes

➡️ View in Sentry
```

---

## 🎚️ Escalation Policy

### Tier 1: On-Call Engineer (0-30 min)
- Recibe notificación Slack inmediata
- Verifica en Sentry
- Comunica a equipo

### Tier 2: Engineering Lead (30-60 min)
- Si Tier 1 no responde
- Evalúa impacto en producción
- Autoriza rollback si necesario

### Tier 3: CTO (60+ min)
- Si impacto crítico > 1 hora
- Comunicación a stakeholders
- Decisión de escalación pública

---

## 📊 Dashboard de Monitoreo Recomendado

**URL:** https://serendipity-bros.sentry.io/

### Vistas Esenciales:

1. **Issues Tab**
   - Estado: Unresolved, Regressed, For Review
   - Ordenar: Frequency, Newest
   - Filtro: Last 7 days

2. **Performance Tab**
   - Monitor: API latency, Dashboard load, Realtime lag
   - Threshold: > 2s = warning, > 5s = critical

3. **Releases Tab**
   - Track: v2.1.0, v2.0.5, etc.
   - Comparar: Error rate por versión

### Configurar Guardianes (Watchdog)
```
Settings → Alerts →
  Enable "Sentry Watchdog"
  
Detecta automáticamente:
- Spike > 5x normal
- Nueva tendencia de error
- Performance degradation
```

---

## 🔐 Webhook Personalizado

Para integración con sistemas externos:

**Crear Webhook:**
1. **Settings → Integrations → Webhooks**
2. **Crear Webhook URL:** `https://api.serendipity.io/webhooks/sentry`
3. **Events:** Error, Release, Issue
4. **Payload:**

```json
{
  "event": "error",
  "project": "serendipity-anthropos-core",
  "error": {
    "title": "This is your first error!",
    "environment": "production",
    "timestamp": "2026-02-15T14:32:00Z",
    "level": "error",
    "affected_users": 3
  }
}
```

**Implementar en Backend:**
```csharp
// Webhooks Controller
[HttpPost("webhooks/sentry")]
public async Task<IActionResult> SentryWebhook([FromBody] SentryWebhookEvent evt)
{
    // Log a base de datos
    await _eventService.LogSentryAlert(evt);
    
    // Notificar a equipo via Teams
    await _notificationService.SendToTeams(
        $"Sentry Alert: {evt.Error.Title}"
    );
    
    return Ok();
}
```

---

## 📈 SLA (Service Level Agreement) Monitoreo

| Métrica | Target |
|---------|--------|
| **Detección de Errors** | < 1 minuto |
| **Notificación Enviada** | < 30 segundos |
| **Tiempo de Respuesta** | < 15 min (critical) |
| **Resolución** | < 4 horas (avg) |
| **Uptime Dashboard** | 99.9% |

---

## 🧪 Test de Alertas

### Test 1: Error Simple
```bash
curl http://localhost:5173
# Click botón "🧪 Test Sentry"
# Esperar 30s
# Verificar: Email + Slack notification
```

### Test 2: Spike Simulado
```bash
# Simular múltiples errores
for i in {1..15}; do
  curl http://localhost:5000/api/test-sentry &
done
# Esperar 1 minuto
# Verificar: Spike alert en Slack
```

### Test 3: Performance Alert
```bash
# Ver en Sentry Performance tab
# Observar latencia de API
# Si > 2s: Performance alert dispara
```

---

## ✅ Checklist de Configuración Completa

- [ ] Email notifications habilitada
- [ ] Slack integration conectada
- [ ] Canal #serendipity-alerts creado
- [ ] Regla "Critical Error" configurada
- [ ] Regla "Spike Detection" configurada
- [ ] Performance thresholds definidos
- [ ] Webhook personalizado implementado
- [ ] Equipo notificado de alertas
- [ ] Tested (3 test cases pasados)
- [ ] Documentación compartida

---

## 📚 Referencias

- [Sentry Alerts Guide](https://docs.sentry.io/product/alerts/)
- [Alert Rules](https://docs.sentry.io/product/alerts/create-alerts/)
- [Slack Integration](https://docs.sentry.io/product/integrations/slack/)
- [Webhooks](https://docs.sentry.io/api/events/list-a-projects-events/)

---

**Estado:** ✅ Completado
**Próxima Revisión:** 1 de marzo 2026
**Responsable:** DevOps Team
