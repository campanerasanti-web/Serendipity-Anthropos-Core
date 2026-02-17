# DESPERTAR TODOS LOS AGENTES - Master Orchestrator Script
# Ejecutar: .\activate-all-agents.ps1

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "           [*] DESPERTANDO LOS AGENTES DORMIDOS [*]           " -ForegroundColor Magenta
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "'Nada me pertenece, todo es del Padre.'" -ForegroundColor Yellow
Write-Host "'El punto de anclaje est establecido.'" -ForegroundColor Yellow
Write-Host ""
Start-Sleep 2

# 

Write-Host "[1] PASO 1: VERIFICAR AGENTES DORMIDOS" -ForegroundColor Cyan
Write-Host "--------------------------------------------------------" -ForegroundColor Gray
Write-Host ""

$agentes = @(
  @{name = "Corazn (App.tsx)"; path = "src/App.tsx"; type = "Frontend"},
  @{name = "Anclaje Supabase"; path = "src/supabase/supabaseClient.ts"; type = "Frontend"},
  @{name = "Servicio Queries"; path = "src/services/queries.ts"; type = "Frontend"},
  @{name = "Suscriptor Realtime"; path = "src/hooks/useRealtimeSubscription.ts"; type = "Frontend"},
  @{name = "Dashboard Transformador"; path = "src/components/SerendipityDashboard.tsx"; type = "Frontend"},
  @{name = "Service Backend"; path = "backend/Services/SerendipityService.cs"; type = "Backend"},
  @{name = "Controlador API"; path = "backend/Controllers/SerendipityController.cs"; type = "Backend"},
  @{name = "PWA Guardian"; path = "public/sw.js"; type = "PWA"},
  @{name = "Health Check"; path = "health-check.ps1"; type = "Verificacin"},
  @{name = "AGENTES_ACTIVADOS"; path = "AGENTES_ACTIVADOS.md"; type = "Documentacin"}
)

$dormidos = 0
$despiertos = 0

foreach ($agente in $agentes) {
  $existe = Test-Path $agente.path -ErrorAction SilentlyContinue
  if ($existe) {
    Write-Host "   [$($agente.type)] $($agente.name)" -ForegroundColor Green
    $despiertos++
  } else {
    Write-Host "   [$($agente.type)] $($agente.name) - NO ENCONTRADO" -ForegroundColor Red
    $dormidos++
  }
}

Write-Host ""
Write-Host "  Agentes despiertos: $despiertos" -ForegroundColor Green
Write-Host "  Agentes dormidos: $dormidos" -ForegroundColor Yellow
Write-Host ""
Start-Sleep 2

# 

Write-Host "[2] PASO 2: CALIBRAR SUPABASE" -ForegroundColor Cyan
Write-Host "--------------------------------------------------------" -ForegroundColor Gray
Write-Host ""

if (Test-Path ".env" -ErrorAction SilentlyContinue) {
  Write-Host "   .env encontrado" -ForegroundColor Green
  $envContent = Get-Content ".env"
  if ($envContent -match "VITE_SUPABASE_URL") {
    Write-Host "   VITE_SUPABASE_URL configurado" -ForegroundColor Green
  } else {
    Write-Host "  [!] VITE_SUPABASE_URL no encontrado en .env" -ForegroundColor Yellow
    Write-Host "     -> Agrega tus credenciales Supabase a .env" -ForegroundColor Gray
  }
  if ($envContent -match "VITE_SUPABASE_ANON_KEY") {
    Write-Host "   VITE_SUPABASE_ANON_KEY configurado" -ForegroundColor Green
  } else {
    Write-Host "  [!] VITE_SUPABASE_ANON_KEY no encontrado en .env" -ForegroundColor Yellow
  }
} else {
  Write-Host "  [!] .env NO encontrado creando template..." -ForegroundColor Yellow
  Write-Host ""
  Write-Host "Crea un archivo .env en la raz con:" -ForegroundColor Yellow
  Write-Host "  VITE_SUPABASE_URL=https://tu-proyecto.supabase.co" -ForegroundColor Gray
  Write-Host "  VITE_SUPABASE_ANON_KEY=tu-clave-anonima-aqui" -ForegroundColor Gray
}

Write-Host ""
Start-Sleep 2

# 

Write-Host "[3] PASO 3: VERIFICAR BUILD FRONTEND" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Gray
Write-Host ""

if (Test-Path "dist" -ErrorAction SilentlyContinue) {
  Write-Host "   Build frontend existe (dist/)" -ForegroundColor Green
  $distSize = (Get-ChildItem dist -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
  Write-Host "   Tamao: $([math]::Round($distSize, 2))MB" -ForegroundColor Cyan
} else {
  Write-Host "  [!] Build frontend NO existe" -ForegroundColor Yellow
  Write-Host "     -> Ejecutando: npm run build" -ForegroundColor Gray
  npm run build
  if ($LASTEXITCODE -eq 0) {
    Write-Host "   Build completado" -ForegroundColor Green
  } else {
    Write-Host "  [!] Build fall" -ForegroundColor Red
  }
}

Write-Host ""
Start-Sleep 2

# 

Write-Host "[4] PASO 4: VERIFICAR DEPENDENCIAS" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Gray
Write-Host ""

$deps = @(
  "node_modules",
  "backend/bin",
  "backend/obj"
)

foreach ($dep in $deps) {
  if (Test-Path $dep) {
    Write-Host "   $dep" -ForegroundColor Green
  } else {
    Write-Host "  [i] $dep - Instalar on-demand" -ForegroundColor Yellow
  }
}

if (-not (Test-Path "node_modules")) {
  Write-Host ""
  Write-Host "  [*] Instalando dependencias npm..." -ForegroundColor Yellow
  npm install
}

Write-Host ""
Start-Sleep 2

# 

Write-Host "[5] PASO 5: VERIFICACIN FINAL" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Gray
Write-Host ""

$checks = @{
  "Cdigo React" = { (Test-Path "src/App.tsx") -and (Select-String "export default App" src/App.tsx -ErrorAction SilentlyContinue) }
  "API Backend" = { Test-Path "backend/Controllers/SerendipityController.cs" }
  "Scripts" = { (Test-Path "health-check.ps1") -and (Test-Path "start-backend.ps1") }
  "Documentacin" = { Test-Path "AGENTES_ACTIVADOS.md" }
  "Build" = { Test-Path "dist/index.html" }
}

$todoBien = $true

foreach ($check in $checks.GetEnumerator()) {
  try {
    $result = & $check.Value
    if ($result) {
      Write-Host "   $($check.Key)" -ForegroundColor Green
    } else {
      Write-Host "  [!] $($check.Key)" -ForegroundColor Yellow
      $todoBien = $false
    }
  } catch {
    Write-Host "  [X] $($check.Key) - Error: $_" -ForegroundColor Red
    $todoBien = $false
  }
}

Write-Host ""

# 

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "              [*] AGENTES DESPERTADOS [*]              " -ForegroundColor Magenta
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

if ($todoBien) {
  Write-Host " TODOS LOS AGENTES ESTN LISTOS " -ForegroundColor Green
  Write-Host ""
  Write-Host "Siguiente: Ejecuta tus agentes" -ForegroundColor Cyan
  Write-Host ""
  Write-Host "  Terminal 1 - Backend:" -ForegroundColor Yellow
  Write-Host "    .\start-backend.ps1" -ForegroundColor Gray
  Write-Host ""
  Write-Host "  Terminal 2 - Frontend:" -ForegroundColor Yellow
  Write-Host "    npm run dev" -ForegroundColor Gray
  Write-Host ""
  Write-Host "  Terminal 3 - Health Check:" -ForegroundColor Yellow
  Write-Host "    .\health-check.ps1" -ForegroundColor Gray
  Write-Host ""
  Write-Host "  Browser:" -ForegroundColor Yellow
  Write-Host "    http://localhost:5177" -ForegroundColor Gray
  Write-Host ""
} else {
  Write-Host "[!] ALGUNOS AGENTES NECESITAN ATENCION" -ForegroundColor Yellow
  Write-Host ""
  Write-Host "Lee ACCIONES_AHORA_FEB12.md para solucionar." -ForegroundColor Yellow
}

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "'Nada me pertenece, todo es del Padre.'" -ForegroundColor Yellow
Write-Host "'El punto de anclaje est establecido.'" -ForegroundColor Yellow
Write-Host ""
Write-Host "La orquesta esta lista. ?Comenzamos la sinfonia?" -ForegroundColor Magenta
Write-Host ""

# ========================================================
# [ZONA DE ABUNDANCIA] - Búnker de Datos para Serendipity
# ========================================================
Write-Host "[ZONA DE ABUNDANCIA] Verificando acceso a C:\\Serendipity_Data" -ForegroundColor Cyan
if (-not (Test-Path "C:\Serendipity_Data")) {
  Write-Host "  [!] La carpeta C:\\Serendipity_Data NO existe." -ForegroundColor Yellow
  Write-Host "  Ejecuta como ADMINISTRADOR en PowerShell:" -ForegroundColor Gray
  Write-Host "    mkdir C:\\Serendipity_Data" -ForegroundColor White
  Write-Host "    takeown /f C:\\Serendipity_Data /r /d s" -ForegroundColor White
  Write-Host "    icacls C:\\Serendipity_Data /grant \"Todos:(OI)(CI)F\" /t" -ForegroundColor White
  Write-Host "    icacls C:\\Serendipity_Data /grant \"Everyone:(OI)(CI)F\" /t" -ForegroundColor White
  Write-Host "  Luego vuelve a ejecutar este script." -ForegroundColor Yellow
} else {
  $testFile = "C:\\Serendipity_Data\\conexion.txt"
  try {
    "Test de Luz" | Out-File -FilePath $testFile -ErrorAction Stop
    if (Test-Path $testFile) {
      Write-Host "  ¡CONEXIÓN ESTABLECIDA! El sistema tiene vía libre en C:\\Serendipity_Data." -ForegroundColor Green
      Remove-Item $testFile -ErrorAction SilentlyContinue
    } else {
      Write-Host "  [!] No se pudo crear archivo de prueba en C:\\Serendipity_Data." -ForegroundColor Red
      Write-Host "  Revisa los permisos con:" -ForegroundColor Gray
      Write-Host "    takeown /f C:\\Serendipity_Data /r /d s" -ForegroundColor White
      Write-Host "    icacls C:\\Serendipity_Data /grant \"Todos:(OI)(CI)F\" /t" -ForegroundColor White
      Write-Host "    icacls C:\\Serendipity_Data /grant \"Everyone:(OI)(CI)F\" /t" -ForegroundColor White
    }
  } catch {
    Write-Host "  [!] Error de acceso a C:\\Serendipity_Data: $_" -ForegroundColor Red
    Write-Host "  Ejecuta como ADMINISTRADOR:" -ForegroundColor Gray
    Write-Host "    takeown /f C:\\Serendipity_Data /r /d s" -ForegroundColor White
    Write-Host "    icacls C:\\Serendipity_Data /grant \"Todos:(OI)(CI)F\" /t" -ForegroundColor White
    Write-Host "    icacls C:\\Serendipity_Data /grant \"Everyone:(OI)(CI)F\" /t" -ForegroundColor White
  }
}
Write-Host "" 

