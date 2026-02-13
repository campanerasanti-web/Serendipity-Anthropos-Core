using Microsoft.Extensions.Logging;

namespace ElMediadorDeSofia.Services.SecurityAgents
{
    /// <summary>
    /// Agente Jardinero de Seguridad (SecurityGardener)
    /// Orquesta la ejecución de 7 reglas de seguridad + 4 tareas
    /// Genera reportes automáticos en Markdown
    /// </summary>
    public class SecurityGardenerAgent
    {
        private readonly ILogger<SecurityGardenerAgent> _logger;
        private readonly IEnumerable<ISecurityRule> _rules;
        private readonly IEnumerable<ISecurityTask> _tasks;
        private readonly ISecurityReportWriter _reportWriter;
        private readonly SecurityProtocols _protocols;

        public SecurityGardenerAgent(
            ILogger<SecurityGardenerAgent> logger,
            IEnumerable<ISecurityRule> rules,
            IEnumerable<ISecurityTask> tasks,
            ISecurityReportWriter reportWriter,
            SecurityProtocols protocols)
        {
            _logger = logger;
            _rules = rules;
            _tasks = tasks;
            _reportWriter = reportWriter;
            _protocols = protocols;
        }

        /// <summary>
        /// Ejecuta el ciclo completo de seguridad:
        /// 1. Valida 7 reglas (SEC-001 a SEC-007)
        /// 2. Aplica AutoFix cuando sea necesario
        /// 3. Ejecuta 4 tareas de seguridad
        /// 4. Genera reporte en Markdown
        /// </summary>
        public async Task<SecurityAuditResult> RunAsync()
        {
            _logger.LogInformation("🛡️ SecurityGardener iniciado");
            var auditStart = DateTime.UtcNow;
            var results = new List<SecurityResult>();

            try
            {
                // Verificar que protocolos estén activos
                var (protocolsHealthy, _) = _protocols.HealthCheck();
                if (!protocolsHealthy)
                {
                    _logger.LogError("🛡️ Error: SecurityProtocols no está inicializado correctamente");
                }

                // ========================
                // FASE 1: VALIDAR REGLAS
                // ========================
                _logger.LogInformation("🔍 Fase 1: Validando 7 reglas de seguridad...");

                foreach (var rule in _rules.OrderBy(r => r.Id))
                {
                    try
                    {
                        _logger.LogInformation("  ⏳ Validando {RuleId}: {Name}", rule.Id, rule.Name);
                        var validation = await rule.ValidateAsync();
                        results.Add(new SecurityResult { Rule = rule, RuleResult = validation });

                        var status = validation.Passed ? "✅ PASS" : "❌ FAIL";
                        _logger.LogInformation("     {Status} - {Message}", status, validation.Message);

                        // ========================
                        // FASE 2A: APLICAR AUTOFIX SI FALLA
                        // ========================
                        if (!validation.Passed)
                        {
                            _logger.LogWarning("  🔧 Aplicando AutoFix para {RuleId}...", rule.Id);
                            var fix = await rule.AutoFixAsync();
                            if (fix != null)
                            {
                                results.Add(new SecurityResult { Rule = rule, FixResult = fix });
                                var fixStatus = fix.Success ? "✅ FIXED" : "❌ FAILED";
                                _logger.LogInformation("     {Status} - {Message}", fixStatus, fix.Message);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error ejecutando regla {RuleId}", rule.Id);
                    }
                }

                // ========================
                // FASE 3: EJECUTAR TAREAS
                // ========================
                _logger.LogInformation("🔄 Fase 2: Ejecutando 4 tareas de seguridad...");

                foreach (var task in _tasks.OrderBy(t => t.Priority == "high" ? 0 : 1))
                {
                    try
                    {
                        _logger.LogInformation("  ⏳ Ejecutando {TaskId}: {Name}", task.Id, task.Name);
                        var taskResult = await task.ExecuteAsync();
                        results.Add(new SecurityResult { Task = task, TaskResult = taskResult });

                        var taskStatus = taskResult.Success ? "✅ OK" : "❌ FAIL";
                        _logger.LogInformation("     {Status} - {Message}", taskStatus, taskResult.Message);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error ejecutando tarea {TaskId}", task.Id);
                    }
                }

                // ========================
                // FASE 4: GENERAR REPORTE
                // ========================
                _logger.LogInformation("📝 Fase 3: Generando reporte de seguridad...");
                await _reportWriter.WriteAsync(results);

                var auditEnd = DateTime.UtcNow;
                var duration = (auditEnd - auditStart).TotalSeconds;

                // ========================
                // RESUMEN FINAL
                // ========================
                var critical = results
                    .Where(r => r.Rule?.Severity == "critical" && r.RuleResult != null && !r.RuleResult.Passed)
                    .Count();

                var warnings = results
                    .Where(r => r.Rule?.Severity == "warning" && r.RuleResult != null && !r.RuleResult.Passed)
                    .Count();

                var climate = critical == 0 ? "☀️ SOLEADO" : "🌧️ TORMENTA";

                _logger.LogInformation(@"
╔══════════════════════════════════════════════════════════════╗
║           🛡️ SECURITY GARDENER - AUDIT COMPLETE            ║
╚══════════════════════════════════════════════════════════════╝

  Reglas Críticas Fallidas:   {CriticalCount}
  Advertencias:               {WarningCount}
  Clima:                      {Status}
  Duración:                   {Duration} segundos

════════════════════════════════════════════════════════════════
", critical, warnings, climate, duration);

                return new SecurityAuditResult
                {
                    ResultsCount = results.Count,
                    RulesEvaluated = results.Count(r => r.Rule != null),
                    TasksExecuted = results.Count(r => r.Task != null),
                    CriticalIssuesFound = critical,
                    WarningsFound = warnings,
                    Climate = climate,
                    Duration = duration,
                    Timestamp = DateTime.UtcNow,
                    Success = critical == 0
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fatal en SecurityGardenerAgent.RunAsync");
                return new SecurityAuditResult
                {
                    Success = false,
                    Climate = "❌ ERROR",
                    ResultsCount = results.Count,
                    Timestamp = DateTime.UtcNow
                };
            }
        }

        /// <summary>
        /// Ejecuta solo las reglas sin tareas (auditoría rápida)
        /// </summary>
        public async Task<IList<SecurityResult>> AuditRulesOnlyAsync()
        {
            _logger.LogInformation("🔍 Auditoría rápida de reglas iniciada");
            var results = new List<SecurityResult>();

            foreach (var rule in _rules.OrderBy(r => r.Id))
            {
                try
                {
                    var validation = await rule.ValidateAsync();
                    results.Add(new SecurityResult { Rule = rule, RuleResult = validation });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error en auditoría de regla {RuleId}", rule.Id);
                }
            }

            return results;
        }

        /// <summary>
        /// Obtiene solo las reglas críticas que fallaron
        /// </summary>
        public IEnumerable<SecurityResult> GetCriticalIssues(IList<SecurityResult> results)
        {
            return results
                .Where(r => r.Rule?.Severity == "critical" && r.RuleResult != null && !r.RuleResult.Passed)
                .ToList();
        }

        /// <summary>
        /// Obtiene resumen del clima de seguridad
        /// </summary>
        public string GetClimateStatus(IList<SecurityResult> results)
        {
            var critical = results.Count(r => r.Rule?.Severity == "critical" && r.RuleResult != null && !r.RuleResult.Passed);
            var warnings = results.Count(r => r.Rule?.Severity == "warning" && r.RuleResult != null && !r.RuleResult.Passed);

            if (critical > 0)
                return "🌧️ TORMENTA (Críticos: " + critical + ")";
            else if (warnings > 0)
                return "⛅ PARCIALMENTE SOLEADO (Advertencias: " + warnings + ")";
            else
                return "☀️ SOLEADO (Sistema saludable)";
        }
    }

    /// <summary>
    /// Resultado de una auditoría completa de seguridad
    /// </summary>
    public class SecurityAuditResult
    {
        public bool Success { get; set; }
        public int ResultsCount { get; set; }
        public int RulesEvaluated { get; set; }
        public int TasksExecuted { get; set; }
        public int CriticalIssuesFound { get; set; }
        public int WarningsFound { get; set; }
        public string Climate { get; set; } = "❓ DESCONOCIDO";
        public double Duration { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
