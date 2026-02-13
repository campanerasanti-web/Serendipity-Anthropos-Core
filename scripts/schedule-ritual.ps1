<#
.SYNOPSIS
  Programa el Ritual de Apertura para ejecutarse automáticamente a las 8:00 AM

.DESCRIPTION
  Crea una tarea programada en Windows que ejecuta el Ritual de Apertura
  del Jardinero de Operaciones todos los días a las 8:00 AM.

.EXAMPLE
  .\schedule-ritual.ps1
#>

$ErrorActionPreference = "Stop"

Write-Host @"

╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     🌅  PROGRAMADOR DEL RITUAL DE APERTURA                     ║
║                                                                ║
║     Configurando ejecución diaria a las 08:00 AM               ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

# Configuración
$taskName = "SerendipityBros-RitualApertura"
$taskDescription = "Ejecuta el Ritual de Apertura del Jardinero de Operaciones a las 8:00 AM"
$workingDir = $PSScriptRoot.Replace("\scripts", "")
$npmPath = (Get-Command npm -ErrorAction SilentlyContinue).Source

if (-not $npmPath) {
    Write-Host "❌ npm no encontrado en PATH. Instala Node.js primero." -ForegroundColor Red
    exit 1
}

# Acción: ejecutar npm run ops:ritual
$action = New-ScheduledTaskAction `
    -Execute $npmPath `
    -Argument "run ops:ritual" `
    -WorkingDirectory $workingDir

# Trigger: Todos los días a las 8:00 AM
$trigger = New-ScheduledTaskTrigger `
    -Daily `
    -At "08:00"

# Configuración de la tarea
$settings = New-ScheduledTaskSettingsSet `
    -StartWhenAvailable `
    -DontStopIfGoingOnBatteries `
    -AllowStartIfOnBatteries `
    -ExecutionTimeLimit (New-TimeSpan -Hours 1)

# Principal: Usuario actual
$principal = New-ScheduledTaskPrincipal `
    -UserId $env:USERNAME `
    -LogonType Interactive `
    -RunLevel Limited

Write-Host "📋 Creando tarea programada..." -ForegroundColor Yellow

try {
    # Eliminar tarea existente si existe
    $existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
    if ($existingTask) {
        Write-Host "   Eliminando tarea existente..." -ForegroundColor Gray
        Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    }

    # Registrar la nueva tarea
    Register-ScheduledTask `
        -TaskName $taskName `
        -Description $taskDescription `
        -Action $action `
        -Trigger $trigger `
        -Settings $settings `
        -Principal $principal | Out-Null

    Write-Host "✅ Tarea programada creada exitosamente" -ForegroundColor Green
    Write-Host ""
    Write-Host "📅 Configuración:" -ForegroundColor Cyan
    Write-Host "   Nombre: $taskName"
    Write-Host "   Horario: 8:00 AM (todos los días)"
    Write-Host "   Comando: npm run ops:ritual"
    Write-Host "   Directorio: $workingDir"
    Write-Host ""

    # Mostrar próxima ejecución
    $task = Get-ScheduledTask -TaskName $taskName
    $nextRun = (Get-ScheduledTaskInfo -TaskName $taskName).NextRunTime
    
    if ($nextRun) {
        Write-Host "⏰ Próxima ejecución: $($nextRun.ToString('dddd, dd MMMM yyyy HH:mm:ss'))" -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "💡 Comandos útiles:" -ForegroundColor Cyan
    Write-Host "   Ver tarea:      Get-ScheduledTask -TaskName '$taskName' | Format-List"
    Write-Host "   Ejecutar ahora: Start-ScheduledTask -TaskName '$taskName'"
    Write-Host "   Eliminar tarea: Unregister-ScheduledTask -TaskName '$taskName' -Confirm:`$false"
    Write-Host ""

    # Preguntar si ejecutar ahora como prueba
    $test = Read-Host "¿Ejecutar el ritual ahora como prueba? (s/n)"
    if ($test -eq "s" -or $test -eq "S") {
        Write-Host ""
        Write-Host "🌅 Ejecutando ritual de prueba..." -ForegroundColor Magenta
        Start-ScheduledTask -TaskName $taskName
        Start-Sleep -Seconds 2
        
        $taskInfo = Get-ScheduledTaskInfo -TaskName $taskName
        Write-Host "   Estado: $($taskInfo.LastTaskResult)" -ForegroundColor Gray
    }

} catch {
    Write-Host "❌ Error al crear la tarea programada:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🙏 El Jardinero está programado. Nos vemos al amanecer." -ForegroundColor Green
Write-Host ""
