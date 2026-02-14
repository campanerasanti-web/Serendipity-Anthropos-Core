# 🫀 SOFIA MONITORING SCRIPT
# Monitorea en tiempo real los agentes PARALINFA y LINFA
# Ejecuta cada 10 segundos y muestra estado colorizado

$baseUrl = "https://serendipity-backend1.onrender.com"

function Get-HealthColor {
    param($health)
    switch ($health) {
        "Healthy" { return "Green" }
        "Warning" { return "Yellow" }
        "Critical" { return "Red" }
        "Irregular" { return "Yellow" }
        "Arrhythmia" { return "Red" }
        default { return "Gray" }
    }
}

function Get-PhaseEmoji {
    param($phase)
    switch ($phase) {
        "DeepMaintenance" { return "🌙" }
        "Regeneration" { return "🌱" }
        "Awakening" { return "🌅" }
        "FullOperation" { return "☀️" }
        "NocturneMonitoring" { return "🌆" }
        default { return "❓" }
    }
}

Write-Host @"

╔════════════════════════════════════════════════════════════════╗
║                  🫀 SOFIA MONITORING DASHBOARD                 ║
║            Paralinfa (Frequency) + Linfa (Rhythm)              ║
╚════════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

$iteration = 0

while ($true) {
    $iteration++
    
    try {
        $timestamp = Get-Date -Format "HH:mm:ss"
        
        Write-Host "`n[$timestamp] Consulta #$iteration" -ForegroundColor DarkGray
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
        
        # Fetch status
        $response = Invoke-RestMethod -Uri "$baseUrl/api/sofia/status" -Method Get -TimeoutSec 10
        
        # Sofia Status
        Write-Host "`n🧠 SOFIA: " -NoNewline
        Write-Host "$($response.sofia_status)" -ForegroundColor Green
        Write-Host "   Message: $($response.message)" -ForegroundColor DarkGray
        
        # Paralinfa (Frequency)
        Write-Host "`n🟣 PARALINFA (Frequency Monitor):" -ForegroundColor Magenta
        $plColor = Get-HealthColor $response.paralinfa.health
        Write-Host "   Status: $($response.paralinfa.status)" -ForegroundColor $plColor
        Write-Host "   Pulse #: $($response.paralinfa.pulse_number)"
        Write-Host "   CPU: $([math]::Round($response.paralinfa.cpu_percent, 1))%" -ForegroundColor $(if ($response.paralinfa.cpu_percent -gt 90) { "Red" } elseif ($response.paralinfa.cpu_percent -gt 70) { "Yellow" } else { "Green" })
        Write-Host "   Memory: $([math]::Round($response.paralinfa.memory_percent, 1))%"
        Write-Host "   Latency: $([math]::Round($response.paralinfa.latency_ms, 0))ms"
        Write-Host "   RPS: $($response.paralinfa.requests_per_second)"
        
        # Linfa (Rhythm)
        Write-Host "`n🔵 LINFA (Rhythm Monitor):" -ForegroundColor Cyan
        $lfColor = Get-HealthColor $response.linfa.health
        $phaseEmoji = Get-PhaseEmoji $response.linfa.circadian_phase
        Write-Host "   Status: $($response.linfa.status)" -ForegroundColor $lfColor
        Write-Host "   Rhythm #: $($response.linfa.rhythm_number)"
        Write-Host "   Phase: $phaseEmoji $($response.linfa.circadian_phase)"
        Write-Host "   Cycle Time: $([math]::Round($response.linfa.cycle_time_min, 1)) min"
        Write-Host "   Success Rate: $([math]::Round($response.linfa.success_rate_percent, 1))%" -ForegroundColor $(if ($response.linfa.success_rate_percent -ge 95) { "Green" } elseif ($response.linfa.success_rate_percent -ge 80) { "Yellow" } else { "Red" })
        
        # Philosophy
        Write-Host "`n💭 Filosofía: " -NoNewline -ForegroundColor DarkGray
        Write-Host "`"$($response.philosophy)`"" -ForegroundColor DarkGray
        
    }
    catch {
        Write-Host "`n❌ ERROR: No se pudo conectar a Sofia" -ForegroundColor Red
        Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "Próxima actualización en 10 segundos... (Ctrl+C para salir)" -ForegroundColor DarkGray
    
    Start-Sleep -Seconds 10
}
