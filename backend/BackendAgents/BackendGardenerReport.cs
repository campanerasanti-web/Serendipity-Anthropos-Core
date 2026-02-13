/**
 * 📊 REPORTES DEL JARDINERO DEL BACKEND
 * Sistema de generación de reportes y visualización
 * 
 * "La luz que no resplandece para otros, no resplandece"
 * - Thomas Merton
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ElMediadorDeSofia.BackendAgents
{
    public class BackendReport
    {
        public DateTime Timestamp { get; set; }
        public ReportSummary Summary { get; set; } = new();
        public List<ValidationResult> ValidationResults { get; set; } = new();
        public List<TaskResult> TaskResults { get; set; } = new();
        public BackendHealth Health { get; set; } = new();
        public List<Recommendation> Recommendations { get; set; } = new();
        public List<string> NextSteps { get; set; } = new();
    }

    public class ReportSummary
    {
        public string OverallStatus { get; set; } = "UNKNOWN";
        public int TotalCompleteness { get; set; }
        public int RulesValidated { get; set; }
        public int RulesPassed { get; set; }
        public int RulesFailed { get; set; }
        public int TasksExecuted { get; set; }
        public int TasksSuccessful { get; set; }
        public int TasksFailed { get; set; }
    }

    public class BackendHealth
    {
        public ComponentHealth Services { get; set; } = new();
        public ComponentHealth Controllers { get; set; } = new();
        public ComponentHealth Workers { get; set; } = new();
        public ComponentHealth EventSourcing { get; set; } = new();
        public ComponentHealth Database { get; set; } = new();
        public ComponentHealth Integration { get; set; } = new();
    }

    public class ComponentHealth
    {
        public int Completeness { get; set; }
        public string Status { get; set; } = "UNKNOWN";
        public List<string> Issues { get; set; } = new();
        public List<string> Strengths { get; set; } = new();
    }

    public class Recommendation
    {
        public string Title { get; set; } = string.Empty;
        public string Priority { get; set; } = "Medium";
        public string Impact { get; set; } = string.Empty;
        public string Effort { get; set; } = string.Empty;
        public List<string> Steps { get; set; } = new();
    }

    public class ReportGenerator
    {
        public string GenerateMarkdownReport(BackendReport report)
        {
            var sb = new StringBuilder();

            sb.AppendLine("# 🌱 REPORTE DEL JARDINERO DEL BACKEND");
            sb.AppendLine($"**Fecha:** {report.Timestamp:yyyy-MM-dd HH:mm:ss}");
            sb.AppendLine();

            // Summary
            sb.AppendLine("## 📊 RESUMEN EJECUTIVO");
            sb.AppendLine();
            sb.AppendLine($"**Estado General:** {GetStatusEmoji(report.Summary.OverallStatus)} {report.Summary.OverallStatus}");
            sb.AppendLine($"**Completitud Total:** {GetProgressBar(report.Summary.TotalCompleteness)} {report.Summary.TotalCompleteness}%");
            sb.AppendLine();
            sb.AppendLine("### Validación de Reglas");
            sb.AppendLine($"- Total validadas: **{report.Summary.RulesValidated}**");
            sb.AppendLine($"- ✅ Aprobadas: **{report.Summary.RulesPassed}**");
            sb.AppendLine($"- ❌ Fallidas: **{report.Summary.RulesFailed}**");
            sb.AppendLine();
            sb.AppendLine("### Ejecución de Tareas");
            sb.AppendLine($"- Total ejecutadas: **{report.Summary.TasksExecuted}**");
            sb.AppendLine($"- ✅ Exitosas: **{report.Summary.TasksSuccessful}**");
            sb.AppendLine($"- ❌ Fallidas: **{report.Summary.TasksFailed}**");
            sb.AppendLine();

            // Health
            sb.AppendLine("## 🏥 SALUD POR COMPONENTE");
            sb.AppendLine();
            sb.AppendLine("| Componente | Completitud | Estado | Issues |");
            sb.AppendLine("|------------|-------------|--------|--------|");
            sb.AppendLine($"| Services | {GetProgressBar(report.Health.Services.Completeness)} {report.Health.Services.Completeness}% | {GetHealthEmoji(report.Health.Services.Status)} | {report.Health.Services.Issues.Count} |");
            sb.AppendLine($"| Controllers | {GetProgressBar(report.Health.Controllers.Completeness)} {report.Health.Controllers.Completeness}% | {GetHealthEmoji(report.Health.Controllers.Status)} | {report.Health.Controllers.Issues.Count} |");
            sb.AppendLine($"| Workers | {GetProgressBar(report.Health.Workers.Completeness)} {report.Health.Workers.Completeness}% | {GetHealthEmoji(report.Health.Workers.Status)} | {report.Health.Workers.Issues.Count} |");
            sb.AppendLine($"| Event Sourcing | {GetProgressBar(report.Health.EventSourcing.Completeness)} {report.Health.EventSourcing.Completeness}% | {GetHealthEmoji(report.Health.EventSourcing.Status)} | {report.Health.EventSourcing.Issues.Count} |");
            sb.AppendLine($"| Database | {GetProgressBar(report.Health.Database.Completeness)} {report.Health.Database.Completeness}% | {GetHealthEmoji(report.Health.Database.Status)} | {report.Health.Database.Issues.Count} |");
            sb.AppendLine($"| Integration | {GetProgressBar(report.Health.Integration.Completeness)} {report.Health.Integration.Completeness}% | {GetHealthEmoji(report.Health.Integration.Status)} | {report.Health.Integration.Issues.Count} |");
            sb.AppendLine();

            // Validation Results
            sb.AppendLine("## ✅ RESULTADOS DE VALIDACIÓN");
            sb.AppendLine();
            var failedRules = report.ValidationResults.Where(r => !r.Passed).ToList();
            if (failedRules.Any())
            {
                sb.AppendLine("### ❌ Reglas Fallidas");
                sb.AppendLine();
                foreach (var rule in failedRules)
                {
                    sb.AppendLine($"- **{rule.Message}**");
                    if (rule.Details.Any())
                    {
                        foreach (var detail in rule.Details)
                        {
                            sb.AppendLine($"  - {detail}");
                        }
                    }
                }
                sb.AppendLine();
            }

            // Task Results
            sb.AppendLine("## 🔧 RESULTADOS DE TAREAS");
            sb.AppendLine();
            var failedTasks = report.TaskResults.Where(t => !t.Success).ToList();
            if (failedTasks.Any())
            {
                sb.AppendLine("### ⚠️ Tareas Pendientes");
                sb.AppendLine();
                foreach (var task in failedTasks)
                {
                    sb.AppendLine($"- **{task.Message}**");
                    if (task.NextSteps.Any())
                    {
                        sb.AppendLine("  Pasos siguientes:");
                        foreach (var step in task.NextSteps)
                        {
                            sb.AppendLine($"  - {step}");
                        }
                    }
                }
                sb.AppendLine();
            }

            // Recommendations
            if (report.Recommendations.Any())
            {
                sb.AppendLine("## 💡 RECOMENDACIONES");
                sb.AppendLine();
                foreach (var rec in report.Recommendations.OrderByDescending(r => r.Priority))
                {
                    sb.AppendLine($"### {GetPriorityEmoji(rec.Priority)} {rec.Title}");
                    sb.AppendLine($"**Prioridad:** {rec.Priority} | **Impacto:** {rec.Impact} | **Esfuerzo:** {rec.Effort}");
                    sb.AppendLine();
                    if (rec.Steps.Any())
                    {
                        foreach (var step in rec.Steps)
                        {
                            sb.AppendLine($"- {step}");
                        }
                    }
                    sb.AppendLine();
                }
            }

            // Next Steps
            if (report.NextSteps.Any())
            {
                sb.AppendLine("## 🎯 PRÓXIMOS PASOS");
                sb.AppendLine();
                for (int i = 0; i < report.NextSteps.Count; i++)
                {
                    sb.AppendLine($"{i + 1}. {report.NextSteps[i]}");
                }
                sb.AppendLine();
            }

            sb.AppendLine("---");
            sb.AppendLine("*Generado por el Jardinero del Backend - El Mediador de Sofía*");

            return sb.ToString();
        }

        public string GenerateConsoleReport(BackendReport report)
        {
            var sb = new StringBuilder();

            sb.AppendLine();
            sb.AppendLine("╔══════════════════════════════════════════════════════════════╗");
            sb.AppendLine("║  🌱 JARDINERO DEL BACKEND - REPORTE                          ║");
            sb.AppendLine("╚══════════════════════════════════════════════════════════════╝");
            sb.AppendLine();

            sb.AppendLine("📊 RESUMEN EJECUTIVO");
            sb.AppendLine($"Estado General:    {GetStatusEmoji(report.Summary.OverallStatus)} {report.Summary.OverallStatus}");
            sb.AppendLine($"Completitud Total: {GetProgressBar(report.Summary.TotalCompleteness)} {report.Summary.TotalCompleteness}%");
            sb.AppendLine();

            sb.AppendLine("Reglas Validadas:  " + report.Summary.RulesValidated);
            sb.AppendLine($"  ✅ Aprobadas:     {report.Summary.RulesPassed}");
            sb.AppendLine($"  ❌ Falladas:      {report.Summary.RulesFailed}");
            sb.AppendLine();

            sb.AppendLine("Tareas Ejecutadas: " + report.Summary.TasksExecuted);
            sb.AppendLine($"  ✅ Exitosas:      {report.Summary.TasksSuccessful}");
            sb.AppendLine($"  ❌ Fallidas:      {report.Summary.TasksFailed}");
            sb.AppendLine();

            sb.AppendLine("🏥 SALUD POR COMPONENTE");
            sb.AppendLine($"services        {GetHealthEmoji(report.Health.Services.Status)} {GetProgressBar(report.Health.Services.Completeness)} {report.Health.Services.Completeness}%");
            sb.AppendLine($"controllers     {GetHealthEmoji(report.Health.Controllers.Status)} {GetProgressBar(report.Health.Controllers.Completeness)} {report.Health.Controllers.Completeness}%");
            sb.AppendLine($"workers         {GetHealthEmoji(report.Health.Workers.Status)} {GetProgressBar(report.Health.Workers.Completeness)} {report.Health.Workers.Completeness}%");
            sb.AppendLine($"event sourcing  {GetHealthEmoji(report.Health.EventSourcing.Status)} {GetProgressBar(report.Health.EventSourcing.Completeness)} {report.Health.EventSourcing.Completeness}%");
            sb.AppendLine($"database        {GetHealthEmoji(report.Health.Database.Status)} {GetProgressBar(report.Health.Database.Completeness)} {report.Health.Database.Completeness}%");
            sb.AppendLine($"integration     {GetHealthEmoji(report.Health.Integration.Status)} {GetProgressBar(report.Health.Integration.Completeness)} {report.Health.Integration.Completeness}%");
            sb.AppendLine();

            var criticalIssues = new List<string>();
            criticalIssues.AddRange(report.Health.Workers.Issues.Take(1));
            criticalIssues.AddRange(report.Health.EventSourcing.Issues.Take(1));
            criticalIssues.AddRange(report.Health.Database.Issues.Take(1));

            if (criticalIssues.Any())
            {
                sb.AppendLine("🔴 ISSUES CRÍTICOS");
                for (int i = 0; i < criticalIssues.Count && i < 5; i++)
                {
                    sb.AppendLine($"{i + 1}. {criticalIssues[i]}");
                }
                sb.AppendLine();
            }

            if (report.Recommendations.Any())
            {
                sb.AppendLine("💡 RECOMENDACIONES TOP");
                var topRecs = report.Recommendations.Take(3);
                foreach (var rec in topRecs)
                {
                    sb.AppendLine($"{GetPriorityEmoji(rec.Priority)} {rec.Title}");
                }
                sb.AppendLine();
            }

            if (report.NextSteps.Any())
            {
                sb.AppendLine("🎯 PRÓXIMOS PASOS");
                for (int i = 0; i < Math.Min(3, report.NextSteps.Count); i++)
                {
                    sb.AppendLine($"{i + 1}. {report.NextSteps[i]}");
                }
                sb.AppendLine();
            }

            sb.AppendLine("══════════════════════════════════════════════════════════════");

            return sb.ToString();
        }

        private string GetStatusEmoji(string status)
        {
            return status.ToUpper() switch
            {
                "EXCELLENT" => "🟢",
                "GOOD" => "🟢",
                "DEGRADED" => "🟡",
                "WARNING" => "🟠",
                "CRITICAL" => "🔴",
                _ => "⚪"
            };
        }

        private string GetHealthEmoji(string status)
        {
            return status.ToUpper() switch
            {
                "ACTIVE" => "🟢",
                "GOOD" => "🟢",
                "DEGRADED" => "🟡",
                "WARNING" => "🟠",
                "INACTIVE" => "🔴",
                "CRITICAL" => "🔴",
                _ => "⚪"
            };
        }

        private string GetPriorityEmoji(string priority)
        {
            return priority.ToLower() switch
            {
                "immediate" => "🔴",
                "high" => "🟠",
                "medium" => "🟡",
                "low" => "🟢",
                _ => "⚪"
            };
        }

        private string GetProgressBar(int percentage)
        {
            int filled = percentage / 10;
            int empty = 10 - filled;
            return new string('█', filled) + new string('░', empty);
        }
    }
}
