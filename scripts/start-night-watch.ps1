<#
.SYNOPSIS
  Inicia la Vigilancia Nocturna del Jardinero de Operaciones

.DESCRIPTION
  Ejecuta el Jardinero en modo harmonize en segundo plano durante la noche
  (22:00 - 06:00) con checks cada hora.

.EXAMPLE
  .\start-night-watch.ps1
#>

$ErrorActionPreference = "Stop"

Write-Host @"

╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     🌙  VIGILANCIA NOCTURNA - EL JARDINERO SILENCIOSO         ║
║                                                                ║
║     "Los mejores guardianes trabajan mientras otros duermen"  ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

$workingDir = $PSScriptRoot.Replace("\scripts", "")

Write-Host "🌱 Preparando el Jardinero para la vigilia nocturna..." -ForegroundColor Yellow
Write-Host ""
Write-Host "📊 Configuración:" -ForegroundColor Cyan
Write-Host "   Modo: harmonize (armonización silenciosa)"
Write-Host "   Horario: 22:00 - 06:00"
Write-Host "   Intervalo: Cada hora"
Write-Host "   Logs: ops/logs/"
Write-Host "   Reportes: ops/reports/"
Write-Host ""

$confirm = Read-Host "¿Iniciar vigilancia nocturna? (s/n)"

if ($confirm -ne "s" -and $confirm -ne "S") {
    Write-Host "❌ Vigilancia cancelada" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🌙 Iniciando vigilancia en segundo plano..." -ForegroundColor Magenta

# Iniciar el script de vigilancia en una nueva ventana de PowerShell
$processArgs = @(
    "-NoExit",
    "-Command",
    "cd '$workingDir'; npm run ops:watch"
)

$process = Start-Process `
    -FilePath "powershell.exe" `
    -ArgumentList $processArgs `
    -WindowStyle Normal `
    -PassThru

Write-Host ""
Write-Host "✅ Vigilancia nocturna activada (PID: $($process.Id))" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Comandos útiles:" -ForegroundColor Cyan
Write-Host "   Ver logs en tiempo real: Get-Content ops\logs\watch-*.jsonl -Wait -Tail 10"
Write-Host "   Detener vigilancia: Stop-Process -Id $($process.Id)"
Write-Host "   Ver último reporte: Get-Content ops\reports\gardener-report-*.md | Select-Object -Last 50"
Write-Host ""
Write-Host "🙏 El Jardinero vigila. Descansa tranquilo." -ForegroundColor Green
Write-Host ""
