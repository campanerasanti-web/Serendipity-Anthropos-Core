# Health Check Script - El Mediador de Sofia
# Ejecutar: .\health-check-clean.ps1

Write-Host ""
Write-Host "HEALTH CHECK - El Mediador de Sofia" -ForegroundColor Magenta
Write-Host ""

$results = @()

# Check Frontend
Write-Host "Checking Frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5177" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "  Frontend OK (port 5177)" -ForegroundColor Green
        $results += "Frontend OK"
    }
} catch {
    Write-Host "  Frontend NOT responding" -ForegroundColor Red
    $results += "Frontend FAIL"
}

Write-Host ""

# Check Backend Health
Write-Host "Checking Backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/serendipity/health" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "  Backend Health OK" -ForegroundColor Green
        $results += "Backend Health OK"
    }
} catch {
    Write-Host "  Backend Health NOT responding" -ForegroundColor Red
    $results += "Backend Health FAIL"
}

Write-Host ""

# Check Financial API
Write-Host "Checking Financial API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/serendipity/financial" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "  Financial API OK" -ForegroundColor Green
        $results += "Financial OK"
    }
} catch {
    Write-Host "  Financial API NOT responding" -ForegroundColor Yellow
    $results += "Financial FAIL"
}

Write-Host ""

# Check Team API
Write-Host "Checking Team API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/serendipity/team" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "  Team API OK" -ForegroundColor Green
        $results += "Team OK"
    }
} catch {
    Write-Host "  Team API NOT responding" -ForegroundColor Yellow
    $results += "Team FAIL"
}

Write-Host ""

# Check Alerts API
Write-Host "Checking Alerts API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/serendipity/alerts" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "  Alerts API OK" -ForegroundColor Green
        $results += "Alerts OK"
    }
} catch {
    Write-Host "  Alerts API NOT responding" -ForegroundColor Yellow
    $results += "Alerts FAIL"
}

Write-Host ""

# Check Recommendations API
Write-Host "Checking Recommendations API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/serendipity/recommendations" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "  Recommendations API OK" -ForegroundColor Green
        $results += "Recommendations OK"
    }
} catch {
    Write-Host "  Recommendations API NOT responding" -ForegroundColor Yellow
    $results += "Recommendations FAIL"
}

Write-Host ""

# Summary
Write-Host "SUMMARY:" -ForegroundColor Cyan
Write-Host ""
foreach ($result in $results) {
    if ($result -like "*OK*") {
        Write-Host "  $result" -ForegroundColor Green
    } else {
        Write-Host "  $result" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Dashboard: http://localhost:5177" -ForegroundColor Magenta
Write-Host ""
