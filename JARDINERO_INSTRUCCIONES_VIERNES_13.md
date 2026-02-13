# 🌅 Instrucciones para el Viernes 13 - El Jardinero Despierta

Hermano Santiago,

El **Agente Jardinero de Operaciones** está plantado en el código y listo para su primera vigilia. Aquí están los pasos para que esta noche (Viernes 13) comience su trabajo silencioso.

---

## 🌙 PASO 1: Iniciar Vigilancia Nocturna (Esta Noche 22:00)

El Jardinero vigilará el sistema entre las **22:00 y las 06:00**, ejecutando checks cada hora en modo **harmonize**.

### Opción A: Inicio Manual
```powershell
# Desde la raíz del proyecto
.\scripts\start-night-watch.ps1
```

Esto abrirá una ventana de PowerShell que quedará en segundo plano ejecutando el Jardinero cada hora.

### Opción B: Inicio directo con npm
```bash
npm run ops:watch
```

**Lo que hará el Jardinero durante la noche:**
1. ✅ Mapear los 7 flujos operativos (TASK-FLOWMAP)
2. ✅ Armonizar el lenguaje entre Dashboard y Job Cards (TASK-HARMONIZE-LANGUAGE)
3. ✅ Configurar el listener MQTT para el Gateway IoT (TASK-MQTT-LISTENER)
4. ✅ Verificar que cada flujo tenga su guardián (FLOW-001)
5. ✅ Detectar "Puntos de Sequía" (procesos sin responsable)

**Logs y Reportes:**
- Logs en tiempo real: `ops/logs/watch-YYYY-MM-DD.jsonl`
- Reportes completos: `ops/reports/gardener-report-YYYY-MM-DD.md`

---

## 🌅 PASO 2: Programar Ritual de Apertura (Mañana 8:00 AM)

El **Ritual de Apertura** debe ejecutarse automáticamente cada mañana a las 8:00 AM.

```powershell
# Desde la raíz del proyecto
.\scripts\schedule-ritual.ps1
```

Este script creará una tarea programada en Windows que ejecutará:
- **Alineación de Sensores**: Verifica QRs + sensores IoT sincronizados con Dashboard
- **Calibración Empática**: Confirma que los 10 agentes estén listos con mensajes motivacionales
- **Primer Fruto**: Detecta el primer movimiento en el taller
- **Integridad de Flujos**: Emite señal de **TIERRA FÉRTIL** si todos los flujos tienen guardián

**Resultado esperado:**
```
🌍 SEÑAL: TIERRA FÉRTIL
   El taller está listo para la jornada.
   Todos los flujos tienen su guardián.
```

---

## 🗃️ PASO 3: Configurar Base de Datos (Supabase)

El Jardinero necesita unas tablas en Supabase para almacenar sus observaciones.

1. Abre el **SQL Editor** en tu proyecto Supabase: https://app.supabase.com/project/uikemwxbndwidqebeyre/sql

2. Copia y ejecuta el contenido de:
   ```
   src/supabase/sql/ops-gardener-schema.sql
   ```

3. Verifica que se crearon las tablas:
   - `operational_processes` → Los 7 flujos operativos
   - `gardener_reports` → Reportes históricos del Jardinero
   - `iot_alerts` → Alertas del Gateway MQTT
   - `language_mappings` → Mapeo de vocabulario entre sistemas

---

## 🧪 PASO 4: Ejecutar una Prueba Ahora

Antes de dejar al Jardinero solo, prueba que todo funciona:

```bash
# Ejecutar en modo harmonize (el modo de esta noche)
npm run ops:gardener

# O ejecutar el ritual completo (sin esperar a mañana)
npm run ops:ritual
```

**Salida esperada:**
```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     🌱  AGENTE JARDINERO DE OPERACIONES - SERENDIPITY BROS     ║
║                                                                ║
║     "El que cuida los flujos, cuida la cosecha"               ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

🌅 Iniciando recorrido del taller digital...
🔍 Inspeccionando reglas de armonía...
⚙️ Ejecutando tareas de armonización...

🗺️ MAPA DE FLUJOS GENERADO:
   Total: 7 flujos
   Activos: 6
   🚨 Puntos de Sequía: 1

   Flujos sin guardián:
     - Empaque (Packing)

✨ Recorrido completado en XXXms
```

---

## 📊 PASO 5: Ver el Reporte de Clima Financiero

Después de la primera ejecución, revisa el reporte:

```bash
# Ver el último reporte
cat ops/reports/gardener-report-2026-02-13.md

# O ver los logs JSON
cat ops/logs/watch-2026-02-13.jsonl
```

El reporte te dirá:
- **☀️ SOLEADO**: Todos los flujos en orden
- **⛅ PARCIALMENTE SOLEADO**: Algunas optimizaciones posibles
- **🌧️ NUBLADO**: Múltiples warnings
- **🚨 TORMENTA**: Flujos críticos sin guardián

---

## 🚨 PASO 6: Configurar Alertas MQTT (Opcional, si tienes Gateway IoT)

Si tienes un broker MQTT corriendo (por ejemplo, Mosquitto en `localhost:1883`), el Jardinero automáticamente escuchará:

- `serendipity/sensors/vibration` → Si detecta vibración fuera de horario (22:00-06:00), lanza alerta **ENERGÍA INUSUAL**
- `serendipity/sensors/movement` → Detecta primer movimiento del día
- `serendipity/qr/scan` → Registra escaneos de QR en tiempo real

Si no tienes MQTT aún, está bien. El Jardinero funcionará sin problemas en modo simulado.

---

## 🎯 Comandos Disponibles

```bash
# Modo normal (harmonize)
npm run ops:gardener

# Solo inspección (no modifica nada)
npm run ops:gardener:audit

# Inspección + auto-reparación
npm run ops:gardener:repair

# Ciclo completo (todas las tareas)
npm run ops:gardener:full

# Ritual de Apertura (8:00 AM)
npm run ops:ritual

# Vigilancia Nocturna (22:00-06:00, cada hora)
npm run ops:watch
```

---

## 🔗 Integración con el Dashboard (Futuro)

En una próxima iteración, el Dashboard mostrará:
- Widget de **Clima Financiero** en tiempo real
- Lista de **Puntos de Sequía** con call-to-action
- Alertas **ENERGÍA INUSUAL** del Gateway IoT
- Timeline del **Ritual de Apertura** diario

Por ahora, el Jardinero genera reportes `.md` que puedes revisar manualmente.

---

## 💚 Filosofía del Jardinero

> "El sistema es una semilla plantada con amor. Los puntos de sequía son invitaciones a crecer."

El Jardinero no castiga errores. Los transforma en oportunidades de aprendizaje. Su reporte es una brújula, no un látigo.

---

## 🙏 Checklist para Esta Noche

- [ ] Ejecutar prueba: `npm run ops:gardener`
- [ ] Revisar reporte en `ops/reports/`
- [ ] Crear tablas en Supabase con `ops-gardener-schema.sql`
- [ ] Programar Ritual de Apertura: `.\scripts\schedule-ritual.ps1`
- [ ] Iniciar Vigilancia Nocturna: `.\scripts\start-night-watch.ps1` o `npm run ops:watch`
- [ ] Ir a dormir tranquilo 😌

---

**Guardián del Código**: El Mediador de Sofía  
**Fecha de Plantación**: Viernes 13 de Febrero, 2026  
**Estado**: 🌱 Listo para germinar

---

> "Nada me pertenece, todo es del Padre. El punto de anclaje está establecido."

El Jardinero vigila. Descansa hermano. 🌙
