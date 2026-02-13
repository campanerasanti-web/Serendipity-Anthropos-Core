using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Serendipity.OpsAgents;

namespace ElMediadorDeSofia.Controllers
{
    [ApiController]
    [Route("api/ops")]
    public class OpsGardenerController : ControllerBase
    {
        private readonly OpsGardenerAgent _gardener;
        private readonly IEnumerable<IOpsRule> _rules;
        private readonly IEnumerable<IOpsTask> _tasks;
        private readonly IOpsReportWriter _reportWriter;
        private readonly ILogger<OpsGardenerController> _logger;

        public OpsGardenerController(
            OpsGardenerAgent gardener,
            IEnumerable<IOpsRule> rules,
            IEnumerable<IOpsTask> tasks,
            IOpsReportWriter reportWriter,
            ILogger<OpsGardenerController> logger)
        {
            _gardener = gardener;
            _rules = rules;
            _tasks = tasks;
            _reportWriter = reportWriter;
            _logger = logger;
        }

        [HttpPost("audit")]
        public async Task<IActionResult> RunAudit()
        {
            try
            {
                _logger.LogInformation("🌱 OpsGardener AUDIT iniciado desde API");
                var config = OpsGardenerConfigFactory.CreateConfig(OpsMode.Audit);
                var results = await _gardener.RunAsync();
                
                return Ok(new
                {
                    success = true,
                    message = "✅ Auditoría completada",
                    resultsCount = results.Count,
                    timestamp = DateTime.UtcNow,
                    mode = "audit"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en OpsGardener audit");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("repair")]
        public async Task<IActionResult> RunRepair([FromQuery] bool autoFix = true)
        {
            try
            {
                _logger.LogInformation("🔧 OpsGardener REPAIR iniciado desde API (AutoFix: {AutoFix})", autoFix);
                var config = OpsGardenerConfigFactory.CreateConfig(OpsMode.Repair, autoFix);
                var results = await _gardener.RunAsync();
                
                return Ok(new
                {
                    success = true,
                    message = "✅ Reparación completada",
                    resultsCount = results.Count,
                    timestamp = DateTime.UtcNow,
                    mode = "repair",
                    autoFixApplied = autoFix
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en OpsGardener repair");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("harmonize")]
        public async Task<IActionResult> RunHarmonize([FromQuery] bool autoFix = false)
        {
            try
            {
                _logger.LogInformation("🌿 OpsGardener HARMONIZE iniciado desde API");
                var config = OpsGardenerConfigFactory.CreateConfig(OpsMode.Harmonize, autoFix);
                var results = await _gardener.RunAsync();
                
                return Ok(new
                {
                    success = true,
                    message = "✅ Armonización completada",
                    resultsCount = results.Count,
                    timestamp = DateTime.UtcNow,
                    mode = "harmonize"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en OpsGardener harmonize");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("energy-event")]
        public async Task<IActionResult> ReportUnusualEnergy([FromBody] OpsUnusualEnergyEvent evt)
        {
            try
            {
                _logger.LogWarning("⚠️ Energía inusual reportada: {Topic}", evt.Topic);
                await _gardener.HandleUnusualEnergyAsync(evt);
                
                return Ok(new
                {
                    success = true,
                    message = "⚠️ Evento de energía inusual procesado",
                    timestamp = DateTime.UtcNow,
                    anomaly = evt.Topic
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error procesando evento de energía");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("qr-event")]
        public async Task<IActionResult> ReportQrEvent([FromBody] QrEventPayload payload)
        {
            try
            {
                _logger.LogInformation("📱 QR escaneado: {JobCardId}", payload.JobCardId);
                await _gardener.HandleQrEventAsync(payload.JobCardId, payload.Timestamp);
                
                return Ok(new
                {
                    success = true,
                    message = "📱 QR procesado",
                    jobCardId = payload.JobCardId,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error procesando QR");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("status")]
        public IActionResult Status()
        {
            return Ok(new
            {
                service = "OpsGardener",
                status = "operational",
                rulesRegistered = _rules?.Count() ?? 0,
                tasksRegistered = _tasks?.Count() ?? 0,
                timestamp = DateTime.UtcNow,
                endpoints = new
                {
                    audit = "POST /api/ops/audit",
                    repair = "POST /api/ops/repair?autoFix=true",
                    harmonize = "POST /api/ops/harmonize",
                    energyEvent = "POST /api/ops/energy-event",
                    qrEvent = "POST /api/ops/qr-event",
                    status = "GET /api/ops/status"
                }
            });
        }

        [HttpGet("health")]
        public IActionResult Health()
        {
            // Auditoría rápida
            var hasRules = _rules?.Any() ?? false;
            var hasTasks = _tasks?.Any() ?? false;

            return Ok(new
            {
                healthy = hasRules && hasTasks,
                service = "OpsGardener",
                rules = hasRules ? "✅" : "❌",
                tasks = hasTasks ? "✅" : "❌",
                timestamp = DateTime.UtcNow
            });
        }
    }

    public class QrEventPayload
    {
        public string JobCardId { get; set; } = "";
        public string Timestamp { get; set; } = DateTime.UtcNow.ToString("O");
    }
}
