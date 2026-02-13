using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Serendipity.OpsAgents
{
    public class OpsGardenerAgent
    {
        private readonly ILogger<OpsGardenerAgent> _logger;
        private readonly IEnumerable<IOpsRule> _rules;
        private readonly IEnumerable<IOpsTask> _tasks;
        private readonly IOpsReportWriter _reportWriter;
        private readonly OpsGardenerConfig _config;

        public OpsGardenerAgent(
            ILogger<OpsGardenerAgent> logger,
            IEnumerable<IOpsRule> rules,
            IEnumerable<IOpsTask> tasks,
            IOpsReportWriter reportWriter,
            OpsGardenerConfig config)
        {
            _logger = logger;
            _rules = rules;
            _tasks = tasks;
            _reportWriter = reportWriter;
            _config = config;
        }

        public async Task<IList<OpsGardenerResult>> RunAsync()
        {
            _logger.LogInformation("🌱 OpsGardener iniciado en modo {Mode} (AutoFix: {AutoFix})",
                _config.Mode, _config.AutoFix);

            var results = new List<OpsGardenerResult>();
            var startTime = DateTime.UtcNow;

            // Validar reglas
            foreach (var rule in _rules)
            {
                try
                {
                    var validation = await rule.ValidateAsync();
                    results.Add(new OpsGardenerResult
                    {
                        Rule = rule,
                        RuleResult = validation
                    });

                    var status = validation.Passed ? "✅ OK" : "❌ FAIL";
                    var level = rule.Severity switch
                    {
                        "critical" => LogLevel.Error,
                        "warning" => LogLevel.Warning,
                        _ => LogLevel.Information
                    };

                    _logger.Log(level, "Regla {Id} ({Name}) → {Status}: {Message}",
                        rule.Id,
                        rule.Name,
                        status,
                        validation.Message);

                    // AutoFix si está habilitado y falló
                    if (!validation.Passed && _config.AutoFix)
                    {
                        var fix = await rule.AutoFixAsync();
                        if (fix != null)
                        {
                            results.Add(new OpsGardenerResult
                            {
                                Rule = rule,
                                FixResult = fix
                            });

                            _logger.LogInformation("🔧 AutoFix {Id} → {Status}: {Message}",
                                rule.Id,
                                fix.Success ? "✅" : "❌",
                                fix.Message);
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error validando regla {Id}", rule.Id);
                }
            }

            // Ejecutar tareas según modo
            foreach (var task in _tasks.Where(ShouldRunTask))
            {
                try
                {
                    var taskResult = await task.ExecuteAsync();
                    results.Add(new OpsGardenerResult
                    {
                        Task = task,
                        TaskResult = taskResult
                    });

                    var status = taskResult.Success ? "✅" : "❌";
                    _logger.LogInformation("📋 Tarea {Id} ({Category}) → {Status}: {Message}",
                        task.Id,
                        task.Category,
                        status,
                        taskResult.Message);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error ejecutando tarea {Id}", task.Id);
                }
            }

            var elapsed = DateTime.UtcNow - startTime;
            _logger.LogInformation("✨ OpsGardener completado en {Duration}ms", elapsed.TotalMilliseconds);

            // Generar reporte
            await _reportWriter.WriteAsync(results, _config);

            return results;
        }

        private bool ShouldRunTask(IOpsTask task)
        {
            return _config.Mode switch
            {
                OpsMode.Audit => task.Category == "audit",
                OpsMode.Repair => task.Category is "audit" or "repair",
                OpsMode.Harmonize => task.Category is "audit" or "harmonize",
                OpsMode.Full => true,
                _ => false
            };
        }

        public async Task HandleUnusualEnergyAsync(OpsUnusualEnergyEvent evt)
        {
            _logger.LogWarning("⚠️ Energía inusual detectada en {Topic} a las {Time}",
                evt.Topic, evt.Timestamp);
            
            // Hook para eventos MQTT "Energía Inusual"
            // Aquí se pueden activar tareas de contingencia
        }

        public async Task HandleQrEventAsync(string jobCardId, string timestamp)
        {
            _logger.LogInformation("📱 Evento QR: Job Card {Id} escaneada a las {Time}",
                jobCardId, timestamp);
            
            // Hook para eventos de QR Scanner
        }
    }
}
