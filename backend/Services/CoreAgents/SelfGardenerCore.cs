using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Serendipity.OpsAgents;
using ElMediadorDeSofia.Services.SecurityAgents;

namespace ElMediadorDeSofia.Services.CoreAgents
{
    /// <summary>
    /// Núcleo de integración: "Self Gardener"
    /// Une Operaciones, Seguridad, Datos y Clima Humano en un solo pulso.
    /// Ejecuta cada noche el "Séptimo Día" — ciclo de reflexión y armonización.
    /// </summary>

    public interface ISelfSignalSource
    {
        Task<SelfSignal> CaptureAsync();
    }

    public class SelfSignal
    {
        public System.DateTime Timestamp { get; set; }
        public string Mode { get; set; } = "harmonize"; // audit | repair | harmonize | reflect
        public string Source { get; set; } = "system";
        public Dictionary<string, object> Context { get; set; } = new();
    }

    public class SelfState
    {
        public string OverallMood { get; set; } = "unknown"; // fertile | stressed | fragmented | flowing
        public IList<string> DroughtPoints { get; set; } = new List<string>(); // puntos de sequía
        public IList<string> SecurityRisks { get; set; } = new List<string>();
        public IList<string> FlowIssues { get; set; } = new List<string>();
        public IList<string> CulturalSignals { get; set; } = new List<string>();
    }

    public interface ISelfGardenerReportWriter
    {
        Task WriteAsync(SelfState state, IList<string> logs);
    }

    public class SelfGardenerCore
    {
        private readonly ILogger<SelfGardenerCore> _logger;
        private readonly OpsGardenerAgent _opsGardener;
        private readonly SecurityGardenerAgent _securityGardener;
        private readonly IEnumerable<ISelfSignalSource> _signalSources;
        private readonly ISelfGardenerReportWriter _reportWriter;

        public SelfGardenerCore(
            ILogger<SelfGardenerCore> logger,
            OpsGardenerAgent opsGardener,
            SecurityGardenerAgent securityGardener,
            IEnumerable<ISelfSignalSource> signalSources,
            ISelfGardenerReportWriter reportWriter)
        {
            _logger = logger;
            _opsGardener = opsGardener;
            _securityGardener = securityGardener;
            _signalSources = signalSources;
            _reportWriter = reportWriter;
        }

        public async Task RunSabbathCycleAsync(string mode = "harmonize")
        {
            _logger.LogInformation("🕊️ SelfGardenerCore iniciado en modo {Mode}.", mode);

            var logs = new List<string>();
            var state = new SelfState();

            try
            {
                // 1. Capturar señales del sistema (IoT, clima, errores, etc.)
                logs.Add("[SIGNAL] Capturando señales del sistema...");
                var signals = new List<SelfSignal>();
                foreach (var src in _signalSources)
                {
                    try
                    {
                        var s = await src.CaptureAsync();
                        signals.Add(s);
                        logs.Add($"[SIGNAL] {s.Timestamp:o} {s.Source} → {s.Mode}");
                    }
                    catch (Exception ex)
                    {
                        logs.Add($"[ERROR] Fallo al capturar señal: {ex.Message}");
                    }
                }

                // 2. Ejecutar jardineros especializados (Operaciones + Seguridad)
                logs.Add("[STEP] Ejecutando OpsGardenerAgent…");
                var opsResults = await _opsGardener.RunAsync();
                var opsRulesCount = opsResults.Count(r => r.Rule != null);
                var opsCriticalCount = opsResults.Count(r => r.Rule != null && r.RuleResult != null && !r.RuleResult.Passed && r.Rule.Severity == "critical");
                logs.Add($"[OPS] {opsRulesCount} reglas validadas, {opsCriticalCount} críticas");

                logs.Add("[STEP] Ejecutando SecurityGardenerAgent (auditoría rápida)…");
                var secResults = await _securityGardener.AuditRulesOnlyAsync();
                var secCriticalCount = secResults.Count(r => r.Rule != null && r.RuleResult != null && !r.RuleResult.Passed && r.Rule.Severity == "critical");
                logs.Add($"[SEC] {secResults.Count} reglas validadas, {secCriticalCount} críticas");

                // 3. Sintetizar estado (Tierra Fértil / Sequía / Estrés / Flujo)
                state.FlowIssues = opsResults
                    .Where(r => r.Rule != null && r.RuleResult != null && !r.RuleResult.Passed)
                    .Select(r => $"FLOW: {r.Rule!.Id}: {r.RuleResult!.Message}")
                    .ToList();

                state.SecurityRisks = secResults
                    .Where(r => r.Rule != null && r.RuleResult != null && !r.RuleResult.Passed)
                    .Select(r => $"SEC: {r.Rule!.Id}: {r.RuleResult!.Message}")
                    .ToList();

                // Puntos de sequía: flujos sin dueño, sin KPI, sin tiempo, sin docs, etc.
                state.DroughtPoints = state.FlowIssues
                    .Where(x => x.Contains("sin dueño", System.StringComparison.OrdinalIgnoreCase)
                             || x.Contains("sin KPI", System.StringComparison.OrdinalIgnoreCase)
                             || x.Contains("sin tiempo", System.StringComparison.OrdinalIgnoreCase)
                             || x.Contains("sin documentación", System.StringComparison.OrdinalIgnoreCase))
                    .ToList();

                // Clima general
                var criticalIssues = opsResults.Count(r => r.Rule != null && r.RuleResult != null && !r.RuleResult.Passed && r.Rule.Severity == "critical")
                    + secResults.Count(r => r.Rule != null && r.RuleResult != null && !r.RuleResult.Passed && r.Rule.Severity == "critical");

                if (!state.FlowIssues.Any() && !state.SecurityRisks.Any())
                    state.OverallMood = "fertile";
                else if (criticalIssues > 0)
                    state.OverallMood = "stressed";
                else if (state.DroughtPoints.Any())
                    state.OverallMood = "fragmented";
                else
                    state.OverallMood = "flowing";

                logs.Add($"[STATE] OverallMood = {state.OverallMood}");
                logs.Add($"[STATE] DroughtPoints = {state.DroughtPoints.Count}");
                logs.Add($"[STATE] SecurityRisks = {state.SecurityRisks.Count}");
                logs.Add($"[STATE] FlowIssues = {state.FlowIssues.Count}");
                logs.Add($"[STATE] CriticalIssues = {criticalIssues}");

                // 4. Escribir reporte central del Séptimo Día
                await _reportWriter.WriteAsync(state, logs);

                _logger.LogInformation("🕊️ SelfGardenerCore completó el ciclo Sabbath con estado {Mood}.", state.OverallMood);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error en SelfGardenerCore.RunSabbathCycleAsync");
                logs.Add($"[FATAL] {ex.Message}");
                await _reportWriter.WriteAsync(state, logs);
            }
        }
    }
}
