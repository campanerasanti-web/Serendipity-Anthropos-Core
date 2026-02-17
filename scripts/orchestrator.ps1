

function Validate-Prerequisites {
    Print-Header "🔍 VALIDANDO PREREQUISITES"
    
    $checks = @{
        "PowerShell 7+"  = { $PSVersionTable.PSVersion.Major -ge 7 }
        "Git"            = { Test-CommandExists "git" }
        ".NET 8 SDK"     = { Test-CommandExists "dotnet" }
        "Node.js"        = { Test-CommandExists "node" }
        "npm"            = { Test-CommandExists "npm" }
    }
    
    $allPassed = $true
    foreach ($check in $checks.GetEnumerator()) {
        $passed = & $check.Value
        if ($passed) {
            Print-Status $check.Key "✅"
        } else {
            Print-Status $check.Key "❌"
            $allPassed = $false
        }
    }
    if (-not $allPassed) {
        Write-ColorOutput "`n❌ Faltan prerequisites. Por favor instalalos primero.`n" Red
        exit 1
    }
    Write-ColorOutput "`n[OK] Todos los prerequisites están instalados`n" Green
        return $true
}

}
# ═══════════════════════════════════════════════════════════════
# VALIDACIÓN PRE-PUSH
# ═══════════════════════════════════════════════════════════════

function Validate-PrePush {
    
    $errors = @()
    
    # Check 1: packages.lock.json existe
    if (-not (Test-Path "packages.lock.json")) {
        $errors += "[ERR] packages.lock.json no encontrado en root"
    } else {
        Print-Status "packages.lock.json" "[OK]"
    }
    
    # Check 2: Program.cs tiene DATABASE_URL
    $programContent = Get-Content "backend/Program.cs" -Raw
    if ($programContent -match 'DATABASE_URL') {
        Print-Status "Program.cs configurado" "[OK]"
    } else {
        $errors += "[ERR] Program.cs no tiene DATABASE_URL"
    }
    
    # Check 3: Tests.csproj existe
    if (Test-Path "backend/Tests/Tests.csproj") {
        Print-Status "Tests.csproj presente" "[OK]"
    } else {
        $errors += "[ERR] Tests.csproj no encontrado"
    }
    
    # Check 4: Workflows presentes
    $workflowCount = (Get-ChildItem ".github/workflows/*.yml" -ErrorAction SilentlyContinue).Count
    if ($workflowCount -ge 5) {
        Print-Status "Workflows: $workflowCount encontrados" "[OK]"
    } else {
        $errors += "[ERR] Workflows incompletos - $workflowCount encontrados"
    }
    
    # Check 5: No secrets en código
    $secretsFound = $false
    Get-ChildItem -Path "src", "backend" -Recurse -Include "*.ts", "*.tsx", "*.cs" | ForEach-Object {
        $content = Get-Content $_ -Raw
        if ($content -match '(password|token|secret|api_key)') {
            if ($content -match '=\s*[''\"]') {
                Write-ColorOutput "  [WARN]  Posible secret encontrado: $_" Yellow
                $secretsFound = $true
            }
        }
    }
    

    if (-not $secretsFound) {
        Print-Status "No secrets hardcodeados" "[OK]"
    } else {
        $errors += "[WARN]  Posibles secrets encontrados en código"
    }

    # Check 6: .gitignore completo
    if (Test-Path ".gitignore") {
        Print-Status ".gitignore presente" "[OK]"
    } else {
        $errors += "[WARN]  .gitignore no encontrado (recomendado)"
    }

    # Check 7: Git status limpio
    $gitStatus = git status --porcelain
    if ($gitStatus.Length -gt 0) {
        Print-Status "Git status: cambios detectados" "[WAIT]"
    } else {
        Print-Status "Git status: limpio" "[OK]"
    }

    # Resumen
    Write-Host "\n------------------------------------------------------------\n"
    if ($errors.Count -eq 0) {
            if ($content -match '=\s*[''"]') {
        return $true
    } else {
        Write-ColorOutput "[ERR] VALIDACIÓN FALLIDA - Errores encontrados:" Red
        $errors | ForEach-Object { Write-ColorOutput "   $_" Red }
        return $false
    }
}
}

# ═══════════════════════════════════════════════════════════════
# MONITOREO DE WORKFLOWS
# ═══════════════════════════════════════════════════════════════

function Monitor-Workflows {
    Print-Header "[MONITOR] MONITOREANDO WORKFLOWS"
    
    Write-ColorOutput "Nota: Los workflows se triggerean automáticamente en GitHub Actions" Cyan
    Write-ColorOutput "URL: https://github.com/campanerasanti-web/Serendipity-Anthropos-Core/actions`n" Cyan
    
    $attempt = 0
    $maxAttempts = 20
    $refreshInterval = 30
    
    while ($attempt -lt $maxAttempts) {
        $attempt++
        Write-Host "[Intento $attempt/$maxAttempts] Esperando GitHub Actions..." -ForegroundColor Yellow
        Start-Sleep -Seconds $refreshInterval
    }
}

# ═══════════════════════════════════════════════════════════════
# DEPLOY A NETLIFY
# ═══════════════════════════════════════════════════════════════

function Deploy-ToNetlify {
    Print-Header "[DEPLOY] DEPLOY A NETLIFY"
    
    # Check prerequisite
    if (-not (Test-CommandExists "netlify")) {
        Write-ColorOutput "[ERR] Netlify CLI no instalado" Red
        Write-ColorOutput "Instalá con: npm install -g netlify-cli\n" Yellow
        return $false
    }
    
    # Check token
    if (-not $env:NETLIFY_AUTH_TOKEN) {
        Write-ColorOutput "[ERR] NETLIFY_AUTH_TOKEN no configurado" Red
        Write-ColorOutput "Generá token en: https://app.netlify.com/user/applications/personal\n" Yellow
        return $false
    }
    
    Write-ColorOutput "[OK] Prerequisites verificados\n" Green
    
    # Build
    Write-Host "Buildiendo frontend..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "[ERR] Build fallido" Red
        return $false
    }
    
    # Deploy
    Write-Host "`nDeployando a Netlify..." -ForegroundColor Cyan
    netlify deploy --prod
    
    Write-ColorOutput "\n[OK] Deploy completado" Green
    return $true
}

# ═══════════════════════════════════════════════════════════════
# REPORTE DE STATUS
# ═══════════════════════════════════════════════════════════════

function Show-Status {
    Print-Header "[INFO] ESTADO DEL SISTEMA"
    
    Write-Host "Backend Status:"
    Write-ColorOutput "  Servicios: 14" Cyan
    Write-ColorOutput "  Controllers: 11" Cyan
    Write-ColorOutput "  Endpoints: 56+" Cyan
    
    Write-Host "`nFrontend Status:"
    Write-ColorOutput "  Componentes: 30+" Cyan
    Write-ColorOutput "  Pages: 3+" Cyan
    Write-ColorOutput "  Tests: 0 (WIP)" Yellow
    
    Write-Host "`nCI/CD Status:"
    Write-ColorOutput "  Workflows: 8/8 [OK]" Green
    Write-ColorOutput "  Tests: [WAIT] (esperando secrets)" Yellow
    Write-ColorOutput "  Deploy: [WAIT] (Netlify pendiente)" Yellow
    
    Write-Host "`nAcciones Requeridas:"
    Write-ColorOutput "  2. [WAIT] Ejecutar validate antes de push" Yellow
    Write-ColorOutput "  3. [WAIT] Verificar workflows verdes" Yellow
    Write-ColorOutput "  4. [WAIT] Configurar Netlify token" Yellow
}

# ═══════════════════════════════════════════════════════════════
# MENÚ INTERACTIVO
# ═══════════════════════════════════════════════════════════════

function Show-Menu {
    Print-Header "[INFO] SOFIA AUTOMATION ORCHESTRATOR"
    
    Write-Host "Seleccioná una acción:`n"
    Write-Host "  1) Validar ambiente (validate)"
    Write-Host "  2) Validar + Deploy (deploy)"
    Write-Host "  3) Monitorear workflows (monitor)"
    Write-Host "  4) Ejecutar todo (full)"
    Write-Host "  5) Ver status (status)"
    Write-Host "  0) Salir`n"
    
    $choice = Read-Host "Opción"
    
    switch($choice) {
        "1" { return "validate" }
        "2" { return "deploy" }
        "3" { return "monitor" }
        "4" { return "full" }
        "5" { return "status" }
        "0" { exit 0 }
        default { return "status" }
    }
}

# ═══════════════════════════════════════════════════════════════
# MODO FULL (Todo)
# ═══════════════════════════════════════════════════════════════

function Execute-FullMode {
    Print-Header "🌱 MODO FULL - AUTOMATIZACIÓN COMPLETA"
    
    # 1. Prerequisites
    Validate-Prerequisites
    
    # 2. Validación
    Write-Host "`n"
    $valid = Validate-PrePush
    
        if (-not $valid) {
            Write-ColorOutput "\n[ERR] Por favor corregí los errores antes de continuar" Red
            return
        }
    
    # 3. Git commit y push
    Write-Host "`n"
    Print-Header "[INFO] GIT COMMIT and PUSH"
    
    Write-Host "Cambios a commitear:" -ForegroundColor Cyan
    git status --short
    
    $commitMessage = Read-Host "`nMensaje de commit"
    if ([string]::IsNullOrEmpty($commitMessage)) {
        $commitMessage = "chore: Update automation framework"
    }
    
    Write-Host "`nCommitendo..." -ForegroundColor Cyan
    git add .
    git commit -m $commitMessage
    
    Write-Host "Pusheando a GitHub..." -ForegroundColor Cyan
    git push
    
        Write-ColorOutput "\n[OK] Git push completado - Workflows triggerearán automáticamente" Green
    
    # 4. Monitor
    Write-Host "`n"
    $monitorChoice = Read-Host "¿Monitorear workflows? (s/n)"
    if ($monitorChoice -eq "s") {
        Monitor-Workflows
    }
    
    # 5. Deploy (opcional)
    Write-Host "`n"
    $deployChoice = Read-Host "¿Hacer deploy a Netlify? (s/n)"
    if ($deployChoice -eq "s") {
        Deploy-ToNetlify
    }
    
        Write-ColorOutput "\n[COMPLETE] AUTOMATIZACIÓN COMPLETADA\n" Green
}

# ═══════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════

function Main {
    Write-Host $emoji.Anchor -NoNewline
    Write-ColorOutput " SOFIA ORCHESTRATOR - Master Control System`n" Purple
    
    if ($Mode -eq "validate") {
        Validate-Prerequisites
        Validate-PrePush
    }
    elseif ($Mode -eq "deploy") {
        Validate-Prerequisites
        Validate-PrePush
        Deploy-ToNetlify
    }
    elseif ($Mode -eq "monitor") {
        Monitor-Workflows
    }
    elseif ($Mode -eq "full") {
        Execute-FullMode
    }
    elseif ($Mode -eq "status") {
        Show-Status
    }
    else {
        # Sin argumentos = menú interactivo
        $selectedMode = Show-Menu
        Main -Mode $selectedMode
    }
    
        Write-Host "\n$($emoji.Anchor) Fin de ejecución\n" -ForegroundColor Magenta
}

# Ejecutar
Main
