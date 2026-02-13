using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Serendipity.OpsAgents
{
    public class ConsoleOpsReportWriter : IOpsReportWriter
    {
        private readonly ILogger<ConsoleOpsReportWriter> _logger;

        public ConsoleOpsReportWriter(ILogger<ConsoleOpsReportWriter> logger)
        {
            _logger = logger;
        }

        public async Task WriteAsync(IList<OpsGardenerResult> results, OpsGardenerConfig config)
        {
            var report = new StringBuilder();
            report.AppendLine("╔════════════════════════════════════════════════════════════════╗");
            report.AppendLine("║");
            report.AppendLine("║     🌱  AGENTE JARDINERO DE OPERACIONES - BACKEND");
            report.AppendLine("║");
            report.AppendLine("║     \"Los datos fluyen donde hay armonía\"");
            report.AppendLine("║");
            report.AppendLine("╚════════════════════════════════════════════════════════════════╝");
            report.AppendLine();

            report.AppendLine($"📅 FECHA: {DateTime.Now:dddd, d \\de MMMM \\de yyyy}");
            report.AppendLine($"⏰ HORA: {DateTime.Now:HH:mm:ss}");
            report.AppendLine($"🌱 MODO: {config.Mode}");
            report.AppendLine();

            // Resumen de reglas
            var ruleResults = results.Where(r => r.RuleResult != null).ToList();
            var passedRules = ruleResults.Count(r => r.RuleResult!.Passed);
            var failedRules = ruleResults.Count(r => !r.RuleResult!.Passed);
            var criticalRules = ruleResults.Count(r => r.Rule?.Severity == "critical" && !r.RuleResult!.Passed);

            report.AppendLine("📊 ESTADÍSTICAS DEL RECORRIDO:");
            report.AppendLine();
            report.AppendLine($"   Reglas evaluadas: {ruleResults.Count}");
            report.AppendLine($"   ├─ ✅ Aprobadas: {passedRules}");
            report.AppendLine($"   ├─ ❌ Fallidas: {failedRules}");
            report.AppendLine($"   └─ 🚨 Críticas: {criticalRules}");
            report.AppendLine();

            var taskResults = results.Where(r => r.TaskResult != null).ToList();
            var successTasks = taskResults.Count(r => r.TaskResult!.Success);
            var failedTasks = taskResults.Count(r => !r.TaskResult!.Success);

            report.AppendLine($"   Tareas ejecutadas: {taskResults.Count}");
            report.AppendLine($"   ├─ ✅ Exitosas: {successTasks}");
            report.AppendLine($"   └─ ❌ Fallidas: {failedTasks}");
            report.AppendLine();

            // Determinar clima
            string clima;
            if (criticalRules > 0)
                clima = "🚨 TORMENTA";
            else if (failedRules > 3)
                clima = "🌧️ NUBLADO";
            else if (failedRules > 0)
                clima = "⛅ PARCIALMENTE SOLEADO";
            else
                clima = "☀️ SOLEADO";

            report.AppendLine("═══════════════════════════════════════════════════════════════");
            report.AppendLine($"🌡️  CLIMA FINANCIERO: {clima}");
            report.AppendLine("═══════════════════════════════════════════════════════════════");
            report.AppendLine();

            report.AppendLine("💚 \"El sistema es una semilla plantada con amor\"");
            report.AppendLine("   Los puntos de sequía son invitaciones a crecer");
            report.AppendLine();
            report.AppendLine("   - El Jardinero");
            report.AppendLine("═══════════════════════════════════════════════════════════════");

            _logger.LogInformation(report.ToString());

            await Task.CompletedTask;
        }
    }
}
