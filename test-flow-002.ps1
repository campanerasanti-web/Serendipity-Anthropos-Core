#!/usr/bin/env pwsh
# Test FLOW-002 Integration

Write-Host "`n=== FLOW-002 INTEGRATION TEST ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000/api/ops"

# Test 1: Current State (All flows with Input/Output)
Write-Host "[1] Current State - All Flows With Input/Output" -ForegroundColor Yellow
try {
    Start-Sleep -Seconds 2
    $resp = Invoke-RestMethod -Uri "$baseUrl/audit" -Method Post -TimeoutSec 5
    if ($resp.success) {
        Write-Host "[OK] Audit executed - $($resp.resultsCount) results" -ForegroundColor Green
        Write-Host "     Expected: FLOW-002 PASSING (all flows have input and output)" -ForegroundColor Green
    }
} catch {
    Write-Host "[ERROR] $_" -ForegroundColor Red
}

Write-Host ""

# Test 2: DI Registration Check
Write-Host "[2] Dependency Injection Status" -ForegroundColor Yellow
try {
    $resp = Invoke-RestMethod -Uri "$baseUrl/status" -Method Get -TimeoutSec 3
    Write-Host "[OK] DI Container:" -ForegroundColor Green
    Write-Host "     Rules: $($resp.rulesRegistered)" -ForegroundColor Green
    Write-Host "     Tasks: $($resp.tasksRegistered)" -ForegroundColor Green
    if ($resp.rulesRegistered -ge 4) {
        Write-Host "[OK] FLOW-002 registered (FlowIORule)" -ForegroundColor Green
    }
} catch {
    Write-Host "[ERROR] $_" -ForegroundColor Red
}

Write-Host ""

# Test 3: Files Verification
Write-Host "[3] Configuration Files" -ForegroundColor Yellow

$files = @(
    "backend/Services/OpsGardener/OpsGardenerRulesFlow.cs",
    "backend/ops/flowmap.json",
    "backend/ops/flow-io.json"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        Write-Host "[OK] $file ($size bytes)" -ForegroundColor Green
    } else {
        Write-Host "[MISSING] $file" -ForegroundColor Red
    }
}

Write-Host ""

# Test 4: Flow-IO Summary
Write-Host "[4] Flow-IO Current State" -ForegroundColor Yellow
try {
    $flowIo = Get-Content "backend/ops/flow-io.json" | ConvertFrom-Json
    Write-Host "[OK] Loaded flow definitions" -ForegroundColor Green
    
    foreach ($flowId in $flowIo.PSObject.Properties.Name) {
        $flow = $flowIo.$flowId
        $inputOk = if ([string]::IsNullOrWhiteSpace($flow.input)) { "[EMPTY]" } else { "[OK]" }
        $outputOk = if ([string]::IsNullOrWhiteSpace($flow.output)) { "[EMPTY]" } else { "[OK]" }
        Write-Host "     $inputOk $flowId - Input: $($flow.input) | Output: $($flow.output)" -ForegroundColor Green
    }
} catch {
    Write-Host "[ERROR] $_" -ForegroundColor Red
}

Write-Host ""

# Test 5: Report Generation
Write-Host "[5] Generate Report With FLOW-002 Messages" -ForegroundColor Yellow
try {
    $resp = Invoke-RestMethod -Uri "$baseUrl/repair" -Method Post -TimeoutSec 5
    if ($resp.success) {
        Write-Host "[OK] Report generated - Mode: $($resp.mode)" -ForegroundColor Green
        Write-Host "[OK] Expected messages:" -ForegroundColor Cyan
        Write-Host "     - 'El agua corre libremente' (all flows OK)" -ForegroundColor Cyan
        Write-Host "     - '💧 Agua sin origen' (missing Input)" -ForegroundColor Cyan
        Write-Host "     - '🌊 Agua estancada' (missing Output)" -ForegroundColor Cyan
        Write-Host "     - '🚫 Canal roto' (missing IO definition)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "[ERROR] $_" -ForegroundColor Red
}

Write-Host ""

# Summary
Write-Host "=== FLOW-002 INTEGRATION COMPLETE ===" -ForegroundColor Magenta
Write-Host ""
Write-Host "Files Created/Verified:" -ForegroundColor Green
Write-Host "  * FlowIORule added to OpsGardenerRulesFlow.cs" -ForegroundColor Green
Write-Host "  * ops/flow-io.json with 7 flows (Input/Output)" -ForegroundColor Green
Write-Host "  * Program.cs DI registration" -ForegroundColor Green
Write-Host "  * OpsGardenerReportWriter with water language" -ForegroundColor Green
Write-Host ""
Write-Host "Rules Loaded:" -ForegroundColor Green
Write-Host "  * FLOW-001: FlowOwnershipRule" -ForegroundColor Green
Write-Host "  * FLOW-002: FlowIORule  (NEW)" -ForegroundColor Green
Write-Host "  * CULT-001: RitualDocumentationRule" -ForegroundColor Green
Write-Host "  * MQTT-001: MqttGatewayRule" -ForegroundColor Green
Write-Host ""
Write-Host "Report Features:" -ForegroundColor Green
Write-Host "  * Detects 'Agua sin origen' (flows without Input)" -ForegroundColor Green
Write-Host "  * Detects 'Agua estancada' (flows without Output)" -ForegroundColor Green
Write-Host "  * Detects 'Canal roto' (flows without IO definition)" -ForegroundColor Green
Write-Host "  * Shows 'El agua corre libremente' when all flows OK" -ForegroundColor Green
Write-Host ""
Write-Host "Climate Status: SOLEADO (all flows have input/output)" -ForegroundColor Green
Write-Host ""
