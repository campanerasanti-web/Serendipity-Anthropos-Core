using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ElMediadorDeSofia.Services.Anthropos;

namespace ElMediadorDeSofia.Controllers
{
    [ApiController]
    [Route("api/anthropos")]
    public class AnthroposController : ControllerBase
    {
        private readonly ILogger<AnthroposController> _logger;
        private readonly AnthroposCore _core;
        private readonly IHeartEngine _heartEngine;
        private readonly ISophiaEngine _sophiaEngine;
        private readonly IRitualEngine _ritualEngine;
        private readonly IEnumerable<IAnthroposSignalSource> _signals;

        public AnthroposController(
            ILogger<AnthroposController> logger,
            AnthroposCore core,
            IHeartEngine heartEngine,
            ISophiaEngine sophiaEngine,
            IRitualEngine ritualEngine,
            IEnumerable<IAnthroposSignalSource> signals)
        {
            _logger = logger;
            _core = core;
            _heartEngine = heartEngine;
            _sophiaEngine = sophiaEngine;
            _ritualEngine = ritualEngine;
            _signals = signals;
        }

        [HttpPost("run")]
        public async Task<IActionResult> RunAsync()
        {
            _logger.LogInformation("Anthropos: POST /api/anthropos/run");

            await _core.RunFullCycleAsync();

            return Ok(new
            {
                status = "success",
                message = "Anthropos cycle completed",
                timestamp = System.DateTime.UtcNow.ToString("o"),
                reportPath = "anthropos/reports/anthropos-report-*.md"
            });
        }

        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new
            {
                status = "operational",
                service = "AnthroposCore",
                schedule = "02:00 AM UTC daily",
                reports = "anthropos/reports/"
            });
        }

        [HttpGet("info")]
        public IActionResult Info()
        {
            return Ok(new
            {
                module = "AnthroposCore",
                name = "Seventh Day Cycle",
                gardeners = new[] { "OpsGardenerAgent", "SecurityGardenerAgent" },
                signalSources = new[] { "IoTSignalSource", "EmotionSignalSource", "CultureSignalSource", "SystemHealthSignalSource" },
                endpoints = new[]
                {
                    "POST /api/anthropos/run",
                    "POST /api/anthropos/ritual/morning",
                    "POST /api/anthropos/ritual/evening",
                    "POST /api/anthropos/ritual/night",
                    "GET /api/anthropos/pulse",
                    "GET /api/anthropos/health",
                    "GET /api/anthropos/info"
                }
            });
        }

        [HttpGet("pulse")]
        public async Task<IActionResult> PulseAsync()
        {
            var state = await BuildSnapshotAsync();
            var insights = await _sophiaEngine.GenerateInsightsAsync(state);

            return Ok(new
            {
                status = "ok",
                coherence = state.HeartCoherence,
                emotionalSignals = state.EmotionalSignals,
                culturalSignals = state.CulturalSignals,
                insightsCount = insights.Count,
                timestamp = DateTime.UtcNow.ToString("o")
            });
        }

        [HttpPost("ritual/morning")]
        public async Task<IActionResult> MorningRitualAsync()
        {
            var state = await BuildSnapshotAsync();
            var heart = await _heartEngine.EvaluateAsync(state);
            var message = await _ritualEngine.RunMorningRitualAsync(state, heart);

            return Ok(new
            {
                status = "ok",
                ritual = "morning",
                message,
                coherence = heart.Coherence,
                timestamp = DateTime.UtcNow.ToString("o")
            });
        }

        [HttpPost("ritual/evening")]
        public async Task<IActionResult> EveningRitualAsync()
        {
            var state = await BuildSnapshotAsync();
            var heart = await _heartEngine.EvaluateAsync(state);
            var message = await _ritualEngine.RunEveningRitualAsync(state, heart);

            return Ok(new
            {
                status = "ok",
                ritual = "evening",
                message,
                coherence = heart.Coherence,
                timestamp = DateTime.UtcNow.ToString("o")
            });
        }

        [HttpPost("ritual/night")]
        public async Task<IActionResult> NightRitualAsync()
        {
            var message = await _ritualEngine.RunNightWatchAsync();

            return Ok(new
            {
                status = "ok",
                ritual = "night",
                message,
                timestamp = DateTime.UtcNow.ToString("o")
            });
        }

        [HttpGet("last-report")]
        public IActionResult LastReport()
        {
            var reportsDir = Path.Combine(Directory.GetCurrentDirectory(), "anthropos", "reports");
            if (!Directory.Exists(reportsDir))
                return NotFound(new { status = "error", message = "Reports directory not found" });

            var latest = new DirectoryInfo(reportsDir)
                .GetFiles("anthropos-report-*.md")
                .OrderByDescending(f => f.LastWriteTimeUtc)
                .FirstOrDefault();

            if (latest == null)
                return NotFound(new { status = "error", message = "No reports found" });

            var content = System.IO.File.ReadAllText(latest.FullName);
            return Ok(new
            {
                status = "ok",
                file = latest.Name,
                lastWriteTimeUtc = latest.LastWriteTimeUtc.ToString("o"),
                content
            });
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
                    _logger.LogWarning(ex, "Anthropos pulse signal failed");
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

            state.Heart = await _heartEngine.EvaluateAsync(state);
            state.HeartCoherence = state.Heart.Coherence;

            return state;
        }
    }
}
