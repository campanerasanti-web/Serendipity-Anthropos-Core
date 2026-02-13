# El Mediador de Sofía - System Health Check Script
# Verifies frontend, backend, and all API endpoints

Write-Host "🔍 El Mediador de Sofía - System Health Check" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

$errors = @()
$warnings = @()
$success = 0

# Test Frontend
Write-Host "1️⃣  Testing Frontend..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:5177" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "   ✅ Frontend OK (localhost:5177)" -ForegroundColor Green
        $success++
    }
} catch {
    Write-Host "   ⚠️  Frontend NOT responding (Expected if dev server not running)" -ForegroundColor Yellow
    $warnings += "Frontend dev server not running on localhost:5177"
}

Write-Host ""

# Test Backend Health
Write-Host "2️⃣  Testing Backend Health..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/serendipity/health" -UseBasicParsing -TimeoutSec 5
    if ($healthResponse.StatusCode -eq 200) {
        Write-Host "   ✅ Backend Health Check OK" -ForegroundColor Green
        $success++
    }
} catch {
    Write-Host "   ❌ Backend NOT responding" -ForegroundColor Red
    $errors += @{
        endpoint = "/api/serendipity/health"
        error = $_.Exception.Message
        status = "FAILED"
    }
}

Write-Host ""

# Test API Endpoints
Write-Host "3️⃣  Testing API Endpoints..." -ForegroundColor Yellow

$endpoints = @(
    @{name = "Financial"; url = "http://localhost:5000/api/serendipity/financial"},
    @{name = "Team"; url = "http://localhost:5000/api/serendipity/team"},
    @{name = "Alerts"; url = "http://localhost:5000/api/serendipity/alerts"},
    @{name = "Recommendations"; url = "http://localhost:5000/api/serendipity/recommendations"},
    @{name = "Dashboard (ALL)"; url = "http://localhost:5000/api/serendipity/dashboard"}
)

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri $endpoint.url -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✅ $($endpoint.name) endpoint OK" -ForegroundColor Green
            $success++
        }
    } catch {
        Write-Host "   ❌ $($endpoint.name) endpoint FAILED" -ForegroundColor Red
        $errors += @{
            endpoint = $endpoint.name
            url = $endpoint.url
            error = $_.Exception.Message
        }
    }
}

Write-Host ""

# Test CORS (Frontend → Backend Communication)
Write-Host "4️⃣  Testing Frontend → Backend Communication..." -ForegroundColor Yellow
try {
    $corsTest = Invoke-WebRequest -Uri "http://localhost:5000/api/serendipity/financial" `
        -Headers @{"Origin" = "http://localhost:5177"} `
        -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    
    if ($corsTest.Headers."Access-Control-Allow-Origin") {
        Write-Host "   ✅ CORS properly configured" -ForegroundColor Green
        $success++
    } else {
        Write-Host "   ⚠️  CORS headers not found (may need configuration)" -ForegroundColor Yellow
        $warnings += "CORS may need adjustment in backend Program.cs"
    }
} catch {
    Write-Host "   ⚠️  Cannot test CORS (backend may not be running)" -ForegroundColor Yellow
    $warnings += "Cannot test CORS - backend not accessible"
}

Write-Host ""

# Summary
Write-Host "════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📊 HEALTH CHECK SUMMARY" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($success -gt 0) {
    Write-Host "✅ $success checks passed" -ForegroundColor Green
}

if ($errors.Count -gt 0) {
    Write-Host ""
    Write-Host "❌ $($errors.Count) ERRORS:" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "   • $($error.endpoint): $($error.error)" -ForegroundColor Red
    }
}

if ($warnings.Count -gt 0) {
    Write-Host ""
    Write-Host "⚠️  $($warnings.Count) WARNINGS:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "   • $warning" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "════════════════════════════════════════════════" -ForegroundColor Cyan

if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "🎉 ALL SYSTEMS OPERATIONAL!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Frontend: http://localhost:5177" -ForegroundColor Green
    Write-Host "Backend:  http://localhost:5000" -ForegroundColor Green
    exit 0
} else {
    Write-Host ""
    Write-Host "🔧 TROUBLESHOOTING GUIDE:" -ForegroundColor Yellow
    Write-Host ""
    
    if ($errors.Count -gt 0) {
        Write-Host "Backend Issues:" -ForegroundColor Yellow
        Write-Host "1. Ensure .NET SDK 7.0+ is installed" -ForegroundColor Gray
        Write-Host "2. Run: .\start-backend.ps1" -ForegroundColor Gray
        Write-Host "3. Check Program.cs for correct ports" -ForegroundColor Gray
        Write-Host "4. Check Windows Firewall (allow port 5000)" -ForegroundColor Gray
    }
    
    if ($warnings.Count -gt 0) {
        Write-Host ""
        Write-Host "Frontend Issues:" -ForegroundColor Yellow
        Write-Host "1. Frontend dev server: npm run dev" -ForegroundColor Gray
        Write-Host "2. Check CORS in backend" -ForegroundColor Gray
    }
    
    exit 1
}
