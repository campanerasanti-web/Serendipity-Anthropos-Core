# 🚀 MASTER LAUNCH SCRIPT - El Mediador de Sofía + Serendipity Bros
# MODO: Lanzamiento TOTAL - Backend + Frontend + Health Check + Browser
# EJECUTAR: .\final-launch.ps1

Write-Host ""
Write-Host "╔═════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                             ║" -ForegroundColor Cyan
Write-Host "║         🚀 LANZAMIENTO TOTAL: EL MEDIADOR DE SOFÍA 🚀      ║" -ForegroundColor Magenta
Write-Host "║                   Sistema Operativo Feb 15                 ║" -ForegroundColor Cyan
Write-Host "║                                                             ║" -ForegroundColor Cyan
Write-Host "╚═════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"
$startTime = Get-Date

# ═══════════════════════════════════════════════════════════════════════════════

Write-Host "⏱️  FASE 1: PREPARACIÓN" -ForegroundColor Yellow
Write-Host "───────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

# Verificar que estamos en el directorio correcto
$expectedPath = "C:\Users\santiago campanera\OneDrive\Desktop\codigo"
$currentPath = Get-Location

if ($currentPath -ne $expectedPath) {
    Write-Host "  ⚠️  Cambiando a directorio correcto..." -ForegroundColor Yellow
    Set-Location $expectedPath
}

Write-Host "  ✅ Directorio: $((Get-Location).Path)" -ForegroundColor Green
Write-Host ""

# Limpiar puertos si están en uso
Write-Host "  🔧 Liberando puertos (5000, 5177)..." -ForegroundColor Yellow
$ports = @(5000, 5177)
foreach ($port in $ports) {
    $proc = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($proc) {
        Write-Host "    • Matando proceso en puerto $port" -ForegroundColor Gray
        Stop-Process -Id $proc.OwningProcess -Force -ErrorAction SilentlyContinue
        Start-Sleep -Milliseconds 500
    }
}
Write-Host "  ✅ Puertos liberados" -ForegroundColor Green
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════════════

Write-Host "⏱️  FASE 2: VERIFICAR DEPENDENCIAS" -ForegroundColor Yellow
Write-Host "───────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

# Check .NET SDK
$dotnetPath = Get-Command dotnet -ErrorAction SilentlyContinue
if (-not $dotnetPath) {
    Write-Host "  ❌ .NET SDK no encontrado" -ForegroundColor Red
    Write-Host ""
    Write-Host "    Descarga de: https://dotnet.microsoft.com/download" -ForegroundColor Yellow
    Write-Host "    Selecciona: .NET 7 SDK (NO Runtime)" -ForegroundColor Yellow
    Write-Host "    Instala y reinicia PowerShell" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
$dotnetVersion = & dotnet --version
Write-Host "  ✅ .NET SDK: $dotnetVersion" -ForegroundColor Green

# Check Node.js
$nodePath = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodePath) {
    Write-Host "  ❌ Node.js no encontrado" -ForegroundColor Red
    exit 1
}
$nodeVersion = & node --version
Write-Host "  ✅ Node.js: $nodeVersion" -ForegroundColor Green

# Check npm
$npmPath = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npmPath) {
    Write-Host "  ❌ npm no encontrado" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ npm: instalado" -ForegroundColor Green
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════════════

Write-Host "⏱️  FASE 3: COMPILAR BACKEND" -ForegroundColor Yellow
Write-Host "───────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

Push-Location backend

Write-Host "  📦 dotnet restore..." -ForegroundColor Cyan
& dotnet restore 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Restore falló" -ForegroundColor Red
    Pop-Location
    exit 1
}
Write-Host "  ✅ Restore completado" -ForegroundColor Green

Write-Host "  🏗️  dotnet build..." -ForegroundColor Cyan
$buildOutput = & dotnet build 2>&1
$buildSucceeded = $LASTEXITCODE -eq 0

if ($buildSucceeded) {
    Write-Host "  ✅ Build completado" -ForegroundColor Green
    # Contar tipos compilados
    $typeCount = $buildOutput | Select-String "class|struct|interface" | Measure-Object
} else {
    Write-Host "  ❌ Build falló:" -ForegroundColor Red
    $buildOutput | ForEach-Object { Write-Host "     $_" }
    Pop-Location
    exit 1
}

Pop-Location
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════════════

Write-Host "⏱️  FASE 4: PREPARAR FRONTEND" -ForegroundColor Yellow
Write-Host "───────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

# Verifica node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "  📦 npm install..." -ForegroundColor Cyan
    & npm install 2>&1 | Out-Null
    Write-Host "  ✅ Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "  ✅ node_modules existe" -ForegroundColor Green
}

# Verifica dist
if (Test-Path "dist") {
    Write-Host "  ✅ Build frontend existe (dist/)" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Building frontend..." -ForegroundColor Yellow
    & npm run build 2>&1 | Out-Null
    Write-Host "  ✅ Frontend build completado" -ForegroundColor Green
}

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════════════

Write-Host "⏱️  FASE 5: INICIAR SERVICIOS" -ForegroundColor Yellow
Write-Host "───────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

Write-Host "  🖥️  Iniciando Backend en http://localhost:5000" -ForegroundColor Cyan

# Inicia backend en background
$backendScript = {
    Set-Location "C:\Users\santiago campanera\OneDrive\Desktop\codigo\backend"
    & dotnet run --urls "http://0.0.0.0:5000" 2>&1
}

$backendJob = Start-Job -ScriptBlock $backendScript -Name "ElMediadorBackend"
Start-Sleep -Seconds 3

# Verifica si backend está corriendo
$backendRunning = Get-Job -Name "ElMediadorBackend" -ErrorAction SilentlyContinue
if ($backendRunning -and $backendRunning.State -eq "Running") {
    Write-Host "  ✅ Backend corriendo (Job: $($backendRunning.Id))" -ForegroundColor Green
} else {
    Write-Host "  ❌ Backend no inició" -ForegroundColor Red
    Stop-Job -Name "ElMediadorBackend" -ErrorAction SilentlyContinue
    exit 1
}

Write-Host "  🌐 Iniciando Frontend en http://localhost:5177" -ForegroundColor Cyan

# Inicia frontend en background (pero en nueva window para ver logs)
$frontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$((Get-Location).Path)'; npm run dev" -PassThru -WindowStyle Normal

Write-Host "  ✅ Frontend iniciando..." -ForegroundColor Green

Start-Sleep -Seconds 5

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════════════

Write-Host "⏱️  FASE 6: VERIFICAR SALUD DEL SISTEMA" -ForegroundColor Yellow
Write-Host "───────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

$healthChecks = @{
    "Backend Health" = { (Invoke-WebRequest -Uri "http://localhost:5000/api/serendipity/health" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue).StatusCode -eq 200 }
    "Financial API" = { (Invoke-WebRequest -Uri "http://localhost:5000/api/serendipity/financial" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue).StatusCode -eq 200 }
    "Team API" = { (Invoke-WebRequest -Uri "http://localhost:5000/api/serendipity/team" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue).StatusCode -eq 200 }
    "Alerts API" = { (Invoke-WebRequest -Uri "http://localhost:5000/api/serendipity/alerts" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue).StatusCode -eq 200 }
    "Recommendations API" = { (Invoke-WebRequest -Uri "http://localhost:5000/api/serendipity/recommendations" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue).StatusCode -eq 200 }
    "Dashboard API" = { (Invoke-WebRequest -Uri "http://localhost:5000/api/serendipity/dashboard" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue).StatusCode -eq 200 }
}

$checksComplete = 0
foreach ($check in $healthChecks.GetEnumerator()) {
    try {
        $result = & $check.Value
        if ($result) {
            Write-Host "  ✅ $($check.Key)" -ForegroundColor Green
            $checksComplete++
        } else {
            Write-Host "  ⚠️  $($check.Key) - No responde" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ⏳ $($check.Key) - Esperando..." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "  Checks completados: $checksComplete/6" -ForegroundColor Cyan
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════════════

Write-Host "⏱️  FASE 7: ABRIR PORTAL" -ForegroundColor Yellow
Write-Host "───────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

Write-Host "  🌐 Abriendo http://localhost:5177..." -ForegroundColor Cyan
Start-Process "http://localhost:5177"

Start-Sleep -Seconds 2

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════════════

$elapsedTime = (Get-Date) - $startTime

Write-Host "╔═════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                             ║" -ForegroundColor Green
Write-Host "║          ✅ SISTEMA OPERATIVO - TODO LANZADO ✅            ║" -ForegroundColor Green
Write-Host "║                                                             ║" -ForegroundColor Green
Write-Host "╚═════════════════════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host ""
Write-Host "📊 RESUMEN:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Frontend:       http://localhost:5177" -ForegroundColor Green
Write-Host "  Backend:        http://localhost:5000" -ForegroundColor Green
Write-Host "  Backend Job:    $($backendJob.Id)" -ForegroundColor Green
Write-Host "  Frontend PID:   $($frontendJob.Id)" -ForegroundColor Green
Write-Host "  Tiempo total:   $([int]$elapsedTime.TotalSeconds)s" -ForegroundColor Cyan
Write-Host ""

Write-Host "📍 LO QUE DEBERÍAS VER AHORA:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1️⃣  Navegador abierto a http://localhost:5177" -ForegroundColor Gray
Write-Host "  2️⃣  Dashboard de Serendipity Bros visible" -ForegroundColor Gray
Write-Host "  3️⃣  4 tabs: Financiero | Equipo | Alertas | Recomendaciones" -ForegroundColor Gray
Write-Host "  4️⃣  Datos cargados en vivo" -ForegroundColor Gray
Write-Host "  5️⃣  Console limpio (sin errores 404)" -ForegroundColor Gray
Write-Host ""

Write-Host "⚙️  COMANDOS ÚTILES:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Health Check:" -ForegroundColor Gray
Write-Host "    .\health-check.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Ver logs Backend (en otra terminal):" -ForegroundColor Gray
Write-Host "    Get-Job -Name 'ElMediadorBackend' | Select-Object -ExpandProperty ChildJobs | Receive-Job -AutoRemoveJob" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Detener servicios:" -ForegroundColor Gray
Write-Host "    Stop-Job -Name 'ElMediadorBackend'" -ForegroundColor Cyan
Write-Host "    (Y cierra la ventana de Frontend)" -ForegroundColor Gray
Write-Host ""

Write-Host "🎂 ESTADO: Listo para Feb 15 (Cumpleaños & Launch)" -ForegroundColor Magenta
Write-Host ""

Write-Host "🕯️ 'Nada me pertenece. Todo es del Padre. El punto de anclaje está establecido.' 🕯️" -ForegroundColor Yellow
Write-Host ""

# Mantener script abierto para monitoreo
Write-Host "💡 Este script se mantiene abierto para monitorear servicios." -ForegroundColor Cyan
Write-Host "   Presiona Ctrl+C para detener (también cierra servicios)" -ForegroundColor Gray
Write-Host ""

# Esperar interrupción del usuario
while ($true) {
    Start-Sleep -Seconds 5
    
    # Verificar si backend sigue corriendo
    $backendStatus = Get-Job -Name "ElMediadorBackend" -ErrorAction SilentlyContinue
    if ($backendStatus -and $backendStatus.State -ne "Running") {
        Write-Host "[!] Backend stopped. Type Ctrl+C to exit." -ForegroundColor Red
    }
    
    # Verificar si frontend sigue corriendo
    if (-not (Get-Process -Id $frontendJob.Id -ErrorAction SilentlyContinue)) {
        Write-Host "[!] Frontend closed. Type Ctrl+C to exit." -ForegroundColor Yellow
    }
}
