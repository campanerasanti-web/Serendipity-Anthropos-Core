# HEALTH CHECK - MONITOREO DE SISTEMA
# Santiago - 2026-02-15

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  HEALTH CHECK - SERENDIPITY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# === SECCION 1: VERIFICAR HERRAMIENTAS ===
Write-Host "TOOLS:" -ForegroundColor Yellow

# Node.js
if (Get-Command node -ErrorAction SilentlyContinue) {
    $ver = node --version
    Write-Host "  OK: Node.js $ver" -ForegroundColor Green
} else {
    Write-Host "  MISSING: Node.js" -ForegroundColor Red
}

# .NET
if (Get-Command dotnet -ErrorAction SilentlyContinue) {
    $ver = dotnet --version
    Write-Host "  OK: .NET $ver" -ForegroundColor Green
} else {
    Write-Host "  MISSING: .NET" -ForegroundColor Red
}

# Git
if (Get-Command git -ErrorAction SilentlyContinue) {
    $ver = git --version
    Write-Host "  OK: $ver" -ForegroundColor Green
} else {
    Write-Host "  MISSING: Git" -ForegroundColor Red
}

# === SECCION 2: VERIFICAR AGENTES PRINCIPALES ===
Write-Host ""
Write-Host "AGENTES CORE:" -ForegroundColor Yellow

$agentes_core = @(
    @{name = "Corazon (App.tsx)"; path = "src/App.tsx"},
    @{name = "Anclaje Supabase"; path = "src/supabase/supabaseClient.ts"},
    @{name = "Servicio Queries"; path = "src/services/queries.ts"},
    @{name = "Suscriptor Realtime"; path = "src/hooks/useRealtimeSubscription.ts"},
    @{name = "Dashboard"; path = "src/components/SerendipityDashboard.tsx"},
    @{name = "Service Backend"; path = "backend/Services/SerendipityService.cs"},
    @{name = "Controller API"; path = "backend/Controllers/SerendipityController.cs"},
    @{name = "PWA Guardian"; path = "public/sw.js"}
)

$despiertos = 0
$total = $agentes_core.Count

foreach ($agente in $agentes_core) {
    if (Test-Path $agente.path) {
        Write-Host "  OK: $($agente.name)" -ForegroundColor Green
        $despiertos++
    } else {
        Write-Host "  MISSING: $($agente.name)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "  Despiertos: $despiertos/$total" -ForegroundColor Cyan

# === SECCION 3: VERIFICAR DEPENDENCIAS ===
Write-Host ""
Write-Host "DEPENDENCIES:" -ForegroundColor Yellow

if (Test-Path "node_modules") {
    $size = (Get-ChildItem node_modules -Recurse | Measure-Object -Sum Length).Sum / 1MB
    Write-Host "  OK: npm ($([math]::Round($size, 1)) MB)" -ForegroundColor Green
} else {
    Write-Host "  MISSING: npm (ejecuta: npm install)" -ForegroundColor Red
}

if (Test-Path "backend/bin") {
    Write-Host "  OK: Backend compiled" -ForegroundColor Green
} else {
    Write-Host "  MISSING: Backend (ejecuta: dotnet build backend)" -ForegroundColor Red
}

if (Test-Path "dist") {
    $size = (Get-ChildItem dist -Recurse | Measure-Object -Sum Length).Sum / 1MB
    Write-Host "  OK: Frontend build ($([math]::Round($size, 1)) MB)" -ForegroundColor Green
} else {
    Write-Host "  MISSING: Frontend build (ejecuta: npm run build)" -ForegroundColor Red
}

# === SECCION 4: ESTADO GENERAL ===
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($despiertos -eq $total) {
    Write-Host "STATUS: TODOS LOS AGENTES DESPIERTOS" -ForegroundColor Green
} else {
    Write-Host "STATUS: $despiertos/$total AGENTES DESPIERTOS" -ForegroundColor Yellow
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
