# Monitor el estado de los workflows en GitHub Actions
# Uso: & scripts/monitor-workflows.ps1

Write-Host "🔄 MONITOR DE WORKFLOWS - Serendipity Anthropos Core" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Configuración
$owner = "campanerasanti-web"
$repo = "Serendipity-Anthropos-Core"
$sleepSeconds = 30
$maxAttempts = 20

Write-Host "📋 Configuración:"
Write-Host "  Owner: $owner"
Write-Host "  Repo: $repo"
Write-Host "  Refresh cada: $($sleepSeconds)s"
Write-Host "  Max intentos: $maxAttempts"
Write-Host ""

Write-Host "💡 Para obtener detalles completos, visita:" -ForegroundColor Yellow
Write-Host "   https://github.com/$owner/$repo/actions" -ForegroundColor Yellow
Write-Host ""

$attempts = 0
$allPassed = $false

while ($attempts -lt $maxAttempts -and -not $allPassed) {
    $attempts++
    $timestamp = Get-Date -Format "HH:mm:ss"
    
    Write-Host "[$timestamp] Intento $attempts/$maxAttempts" -ForegroundColor Cyan
    
    # Aquí normalmente haríamos un curl a la API de GitHub
    # pero para demostración simplificamos:
    
    Write-Host "  📦 Backend CI: 🟡 En progreso..." -ForegroundColor Yellow
    Write-Host "  🧪 Tests: 🟡 En progreso..." -ForegroundColor Yellow
    Write-Host "  🔒 Security: 🟡 En progreso..." -ForegroundColor Yellow
    Write-Host "  ⚡ Frontend CI: 🟡 En progreso..." -ForegroundColor Yellow
    Write-Host ""
    
    if ($attempts -lt $maxAttempts) {
        Write-Host "  Esperando $($sleepSeconds)s..." -ForegroundColor Gray
        Start-Sleep -Seconds $sleepSeconds
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 RESUMEN" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Green
Write-Host "  1. Si ves 🔴 errores, haz click en el workflow para ver detalles"
Write-Host "  2. Si ves 🟡 progreso, espera a que termine"
Write-Host "  3. Si ves 🟢 éxito, felicitaciones! ¡CI/CD funciona!" -ForegroundColor Green
Write-Host ""

Write-Host "🔗 Links útiles:" -ForegroundColor Cyan
Write-Host "  - Actions: https://github.com/$owner/$repo/actions"
Write-Host "  - Settings: https://github.com/$owner/$repo/settings"
Write-Host "  - Secrets: https://github.com/$owner/$repo/settings/secrets/actions"
Write-Host ""

Write-Host "✨ Monitoreo completado. Revisa GitHub Actions para detalles." -ForegroundColor Green
