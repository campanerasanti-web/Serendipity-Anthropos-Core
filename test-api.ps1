#!/usr/bin/env pwsh

Write-Host "`n[TESTS] OpsGardener Backend API Tests" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:5000/api/ops"
$headers = @{
    "Content-Type" = "application/json"
}

# Test 1: Health Check
Write-Host "[TEST 1] GET /api/ops/health" -ForegroundColor Yellow
try {
    $resp = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get -TimeoutSec 3
    Write-Host "[OK] Success" -ForegroundColor Green
    $resp | ConvertTo-Json | Write-Host -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed: $_" -ForegroundColor Red
}

Write-Host "`n"

# Test 2: Status Check
Write-Host "[TEST 2] GET /api/ops/status" -ForegroundColor Yellow
try {
    $resp = Invoke-RestMethod -Uri "$baseUrl/status" -Method Get -TimeoutSec 3
    Write-Host "[OK] Success" -ForegroundColor Green
    $resp | ConvertTo-Json -Depth 5 | Write-Host -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed: $_" -ForegroundColor Red
}

Write-Host "`n"

# Test 3: Run Audit
Write-Host "[TEST 3] POST /api/ops/audit" -ForegroundColor Yellow
try {
    $resp = Invoke-RestMethod -Uri "$baseUrl/audit" -Method Post -TimeoutSec 5
    Write-Host "[OK] Success" -ForegroundColor Green
    $resp | ConvertTo-Json -Depth 5 | Write-Host -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed: $_" -ForegroundColor Red
}

Write-Host "`n"

# Test 4: Run Repair
Write-Host "[TEST 4] POST /api/ops/repair" -ForegroundColor Yellow
try {
    $resp = Invoke-RestMethod -Uri "$baseUrl/repair" -Method Post -TimeoutSec 5
    Write-Host "[OK] Success" -ForegroundColor Green
    $resp | ConvertTo-Json -Depth 5 | Write-Host -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed: $_" -ForegroundColor Red
}

Write-Host "`n"

# Test 5: Energy Event
Write-Host "[TEST 5] POST /api/ops/energy-event" -ForegroundColor Yellow
try {
    $body = @{
        Topic = "garden/mqtt/energy/anomaly"
        Value = 1250
        Threshold = 1000
    } | ConvertTo-Json
    
    $resp = Invoke-RestMethod -Uri "$baseUrl/energy-event" -Method Post -Body $body -Headers $headers -TimeoutSec 5
    Write-Host "[OK] Success" -ForegroundColor Green
    $resp | ConvertTo-Json -Depth 5 | Write-Host -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed: $_" -ForegroundColor Red
}

Write-Host "`n[DONE] All tests completed!" -ForegroundColor Cyan
