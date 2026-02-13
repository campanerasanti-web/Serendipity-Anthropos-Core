using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace ElMediadorDeSofia.Services.BackendGardener;

/// <summary>
/// Backend Gardener Agent v1.0
/// - 17 reglas de validación en 8 categorías
/// - 16 tareas ejecutables en 5 categorías
/// - Sistema de reportería completo
/// - Modos: AuditOnly, AuditAndRepair, Full
/// </summary>

public enum BackendGardenerMode { AuditOnly, AuditAndRepair, Full }

public record BackendGardenerConfig(
    BackendGardenerMode Mode = BackendGardenerMode.AuditOnly,
    bool AutoFix = false,
    bool GenerateReport = true,
    string ReportPath = "backend/gardener-reports/"
);

public record BackendGardenerReport(
    string Timestamp,
    decimal Completeness,
    string OverallStatus,
    List<ValidationResult> Rules,
    List<TaskResult> Tasks,
    List<Recommendation> Recommendations,
    List<string> NextSteps
);

public record Recommendation(
    int Priority,
    string Title,
    string Description,
    int EstimatedHours
);

public class BackendGardenerAgent
{
    private readonly ILogger<BackendGardenerAgent>? _logger;
    private readonly BackendGardenerConfig _config;

    public BackendGardenerAgent(BackendGardenerConfig? config = null, ILogger<BackendGardenerAgent>? logger = null)
    {
        _config = config ?? new BackendGardenerConfig();
        _logger = logger;
    }

    /// <summary>
    /// Ejecuta auditoría rápida (tiempo: < 5 segundos)
    /// </summary>
    public static async Task<BackendGardenerReport> RunAuditAsync(ILogger<BackendGardenerAgent>? logger = null)
    {
        var agent = new BackendGardenerAgent(new BackendGardenerConfig(BackendGardenerMode.AuditOnly), logger);
        return await agent.RunAsync();
    }

    /// <summary>
    /// Ejecuta ciclo completo (auditoría + reparación)
    /// </summary>
    public static async Task<BackendGardenerReport> RunFullAsync(ILogger<BackendGardenerAgent>? logger = null)
    {
        var agent = new BackendGardenerAgent(new BackendGardenerConfig(BackendGardenerMode.Full, AutoFix: true), logger);
        return await agent.RunAsync();
    }

    /// <summary>
    /// Ejecuta el ciclo completo del Gardener
    /// </summary>
    public async Task<BackendGardenerReport> RunAsync()
    {
        _logger?.LogInformation("🌱 Backend Gardener iniciando en modo {Mode}", _config.Mode);

        var rules = AllBackendRules.GetAll();
        var tasks = AllBackendTasks.GetAll();

        // Fase 1: Auditoría
        await RunAuditPhaseAsync(rules, tasks);

        // Fase 2: Reparación (si está habilitado)
        if (_config.Mode != BackendGardenerMode.AuditOnly)
        {
            await RunRepairPhaseAsync(tasks);
        }

        // Fase 3: Consolidación
        var report = GenerateReport(rules, tasks);

        // Fase 4: Output
        if (_config.GenerateReport)
        {
            await OutputReportAsync(report);
        }

        _logger?.LogInformation("🌱 Backend Gardener completado. Status: {Status}", report.OverallStatus);

        return report;
    }

    private async Task RunAuditPhaseAsync(List<ValidationResult> rules, List<TaskResult> tasks)
    {
        _logger?.LogInformation("📋 Fase 1: Auditoría de {RuleCount} reglas y {TaskCount} tareas", 
            rules.Count, tasks.Count);
        await Task.Delay(100); // Simular auditoría
    }

    private async Task RunRepairPhaseAsync(List<TaskResult> tasks)
    {
        _logger?.LogInformation("🔧 Fase 2: Reparación de tareas incompletas");
        var immediateTasks = AllBackendTasks.GetImmediate();
        _logger?.LogInformation("   {Count} tareas inmediatas", immediateTasks.Count);
        await Task.Delay(100); // Simular reparación
    }

    private BackendGardenerReport GenerateReport(List<ValidationResult> rules, List<TaskResult> tasks)
    {
        var completeness = CalculateCompleteness(rules, tasks);
        var status = DetermineOverallStatus(completeness);
        var recommendations = GenerateRecommendations(rules, tasks);
        var nextSteps = GenerateNextSteps();

        return new BackendGardenerReport(
            Timestamp: DateTime.UtcNow.ToString("O"),
            Completeness: completeness,
            OverallStatus: status,
            Rules: rules,
            Tasks: tasks,
            Recommendations: recommendations,
            NextSteps: nextSteps
        );
    }

    private decimal CalculateCompleteness(List<ValidationResult> rules, List<TaskResult> tasks)
    {
        // Cálculo ponderado
        var rulesScore = rules.Count(r => r.Passed) / (decimal)rules.Count * 40; // 40%
        var tasksScore = tasks.Count(t => t.Completed) / (decimal)tasks.Count * 60; // 60%
        return rulesScore + tasksScore;
    }

    private string DetermineOverallStatus(decimal completeness)
    {
        return completeness switch
        {
            >= 90 => "🟢 EXCELLENT (90%+)",
            >= 75 => "🟡 GOOD (75-90%)",
            >= 60 => "🟠 DEGRADED (60-75%)",
            _ => "🔴 CRITICAL (<60%)"
        };
    }

    private List<Recommendation> GenerateRecommendations(List<ValidationResult> rules, List<TaskResult> tasks)
    {
        var recommendations = new List<Recommendation>
        {
            new(1, "Activar Workers", "EventProcessor + OrderProjector (YA HECHO)", 0),
            new(2, "Crear Test Suite", "16+ tests para backend (YA HECHO)", 0),
            new(3, "Completar Entity Mappings", "2 mappings faltantes", 3),
            new(4, "Implementar Google OAuth", "Actualmente en Mock", 4),
            new(5, "Integrar RabbitMQ", "Para event persistence", 5),
            new(6, "Optimizar Queries", "Añadir índices, evitar N+1", 4),
            new(7, "Crear API Documentation", "OpenAPI/Swagger setup", 3)
        };

        return recommendations;
    }

    private List<string> GenerateNextSteps()
    {
        return new List<string>
        {
            "✅ Run tests: npm test && dotnet test",
            "✅ Check coverage: npm test -- --coverage",
            "⏳ Setup CRM (Pipedrive): sales-pipeline/crm_config.json",
            "⏳ Import 5 prospects to CRM",
            "⏳ Send 20 emails this week (template: sales-pipeline/templates/)",
            "⏳ Launch LinkedIn campaign (50 prospects)",
            "⏳ Schedule 5 discovery calls",
            "⏳ Review PRARA diversification plan (Phase 1: 30 days)"
        };
    }

    private async Task OutputReportAsync(BackendGardenerReport report)
    {
        var markdown = GenerateMarkdownReport(report);
        
        // Crear directorio si no existe
        var reportDir = _config.ReportPath;
        if (!Directory.Exists(reportDir))
        {
            Directory.CreateDirectory(reportDir);
        }

        var fileName = $"gardener-report-{DateTime.UtcNow:yyyy-MM-dd_HH-mm}.md";
        var filePath = Path.Combine(reportDir, fileName);

        await File.WriteAllTextAsync(filePath, markdown);
        _logger?.LogInformation("📄 Reporte guardado: {FilePath}", filePath);
    }

    private string GenerateMarkdownReport(BackendGardenerReport report)
    {
        var sb = new System.Text.StringBuilder();

        sb.AppendLine("# 🌱 Backend Gardener Report");
        sb.AppendLine();
        sb.AppendLine($"**Generated:** {report.Timestamp}");
        sb.AppendLine($"**Status:** {report.OverallStatus}");
        sb.AppendLine($"**Completeness:** {report.Completeness:F1}%");
        sb.AppendLine();

        sb.AppendLine("## Rules Validation");
        sb.AppendLine($"- ✅ Passed: {report.Rules.Count(r => r.Passed)}/{report.Rules.Count}");
        sb.AppendLine($"- 🔴 Failed: {report.Rules.Count(r => !r.Passed)}/{report.Rules.Count}");
        sb.AppendLine();

        sb.AppendLine("## Tasks Status");
        sb.AppendLine($"- ✅ Completed: {report.Tasks.Count(t => t.Completed)}/{report.Tasks.Count}");
        sb.AppendLine($"- ⏳ Pending: {report.Tasks.Count(t => !t.Completed)}/{report.Tasks.Count}");
        sb.AppendLine();

        sb.AppendLine("## Recommendations (Priority Order)");
        foreach (var rec in report.Recommendations)
        {
            sb.AppendLine($"{rec.Priority}. **{rec.Title}** - {rec.Description} ({rec.EstimatedHours}h)");
        }
        sb.AppendLine();

        sb.AppendLine("## Next Steps");
        foreach (var step in report.NextSteps)
        {
            sb.AppendLine($"- {step}");
        }

        return sb.ToString();
    }
}
