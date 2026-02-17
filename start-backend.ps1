# El Mediador de Sofía - Backend Startup Script (Windows PowerShell)
# Usage: .\start-backend.ps1

Write-Host '🚀 Starting El Mediador de Sofía Backend...' -ForegroundColor Cyan
Write-Host ""

# Check if .NET is installed (bloque mínimo y limpio)
$dotnetPath = Get-Command dotnet -ErrorAction SilentlyContinue
if (-not $dotnetPath) {
    Write-Host "❌ .NET SDK not found in PATH!" -ForegroundColor Red
    exit 1
}

$dotnetVersion = & dotnet --version
Write-Host "✅ .NET SDK found: $dotnetVersion" -ForegroundColor Green
Write-Host ""

# Navigate to backend directory
$backendPath = Join-Path -Path (Get-Location) -ChildPath "backend"
if (-not (Test-Path $backendPath)) {
    Write-Host "❌ backend directory not found at $backendPath" -ForegroundColor Red
    exit 1
}

Set-Location $backendPath

Write-Host '📦 Restoring dependencies...' -ForegroundColor Cyan
& dotnet restore

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Restore failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host '🏗️  Building project...' -ForegroundColor Cyan
& dotnet build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host '✅ Build completed successfully!' -ForegroundColor Green
Write-Host ""
Write-Host '🌍 Starting backend server on http://localhost:5000' -ForegroundColor Cyan
Write-Host ""
Write-Host 'Press Ctrl+C to stop the server' -ForegroundColor Yellow
Write-Host 'API endpoints disponibles en http://localhost:5000' -ForegroundColor Yellow
# Run backend
& dotnet run --urls http://0.0.0.0:5000

