# 🧪 GUÍA RÁPIDA: CÓMO PROBAR EL SISTEMA OpsGardener

## 1️⃣ OPCIÓN A: Verificación Manual Rápida (Terminal)

```powershell
# Verifica que el backend responde
Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing

# Ejecuta un audit de las 9 reglas
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/ops/audit" -UseBasicParsing
$response.Content | ConvertFrom-Json | ConvertTo-Json
```

**Resultado esperado:** Status 200 con JSON de 9 reglas (FLOW-001 a FLOW-007, CULT-001, MQTT-001)

---

## 2️⃣ OPCIÓN B: Tests Automatizados (Recomendado)

```powershell
# Ejecuta la suite de tests completa
powershell -ExecutionPolicy Bypass -File "test-flow-003-007.ps1"

# O ejecuta tests de Viernes 13 (vigilia completa)
powershell -ExecutionPolicy Bypass -File "TEST_VIERNES_13_PROTOCOL.ps1"
```

**Qué valida:**
- ✅ Todos los archivos JSON cargados correctamente
- ✅ Las 9 reglas registradas en DI
- ✅ Todas las validaciones PASS/FAIL

---

## 3️⃣ OPCIÓN C: Frontend Visual (Navegador)

**1. Inicia el frontend React:**
```powershell
npm run dev
```

**2. Abre en navegador:**
```
http://localhost:5178
```

**3. Visualiza:**
- 🌡️ Dashboard en tiempo real
- 📊 Clima del sistema
- 📋 Estado de cada regla
- 🔄 Auto-fix status

---

## 📌 ENDPOINTS DISPONIBLES

### Health Check
```
GET http://localhost:5000/health
```

### Auditoría (lectura)
```
GET http://localhost:5000/api/ops/audit
```
Respuesta: Lista de 9 resultados de reglas

### Reparación (con auto-fix)
```
GET http://localhost:5000/api/ops/repair
```
Intenta corregir problemas automáticamente

### Full Report
```
GET http://localhost:5000/api/ops/full
```
Auditoría + Tareas ejecutadas + Reporte

---

## 🎯 PRUEBA RÁPIDA (1 minuto)

Copiar en PowerShell e inmediatamente ver resultados:

```powershell
# 1. Esperar backend listo (verifica salida: HTTP 200)
$maxRetries = 5
$retry = 0
while ($retry -lt $maxRetries) {
    try {
        $health = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        Write-Host "✅ Backend LISTO (HTTP $($health.StatusCode))" -ForegroundColor Green
        break
    }
    catch {
        $retry++
        Write-Host "⏳ Intento $retry/$maxRetries - Esperando..." -ForegroundColor Cyan
        Start-Sleep -Seconds 2
    }
}

# 2. Ejecutar auditoría
Write-Host "`n>>> EJECUTANDO AUDITORÍA (9 reglas)" -ForegroundColor Yellow
$audit = Invoke-WebRequest -Uri "http://localhost:5000/api/ops/audit" -UseBasicParsing
$data = $audit.Content | ConvertFrom-Json

# 3. Mostrar resultados
Write-Host "`n✅ RESULTADOS:" -ForegroundColor Green
foreach ($result in $data.results) {
    $status = if ($result.ruleResult.passed) { "✅ PASS" } else { "❌ FAIL" }
    Write-Host "  $($result.rule.id): $status - $($result.ruleResult.message)" -ForegroundColor Cyan
}

# 4. Clima
Write-Host "`n🌡️ CLIMA: $($data.climate)" -ForegroundColor Magenta
```

---

## 🌙 VIGILIA AUTOMÁTICA (22:00-06:00)

Para ejecutar vigilancia nocturna automática:

```powershell
# 1. Inicia backend en background
Set-Location "c:\Users\santiago campanera\OneDrive\Desktop\codigo\backend"
& "C:\Program Files\dotnet\dotnet.exe" run --urls="http://localhost:5000"

# 2. En otra terminal: Inicia vigilia
powershell -ExecutionPolicy Bypass -File "VIGILIA_NOCHE.ps1"
```

Esto ejecutará auditorías cada hora entre 22:00 y 06:00.

---

## 📊 ARCHIVOS DE PRUEBA LISTOS

- `test-flow-003-007.ps1` - Tests FLOW-003 a FLOW-007
- `TEST_VIERNES_13_PROTOCOL.ps1` - Suite completa con 9 reglas
- `VIGILIA_NOCHE.ps1` - Monitoreo continuo 22:00-06:00

---

## ✅ CHECKLIST RÁPIDO

- [ ] Backend iniciado en puerto 5000
- [ ] `GET /health` responde HTTP 200
- [ ] `GET /api/ops/audit` devuelve 9 reglas
- [ ] Clima: ☀️ SOLEADO (sin FAIL)
- [ ] Archivos JSON en `backend/ops/` completos
- [ ] Frontend visible en http://localhost:5178

---

## 🎬 INICIO RECOMENDADO (PASO A PASO)

### Terminal 1: Backend
```
cd backend
dotnet run --urls="http://localhost:5000"
```

### Terminal 2: Verifica (espera~5 segundos)
```
Invoke-WebRequest http://localhost:5000/health
```

### Terminal 3: Execute tests
```
powershell -ExecutionPolicy Bypass -File "test-flow-003-007.ps1"
```

### Terminal 4: Frontend (Opcional)
```
npm run dev
```

Luego abre: http://localhost:5178

---

¡Listo para probar! 🚀
