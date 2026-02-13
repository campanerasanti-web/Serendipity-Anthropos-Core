# Quick Frontend Starter
# Execute: .\quick-frontend.ps1

Write-Host "Starting Frontend..." -ForegroundColor Cyan

$expectedPath = "C:\Users\santiago campanera\OneDrive\Desktop\codigo"
Set-Location $expectedPath

# Check Node.js
$nodePath = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodePath) {
    Write-Host "ERROR: Node.js not found" -ForegroundColor Red
    exit 1
}

# Free port 5177
$proc = Get-NetTCPConnection -LocalPort 5177 -ErrorAction SilentlyContinue
if ($proc) {
    Write-Host "Killing process on port 5177..." -ForegroundColor Yellow
    Stop-Process -Id $proc.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

# Install if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing npm packages..." -ForegroundColor Yellow
    & npm install
}

Write-Host ""
Write-Host "Starting on http://localhost:5177..." -ForegroundColor Cyan
Write-Host ""

# Run frontend
& npm run dev
