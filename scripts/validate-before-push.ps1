# Valida la estructura antes de hacer push
# Uso: & scripts/validate-before-push.ps1

Write-Host "🔍 Iniciando validación pre-push..." -ForegroundColor Cyan

$errors = @()
$warnings = @()

# 1. Verificar packages.lock.json
Write-Host "  ✓ Verificando packages.lock.json..." -NoNewline
if (Test-Path "packages.lock.json") {
    Write-Host " ✅" -ForegroundColor Green
} else {
    $errors += "❌ packages.lock.json no encontrado en root"
    Write-Host " ❌" -ForegroundColor Red
}

# 2. Verificar Program.cs
Write-Host "  ✓ Verificando Program.cs..." -NoNewline
$programCs = Get-Content "backend/Program.cs" -Raw
if ($programCs -match "DATABASE_URL") {
    Write-Host " ✅" -ForegroundColor Green
} else {
    $errors += "❌ Program.cs no configurado para DATABASE_URL"
    Write-Host " ❌" -ForegroundColor Red
}

# 3. Verificar Tests.csproj
Write-Host "  ✓ Verificando Tests.csproj..." -NoNewline
$testsCsproj = Get-Content "backend/Tests/Tests.csproj" -Raw
if ($testsCsproj -match "xunit") {
    Write-Host " ✅" -ForegroundColor Green
} else {
    $errors += "❌ Tests.csproj sin xunit"
    Write-Host " ❌" -ForegroundColor Red
}

# 4. Verificar workflows
Write-Host "  ✓ Verificando workflows..." -NoNewline
$workflowCount = (Get-ChildItem ".github/workflows/*.yml" -ErrorAction SilentlyContinue).Count
if ($workflowCount -ge 8) {
    Write-Host " ✅" -ForegroundColor Green
} else {
    $warnings += "⚠️  Solo $workflowCount workflows encontrados (esperados 8+)"
    Write-Host " ⚠️ " -ForegroundColor Yellow
}

# 5. Verificar no haya secrets en código
Write-Host "  ✓ Escaneando secrets en código..." -NoNewline
$secretPatterns = @("password=", "api_key=", "secret=", "token=")
$secretsFound = $false
foreach ($pattern in $secretPatterns) {
    $matches = Get-ChildItem "src/", "backend/" -Recurse -Include "*.cs", "*.tsx", "*.ts" | 
               Select-String -Pattern $pattern -ErrorAction SilentlyContinue
    if ($matches) {
        $secretsFound = $true
        break
    }
}
if (-not $secretsFound) {
    Write-Host " ✅" -ForegroundColor Green
} else {
    $warnings += "⚠️  Posibles secrets encontrados en código"
    Write-Host " ⚠️ " -ForegroundColor Yellow
}

# 6. Verificar .gitignore
Write-Host "  ✓ Verificando .gitignore..." -NoNewline
if (Test-Path ".gitignore") {
    $gitIgnore = Get-Content ".gitignore" -Raw
    if ($gitIgnore -match "bin/" -and $gitIgnore -match "obj/" -and $gitIgnore -match "node_modules/" -and $gitIgnore -match ".env") {
        Write-Host " ✅" -ForegroundColor Green
    } else {
        $warnings += "⚠️  .gitignore incompleto"
        Write-Host " ⚠️ " -ForegroundColor Yellow
    }
} else {
    $errors += "❌ .gitignore no encontrado"
    Write-Host " ❌" -ForegroundColor Red
}

# 7. Verificar Git index
Write-Host "  ✓ Verificando estado de Git..." -NoNewline
$gitStatus = & git status --porcelain
if ($null -eq $gitStatus) {
    Write-Host " ✅ (sin cambios)" -ForegroundColor Green
} else {
    Write-Host " ⚠️  (cambios pendientes)" -ForegroundColor Yellow
}

# Resumen
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📋 RESUMEN DE VALIDACIÓN" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "✅ TODAS LAS VALIDACIONES PASARON" -ForegroundColor Green
    Write-Host ""
    Write-Host "Listo para hacer push:" -ForegroundColor Green
    Write-Host "  git add ." -ForegroundColor Gray
    Write-Host "  git commit -m 'mensaje'" -ForegroundColor Gray
    Write-Host "  git push" -ForegroundColor Gray
    exit 0
} else {
    if ($errors.Count -gt 0) {
        Write-Host ""
        Write-Host "❌ ERRORES CRÍTICOS:" -ForegroundColor Red
        foreach ($error in $errors) {
            Write-Host "   $error" -ForegroundColor Red
        }
    }
    
    if ($warnings.Count -gt 0) {
        Write-Host ""
        Write-Host "⚠️  ADVERTENCIAS:" -ForegroundColor Yellow
        foreach ($warning in $warnings) {
            Write-Host "   $warning" -ForegroundColor Yellow
        }
    }
    
    if ($errors.Count -gt 0) {
        Write-Host ""
        Write-Host "❌ NO PUEDES HACER PUSH hasta resolver los errores críticos" -ForegroundColor Red
        exit 1
    } else {
        Write-Host ""
        Write-Host "✅ Puedes hacer push pero revisa los warnings" -ForegroundColor Green
        exit 0
    }
}
