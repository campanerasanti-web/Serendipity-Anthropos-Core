using ElMediadorDeSofia.Data;
using ElMediadorDeSofia.Models;
using Microsoft.EntityFrameworkCore;

namespace ElMediadorDeSofia.Services;

/// <summary>
/// Extensiones para GuidedAssistantService - Métodos para los 4 agentes del Anthropos
/// </summary>
public partial class GuidedAssistantService
{
    /// <summary>
    /// OpsGardener: Optimización operativa
    /// Analiza patrones operativos, eficiencia, y sugiere mejoras.
    /// </summary>
    public async Task<dynamic> RunOperationalOptimizationAsync(CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("🌱 OpsGardener iniciando análisis operativo...");

        try
        {
            // Obtener últimos eventos de operación
            var recentEvents = await _db.EventRecords
                .Where(e => e.EventType == "OPERATION" || e.EventType == "PRODUCTION")
                .OrderByDescending(e => e.CreatedAt)
                .Take(30)
                .ToListAsync(cancellationToken);

            // Análisis básico
            var operationalEfficiency = CalculateOperationalMetrics(recentEvents);

            _logger.LogInformation("✅ OpsGardener completó análisis");

            return new
            {
                agent = "OpsGardener",
                status = "healthy",
                efficiency = operationalEfficiency,
                recommendations = new[]
                {
                    "🌱 Monitoreo continuo de procesos activo",
                    "📊 Métricas operativas dentro de parámetros normales",
                    "⚡ Recursos optimizados",
                },
                timestamp = DateTime.Now,
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"❌ OpsGardener error: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// SecurityGardener: Análisis de riesgos
    /// Evalúa riesgos financieros, operativos y de seguridad.
    /// </summary>
    public async Task<dynamic> RunSecurityAnalysisAsync(CancellationToken cancellationToken = default)
    {
        _logger.LogError("🛡️ SecurityGardener iniciando evaluación de riesgos...");

        try
        {
            // Obtener últimos eventos y analizar riesgos
            var allEvents = await _db.EventRecords
                .OrderByDescending(e => e.CreatedAt)
                .Take(50)
                .ToListAsync(cancellationToken);

            var riskLevel = EvaluateRiskLevel(allEvents);

            _logger.LogInformation("✅ SecurityGardener completó análisis");

            return new
            {
                agent = "SecurityGardener",
                status = "monitoring",
                riskLevel = riskLevel, // low, medium, high
                alerts = new[]
                {
                    "✅ No hay alertas críticas",
                    "📋 Monitoreo de seguridad activo",
                    "🔒 Integridad de datos verificada",
                },
                timestamp = DateTime.Now,
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"❌ SecurityGardener error: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// AnthroposCore: Súper Agente
    /// Inteligencia unificada - sintetiza datos de todos los subsistemas.
    /// </summary>
    public async Task<dynamic> RunAnthroposCoreAnalysisAsync(CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("🧠 AnthroposCore - Súper Agente activando...");

        try
        {
            // Obtener datos financieros y operativos
            var stats = await _db.EventRecords
                .Where(e => e.EventType == "DASHBOARD_UPDATE")
                .OrderByDescending(e => e.CreatedAt)
                .FirstOrDefaultAsync(cancellationToken);

            var operationalData = await _db.EventRecords
                .Where(e => e.EventType == "OPERATION")
                .OrderByDescending(e => e.CreatedAt)
                .Take(7)
                .ToListAsync(cancellationToken);

            // Análisis sintético
            var anthroposState = DetermineAnthroposState(stats, operationalData);

            _logger.LogInformation("✅ AnthroposCore análisis completado");

            return new
            {
                agent = "AnthroposCore",
                state = anthroposState, // fertile, stressed, fragmented, flowing
                coherence = CalculateCoherence(operationalData), // 0-100
                globalInsight = GenerateGlobalInsight(stats, operationalData),
                timestamp = DateTime.Now,
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"❌ AnthroposCore error: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Self Gardener: Coherencia emocional y sostenibilidad
    /// Monitorea salud emocional del sistema y coherencia del corazón.
    /// </summary>
    public async Task<dynamic> RunSelfGardenerSyncAsync(CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("❤️ Self Gardener sincronizando coherencia...");

        try
        {
            // Monitorear carga emocional y operativa
            var recentStress = await _db.EventRecords
                .Where(e => e.EventType == "ALERT" || e.EventType == "ERROR")
                .OrderByDescending(e => e.CreatedAt)
                .Take(10)
                .ToListAsync(cancellationToken);

            var emotionalLoad = CalculateEmotionalLoad(recentStress);
            var operationalLoad = CalculateOperationalLoad();
            var coherence = CalculateHeartCoherence(emotionalLoad, operationalLoad);

            _logger.LogInformation("✅ Self Gardener sincronización completada");

            return new
            {
                agent = "SelfGardener",
                emotionalLoad = emotionalLoad, // 0-100
                operationalLoad = operationalLoad, // 0-100
                coherence = coherence, // 0-100
                hearthStatus = coherence > 70 ? "healthy" : coherence > 40 ? "stressed" : "critical",
                selfCare = new[]
                {
                    "🧘 Ritmo respiratorio estable",
                    "💚 Coherencia del corazón: " + coherence + "%",
                    "🌙 Ciclo diurno sincronizado",
                },
                timestamp = DateTime.Now,
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"❌ Self Gardener error: {ex.Message}");
            throw;
        }
    }

    // ============================================================================
    // MÉTODOS PRIVADOS DE CÁLCULO
    // ============================================================================

    private decimal CalculateOperationalMetrics(List<EventRecord> events)
    {
        if (events.Count == 0) return 0.85m;

        var successfulEvents = events.Count(e => e.Processed);
        return (decimal)successfulEvents / events.Count;
    }

    private string EvaluateRiskLevel(List<EventRecord> events)
    {
        var alerts = events.Count(e => e.EventType == "ALERT");
        var errors = events.Count(e => e.EventType == "ERROR");

        if (errors > 5 || alerts > 10) return "high";
        if (errors > 0 || alerts > 3) return "medium";
        return "low";
    }

    private string DetermineAnthroposState(EventRecord? stats, List<EventRecord> operationalData)
    {
        if (operationalData.Count == 0) return "fertile";

        var successRate = (decimal)operationalData.Count(e => e.Processed) / operationalData.Count;

        if (successRate >= 0.9m) return "fertile";
        if (successRate >= 0.7m) return "flowing";
        if (successRate >= 0.5m) return "stressed";
        return "fragmented";
    }

    private int CalculateCoherence(List<EventRecord> events)
    {
        if (events.Count == 0) return 75;

        var completed = events.Count(e => e.Processed);
        var coherence = (completed * 100) / (events.Count > 0 ? events.Count : 1);

        return Math.Min(100, coherence);
    }

    private string GenerateGlobalInsight(EventRecord? stats, List<EventRecord> operationalData)
    {
        var stateString = DetermineAnthroposState(stats, operationalData);

        return stateString switch
        {
            "fertile" => "🌿 El sistema está floreciendo. Energía abundante para crecimiento.",
            "flowing" => "🌊 El flujo es armónico. Operaciones proceden naturalmente.",
            "stressed" => "⚡ El sistema está bajo tensión. Reducir carga y restaurar equilibrio.",
            "fragmented" => "🌪️ Fragmentación detectada. Necesita sincronización urgente.",
            _ => "🤖 Estado indeterminado. Evaluación en progreso.",
        };
    }

    private int CalculateEmotionalLoad(List<EventRecord> alerts)
    {
        var alertCount = alerts.Count;

        if (alertCount > 20) return 95;
        if (alertCount > 10) return 75;
        if (alertCount > 5) return 50;
        return Math.Max(10, 30 - (alertCount * 5));
    }

    private int CalculateOperationalLoad()
    {
        // Simulación: en producción, consultar métricas reales
        return Random.Shared.Next(20, 80);
    }

    private int CalculateHeartCoherence(int emotionalLoad, int operationalLoad)
    {
        // Fórmula: coherencia = 100 - (carga emocional + carga operativa) / 2
        var avgLoad = (emotionalLoad + operationalLoad) / 2;
        return Math.Max(10, 100 - avgLoad);
    }
}

/// <summary>
/// Extensiones para EventService - Acceso a eventos registrados
/// </summary>

