# Backend Startup Script - El Mediador de Sofia
# Ejecutar: .\start-backend-clean.ps1

Write-Host "Backend Startup - El Mediador de Sofia" -ForegroundColor Cyan
Write-Host ""

$dotnetPath = "C:\Program Files\dotnet\dotnet.exe"

if (-not (Test-Path $dotnetPath)) {
    Write-Host "ERROR: .NET SDK no encontrado en $dotnetPath" -ForegroundColor Red
    Write-Host "Descarga desde: https://dotnet.microsoft.com/download" -ForegroundColor Yellow
    exit 1
}

$dotnetVersion = & $dotnetPath --version
Write-Host "NET SDK: $dotnetVersion" -ForegroundColor Green
Write-Host ""

$backendPath = Join-Path -Path (Get-Location) -ChildPath "backend"
if (-not (Test-Path $backendPath)) {
    Write-Host "ERROR: Carpeta backend no encontrada" -ForegroundColor Red
    exit 1
}

Set-Location $backendPath

Write-Host "Build backend..." -ForegroundColor Cyan
& $dotnetPath build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build fall" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Running backend en http://localhost:5000" -ForegroundColor Green
Write-Host "Endpoints:" -ForegroundColor Yellow
Write-Host "  /api/serendipity/financial" -ForegroundColor Gray
Write-Host "  /api/serendipity/team" -ForegroundColor Gray
Write-Host "  /api/serendipity/alerts" -ForegroundColor Gray
Write-Host "  /api/serendipity/recommendations" -ForegroundColor Gray
Write-Host "  /api/serendipity/dashboard" -ForegroundColor Gray
Write-Host "  /api/serendipity/health" -ForegroundColor Gray
Write-Host ""
Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Yellow
Write-Host ""

& $dotnetPath run --urls "http://0.0.0.0:5000"
