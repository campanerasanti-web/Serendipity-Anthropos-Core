#!/usr/bin/env powershell
# DESPERTAR LOS AGENTES DORMIDOS
# Santiago - 2026-02-15

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DESPERTADOR DE AGENTES" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Define los agentes a crear
$agentes_crear = @(
    "src/services/queries.ts",
    "src/hooks/useRealtimeSubscription.ts",
    "src/components/SerendipityDashboard.tsx",
    "backend/Services/SerendipityService.cs",
    "public/sw.js"
)

# 1. Crear directorios y archivos
foreach ($archivo in $agentes_crear) {
    $dir = Split-Path $archivo
    
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    
    # Crear archivo vacío si no existe
    if (-not (Test-Path $archivo)) {
        New-Item -ItemType File -Path $archivo -Force | Out-Null
        Add-Content -Path $archivo -Value "// AGENTE DESPIERTO`n"
        Write-Host "OK: $archivo" -ForegroundColor Green
    } else {
        Write-Host "EXISTE: $archivo" -ForegroundColor Yellow
    }
}

# 2. Crear health-check.ps1
$healthCheck = "health-check.ps1"
if (-not (Test-Path $healthCheck)) {
    $content = @"
# HEALTH CHECK SCRIPT

Write-Host "HEALTH CHECK - SERENDIPITY" -ForegroundColor Cyan
Write-Host ""

# Verificar agentes principales
`$agentes = @(
    "src/App.tsx",
    "backend/Controllers/SerendipityController.cs",
    "src/supabase/supabaseClient.ts"
)

foreach (`$agente in `$agentes) {
    if (Test-Path `$agente) {
        Write-Host "OK: `$agente" -ForegroundColor Green
    } else {
        Write-Host "MISSING: `$agente" -ForegroundColor Red
    }
}
"@
    Set-Content -Path $healthCheck -Value $content -Encoding UTF8
    Write-Host "OK: $healthCheck" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "AGENTES DESPIERTOS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""
