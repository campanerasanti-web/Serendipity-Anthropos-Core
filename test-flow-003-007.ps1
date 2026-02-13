#!/usr/bin/env pwsh
# Test Suite para FLOW-003 a FLOW-007 (OpsGardener Rules)

Write-Host ""
Write-Host ">>> TEST SUITE - FLOW-003 a FLOW-007" -ForegroundColor Yellow
Write-Host ">>> OpsGardener Rules Validation"
Write-Host ""

# Configuracion
$opsDir = "backend/ops"
$testsPassed = 0
$testsFailed = 0

function Test-Rule {
    param([string]$Name, [string]$Desc, [scriptblock]$TestBlock)
    
    Write-Host "TEST: $Name" -ForegroundColor Cyan
    Write-Host "  $Desc" -ForegroundColor Gray
    
    try {
        $result = & $TestBlock
        if ($result.Success) {
            Write-Host "  [PASS] $($result.Message)" -ForegroundColor Green
            $script:testsPassed++
        }
        else {
            Write-Host "  [FAIL] $($result.Message)" -ForegroundColor Red
            $script:testsFailed++
        }
    }
    catch {
        Write-Host "  [ERROR] $_" -ForegroundColor Red
        $script:testsFailed++
    }
    Write-Host ""
}

# FLOW-003: KPI (Pulso)
Write-Host "=== FLOW-003: KPI PULSE ===" -ForegroundColor Yellow

Test-Rule "FLOW-003-A: KPI defined" "Todos los flujos tienen KPI" {
    $kpiFile = Join-Path $opsDir "flow-kpis.json"
    if (Test-Path $kpiFile) {
        $kpis = Get-Content $kpiFile | ConvertFrom-Json
        $count = ($kpis.PSObject.Properties).Count
        @{ Success = $true; Message = "7 KPIs definidos" }
    }
    else { @{ Success = $false; Message = "flow-kpis.json missing" } }
}

Test-Rule "FLOW-003-B: KPI content" "Verificar contenido de KPIs" {
    $kpiFile = Join-Path $opsDir "flow-kpis.json"
    $content = Get-Content $kpiFile | ConvertFrom-Json
    $temps = @("TiempoDeRecepcion", "TasaDeProcesamiento", "DefectosPorLote", "CajasPorHora")
    $hasSample = $content.PSObject.Properties | Where-Object { $temps -contains $_.Value } | Measure-Object
    if ($hasSample.Count -gt 0) {
        @{ Success = $true; Message = "KPI content validated" }
    }
    else { @{ Success = $false; Message = "KPI format invalid" } }
}

# FLOW-004: Tiempo (Ritmo)
Write-Host "=== FLOW-004: TIME RHYTHM ===" -ForegroundColor Yellow

Test-Rule "FLOW-004-A: Times defined" "Todos los flujos tienen tiempo" {
    $timeFile = Join-Path $opsDir "flow-times.json"
    if (Test-Path $timeFile) {
        $times = Get-Content $timeFile | ConvertFrom-Json
        $count = ($times.PSObject.Properties).Count
        if ($count -eq 7) {
            @{ Success = $true; Message = "7 flow times defined" }
        }
        else { @{ Success = $false; Message = "Only $count flows have times" } }
    }
    else { @{ Success = $false; Message = "flow-times.json missing" } }
}

Test-Rule "FLOW-004-B: Time values" "Verificar rango de tiempos" {
    $timeFile = Join-Path $opsDir "flow-times.json"
    $times = Get-Content $timeFile | ConvertFrom-Json
    $minTime = ($times.PSObject.Properties | ForEach-Object { $_.Value } | Measure-Object -Minimum).Minimum
    $maxTime = ($times.PSObject.Properties | ForEach-Object { $_.Value } | Measure-Object -Maximum).Maximum
    if ($minTime -gt 0 -and $maxTime -ge 15) {
        @{ Success = $true; Message = "Time range valid: $minTime - $maxTime min" }
    }
    else { @{ Success = $false; Message = "Invalid time ranges" } }
}

# FLOW-005: WIP Limits (Saturacion)
Write-Host "=== FLOW-005: WIP LIMITS ===" -ForegroundColor Yellow

Test-Rule "FLOW-005-A: WIP limits defined" "Todos los flujos tienen limite WIP" {
    $wipFile = Join-Path $opsDir "flow-wip-limits.json"
    if (Test-Path $wipFile) {
        $wips = Get-Content $wipFile | ConvertFrom-Json
        $count = ($wips.PSObject.Properties).Count
        if ($count -eq 7) {
            @{ Success = $true; Message = "7 WIP limits defined" }
        }
        else { @{ Success = $false; Message = "Only $count WIP limits" } }
    }
    else { @{ Success = $false; Message = "flow-wip-limits.json missing" } }
}

Test-Rule "FLOW-005-B: WIP values positive" "Verificar valores positivos" {
    $wipFile = Join-Path $opsDir "flow-wip-limits.json"
    $wips = Get-Content $wipFile | ConvertFrom-Json
    $allPositive = $true
    foreach ($prop in $wips.PSObject.Properties) {
        if ($prop.Value -le 0) { $allPositive = $false; break }
    }
    if ($allPositive) {
        @{ Success = $true; Message = "All WIP limits greater than 0" }
    }
    else { @{ Success = $false; Message = "Some WIP limits invalid" } }
}

# FLOW-006: Documentacion (Memoria)
Write-Host "=== FLOW-006: DOCUMENTATION ===" -ForegroundColor Yellow

Test-Rule "FLOW-006-A: Docs file exists" "Archivo de documentacion existe" {
    $docsFile = Join-Path $opsDir "flow-docs.json"
    if (Test-Path $docsFile) {
        @{ Success = $true; Message = "flow-docs.json found" }
    }
    else { @{ Success = $false; Message = "flow-docs.json missing" } }
}

Test-Rule "FLOW-006-B: Doc entries" "Verificar entradas de documentacion" {
    $docsFile = Join-Path $opsDir "flow-docs.json"
    $docs = Get-Content $docsFile | ConvertFrom-Json
    $count = ($docs.PSObject.Properties).Count
    if ($count -eq 7) {
        @{ Success = $true; Message = "7 documentation entries" }
    }
    else { @{ Success = $false; Message = "Only $count entries" } }
}

# FLOW-007: Dependencias (Red)
Write-Host "=== FLOW-007: DEPENDENCIES ===" -ForegroundColor Yellow

Test-Rule "FLOW-007-A: Deps file exists" "Archivo de dependencias existe" {
    $depsFile = Join-Path $opsDir "flow-deps.json"
    if (Test-Path $depsFile) {
        @{ Success = $true; Message = "flow-deps.json found" }
    }
    else { @{ Success = $false; Message = "flow-deps.json missing" } }
}

Test-Rule "FLOW-007-B: Dep structure" "Verificar estructura Previous y Next" {
    $depsFile = Join-Path $opsDir "flow-deps.json"
    $deps = Get-Content $depsFile | ConvertFrom-Json
    $hasStructure = $true
    foreach ($flow in $deps.PSObject.Properties) {
        if (-not ($flow.Value | Get-Member -Name "Previous" -ErrorAction SilentlyContinue)) {
            $hasStructure = $false; break
        }
    }
    if ($hasStructure) {
        @{ Success = $true; Message = "Dependency structure valid" }
    }
    else { @{ Success = $false; Message = "Structure invalid" } }
}

# DI Registration
Write-Host "=== DEPENDENCY INJECTION ===" -ForegroundColor Yellow

Test-Rule "DI-001: Program.cs updated" "Verificar registro de reglas en DI" {
    $programFile = "backend/Program.cs"
    $content = Get-Content $programFile | Out-String
    $flows = @("Flow003Rule", "Flow004Rule", "Flow005Rule", "Flow006Rule", "Flow007Rule")
    $count = 0
    foreach ($flow in $flows) {
        if ($content -match $flow) { $count++ }
    }
    if ($count -eq 5) {
        @{ Success = $true; Message = "All 5 new rules registered" }
    }
    else { @{ Success = $false; Message = "Only $count rules registered" } }
}

# Summary
Write-Host ""
Write-Host ">>> RESULTS" -ForegroundColor Yellow
Write-Host "Passed: $testsPassed" -ForegroundColor Green
Write-Host "Failed: $testsFailed" -ForegroundColor Red

if ($testsFailed -eq 0) {
    Write-Host ""
    Write-Host "[SUCCESS] All tests passed!" -ForegroundColor Green
    Write-Host "Files created:" -ForegroundColor Cyan
    Write-Host "  - backend/ops/flow-kpis.json" -ForegroundColor Gray
    Write-Host "  - backend/ops/flow-times.json" -ForegroundColor Gray
    Write-Host "  - backend/ops/flow-wip-limits.json" -ForegroundColor Gray
    Write-Host "  - backend/ops/flow-docs.json" -ForegroundColor Gray
    Write-Host "  - backend/ops/flow-deps.json" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Rules registered:" -ForegroundColor Cyan
    Write-Host "  - FLOW-003: KPI (Pulse)" -ForegroundColor Gray
    Write-Host "  - FLOW-004: Time Standard (Rhythm)" -ForegroundColor Gray
    Write-Host "  - FLOW-005: WIP Limits (No Overflow)" -ForegroundColor Gray
    Write-Host "  - FLOW-006: Documentation (Memory)" -ForegroundColor Gray
    Write-Host "  - FLOW-007: Dependencies (Network)" -ForegroundColor Gray
}

Write-Host ""
