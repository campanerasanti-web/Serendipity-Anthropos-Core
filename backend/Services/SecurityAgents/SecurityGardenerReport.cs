using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace ElMediadorDeSofia.Services.SecurityAgents
{
    public interface ISecurityReportWriter
    {
        Task WriteAsync(IList<SecurityResult> results);
    }

    /// <summary>
    /// Generador de reportes de seguridad en Markdown
    /// Salida: /security/reports/security-report-YYYY-MM-DD.md
    /// </summary>
    public class SecurityGardenerReportWriter : ISecurityReportWriter
    {
        private readonly ILogger<SecurityGardenerReportWriter> _logger;
        private readonly string _reportsDir = "security/reports";

        public SecurityGardenerReportWriter(ILogger<SecurityGardenerReportWriter> logger)
        {
            _logger = logger;
        }

        public async Task WriteAsync(IList<SecurityResult> results)
        {
            try
            {
                Directory.CreateDirectory(_reportsDir);
                var date = DateTime.UtcNow.ToString("yyyy-MM-dd");
                var time = DateTime.UtcNow.ToString("HH:mm:ss");
                var path = Path.Combine(_reportsDir, $"security-report-{date}.md");

                var content = GenerateReport(results, date, time);
                await File.WriteAllTextAsync(path, content);

                _logger.LogInformation("🛡️ Reporte de seguridad generado: {Path}", path);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al generar reporte de seguridad");
            }
        }

        private string GenerateReport(IList<SecurityResult> results, string date, string time)
        {
            var ruleResults = results.Where(r => r.Rule != null).ToList();
            var taskResults = results.Where(r => r.Task != null).ToList();

            var critical = ruleResults
                .Where(r => r.Rule?.Severity == "critical" && r.RuleResult != null && !r.RuleResult.Passed)
                .ToList();

            var warnings = ruleResults
                .Where(r => r.Rule?.Severity == "warning" && r.RuleResult != null && !r.RuleResult.Passed)
                .ToList();

            var sb = new StringBuilder();

            sb.AppendLine("# 🛡️ Security Report");
            sb.AppendLine($"**Fecha:** {date} | **Hora:** {time} UTC");
            sb.AppendLine("");

            // RESUMEN
            sb.AppendLine("## 📊 Resumen Ejecutivo");
            sb.AppendLine("");
            sb.AppendLine($"| Métrica | Valor |");
            sb.AppendLine("|---|---|");
            sb.AppendLine($"| **Reglas Críticas Fallidas** | {critical.Count} ❌ |");
            sb.AppendLine($"| **Advertencias** | {warnings.Count} ⚠️ |");
            sb.AppendLine($"| **Reglas Evaluadas** | {ruleResults.Count} |");
            sb.AppendLine($"| **Tareas Ejecutadas** | {taskResults.Count} |");
            sb.AppendLine($"| **Estado General** | {(critical.Count == 0 ? "✅ SANO" : "🚨 CRÍTICO")} |");
            sb.AppendLine("");

            // RIESGOS CRÍTICOS
            if (critical.Any())
            {
                sb.AppendLine("## 🚨 Riesgos Críticos Detectados");
                sb.AppendLine("");
                foreach (var r in critical)
                {
                    sb.AppendLine($"### ❌ {r.Rule?.Id} - {r.Rule?.Name}");
                    sb.AppendLine($"**Severidad:** {r.Rule?.Severity}");
                    sb.AppendLine($"**Categoría:** {r.Rule?.Category}");
                    sb.AppendLine($"**Mensaje:** {r.RuleResult?.Message}");
                    if (r.RuleResult?.Details != null)
                    {
                        sb.AppendLine("**Detalles:**");
                        sb.AppendLine("```");
                        sb.AppendLine(JsonSerializer.Serialize(r.RuleResult.Details, new JsonSerializerOptions { WriteIndented = true }));
                        sb.AppendLine("```");
                    }
                    if (r.FixResult != null)
                    {
                        sb.AppendLine($"**AutoFix:** {(r.FixResult.Success ? "✅ Exitoso" : "❌ Falló")} - {r.FixResult.Message}");
                    }
                    sb.AppendLine("");
                }
            }

            // ADVERTENCIAS
            if (warnings.Any())
            {
                sb.AppendLine("## ⚠️ Advertencias");
                sb.AppendLine("");
                foreach (var r in warnings)
                {
                    sb.AppendLine($"### ⚠️ {r.Rule?.Id} - {r.Rule?.Name}");
                    sb.AppendLine($"**Mensaje:** {r.RuleResult?.Message}");
                    if (r.RuleResult?.Details != null)
                    {
                        sb.AppendLine("**Detalles:**");
                        sb.AppendLine("```");
                        sb.AppendLine(JsonSerializer.Serialize(r.RuleResult.Details, new JsonSerializerOptions { WriteIndented = true }));
                        sb.AppendLine("```");
                    }
                    sb.AppendLine("");
                }
            }

            // REGLAS EXITOSAS
            var passed = ruleResults
                .Where(r => r.RuleResult != null && r.RuleResult.Passed)
                .ToList();

            if (passed.Any())
            {
                sb.AppendLine("## ✅ Reglas en Buen Estado");
                sb.AppendLine("");
                foreach (var r in passed)
                {
                    sb.AppendLine($"- **{r.Rule?.Id}**: {r.RuleResult?.Message}");
                }
                sb.AppendLine("");
            }

            // TAREAS EJECUTADAS
            if (taskResults.Any())
            {
                sb.AppendLine("## 🔄 Tareas Ejecutadas");
                sb.AppendLine("");
                foreach (var t in taskResults)
                {
                    var status = t.TaskResult?.Success == true ? "✅" : "❌";
                    sb.AppendLine($"### {status} {t.Task?.Id} - {t.Task?.Name}");
                    sb.AppendLine($"**Categoría:** {t.Task?.Category} | **Prioridad:** {t.Task?.Priority}");
                    sb.AppendLine($"**Resultado:** {t.TaskResult?.Message}");
                    if (t.TaskResult?.FilesAffected != null && t.TaskResult.FilesAffected.Any())
                    {
                        sb.AppendLine("**Archivos Afectados:**");
                        foreach (var file in t.TaskResult.FilesAffected)
                        {
                            sb.AppendLine($"  - `{file}`");
                        }
                    }
                    sb.AppendLine("");
                }
            }

            // TABLA DE ESTADO COMPLETO
            sb.AppendLine("## 📋 Estado Completo de Reglas");
            sb.AppendLine("");
            sb.AppendLine("| Regla | Nombre | Severidad | Estado | Mensaje |");
            sb.AppendLine("|---|---|---|---|---|");
            foreach (var r in ruleResults)
            {
                var status = r.RuleResult?.Passed == true ? "✅ PASS" : "❌ FAIL";
                var severity = r.Rule?.Severity ?? "?";
                sb.AppendLine($"| {r.Rule?.Id} | {r.Rule?.Name} | {severity} | {status} | {r.RuleResult?.Message?.Substring(0, Math.Min(30, r.RuleResult.Message.Length))}... |");
            }
            sb.AppendLine("");

            // RECOMENDACIONES
            if (critical.Any() || warnings.Any())
            {
                sb.AppendLine("## 🎯 Recomendaciones");
                sb.AppendLine("");
                foreach (var r in critical.Concat(warnings))
                {
                    sb.AppendLine(GetRecommendation(r.Rule?.Id ?? ""));
                }
                sb.AppendLine("");
            }

            // FOOTER
            sb.AppendLine("---");
            sb.AppendLine($"*Reporte generado automáticamente por SecurityGardener el {date} a las {time} UTC*");
            sb.AppendLine("*Sistema de Seguridad del Templo Digital - El Mediador de Sofía*");

            return sb.ToString();
        }

        private string GetRecommendation(string ruleId) => ruleId switch
        {
            "SEC-001" => "1. **SEC-001:** Audita access-map.json y asigna propietarios identificables a cada acceso.",
            "SEC-002" => "2. **SEC-002:** Revisa endpoints.json y fortalece autenticación en rutas críticas (admin, config, datos sensibles).",
            "SEC-003" => "3. **SEC-003:** Ejecuta hash en todos los archivos sensibles y almacena valores en file-hashes.json.",
            "SEC-004" => "4. **SEC-004:** Revisa activity-log.json para detectar patrones anómalos fuera de 08:00-18:00 UTC.",
            "SEC-005" => "5. **SEC-005:** Configura límites de acción en agents-limits.json (CanWrite, CanExecute, MaxRequestsPerHour).",
            "SEC-006" => "6. **SEC-006:** Audita tokens.json y renovación automática cada 7 días para tokens sin expiración.",
            "SEC-007" => "7. **SEC-007:** Añade cambios de configuración a config-changes.json con usuario, fecha y descripción del cambio.",
            _ => $"- {ruleId}: Consulta la documentación del protocolo relacionado"
        };
    }
}
