# Quick Backend Starter
# Execute: .\quick-backend.ps1

Write-Host "Starting Backend..." -ForegroundColor Cyan

$expectedPath = "C:\Users\santiago campanera\OneDrive\Desktop\codigo"
Set-Location $expectedPath

# Check .NET
$dotnetPath = Get-Command dotnet -ErrorAction SilentlyContinue
if (-not $dotnetPath) {
    Write-Host "ERROR: .NET SDK not found" -ForegroundColor Red
    exit 1
}

# Free port 5000
$proc = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($proc) {
    Write-Host "Killing process on port 5000..." -ForegroundColor Yellow
    Stop-Process -Id $proc.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

# Navigate to backend
Push-Location backend

Write-Host "Building backend..." -ForegroundColor Yellow
& dotnet build 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed" -ForegroundColor Red
    Pop-Location
    exit 1
}

Write-Host "Backend built successfully" -ForegroundColor Green
Write-Host ""
Write-Host "Starting on http://localhost:5000..." -ForegroundColor Cyan
Write-Host ""

# Run backend
& dotnet run --urls "http://0.0.0.0:5000"

Pop-Location
