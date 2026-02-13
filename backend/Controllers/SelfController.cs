using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ElMediadorDeSofia.Services.CoreAgents;

namespace ElMediadorDeSofia.Controllers
{
    /// <summary>
    /// API endpoints para el módulo Self Gardener (Séptimo Día)
    /// </summary>
    [ApiController]
    [Route("api/self")]
    public class SelfController : ControllerBase
    {
        private readonly ILogger<SelfController> _logger;
        private readonly SelfGardenerCore _core;
        private readonly SelfGardenerHostedService _hostedService;

        public SelfController(
            ILogger<SelfController> logger,
            SelfGardenerCore core,
            SelfGardenerHostedService hostedService)
        {
            _logger = logger;
            _core = core;
            _hostedService = hostedService;
        }

        /// <summary>
        /// Ejecuta manualmente el ciclo Sabbath (Séptimo Día).
        /// Útil para testing o auditoría manual.
        /// </summary>
        [HttpPost("sabbath")]
        public async Task<IActionResult> ExecuteSabbathAsync([FromQuery] string mode = "harmonize")
        {
            try
            {
                _logger.LogInformation("📍 POST /api/self/sabbath - Ejecutando ciclo manual en modo {Mode}", mode);

                await _core.RunSabbathCycleAsync(mode);

                return Ok(new
                {
                    status = "success",
                    message = "✅ Ciclo Sabbath ejecutado exitosamente",
                    timestamp = System.DateTime.UtcNow.ToString("o"),
                    mode = mode,
                    nextReport = "self/reports/self-report-*.md"
                });
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "❌ Error ejecutando ciclo Sabbath");
                return StatusCode(500, new
                {
                    status = "error",
                    message = $"Error: {ex.Message}",
                    timestamp = System.DateTime.UtcNow.ToString("o")
                });
            }
        }

        /// <summary>
        /// Retorna el estado de salud del Self Gardener
        /// </summary>
        [HttpGet("health")]
        public IActionResult GetHealth()
        {
            return Ok(new
            {
                status = "operational",
                service = "SelfGardenerCore",
                version = "1.0",
                description = "Séptimo Día — Ciclo de reflexión del sistema",
                schedule = "02:00 AM UTC diariamente",
                reports_location = "self/reports/",
                timestamp = System.DateTime.UtcNow.ToString("o")
            });
        }

        /// <summary>
        /// Retorna información del módulo
        /// </summary>
        [HttpGet("info")]
        public IActionResult GetInfo()
        {
            return Ok(new
            {
                module = "SelfGardenerCore",
                name = "Séptimo Día",
                description = "Integración de OpsGardener + SecurityGardener para reflexión sistémica",
                components = new
                {
                    gardeners = new[] { "OpsGardenerAgent (9 reglas)", "SecurityGardenerAgent (7 reglas)" },
                    signalSources = new[] { "SystemHealthSignalSource", "OperationalClimateSignalSource" },
                    reportWriter = "SelfGardenerReportWriter (Markdown)"
                },
                metrics = new
                {
                    totalRules = 16,
                    opsRules = 9,
                    securityRules = 7,
                    moods = new[] { "fertile", "flowing", "fragmented", "stressed" }
                },
                endpoints = new
                {
                    sabbath_manual = "POST /api/self/sabbath?mode=harmonize",
                    health = "GET /api/self/health",
                    info = "GET /api/self/info"
                }
            });
        }
    }
}
