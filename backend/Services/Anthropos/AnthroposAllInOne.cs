using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serendipity.OpsAgents;
using ElMediadorDeSofia.Services.SecurityAgents;

namespace ElMediadorDeSofia.Services.Anthropos
{
    // ============================
    // MODELOS CENTRALES
    // ============================

    public class AnthroposSignal
    {
        public DateTime Timestamp { get; set; }
        public string Source { get; set; } = "system";
        public string Type { get; set; } = "status"; // iot | ops | security | culture | emotion
        public Dictionary<string, object> Data { get; set; } = new();
    }

    public class AnthroposState
    {
        public string Mood { get; set; } = "unknown"; // fertile | stressed | fragmented | flowing
        public IList<string> FlowIssues { get; set; } = new List<string>();
        public IList<string> SecurityRisks { get; set; } = new List<string>();
        public IList<string> DroughtPoints { get; set; } = new List<string>();
        public IList<string> EmotionalSignals { get; set; } = new List<string>();
        public IList<string> CulturalSignals { get; set; } = new List<string>();
        public HeartState? Heart { get; set; }
        public string HeartCoherence { get; set; } = "neutral";
    }

    public interface IAnthroposSignalSource
    {
        Task<AnthroposSignal> CaptureAsync();
    }

    public interface IAnthroposReportWriter
    {
        Task WriteAsync(
            AnthroposState state,
            IList<string> logs,
            IList<SophiaInsight> insights,
            HeartState heart);
    }

    // ============================
    // SOPHIA ENGINE — INTUICION
    // ============================

    public class SophiaInsight
    {
        public string Category { get; set; } = "unknown"; // flow | security | culture | emotion
        public string Message { get; set; } = "";
        public Dictionary<string, object> Data { get; set; } = new();
    }

    public interface ISophiaEngine
    {
        Task<IList<SophiaInsight>> GenerateInsightsAsync(AnthroposState state);
    }

    public class SophiaEngine : ISophiaEngine
    {
        private readonly ILogger<SophiaEngine> _logger;

        public SophiaEngine(ILogger<SophiaEngine> logger)
        {
            _logger = logger;
        }

        public Task<IList<SophiaInsight>> GenerateInsightsAsync(AnthroposState state)
        {
            var insights = new List<SophiaInsight>();

            if (state.DroughtPoints.Any())
            {
                insights.Add(new SophiaInsight
                {
                    Category = "flow",
                    Message = "Drought points indicate unowned or unstructured flows. Prioritize assignment.",
                    Data = { ["count"] = state.DroughtPoints.Count }
                });
            }

            if (state.SecurityRisks.Any())
            {
                insights.Add(new SophiaInsight
                {
                    Category = "security",
                    Message = "Critical security risks detected. Review agents and endpoints.",
                    Data = { ["count"] = state.SecurityRisks.Count }
                });
            }

            if (state.EmotionalSignals.Any(e => e.Contains("stress", StringComparison.OrdinalIgnoreCase)))
            {
                insights.Add(new SophiaInsight
                {
                    Category = "emotion",
                    Message = "Emotional climate shows stress. Consider human intervention.",
                    Data = { ["signals"] = state.EmotionalSignals }
                });
            }

            if (state.CulturalSignals.Any(c => c.Contains("silencio", StringComparison.OrdinalIgnoreCase)))
            {
                insights.Add(new SophiaInsight
                {
                    Category = "culture",
                    Message = "Cultural silence detected. It can indicate disconnection.",
                    Data = { ["signals"] = state.CulturalSignals }
                });
            }

            _logger.LogInformation("SophiaEngine generated {Count} insights.", insights.Count);
            return Task.FromResult<IList<SophiaInsight>>(insights);
        }
    }

    // ============================
    // HEART ENGINE — COHERENCIA
    // ============================

    public class HeartState
    {
        public string Coherence { get; set; } = "neutral"; // coherent | incoherent | stressed
        public double EmotionalLoad { get; set; }
        public double OperationalLoad { get; set; }
    }

    public interface IHeartEngine
    {
        Task<HeartState> EvaluateAsync(AnthroposState state);
    }

    public class HeartEngine : IHeartEngine
    {
        private readonly ILogger<HeartEngine> _logger;

        public HeartEngine(ILogger<HeartEngine> logger)
        {
            _logger = logger;
        }

        public Task<HeartState> EvaluateAsync(AnthroposState state)
        {
            var heart = new HeartState
            {
                EmotionalLoad = state.EmotionalSignals.Count,
                OperationalLoad = state.FlowIssues.Count + state.SecurityRisks.Count
            };

            if (heart.EmotionalLoad == 0 && heart.OperationalLoad == 0)
                heart.Coherence = "coherent";
            else if (heart.EmotionalLoad > 3 || heart.OperationalLoad > 3)
                heart.Coherence = "stressed";
            else
                heart.Coherence = "incoherent";

            _logger.LogInformation("HeartEngine coherence: {C}", heart.Coherence);
            return Task.FromResult(heart);
        }
    }

    // ============================
    // RITUAL ENGINE — RITUALES
    // ============================

    public interface IRitualEngine
    {
        Task<string> RunMorningRitualAsync(AnthroposState state, HeartState heart);
        Task<string> RunEveningRitualAsync(AnthroposState state, HeartState heart);
        Task<string> RunNightWatchAsync();
    }

    public class RitualEngine : IRitualEngine
    {
        private readonly ILogger<RitualEngine> _logger;

        public RitualEngine(ILogger<RitualEngine> logger)
        {
            _logger = logger;
        }

        public Task<string> RunMorningRitualAsync(AnthroposState state, HeartState heart)
        {
            var moodMsg = state.Mood switch
            {
                "fertile" => "Morning ritual: fertile dawn. System is ready to grow.",
                "flowing" => "Morning ritual: flowing dawn. The day promises harmony.",
                "fragmented" => "Morning ritual: fragmented dawn. Review drought points.",
                "stressed" => "Morning ritual: tense dawn. Prioritize security and calm.",
                _ => "Morning ritual: unknown dawn. Observe and align."
            };

            var heartMsg = heart.Coherence switch
            {
                "coherent" => "Heart coherence is stable.",
                "incoherent" => "Heart shows mild incoherence.",
                "stressed" => "Heart is stressed. Lower load.",
                _ => "Heart state unknown."
            };

            var msg = $"{moodMsg} {heartMsg}";
            _logger.LogInformation(msg);
            return Task.FromResult(msg);
        }

        public Task<string> RunEveningRitualAsync(AnthroposState state, HeartState heart)
        {
            var msg = "Evening ritual: the system lowers its pace and records learnings.";
            _logger.LogInformation(msg);
            return Task.FromResult(msg);
        }

        public Task<string> RunNightWatchAsync()
        {
            var msg = "Night watch active: monitoring signals and anomalies.";
            _logger.LogInformation(msg);
            return Task.FromResult(msg);
        }
    }

    // ============================
    // NUCLEO DEL ANTHROPOS
    // ============================

    public class AnthroposCore
    {
        private readonly ILogger<AnthroposCore> _logger;
        private readonly OpsGardenerAgent _ops;
        private readonly SecurityGardenerAgent _security;
        private readonly IEnumerable<IAnthroposSignalSource> _signals;
        private readonly IAnthroposReportWriter _report;
        private readonly ISophiaEngine _sophia;
        private readonly IHeartEngine _heart;
        private readonly IRitualEngine _rituals;

        public AnthroposCore(
            ILogger<AnthroposCore> logger,
            OpsGardenerAgent ops,
            SecurityGardenerAgent security,
            IEnumerable<IAnthroposSignalSource> signals,
            IAnthroposReportWriter report,
            ISophiaEngine sophia,
            IHeartEngine heart,
            IRitualEngine rituals)
        {
            _logger = logger;
            _ops = ops;
            _security = security;
            _signals = signals;
            _report = report;
            _sophia = sophia;
            _heart = heart;
            _rituals = rituals;
        }

        public async Task RunFullCycleAsync()
        {
            _logger.LogInformation("Anthropos: starting full cycle.");

            var logs = new List<string>();
            var state = new AnthroposState();

            try
            {
                logs.Add("[STEP] Capturing signals...");
                var captured = new List<AnthroposSignal>();
                foreach (var src in _signals)
                {
                    try
                    {
                        var s = await src.CaptureAsync();
                        captured.Add(s);
                        logs.Add($"[SIGNAL] {s.Timestamp:o} {s.Source} -> {s.Type}");
                    }
                    catch (Exception ex)
                    {
                        logs.Add($"[ERROR] Signal failed: {ex.Message}");
                    }
                }

                logs.Add("[STEP] Running OpsGardener...");
                var opsResults = await _ops.RunAsync();

                logs.Add("[STEP] Running SecurityGardener...");
                var secResults = await _security.AuditRulesOnlyAsync();

                state.FlowIssues = opsResults
                    .Where(r => r.Rule != null && r.RuleResult != null && !r.RuleResult.Passed)
                    .Select(r => $"{r.Rule!.Id}: {r.RuleResult!.Message}")
                    .ToList();

                state.SecurityRisks = secResults
                    .Where(r => r.Rule != null && r.RuleResult != null && !r.RuleResult.Passed)
                    .Select(r => $"{r.Rule!.Id}: {r.RuleResult!.Message}")
                    .ToList();

                state.DroughtPoints = state.FlowIssues
                    .Where(x => x.Contains("sin", StringComparison.OrdinalIgnoreCase))
                    .ToList();

                state.EmotionalSignals = captured
                    .Where(s => s.Type == "emotion" && s.Data.TryGetValue("value", out _))
                    .Select(s => s.Data["value"].ToString() ?? string.Empty)
                    .Where(v => !string.IsNullOrWhiteSpace(v))
                    .ToList();

                state.CulturalSignals = captured
                    .Where(s => s.Type == "culture" && s.Data.TryGetValue("value", out _))
                    .Select(s => s.Data["value"].ToString() ?? string.Empty)
                    .Where(v => !string.IsNullOrWhiteSpace(v))
                    .ToList();

                var criticalIssues = opsResults.Count(r => r.Rule != null && r.RuleResult != null && !r.RuleResult.Passed && r.Rule.Severity == "critical")
                    + secResults.Count(r => r.Rule != null && r.RuleResult != null && !r.RuleResult.Passed && r.Rule.Severity == "critical");

                if (!state.FlowIssues.Any() && !state.SecurityRisks.Any())
                    state.Mood = "fertile";
                else if (criticalIssues > 0)
                    state.Mood = "stressed";
                else if (state.DroughtPoints.Any())
                    state.Mood = "fragmented";
                else
                    state.Mood = "flowing";

                logs.Add($"[STATE] Mood = {state.Mood}");

                var insights = await _sophia.GenerateInsightsAsync(state);
                var heart = await _heart.EvaluateAsync(state);

                await _report.WriteAsync(state, logs, insights, heart);

                var morningMsg = await _rituals.RunMorningRitualAsync(state, heart);
                logs.Add($"[RITUAL] Morning: {morningMsg}");

                _logger.LogInformation("Anthropos: cycle completed with {Mood}.", state.Mood);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Anthropos: error during full cycle.");
                logs.Add($"[FATAL] {ex.Message}");
                var heart = await _heart.EvaluateAsync(state);
                await _report.WriteAsync(state, logs, new List<SophiaInsight>(), heart);
            }
        }
    }

    // ============================
    // REPORT WRITER
    // ============================

    public class AnthroposReportWriter : IAnthroposReportWriter
    {
        private readonly ILogger<AnthroposReportWriter> _logger;
        private readonly string _dir = "anthropos/reports";

        public AnthroposReportWriter(ILogger<AnthroposReportWriter> logger)
        {
            _logger = logger;
        }

        public async Task WriteAsync(AnthroposState state, IList<string> logs, IList<SophiaInsight> insights, HeartState heart)
        {
            Directory.CreateDirectory(_dir);
            var date = DateTime.UtcNow.ToString("yyyy-MM-dd_HH-mm");
            var path = Path.Combine(_dir, $"anthropos-report-{date}.md");

            var insightsText = insights.Any()
                ? string.Join("\n", insights.Select(i => $"- [{i.Category}] {i.Message}"))
                : "_No Sophia insights._";

            var content = $@"# Anthropos Report - {date}

## Estado General
- Estado global: **{state.Mood}**
- Puntos de sequia: {state.DroughtPoints.Count}
- Riesgos de seguridad: {state.SecurityRisks.Count}
- Problemas de flujo: {state.FlowIssues.Count}
- Senales emocionales: {state.EmotionalSignals.Count}
- Senales culturales: {state.CulturalSignals.Count}

## Estado del Corazon
- Coherencia: **{heart.Coherence}**
- Carga emocional: {heart.EmotionalLoad}
- Carga operativa: {heart.OperationalLoad}

## Intuiciones de Sophia
{insightsText}

## Puntos de Sequia
{(state.DroughtPoints.Any() ? string.Join("\n", state.DroughtPoints.Select(x => "- " + x)) : "_Ninguno._")}

## Riesgos de Seguridad
{(state.SecurityRisks.Any() ? string.Join("\n", state.SecurityRisks.Select(x => "- " + x)) : "_Ninguno._")}

## Problemas de Flujo
{(state.FlowIssues.Any() ? string.Join("\n", state.FlowIssues.Select(x => "- " + x)) : "_Ninguno._")}

## Senales Emocionales
{(state.EmotionalSignals.Any() ? string.Join("\n", state.EmotionalSignals.Select(x => "- " + x)) : "_Ninguno._")}

## Senales Culturales
{(state.CulturalSignals.Any() ? string.Join("\n", state.CulturalSignals.Select(x => "- " + x)) : "_Ninguno._")}

## Log del Ciclo
```text
{string.Join("\n", logs)}
```
";

            await File.WriteAllTextAsync(path, content);
            _logger.LogInformation("Anthropos report saved at {Path}", path);
        }
    }

    // ============================
    // DAILY CYCLE SERVICE
    // ============================

    public class AnthroposDailyCycleService : IHostedService
    {
        private readonly ILogger<AnthroposDailyCycleService> _logger;
        private readonly AnthroposCore _core;
        private readonly IRitualEngine _rituals;
        private readonly IHeartEngine _heartEngine;
        private readonly IEnumerable<IAnthroposSignalSource> _signals;
        private Timer? _timer;
        private bool _isRunning;

        private readonly TimeSpan _fullCycleTime = new(2, 0, 0);
        private readonly TimeSpan _morningTime = new(6, 0, 0);
        private readonly TimeSpan _eveningTime = new(18, 0, 0);
        private readonly TimeSpan _nightTime = new(22, 0, 0);

        private DateTime? _lastFullCycle;
        private DateTime? _lastMorning;
        private DateTime? _lastEvening;
        private DateTime? _lastNight;

        public AnthroposDailyCycleService(
            ILogger<AnthroposDailyCycleService> logger,
            AnthroposCore core,
            IRitualEngine rituals,
            IHeartEngine heartEngine,
            IEnumerable<IAnthroposSignalSource> signals)
        {
            _logger = logger;
            _core = core;
            _rituals = rituals;
            _heartEngine = heartEngine;
            _signals = signals;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(async _ => await TickAsync(), null, TimeSpan.Zero, TimeSpan.FromMinutes(1));
            _logger.LogInformation("Anthropos daily cycle service started.");
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Dispose();
            return Task.CompletedTask;
        }

        private async Task TickAsync()
        {
            if (_isRunning)
                return;

            _isRunning = true;
            try
            {
                var now = DateTime.UtcNow;

                if (ShouldRun(now, _fullCycleTime, _lastFullCycle))
                {
                    _logger.LogInformation("Anthropos: full cycle (02:00 UTC)");
                    await _core.RunFullCycleAsync();
                    _lastFullCycle = now;
                }

                if (ShouldRun(now, _morningTime, _lastMorning))
                {
                    _logger.LogInformation("Anthropos: morning ritual (06:00 UTC)");
                    var state = await BuildSnapshotAsync();
                    var heart = await _heartEngine.EvaluateAsync(state);
                    await _rituals.RunMorningRitualAsync(state, heart);
                    _lastMorning = now;
                }

                if (ShouldRun(now, _eveningTime, _lastEvening))
                {
                    _logger.LogInformation("Anthropos: evening ritual (18:00 UTC)");
                    var state = await BuildSnapshotAsync();
                    var heart = await _heartEngine.EvaluateAsync(state);
                    await _rituals.RunEveningRitualAsync(state, heart);
                    _lastEvening = now;
                }

                if (ShouldRun(now, _nightTime, _lastNight))
                {
                    _logger.LogInformation("Anthropos: night watch (22:00 UTC)");
                    await _rituals.RunNightWatchAsync();
                    _lastNight = now;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Anthropos daily cycle error");
            }
            finally
            {
                _isRunning = false;
            }
        }

        private static bool ShouldRun(DateTime now, TimeSpan targetTime, DateTime? lastRun)
        {
            if (now.TimeOfDay < targetTime)
                return false;

            return lastRun == null || lastRun.Value.Date < now.Date;
        }

        private async Task<AnthroposState> BuildSnapshotAsync()
        {
            var state = new AnthroposState();
            var captured = new List<AnthroposSignal>();

            foreach (var src in _signals)
            {
                try
                {
                    var s = await src.CaptureAsync();
                    captured.Add(s);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Anthropos snapshot signal failed");
                }
            }

            state.EmotionalSignals = captured
                .Where(s => s.Type == "emotion" && s.Data.TryGetValue("value", out _))
                .Select(s => s.Data["value"].ToString() ?? string.Empty)
                .Where(v => !string.IsNullOrWhiteSpace(v))
                .ToList();

            state.CulturalSignals = captured
                .Where(s => s.Type == "culture" && s.Data.TryGetValue("value", out _))
                .Select(s => s.Data["value"].ToString() ?? string.Empty)
                .Where(v => !string.IsNullOrWhiteSpace(v))
                .ToList();

            return state;
        }
    }
}

namespace ElMediadorDeSofia.Services.Anthropos.SignalSources
{
    public class IoTSignalSource : IAnthroposSignalSource
    {
        private readonly ILogger<IoTSignalSource> _logger;
        private readonly string _iotFile = "anthropos/iot-sensor.json";

        public IoTSignalSource(ILogger<IoTSignalSource> logger)
        {
            _logger = logger;
        }

        public async Task<AnthroposSignal> CaptureAsync()
        {
            var signal = new AnthroposSignal
            {
                Timestamp = DateTime.UtcNow,
                Source = "iot-sensor",
                Type = "iot"
            };

            try
            {
                if (!File.Exists(_iotFile))
                {
                    await CreateDefaultFileAsync();
                }

                var json = await File.ReadAllTextAsync(_iotFile);
                using var doc = JsonDocument.Parse(json);
                var root = doc.RootElement;

                var data = new Dictionary<string, object>();
                if (root.TryGetProperty("sensor_id", out var sensorId))
                    data["sensor_id"] = sensorId.GetString() ?? "unknown";
                if (root.TryGetProperty("status", out var status))
                    data["status"] = status.GetString() ?? "unknown";
                if (root.TryGetProperty("temperature", out var temp))
                    data["temperature"] = temp.GetDouble();
                if (root.TryGetProperty("humidity", out var humidity))
                    data["humidity"] = humidity.GetDouble();
                if (root.TryGetProperty("alerts", out var alerts))
                {
                    var list = new List<string>();
                    foreach (var alert in alerts.EnumerateArray())
                        list.Add(alert.GetString() ?? "unknown");
                    data["alerts"] = list;
                }

                signal.Data = data;
                _logger.LogInformation("Anthropos IoT signal captured");
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Anthropos IoT signal failed");
                signal.Data["error"] = ex.Message;
            }

            return signal;
        }

        private async Task CreateDefaultFileAsync()
        {
            Directory.CreateDirectory(Path.GetDirectoryName(_iotFile)!);

            var payload = new
            {
                sensor_id = "iot-001",
                status = "ok",
                temperature = 21.5,
                humidity = 44.0,
                alerts = new string[] { }
            };

            var json = JsonSerializer.Serialize(payload, new JsonSerializerOptions { WriteIndented = true });
            await File.WriteAllTextAsync(_iotFile, json);
        }
    }

    public class EmotionSignalSource : IAnthroposSignalSource
    {
        private readonly ILogger<EmotionSignalSource> _logger;
        private readonly string _emotionFile = "anthropos/emotion.json";

        public EmotionSignalSource(ILogger<EmotionSignalSource> logger)
        {
            _logger = logger;
        }

        public async Task<AnthroposSignal> CaptureAsync()
        {
            var signal = new AnthroposSignal
            {
                Timestamp = DateTime.UtcNow,
                Source = "emotion-sensor",
                Type = "emotion"
            };

            try
            {
                if (!File.Exists(_emotionFile))
                {
                    await CreateDefaultFileAsync();
                }

                var json = await File.ReadAllTextAsync(_emotionFile);
                using var doc = JsonDocument.Parse(json);
                var root = doc.RootElement;

                if (root.TryGetProperty("value", out var value))
                    signal.Data["value"] = value.GetString() ?? "neutral";
                if (root.TryGetProperty("intensity", out var intensity))
                    signal.Data["intensity"] = intensity.GetInt32();

                _logger.LogInformation("Anthropos emotion signal captured");
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Anthropos emotion signal failed");
                signal.Data["error"] = ex.Message;
            }

            return signal;
        }

        private async Task CreateDefaultFileAsync()
        {
            Directory.CreateDirectory(Path.GetDirectoryName(_emotionFile)!);

            var payload = new
            {
                value = "calm",
                intensity = 3
            };

            var json = JsonSerializer.Serialize(payload, new JsonSerializerOptions { WriteIndented = true });
            await File.WriteAllTextAsync(_emotionFile, json);
        }
    }

    public class CultureSignalSource : IAnthroposSignalSource
    {
        private readonly ILogger<CultureSignalSource> _logger;
        private readonly string _cultureFile = "anthropos/culture.json";

        public CultureSignalSource(ILogger<CultureSignalSource> logger)
        {
            _logger = logger;
        }

        public async Task<AnthroposSignal> CaptureAsync()
        {
            var signal = new AnthroposSignal
            {
                Timestamp = DateTime.UtcNow,
                Source = "culture-sensor",
                Type = "culture"
            };

            try
            {
                if (!File.Exists(_cultureFile))
                {
                    await CreateDefaultFileAsync();
                }

                var json = await File.ReadAllTextAsync(_cultureFile);
                using var doc = JsonDocument.Parse(json);
                var root = doc.RootElement;

                if (root.TryGetProperty("value", out var value))
                    signal.Data["value"] = value.GetString() ?? "collaboration";
                if (root.TryGetProperty("signal", out var signalValue))
                    signal.Data["signal"] = signalValue.GetString() ?? "steady";

                _logger.LogInformation("Anthropos culture signal captured");
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Anthropos culture signal failed");
                signal.Data["error"] = ex.Message;
            }

            return signal;
        }

        private async Task CreateDefaultFileAsync()
        {
            Directory.CreateDirectory(Path.GetDirectoryName(_cultureFile)!);

            var payload = new
            {
                value = "collaboration",
                signal = "steady"
            };

            var json = JsonSerializer.Serialize(payload, new JsonSerializerOptions { WriteIndented = true });
            await File.WriteAllTextAsync(_cultureFile, json);
        }
    }

    public class SystemHealthSignalSource : IAnthroposSignalSource
    {
        private readonly ILogger<SystemHealthSignalSource> _logger;

        public SystemHealthSignalSource(ILogger<SystemHealthSignalSource> logger)
        {
            _logger = logger;
        }

        public async Task<AnthroposSignal> CaptureAsync()
        {
            return await Task.Run(() =>
            {
                var signal = new AnthroposSignal
                {
                    Timestamp = DateTime.UtcNow,
                    Source = "system-health",
                    Type = "ops"
                };

                try
                {
                    var memUsage = GC.GetTotalMemory(false) / (1024.0 * 1024.0);
                    signal.Data["memory_mb"] = Math.Round(memUsage, 2);
                    signal.Data["memory_status"] = memUsage > 1000 ? "high" : "normal";

                    var currentProcess = System.Diagnostics.Process.GetCurrentProcess();
                    signal.Data["thread_count"] = currentProcess.Threads.Count;
                    signal.Data["working_set_mb"] = Math.Round(currentProcess.WorkingSet64 / (1024.0 * 1024.0), 2);
                    signal.Data["process_id"] = currentProcess.Id;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Anthropos system health signal failed");
                    signal.Data["error"] = ex.Message;
                }

                return signal;
            });
        }
    }
}
