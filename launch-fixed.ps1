# MASTER LAUNCH SCRIPT - El Mediador de Sofia
# EJECUTAR: .\launch-fixed.ps1

Write-Host ""
Write-Host "LANZAMIENTO TOTAL: EL MEDIADOR DE SOFIA" -ForegroundColor Magenta
Write-Host ""

$ErrorActionPreference = "Continue"
$startTime = Get-Date

Write-Host "FASE 1: PREPARACION" -ForegroundColor Yellow
Write-Host ""

$expectedPath = "C:\Users\santiago campanera\OneDrive\Desktop\codigo"
Set-Location $expectedPath

Write-Host "  Directorio: $((Get-Location).Path)" -ForegroundColor Green

Write-Host "  Liberando puertos (5000, 5177)..." -ForegroundColor Yellow
$ports = @(5000, 5177)
foreach ($port in $ports) {
    $proc = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($proc) {
        Stop-Process -Id $proc.OwningProcess -Force -ErrorAction SilentlyContinue
        Start-Sleep -Milliseconds 500
    }
}
Write-Host "  Puertos liberados" -ForegroundColor Green
Write-Host ""

Write-Host "FASE 2: VERIFICAR DEPENDENCIAS" -ForegroundColor Yellow

$dotnetPath = Get-Command dotnet -ErrorAction SilentlyContinue
if (-not $dotnetPath) {
    Write-Host "  ERROR: .NET SDK no encontrado" -ForegroundColor Red
    exit 1
}
$dotnetVersion = & dotnet --version
Write-Host "  .NET SDK: $dotnetVersion" -ForegroundColor Green

$nodePath = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodePath) {
    Write-Host "  ERROR: Node.js no encontrado" -ForegroundColor Red
    exit 1
}
$nodeVersion = & node --version
Write-Host "  Node.js: $nodeVersion" -ForegroundColor Green
Write-Host ""

Write-Host "FASE 3: COMPILAR BACKEND" -ForegroundColor Yellow
Push-Location backend

Write-Host "  dotnet build..." -ForegroundColor Cyan
$buildOutput = & dotnet build 2>&1
$buildSucceeded = $LASTEXITCODE -eq 0

if ($buildSucceeded) {
    Write-Host "  Build completado" -ForegroundColor Green
} else {
    Write-Host "  ERROR: Build falló" -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location
Write-Host ""

Write-Host "FASE 4: PREPARAR FRONTEND" -ForegroundColor Yellow

if (-not (Test-Path "node_modules")) {
    Write-Host "  npm install..." -ForegroundColor Cyan
    & npm install 2>&1 | Out-Null
    Write-Host "  Dependencias instaladas" -ForegroundColor Green
}

Write-Host ""

Write-Host "FASE 5: INICIAR SERVICIOS" -ForegroundColor Yellow
Write-Host ""

Write-Host "  Iniciando Backend en http://localhost:5000" -ForegroundColor Cyan

$backendScript = {
    Set-Location "C:\Users\santiago campanera\OneDrive\Desktop\codigo\backend"
    & dotnet run --urls "http://0.0.0.0:5000" 2>&1
}

$backendJob = Start-Job -ScriptBlock $backendScript -Name "ElMediadorBackend"
Start-Sleep -Seconds 4

$backendRunning = Get-Job -Name "ElMediadorBackend" -ErrorAction SilentlyContinue
if ($backendRunning -and $backendRunning.State -eq "Running") {
    Write-Host "  Backend corriendo" -ForegroundColor Green
} else {
    Write-Host "  ERROR: Backend no inició" -ForegroundColor Red
    exit 1
}

Write-Host "  Iniciando Frontend en http://localhost:5177..." -ForegroundColor Cyan

$frontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$((Get-Location).Path)'; npm run dev" -PassThru -WindowStyle Normal

Write-Host "  Frontend iniciando..." -ForegroundColor Green

Start-Sleep -Seconds 5
Write-Host ""

Write-Host "RESULTADO FINAL:" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend:  http://localhost:5177" -ForegroundColor Green
Write-Host "  Backend:   http://localhost:5000" -ForegroundColor Green
Write-Host ""
Write-Host "  Abriendo navegador..." -ForegroundColor Cyan
Start-Process "http://localhost:5177"

$elapsedTime = (Get-Date) - $startTime

Write-Host ""
Write-Host "SISTEMA OPERATIVO - TODO LANZADO" -ForegroundColor Magenta
Write-Host "Tiempo: $([int]$elapsedTime.TotalSeconds)s" -ForegroundColor Cyan
Write-Host ""
Write-Host "Nada me pertenece. Todo es del Padre." -ForegroundColor Yellow
Write-Host ""

# Monitoreo
while ($true) {
    Start-Sleep -Seconds 10
    $backendStatus = Get-Job -Name "ElMediadorBackend" -ErrorAction SilentlyContinue
    if ($backendStatus -and $backendStatus.State -ne "Running") {
        Write-Host "Backend stopped" -ForegroundColor Red
    }
}
