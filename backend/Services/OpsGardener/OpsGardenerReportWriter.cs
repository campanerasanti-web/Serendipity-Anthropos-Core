using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Serendipity.OpsAgents
{
    public class OpsGardenerReportWriter : IOpsReportWriter
    {
        private readonly ILogger<OpsGardenerReportWriter> _logger;

        public OpsGardenerReportWriter(ILogger<OpsGardenerReportWriter> logger)
        {
            _logger = logger;
        }

        public async Task WriteAsync(IList<OpsGardenerResult> results, OpsGardenerConfig config)
        {
            try
            {
                // Resumen en consola
                await WriteConsoleReportAsync(results, config);

                // Guardar en archivo Markdown
                await WriteMarkdownReportAsync(results, config);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error escribiendo reporte");
            }
        }

        private async Task WriteConsoleReportAsync(IList<OpsGardenerResult> results, OpsGardenerConfig config)
        {
            var report = new StringBuilder();

            report.AppendLine("╔════════════════════════════════════════════════════════════════╗");
            report.AppendLine("║                                                                ║");
            report.AppendLine("║     🌱  AGENTE JARDINERO DE OPERACIONES - BACKEND              ║");
            report.AppendLine("║                                                                ║");
            report.AppendLine("║     \"La tierra fértil genera abundancia\"                      ║");
            report.AppendLine("║                                                                ║");
            report.AppendLine("╚════════════════════════════════════════════════════════════════╝");
            report.AppendLine();

            report.AppendLine($"📅 FECHA: {DateTime.Now:dddd, d \\de MMMM \\de yyyy}");
            report.AppendLine($"⏰ HORA: {DateTime.Now:HH:mm:ss}");
            report.AppendLine($"🌱 MODO: {config.Mode}");
            report.AppendLine();

            // Estadísticas
            var ruleResults = results.Where(r => r.RuleResult != null).ToList();
            var taskResults = results.Where(r => r.TaskResult != null).ToList();

            var passedRules = ruleResults.Count(r => r.RuleResult!.Passed);
            var failedRules = ruleResults.Count(r => !r.RuleResult!.Passed);
            var criticalRules = failedRules; // Simplificado

            report.AppendLine("📊 ESTADÍSTICAS DEL RECORRIDO:");
            report.AppendLine();
            report.AppendLine($"   Reglas evaluadas: {ruleResults.Count}");
            report.AppendLine($"   ├─ ✅ Aprobadas: {passedRules}");
            report.AppendLine($"   ├─ ❌ Fallidas: {failedRules}");
            report.AppendLine($"   └─ 🚨 Críticas: {criticalRules}");
            report.AppendLine();

            var successTasks = taskResults.Count(r => r.TaskResult!.Success);
            var failedTasks = taskResults.Count(r => !r.TaskResult!.Success);

            report.AppendLine($"   Tareas ejecutadas: {taskResults.Count}");
            report.AppendLine($"   ├─ ✅ Exitosas: {successTasks}");
            report.AppendLine($"   └─ ❌ Fallidas: {failedTasks}");
            report.AppendLine();

            // Determinar clima
            var clima = DetermineClimate(failedRules, criticalRules);
            report.AppendLine("═══════════════════════════════════════════════════════════════");
            report.AppendLine($"🌡️  CLIMA FINANCIERO: {clima}");
            report.AppendLine("═══════════════════════════════════════════════════════════════");
            report.AppendLine();

            // Detalles de reglas
            if (ruleResults.Any(r => !r.RuleResult!.Passed))
            {
                report.AppendLine("🌵 PUNTOS DE SEQUÍA (Procesos con problemas):");
                report.AppendLine();
                foreach (var result in ruleResults.Where(r => !r.RuleResult!.Passed))
                {
                    report.AppendLine($"   {result.Rule?.Id}: {result.Rule?.Name}");
                    report.AppendLine($"      └─ {result.RuleResult!.Message}");
                    
                    if (result.RuleResult!.Details is List<string> details && details.Any())
                    {
                        report.AppendLine();
                        foreach (var detail in details)
                        {
                            // FLOW-002: Agua (input/output)
                            if (result.Rule?.Id == "FLOW-002")
                            {
                                if (detail.Contains("sin origen"))
                                    report.AppendLine($"         💧 {detail}");
                                else if (detail.Contains("estancada"))
                                    report.AppendLine($"         🌊 {detail}");
                                else if (detail.Contains("roto"))
                                    report.AppendLine($"         🚫 {detail}");
                                else
                                    report.AppendLine($"         • {detail}");
                            }
                            // FLOW-003: Pulso (KPI)
                            else if (result.Rule?.Id == "FLOW-003")
                            {
                                if (detail.Contains("sin pulso"))
                                    report.AppendLine($"         💔 {detail}");
                                else if (detail.Contains("débil"))
                                    report.AppendLine($"         💤 {detail}");
                                else if (detail.Contains("despertar"))
                                    report.AppendLine($"         🌱 {detail}");
                                else
                                    report.AppendLine($"         • {detail}");
                            }
                            // FLOW-004: Ritmo (tiempo)
                            else if (result.Rule?.Id == "FLOW-004")
                            {
                                if (detail.Contains("indefinido"))
                                    report.AppendLine($"         ⏱ {detail}");
                                else
                                    report.AppendLine($"         • {detail}");
                            }
                            // FLOW-005: Saturación (WIP)
                            else if (result.Rule?.Id == "FLOW-005")
                            {
                                if (detail.Contains("saturación"))
                                    report.AppendLine($"         📦 {detail}");
                                else
                                    report.AppendLine($"         • {detail}");
                            }
                            // FLOW-006: Memoria (documentación)
                            else if (result.Rule?.Id == "FLOW-006")
                            {
                                if (detail.Contains("pendiente"))
                                    report.AppendLine($"         📜 {detail}");
                                else
                                    report.AppendLine($"         • {detail}");
                            }
                            // FLOW-007: Red (dependencias)
                            else if (result.Rule?.Id == "FLOW-007")
                            {
                                if (detail.Contains("ciega"))
                                    report.AppendLine($"         🔗 {detail}");
                                else
                                    report.AppendLine($"         • {detail}");
                            }
                            else
                            {
                                report.AppendLine($"         • {detail}");
                            }
                        }
                    }
                    report.AppendLine();
                }
            }
            else
            {
                report.AppendLine("✅ No se detectaron puntos de sequía. Todos los flujos en armonía.");
                report.AppendLine("💧 El agua corre libremente por todos los canales.");
                report.AppendLine("💓 Todos los flujos tienen pulso. El sistema está vivo.");
                report.AppendLine("⏰ El ritmo está marcado en todos los procesos.");
                report.AppendLine("🛡 Sin riesgo de saturación. Los límites de WIP están activos.");
                report.AppendLine("📖 La memoria está escrita. La documentación es completa.");
                report.AppendLine("🌐 La red es visible. Todas las dependencias están mapeadas.");
                report.AppendLine();
            }

            report.AppendLine("═══════════════════════════════════════════════════════════════");
            report.AppendLine("💚 \"El sistema es una semilla plantada con amor\"");
            report.AppendLine("═══════════════════════════════════════════════════════════════");

            _logger.LogInformation(report.ToString());

            await Task.CompletedTask;
        }

        private async Task WriteMarkdownReportAsync(IList<OpsGardenerResult> results, OpsGardenerConfig config)
        {
            try
            {
                var opsDir = Path.Combine(AppContext.BaseDirectory, "ops", "reports");
                Directory.CreateDirectory(opsDir);

                var reportPath = Path.Combine(opsDir, $"gardener-report-{DateTime.Now:yyyy-MM-dd_HHmmss}.md");

                var markdown = new StringBuilder();

                markdown.AppendLine("# 🌱 Reporte del Agente Jardinero");
                markdown.AppendLine();
                markdown.AppendLine($"**Fecha:** {DateTime.Now:G}  ");
                markdown.AppendLine($"**Modo:** {config.Mode}  ");
                markdown.AppendLine($"**Auto-Fix:** {config.AutoFix}");
                markdown.AppendLine();

                // Resumen
                var ruleResults = results.Where(r => r.RuleResult != null).ToList();
                var passedRules = ruleResults.Count(r => r.RuleResult!.Passed);
                var failedRules = ruleResults.Count(r => !r.RuleResult!.Passed);

                markdown.AppendLine("## 📊 Resumen");
                markdown.AppendLine();
                markdown.AppendLine($"| Métrica | Valor |");
                markdown.AppendLine("|---------|-------|");
                markdown.AppendLine($"| Reglas Evaluadas | {ruleResults.Count} |");
                markdown.AppendLine($"| Reglas OK | ✅ {passedRules} |");
                markdown.AppendLine($"| Reglas FAIL | ❌ {failedRules} |");
                markdown.AppendLine();

                // Clima
                var clima = DetermineClimate(failedRules, failedRules);
                markdown.AppendLine($"## 🌡️ Clima Financiero: {clima}");
                markdown.AppendLine();

                // Reglas detalladas
                markdown.AppendLine("## 📋 Resultados de Reglas");
                markdown.AppendLine();

                foreach (var result in ruleResults)
                {
                    var status = result.RuleResult!.Passed ? "✅ PASS" : "❌ FAIL";
                    markdown.AppendLine($"### {result.Rule?.Id} - {result.Rule?.Name}");
                    markdown.AppendLine($"**Status:** {status}  ");
                    markdown.AppendLine($"**Severity:** {result.Rule?.Severity}  ");
                    markdown.AppendLine($"**Mensaje:** {result.RuleResult!.Message}");
                    markdown.AppendLine();
                }

                // Tareas
                var taskResults = results.Where(r => r.TaskResult != null).ToList();
                if (taskResults.Any())
                {
                    markdown.AppendLine("## 🎯 Tareas Ejecutadas");
                    markdown.AppendLine();

                    foreach (var result in taskResults)
                    {
                        var status = result.TaskResult!.Success ? "✅" : "❌";
                        markdown.AppendLine($"### {status} {result.Task?.Id} - {result.Task?.Name}");
                        markdown.AppendLine($"**Mensaje:** {result.TaskResult!.Message}");
                        markdown.AppendLine();
                    }
                }

                await File.WriteAllTextAsync(reportPath, markdown.ToString());

                _logger.LogInformation("📄 Reporte guardado en: {Path}", reportPath);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error escribiendo reporte Markdown");
            }
        }

        private string DetermineClimate(int failedRules, int criticalRules)
        {
            if (criticalRules > 0)
                return "🚨 TORMENTA";
            if (failedRules > 3)
                return "🌧️ NUBLADO";
            if (failedRules > 0)
                return "⛅ PARCIALMENTE SOLEADO";

            return "☀️ SOLEADO";
        }
    }
}
