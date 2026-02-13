# Health Check - El Mediador de Sofia
# Execute: .\check-health.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SYSTEM HEALTH CHECK" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Frontend
Write-Host "Checking Frontend (localhost:5177)..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:5177" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    Write-Host "  OK - Frontend responding" -ForegroundColor Green
} catch {
    Write-Host "  ERROR - Frontend not responding" -ForegroundColor Red
}

Write-Host ""

# Check Backend
Write-Host "Checking Backend APIs (localhost:5000)..." -ForegroundColor Yellow

$endpoints = @(
    "health",
    "financial",
    "team",
    "alerts",
    "recommendations",
    "dashboard"
)

$passCount = 0
foreach ($endpoint in $endpoints) {
    $url = "http://localhost:5000/api/serendipity/$endpoint"
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "  OK - $endpoint API" -ForegroundColor Green
            $passCount++
        }
    } catch {
        Write-Host "  ERROR - $endpoint API not responding" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Result: $passCount/6 endpoints OK" -ForegroundColor Cyan
Write-Host ""

if ($passCount -eq 6) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ALL SYSTEMS OPERATIONAL" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  SOME SYSTEMS DOWN" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
}

Write-Host ""
