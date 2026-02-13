# El Mediador de Sofía - Backend Startup Script (Windows PowerShell)
# Usage: .\start-backend.ps1

Write-Host "🚀 Starting El Mediador de Sofía Backend..." -ForegroundColor Cyan
Write-Host ""

# Check if .NET is installed
$dotnetPath = Get-Command dotnet -ErrorAction SilentlyContinue

if (-not $dotnetPath) {
    Write-Host "❌ .NET SDK not found in PATH!" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Installation Options:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1: Install .NET SDK" -ForegroundColor White
    Write-Host "  → Download from https://dotnet.microsoft.com/download" -ForegroundColor Gray
    Write-Host "  → Choose 'Download .NET 7.0' SDK (not Runtime)" -ForegroundColor Gray
    Write-Host "  → Run installer and restart PowerShell" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Option 2: Use Chocolatey (if installed)" -ForegroundColor White
    Write-Host "  → choco install dotnet-7.0-sdk" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Option 3: Use WSL (Windows Subsystem for Linux)" -ForegroundColor White
    Write-Host "  → wsl" -ForegroundColor Gray
    Write-Host "  → bash ./start-backend.sh" -ForegroundColor Gray
    Write-Host ""
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

Write-Host "📦 Restoring dependencies..." -ForegroundColor Cyan
& dotnet restore

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Restore failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🏗️  Building project..." -ForegroundColor Cyan
& dotnet build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Build completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🌍 Starting backend server on http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""
Write-Host "📊 API Endpoints available:" -ForegroundColor Yellow
Write-Host "  • GET http://localhost:5000/api/serendipity/financial" -ForegroundColor Gray
Write-Host "  • GET http://localhost:5000/api/serendipity/team" -ForegroundColor Gray
Write-Host "  • GET http://localhost:5000/api/serendipity/alerts" -ForegroundColor Gray
Write-Host "  • GET http://localhost:5000/api/serendipity/recommendations" -ForegroundColor Gray
Write-Host "  • GET http://localhost:5000/api/serendipity/dashboard" -ForegroundColor Gray
Write-Host "  • GET http://localhost:5000/api/serendipity/health" -ForegroundColor Gray
Write-Host ""

# Run backend
& dotnet run --urls "http://0.0.0.0:5000"

