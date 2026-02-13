# QUICK START - El Mediador de Sofia

## PROBLEMA RESUELTO
Los scripts anteriores tenian problemas de encoding. Ahora usa estos scripts nuevos (sin caracteres especiales).

---

## OPCION 1: Lanzar TODO (Recomendado)

```powershell
.\launch-system.ps1
```

Esto:
- Compila el backend
- Prepara el frontend  
- Inicia ambos servicios
- Abre el navegador automáticamente
- Verifica que todo funcione

**Tiempo:** ~40 segundos

**Resultado esperado:**
- Navegador abre en http://localhost:5177
- Ves el dashboard con 4 tabs
- Backend responde en http://localhost:5000

---

## OPCION 2: Lanzar Manual (Dos Ventanas)

### Ventana 1 - Backend:
```powershell
.\quick-backend.ps1
```
Espera a ver: "Now listening on: http://localhost:5000"

### Ventana 2 - Frontend:
```powershell
.\quick-frontend.ps1
```
Espera a ver: "Local: http://localhost:5177"

Luego abre manualmente: http://localhost:5177

---

## VERIFICAR QUE TODO FUNCIONA

```powershell
.\check-health.ps1
```

Debería mostrar:
```
OK - Frontend responding
OK - health API
OK - financial API
OK - team API
OK - alerts API
OK - recommendations API
OK - dashboard API

Result: 6/6 endpoints OK
ALL SYSTEMS OPERATIONAL
```

---

## QUE VAS A VER EN EL DASHBOARD

### Tab 1: FINANCIERO
- Ingresos: 1,363.75M VND/mes
- Margen: 78%
- Alerta PRARA: 82% de concentración

### Tab 2: EQUIPO
- 21 empleados listados
- Salarios de cada uno
- Equity scores

### Tab 3: ALERTAS
- 2 CRÍTICAS (rojo)
- 2 ALTAS (naranja)
- 1 OPORTUNIDAD (verde)

### Tab 4: RECOMENDACIONES
- Prioridad 1: Delegación Definitiva (Urgente)
- Prioridad 2: Ajuste salarial +1M (Alto)
- Prioridad 3: Diversificación clientes (Medio)
- Prioridad 4: Cultura cero errores (Estratégico)

---

## SOLUCIÓN DE PROBLEMAS

### Error: "dotnet no encontrado"
Instala .NET 7 SDK: https://dotnet.microsoft.com/download

### Error: "node no encontrado"
Instala Node.js 18+: https://nodejs.org/

### Backend no inicia
```powershell
cd backend
dotnet build
# Lee los errores y reporta
```

### Frontend no inicia
```powershell
npm install
npm run dev
# Lee los errores y reporta
```

### Puerto ocupado
```powershell
# Liberar puerto 5000 (backend)
$p = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($p) { Stop-Process -Id $p.OwningProcess -Force }

# Liberar puerto 5177 (frontend)
$p = Get-NetTCPConnection -LocalPort 5177 -ErrorAction SilentlyContinue
if ($p) { Stop-Process -Id $p.OwningProcess -Force }
```

---

## COMANDOS ÚTILES

### Ver logs del backend (si se ejecutó como Job)
```powershell
Get-Job -Name "ElMediadorBackend" | Receive-Job
```

### Detener backend (si se ejecutó como Job)
```powershell
Stop-Job -Name "ElMediadorBackend"
Remove-Job -Name "ElMediadorBackend"
```

### Ver puertos activos
```powershell
Get-NetTCPConnection -LocalPort 5000,5177
```

---

## ARCHIVOS DISPONIBLES

| Archivo | Propósito |
|---------|-----------|
| `launch-system.ps1` | Lanza todo automaticamente (RECOMENDADO) |
| `quick-backend.ps1` | Solo backend |
| `quick-frontend.ps1` | Solo frontend |
| `check-health.ps1` | Verifica salud del sistema |
| `QUICK-START.md` | Este archivo |

---

## SIGUIENTE PASO

```powershell
.\launch-system.ps1
```

En 40 segundos veras el sistema operativo.

---

**Estado:** Feb 12, 2026 - Listo para lanzamiento
**Deadline:** Feb 15, 2026 (Cumpleaños)
