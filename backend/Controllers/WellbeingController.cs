using System;
using System.Threading.Tasks;
using ElMediadorDeSofia.Services;
using Microsoft.AspNetCore.Mvc;

namespace ElMediadorDeSofia.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WellbeingController : ControllerBase
    {
        private readonly PersonalWellbeingService _wellbeingService;
        private readonly ILogger<WellbeingController> _logger;

        public WellbeingController(PersonalWellbeingService wellbeingService, ILogger<WellbeingController> logger)
        {
            _wellbeingService = wellbeingService;
            _logger = logger;
        }

        /// <summary>
        /// POST /api/wellbeing/baseline
        /// Crea línea base de bienestar
        /// </summary>
        [HttpPost("baseline")]
        public async Task<IActionResult> CreateBaseline([FromBody] dynamic request)
        {
            try
            {
                string email = request.email ?? "unknown@serendipity.com";
                string personName = request.personName ?? "Unknown";

                var baseline = await _wellbeingService.CreateBaselineAsync(email, personName);
                return Ok(baseline);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating baseline");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/wellbeing/current/{email}
        /// Obtiene registro actual de bienestar
        /// </summary>
        [HttpGet("current/{email}")]
        public async Task<IActionResult> GetCurrent(string email)
        {
            try
            {
                var record = await _wellbeingService.GetCurrentAsync(email);
                if (record == null)
                    return NotFound(new { message = $"No wellbeing record for {email}" });
                return Ok(record);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting current wellbeing for {email}", email);
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// PATCH /api/wellbeing/paz-interior
        /// Actualiza métrica de paz interior
        /// </summary>
        [HttpPatch("paz-interior")]
        public async Task<IActionResult> UpdatePazInterior([FromBody] dynamic request)
        {
            try
            {
                string email = request.email ?? "unknown@serendipity.com";
                int score = request.score ?? 50;
                string description = request.description ?? "Neutral state";

                await _wellbeingService.UpdatePazInteriorAsync(email, score, description);

                var record = await _wellbeingService.GetCurrentAsync(email);
                return Ok(new { message = "Paz Interior updated", record });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating paz interior");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// PATCH /api/wellbeing/presence
        /// Actualiza horas de presencia
        /// </summary>
        [HttpPatch("presence")]
        public async Task<IActionResult> UpdatePresence([FromBody] dynamic request)
        {
            try
            {
                string email = request.email ?? "unknown@serendipity.com";
                decimal hoursToday = request.hoursToday ?? 0;
                decimal targetHours = request.targetHours ?? 8;

                await _wellbeingService.UpdatePresenceAsync(email, hoursToday, targetHours);

                var record = await _wellbeingService.GetCurrentAsync(email);
                return Ok(new { message = "Presence updated", record });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating presence");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// PATCH /api/wellbeing/automation
        /// Registra impacto de automatización
        /// </summary>
        [HttpPatch("automation")]
        public async Task<IActionResult> UpdateAutomation([FromBody] dynamic request)
        {
            try
            {
                string email = request.email ?? "unknown@serendipity.com";
                int tasksAutomated = request.tasksAutomated ?? 0;
                decimal hoursRecovered = request.hoursRecovered ?? 0;

                await _wellbeingService.UpdateAutomationImpactAsync(email, tasksAutomated, hoursRecovered);

                var record = await _wellbeingService.GetCurrentAsync(email);
                return Ok(new { message = "Automation impact recorded", record });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating automation");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// PATCH /api/wellbeing/mindfulness
        /// Registra actividades de mindfulness
        /// </summary>
        [HttpPatch("mindfulness")]
        public async Task<IActionResult> UpdateMindfulness([FromBody] dynamic request)
        {
            try
            {
                string email = request.email ?? "unknown@serendipity.com";
                int dailyMoments = request.dailyMoments ?? 0;
                int weeklyMinutes = request.weeklyMinutes ?? 0;

                await _wellbeingService.UpdateMindfulnessAsync(email, dailyMoments, weeklyMinutes);

                var record = await _wellbeingService.GetCurrentAsync(email);
                return Ok(new { message = "Mindfulness updated", record });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating mindfulness");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/wellbeing/history/{email}
        /// Obtiene historial de bienestar
        /// </summary>
        [HttpGet("history/{email}")]
        public async Task<IActionResult> GetHistory(string email, [FromQuery] int days = 30)
        {
            try
            {
                var history = await _wellbeingService.GetHistoryAsync(email, days);
                return Ok(history);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting history for {email}", email);
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/wellbeing/team-summary
        /// Obtiene resumen de bienestar del equipo
        /// </summary>
        [HttpGet("team-summary")]
        public async Task<IActionResult> GetTeamSummary()
        {
            try
            {
                var summary = await _wellbeingService.GetTeamWellbeingSummaryAsync();
                return Ok(summary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting team summary");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/wellbeing/metrics
        /// Retorna definición de métricas de bienestar
        /// </summary>
        [HttpGet("metrics")]
        public IActionResult GetMetricsDefinition()
        {
            return Ok(new
            {
                Metrics = new
                {
                    PazInterior = new { Range = "0-100", Baseline = 50, Target = 80, Description = "Inner Peace Score" },
                    HoursPresence = new { Range = "0-24", Baseline = 6, Target = 8, UnitHours = true },
                    AutomationImpact = new { Range = "0-100%", Description = "Time saved through automation" },
                    MindfulnessGain = new { Range = "0-100%", Description = "Meditation and mindfulness improvement" }
                }
            });
        }
    }
}
