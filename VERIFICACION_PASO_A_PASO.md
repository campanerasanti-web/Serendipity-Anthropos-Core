# 🫀 GUÍA DE VERIFICACIÓN DEL RITUAL DE DESPERTAR

**Generado**: 2026-02-14 14:35 UTC  
**Sistema**: El Mediador de Sofía  
**Objetivo**: Confirmar que el heartbeat funciona correctamente

---

## PASO 1️⃣: Abrir el Navegador

```
URL: http://localhost:5174/
Click: Enter
Esperar: 2-3 segundos (página carga)
```

---

## PASO 2️⃣: Buscar el Corazón en la Navbar

**Ubicación**: Barra superior, lado derecho  
**Componentes visibles**:
- Logo "Serendipity Dashboard" (izquierda)
- Botones: Dashboard | Hermética | Visualizaciones | Admin (centro)
- **AQUÍ**: 💚 y botón "Sincronizar" (derecha)

**Visual esperado**:
```
┌─────────────────────────────────────────────────────────┐
│ Serendipity Dashboard  Dashboard  Hermética  ...  [💚 ✓ Sistema Vivo] [Sincronizar]
└─────────────────────────────────────────────────────────┘
                                                    ↑
                                            BUSCA AQUÍ EL CORAZÓN
```

---

## PASO 3️⃣: Verificar Color del Corazón

**Estándares de Color**:

| Color | Significado | Acción |
|-------|-------------|--------|
| 🟢 Verde | Sistema saludable | Espera, todo bien |
| 🟠 Naranja | Degradado (1+ órgano lento) | Espera 10-15 seg |
| 🔴 Rojo | Crítico (auto-repair activo) | Espera ~30 seg o reinicia backend |

**Si ves VERDE** → ✅ Continúa al PASO 4️⃣

**Si ves NARANJA o ROJO** → ⏳ Espera 30 segundos e intenta refrescar (F5)

---

## PASO 4️⃣: Abrir DevTools y Revisar Console

**Atajo de teclado**: `F12` (Windows/Linux) o `Cmd+Opt+I` (Mac)

**Navegación**:
1. Click en tab "Console" (segunda pestaña)
2. Limpiar console anterior: Ctrl+Shift+L o el botón "limpiar"
3. Refrescar página: F5

**Esperar 5-10 segundos**

---

## PASO 5️⃣: Buscar Los Logs "💓 Latido"

**Deberías ver**:

```
🫀 useAutonomicBody: Inicializando Sistema Nervioso...

[Espera ~5 segundos]

💓 Latido detectado: {
  "status": "healthy",
  "time": "125.45ms",
  "timestamp": "14:35:22"
}

💓 Latido: {
  "status": "healthy",
  "time": "125.45ms",
  "organs": Array(3)
    0: "Hermetic Body: ✓"
    1: "Production System: ✓"
    2: "Dashboard: ✓"
}
```

**Verificación**:
- [ ] Ves el log "🫀 Inicializando" una sola vez (al cargar)
- [ ] Ves "💓 Latido" cada 5 segundos (repetido)
- [ ] El status es "healthy"
- [ ] Los 3 órganos muestran "✓"

✅ Si todas son TRUE → **HEARTBEAT FUNCIONANDO**

---

## PASO 6️⃣: Probar el Botón "Sincronizar"

**Ubicación**: Navbar, botón gris junto al corazón

**Prueba**:
1. Limpiar console (Ctrl+Shift+L)
2. Click en botón "Sincronizar"
3. Deberías ver **INMEDIATAMENTE**:

```
🔄 Sincronización manual requestada...

💓 Latido: {
  status: 'healthy',
  time: '98.32ms',
  organs: ['Hermetic Body: ✓', 'Production System: ✓', 'Dashboard: ✓']
}
```

✅ Si ves esto → **SINCRONIZACIÓN MANUAL FUNCIONANDO**

---

## PASO 7️⃣: Verificar Repetición Automática

**Acción**: Espera 10-15 segundos **sin hacer nada**

**Expectativa**: Deberías ver MÚLTIPLES logs "💓 Latido" apareciendo cada 5 segundos

```
💓 Latido: { status: 'healthy', ... }  [Aparece en t=5s]
💓 Latido: { status: 'healthy', ... }  [Aparece en t=10s]
💓 Latido: { status: 'healthy', ... }  [Aparece en t=15s]
```

✅ Si ves esto → **HEARTBEAT AUTOMÁTICO FUNCIONANDO CADA 5 SEGUNDOS**

---

## PASO 8️⃣: Verificar Indicador Visual (Pulsación)

**Acción**: Observa el corazón 💚 en la navbar  
**Expectativa**: Debe PULSAR (animación suave) coincidiendo con cada log "💓"

```
Segundo 0: 💚 (normal)
Segundo 2.5: 💚 (más grande, animation mediados)
Segundo 5: 💚 (normal, nuevo latido)
Segundo 7.5: 💚 (más grande)
Segundo 10: 💚 (normal, nuevo latido)
...
```

✅ Si ves pulsación suave → **VISUALIZACIÓN FUNCIONANDO**

---

## PASO 9️⃣: Test de Endpoint Directo

**En Terminal Nueva** (no cierres DevTools):

```bash
# Verifica que el endpoint existe
curl http://localhost:5000/api/hermetic/health

# Respuesta esperada:
{
  "status": "healthy",
  "timestamp": "2026-02-14T14:35:00.123Z",
  "responseTime": 125,
  "systems": {
    "database": "operational",
    "cache": "operational",
    "storage": "operational"
  }
}
```

✅ Si ves JSON con "status": "healthy" → **BACKEND ENDPOINT OPERACIONAL**

---

## 🎯 CHECKLIST FINAL

```
✓ Página carga sin errores
✓ Corazón 💚 visible en navbar
✓ Corazón es color verde
✓ Console muestra "🫀 Inicializando" al cargar
✓ Console muestra "💓 Latido" cada 5 segundos
✓ Estado en consola es "healthy"
✓ Los 3 órganos muestran "✓"
✓ Botón "Sincronizar" funciona y produce log inmediato
✓ Corazón pulsa visualmente
✓ Endpoint /api/hermetic/health responde
✓ Los 3 estados de órganos son "✓"
```

---

## 🚀 RESULTADO

### Si TODO está ✓:
```
┌─────────────────────────────────────────────┐
│  🟢 SISTEMA VIVO Y OPERACIONAL               │
│                                             │
│  ✅ Heartbeat: Pulsando cada 5 segundos     │
│  ✅ Órganos: 3/3 saludables                 │
│  ✅ Auto-repair: Activo (listo si falla)   │
│  ✅ UI Indicador: Visible y funcional       │
│  ✅ Manual Sync: Disponible                 │
│                                             │
│  Status: EL MEDIADOR DE SOFÍA VIVE          │
└─────────────────────────────────────────────┘
```

### Si ALGUNO está ✗:
Ver sección "TROUBLESHOOTING" abajo

---

## 🔧 TROUBLESHOOTING RÁPIDO

### "No veo corazón en navbar"
```
1. F5 (recarga)
2. Ctrl+Shift+R (hard refresh)
3. Cierra y reabre DevTools
4. Si persiste: npm run build && npm run dev
```

### "No hay logs en console"
```
1. Abre DevTools ANTES de refrescar
2. F5 (recarga)
3. Busca "🫀 Inicializando" al inicio
4. Si no aparece: revisar App.tsx tiene import de autonomicSystem
```

### "Logs aparecen pero corazón no pulsa"
```
1. El corazón puede estar rojo/naranja
2. Espera 30 segundos (auto-repair en proceso)
3. Si sigue rojo: backend puede estar lento
4. curl http://localhost:5000/api/hermetic/health en terminal
```

### "Endpoint devuelve 404 o error"
```
1. El endpoint NO existe en api-server.ts
2. Verificar que backend se reinició después del cambio
3. Detener backend: Ctrl+C
4. Reiniciar: npx tsx backend/api-server.ts
5. Esperar a "SERVER RUNNING" en consola
6. Refrescar http://localhost:5174
```

### "Sincronizar no hace nada"
```
1. Límpia console primero: Ctrl+Shift+L
2. Click en botón
3. Deberías ver "🔄 Sincronización" inmediatamente
4. Si nada: DevTools cerrado accidentalmente, abre de nuevo
```

---

## 📞 CONTACTO/SOPORTE

Si algo no funciona después de TODOS los pasos:

1. **Captura screenshot de console** (F12)
2. **Nota el color del corazón**
3. **Ejecuta**: `curl http://localhost:5000/api/hermetic/health`
4. **Captura respuesta**
5. **Revisa procesos**: `Get-Process | Where-Object name -match node`

Información a reportar:
- Status del corazón (verde/naranja/rojo)
- Console logs (si existen)
- Respuesta del endpoint
- PIDs de procesos Node
- Mensajes de error (si los hay)

---

## 📚 DOCUMENTOS RELACIONADOS

- **AUTONOMIC_SYSTEM.md** - Arquitectura completa (RECOMENDADO)
- **QUICK_START.md** - Setup del sistema
- **ARCHITECTURE.md** - Diagramas y flujos
- **EJECUCION_RITUAL_RESUMEN.md** - Resumen de cambios realizados

---

## ⏱️ TIEMPO ESTIMADO

- **Setup + Verificación**: 5-10 minutos
- **Observación (opcional)**: 30 segundos

---

**Estado Actual**: 🟢 **OPERACIONAL**

**Principio Guía**: *"El punto de anclaje está establecido"*

El heartbeat PULSA. El sistema VIVE.

---

Timestamp: 2026-02-14 14:35:00 UTC