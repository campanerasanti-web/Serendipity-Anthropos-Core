# MASTER LAUNCH SCRIPT - El Mediador de Sofia
# Execute: .\launch-system.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EL MEDIADOR DE SOFIA - LAUNCH" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"
$startTime = Get-Date

# Change to correct directory
$expectedPath = "C:\Users\santiago campanera\OneDrive\Desktop\codigo"
Set-Location $expectedPath

Write-Host "[1/7] Preparing..." -ForegroundColor Yellow

# Free ports
$ports = @(5000, 5177)
foreach ($port in $ports) {
    $proc = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($proc) {
        Write-Host "  Killing process on port $port" -ForegroundColor Gray
        Stop-Process -Id $proc.OwningProcess -Force -ErrorAction SilentlyContinue
        Start-Sleep -Milliseconds 500
    }
}
Write-Host "  OK - Ports freed" -ForegroundColor Green

Write-Host "[2/7] Checking dependencies..." -ForegroundColor Yellow

# Check .NET
$dotnetPath = Get-Command dotnet -ErrorAction SilentlyContinue
if (-not $dotnetPath) {
    Write-Host "  ERROR: .NET SDK not found" -ForegroundColor Red
    Write-Host "  Download from: https://dotnet.microsoft.com/download" -ForegroundColor Yellow
    exit 1
}
$dotnetVersion = & dotnet --version
Write-Host "  OK - .NET SDK: $dotnetVersion" -ForegroundColor Green

# Check Node.js
$nodePath = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodePath) {
    Write-Host "  ERROR: Node.js not found" -ForegroundColor Red
    exit 1
}
$nodeVersion = & node --version
Write-Host "  OK - Node.js: $nodeVersion" -ForegroundColor Green

Write-Host "[3/7] Building backend..." -ForegroundColor Yellow

Push-Location backend

& dotnet restore 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Restore failed" -ForegroundColor Red
    Pop-Location
    exit 1
}

$buildOutput = & dotnet build 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Build failed" -ForegroundColor Red
    $buildOutput | ForEach-Object { Write-Host "  $_" }
    Pop-Location
    exit 1
}

Pop-Location
Write-Host "  OK - Backend built" -ForegroundColor Green

Write-Host "[4/7] Preparing frontend..." -ForegroundColor Yellow

if (-not (Test-Path "node_modules")) {
    Write-Host "  Installing npm packages..." -ForegroundColor Cyan
    & npm install 2>&1 | Out-Null
}

if (-not (Test-Path "dist")) {
    Write-Host "  Building frontend..." -ForegroundColor Cyan
    & npm run build 2>&1 | Out-Null
}

Write-Host "  OK - Frontend ready" -ForegroundColor Green

Write-Host "[5/7] Starting services..." -ForegroundColor Yellow

# Start backend
$backendScript = {
    Set-Location "C:\Users\santiago campanera\OneDrive\Desktop\codigo\backend"
    & dotnet run --urls "http://0.0.0.0:5000" 2>&1
}

$backendJob = Start-Job -ScriptBlock $backendScript -Name "ElMediadorBackend"
Start-Sleep -Seconds 3

$backendRunning = Get-Job -Name "ElMediadorBackend" -ErrorAction SilentlyContinue
if ($backendRunning -and $backendRunning.State -eq "Running") {
    Write-Host "  OK - Backend running on :5000 (Job: $($backendRunning.Id))" -ForegroundColor Green
} else {
    Write-Host "  ERROR: Backend did not start" -ForegroundColor Red
    Stop-Job -Name "ElMediadorBackend" -ErrorAction SilentlyContinue
    exit 1
}

# Start frontend
Write-Host "  Starting frontend on :5177..." -ForegroundColor Cyan
$frontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$((Get-Location).Path)'; npm run dev" -PassThru -WindowStyle Normal

Write-Host "  OK - Frontend starting" -ForegroundColor Green
Start-Sleep -Seconds 5

Write-Host "[6/7] Health check..." -ForegroundColor Yellow

$healthChecks = @(
    @{Name="Backend Health"; Url="http://localhost:5000/api/serendipity/health"},
    @{Name="Financial API"; Url="http://localhost:5000/api/serendipity/financial"},
    @{Name="Team API"; Url="http://localhost:5000/api/serendipity/team"},
    @{Name="Alerts API"; Url="http://localhost:5000/api/serendipity/alerts"},
    @{Name="Recommendations"; Url="http://localhost:5000/api/serendipity/recommendations"},
    @{Name="Dashboard API"; Url="http://localhost:5000/api/serendipity/dashboard"}
)

$checksPass = 0
foreach ($check in $healthChecks) {
    try {
        $response = Invoke-WebRequest -Uri $check.Url -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "  OK - $($check.Name)" -ForegroundColor Green
            $checksPass++
        }
    } catch {
        Write-Host "  WAIT - $($check.Name)" -ForegroundColor Yellow
    }
}

Write-Host "  Checks passed: $checksPass/6" -ForegroundColor Cyan

Write-Host "[7/7] Opening browser..." -ForegroundColor Yellow

Start-Process "http://localhost:5177"
Start-Sleep -Seconds 2

$elapsedTime = (Get-Date) - $startTime

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  SYSTEM OPERATIONAL" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend:    http://localhost:5177" -ForegroundColor Green
Write-Host "Backend:     http://localhost:5000" -ForegroundColor Green
Write-Host "Time:        $([int]$elapsedTime.TotalSeconds)s" -ForegroundColor Cyan
Write-Host ""
Write-Host "You should see:" -ForegroundColor Yellow
Write-Host "  1. Browser open to localhost:5177" -ForegroundColor Gray
Write-Host "  2. Dashboard with 4 tabs" -ForegroundColor Gray
Write-Host "  3. Financial data, Team, Alerts, Recommendations" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C to stop monitoring" -ForegroundColor Gray
Write-Host ""

# Monitor services
while ($true) {
    Start-Sleep -Seconds 5
    
    $backendStatus = Get-Job -Name "ElMediadorBackend" -ErrorAction SilentlyContinue
    if ($backendStatus -and $backendStatus.State -ne "Running") {
        Write-Host "[!] Backend stopped. Press Ctrl+C to exit." -ForegroundColor Red
    }
    
    if (-not (Get-Process -Id $frontendJob.Id -ErrorAction SilentlyContinue)) {
        Write-Host "[!] Frontend closed. Press Ctrl+C to exit." -ForegroundColor Yellow
    }
}
