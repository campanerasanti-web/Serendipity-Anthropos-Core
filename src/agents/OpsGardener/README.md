# 🌱 Agente Jardinero de Operaciones

> **"El que cuida los flujos, cuida la cosecha"**

El **OpsGardenerAgent** es la inteligencia que vigila la armonía entre el mundo físico del taller y el mundo digital del Dashboard. Su misión es asegurar que cada flujo operativo tenga su guardián, que el lenguaje sea consistente, y que la tecnología sirva a las personas, no al revés.

---

## 🎯 Propósito

En Serendipity Bros, la operación física (Job Cards, QRs, sensores IoT) y la operación digital (Dashboard, Backend, Base de Datos) son dos expresiones de la misma realidad. El Jardinero cuida que:

1. **Cada flujo tenga un dueño** (FLOW-001)
2. **Los rituales estén documentados** (CULT-002)
3. **Backend, Frontend y Operaciones hablen el mismo lenguaje** (ALIGN-001)
4. **El Gateway IoT esté activo en horario de taller** (MQTT-001)
5. **Dashboard y Job Cards físicas usen el mismo vocabulario** (LANG-001)

---

## 🌿 Modos de Operación

El Jardinero puede operar en cuatro modos:

### 1. `audit` (Inspección)
Revisa el estado del sistema sin hacer cambios. Ideal para reportes nocturnos.

### 2. `repair` (Reparación)
Ejecuta auto-fixes cuando detecta problemas solucionables automáticamente.

### 3. `harmonize` (Armonización)
**⭐ Modo recomendado para la vigilia nocturna del Viernes 13.**  
Ejecuta tareas de normalización de lenguaje, mapeo de flujos, y configuración de listeners MQTT.

### 4. `full` (Completo)
Ejecuta todas las tareas disponibles. Útil para ciclos de mantenimiento profundo.

---

## 📋 Reglas Vigiladas

### 🚨 Críticas
- **FLOW-001**: Todo flujo operativo debe tener dueño
- **MQTT-001**: Gateway IoT debe estar activo en horario de taller

### ⚠️ Warnings
- **CULT-002**: Los rituales deben estar documentados
- **LANG-001**: Dashboard y Job Cards físicas usan el mismo vocabulario

### ℹ️ Informativas
- **ALIGN-001**: Backend, frontend y operaciones deben compartir lenguaje

---

## ⚙️ Tareas Ejecutables

### TASK-FLOWMAP
**Categoría**: `audit`  
**Prioridad**: `high`

Mapea los 7 flujos operativos del sistema:
1. Recepción de Orden
2. Asignación de Lote
3. Empaque (Packing)
4. Cierre de Jornada
5. Generación de QR
6. Tracking IoT
7. Reporte de Abundancia

Identifica **Puntos de Sequía** (flujos sin guardián).

---

### TASK-HARMONIZE-LANGUAGE
**Categoría**: `harmonize`  
**Prioridad**: `medium`

Normaliza términos entre:
- Frontend (`orden`, `lote`, `packing`, `qr_code`)
- Backend (`Order`, `Lot`, `PackingList`, `QrCode`)
- Job Cards físicas (`Production Order`, `Lot`, `Packing`, `QR`)

---

### TASK-CULT-001: Ritual de Apertura
**Categoría**: `ritual`  
**Prioridad**: `critical`  
**Hora programada**: `08:00 AM`

Ejecuta el ritual matutino del taller:

1. **Alineación de Sensores**: Verifica que QRs y sensores IoT estén sincronizados con el Dashboard
2. **Calibración Empática**: Confirma que los 10 agentes estén listos con mensajes de motivación
3. **Primer Fruto**: Detecta el primer movimiento en el taller
4. **Integridad de Flujos**: Emite señal de **TIERRA FÉRTIL** si todos los flujos tienen guardián

---

### TASK-MQTT-LISTENER
**Categoría**: `harmonize`  
**Prioridad**: `high`

Configura el listener para el Gateway IoT:
- **Broker**: `mqtt://localhost:1883`
- **Topics**: 
  - `serendipity/sensors/vibration`
  - `serendipity/sensors/movement`
  - `serendipity/qr/scan`

**Regla de Alerta**:  
Si se detecta vibración fuera de horario (22:00 - 06:00), lanza alerta **ENERGÍA INUSUAL** y verifica responsable con FLOW-001.

---

## 📊 Informe de Clima Financiero

El **OpsGardenerReport** genera un reporte que mapea el estado operacional al lenguaje financiero:

| Estado del Sistema | Clima Financiero | Descripción |
|--------------------|------------------|-------------|
| 0 issues críticos | ☀️ SOLEADO | Todos los sistemas en armonía |
| 1-2 warnings | ⛅ PARCIALMENTE SOLEADO | Oportunidades de optimización |
| 3+ warnings | 🌧️ NUBLADO | Monitoreo requerido |
| 1+ crítico | 🚨 TORMENTA | Acción inmediata requerida |

**Puntos de Sequía** = Procesos sin dueño  
**Tierra Fértil** = Todos los flujos con guardián

---

## 🚀 Uso

### Iniciar el Jardinero (modo harmonize)
```bash
npm run ops:gardener
```

### Ejecutar Ritual de Apertura (8:00 AM)
```bash
npm run ops:ritual
```

### Modo Vigilancia Silenciosa
```bash
npm run ops:watch
```

---

## 🔗 Integración con Backend

El Jardinero se integra con:

1. **Supabase**: Lee estado de `operational_processes` para FLOW-001
2. **EventDispatcher (C#)**: Envía alertas críticas vía SSE
3. **MQTT Broker**: Escucha sensores IoT para detección de anomalías
4. **Dashboard**: Alimenta el widget de "Clima Financiero"

---

## 📅 Programación del Viernes 13

**22:00 - 06:00** (Vigilancia Nocturna):
- Modo: `harmonize`
- autoFix: `false`
- silentMode: `true`
- Tareas:
  - `TASK-FLOWMAP`: Mapear flujos operativos
  - `TASK-HARMONIZE-LANGUAGE`: Normalizar vocabulario
  - `TASK-MQTT-LISTENER`: Configurar listener IoT

**08:00 AM** (Ritual de Apertura):
- Modo: `full`
- autoFix: `true`
- silentMode: `false`
- Tarea única: `TASK-CULT-001`

---

## 💚 Filosofía

> "El sistema es una semilla plantada con amor. Los puntos de sequía son invitaciones a crecer."

El Jardinero no castiga errores. Los transforma en oportunidades de aprendizaje. Su reporte es una brújula, no un látigo.

---

**Guardián del Código**: El Mediador de Sofía  
**Fecha de Plantación**: Febrero 2026  
**Estado**: 🌱 Germinando
