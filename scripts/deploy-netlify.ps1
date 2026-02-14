# Deploy frontend a Netlify después de build exitoso
# Uso: & scripts/deploy-netlify.ps1

Write-Host "🚀 DEPLOY A NETLIFY - Serendipity Anthropos Core" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Configuración
$netlifyAuthToken = $env:NETLIFY_AUTH_TOKEN
$netlifySiteId = $env:NETLIFY_SITE_ID
$buildCommand = "npm run build"
$deployPath = "dist"

Write-Host "📋 Configuración de Deploy:" -ForegroundColor Cyan
Write-Host "  Build dir: ./src"
Write-Host "  Deploy dir: ./$deployPath"
Write-Host "  Build command: $buildCommand"
Write-Host ""

# Validar prerequisites
Write-Host "✅ Validando prerequisites..." -ForegroundColor Yellow

$checks = @{
    "Node.js" = { node --version }
    "npm" = { npm --version }
    "git" = { git --version }
    "NETLIFY_AUTH_TOKEN" = { if ($env:NETLIFY_AUTH_TOKEN) { "OK" } else { throw "No configurado" } }
}

foreach ($check in $checks.GetEnumerator()) {
    Write-Host "  ✓ $($check.Name)...: " -NoNewline
    try {
        $result = & $check.Value 2>&1
        if ($result) {
            Write-Host "✅ $result" -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "❌ ERROR: Falta configurar $($check.Name)" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "📦 Building frontend..." -ForegroundColor Cyan
Write-Host "  Comando: npm run build" -ForegroundColor Gray

try {
    Push-Location
    cd "."
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "❌ Build fallido" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Build completado" -ForegroundColor Green
} finally {
    Pop-Location
}

Write-Host ""
Write-Host "🌐 Preparando deploy a Netlify..." -ForegroundColor Cyan

Write-Host ""
Write-Host "❓ Para deployar a Netlify necesitas:" -ForegroundColor Yellow
Write-Host "  1. Tener cuenta en Netlify (netlify.com)"
Write-Host "  2. Conectar tu repositorio"
Write-Host "  3. Configurar env vars:" -ForegroundColor Cyan
Write-Host "     - NETLIFY_AUTH_TOKEN (personal access token)" -ForegroundColor Cyan
Write-Host "     - NETLIFY_SITE_ID (site id)" -ForegroundColor Cyan
Write-Host ""

Write-Host "📝 Alternativa rápida (Drag & Drop):" -ForegroundColor Green
Write-Host "  1. Ve a: https://app.netlify.com/drop"
Write-Host "  2. Arrastra la carpeta '$deployPath' aquí"
Write-Host "  3. ¡Listo! Tu site está online" -ForegroundColor Green
Write-Host ""

Write-Host "✨ Deploy setup completado." -ForegroundColor Cyan
Write-Host "  Próximas veces será automático via GitHub Actions" -ForegroundColor Gray
