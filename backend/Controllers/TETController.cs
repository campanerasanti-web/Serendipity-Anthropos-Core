using System;
using System.Threading.Tasks;
using ElMediadorDeSofia.Services;
using Microsoft.AspNetCore.Mvc;

namespace ElMediadorDeSofia.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TETController : ControllerBase
    {
        private readonly TETReadinessService _tetService;
        private readonly ILogger<TETController> _logger;

        public TETController(TETReadinessService tetService, ILogger<TETController> logger)
        {
            _tetService = tetService;
            _logger = logger;
        }

        /// <summary>
        /// GET /api/tet/readiness/{email}
        /// Obtiene disponibilidad TET de una persona
        /// </summary>
        [HttpGet("readiness/{email}")]
        public async Task<IActionResult> GetReadiness(string email)
        {
            try
            {
                var record = await _tetService.GetByEmailAsync(email);
                if (record == null)
                    return NotFound(new { message = $"No TET readiness record for {email}" });
                return Ok(record);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting readiness for {email}", email);
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// POST /api/tet/readiness
        /// Crea o obtiene registro de disponibilidad
        /// </summary>
        [HttpPost("readiness")]
        public async Task<IActionResult> CreateReadiness([FromBody] dynamic request)
        {
            try
            {
                string email = request.email ?? "unknown@serendipity.com";
                string name = request.name ?? "Unknown";
                string role = request.role ?? "member";

                var record = await _tetService.GetOrCreateAsync(email, name, role);
                return Ok(record);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating readiness");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// PATCH /api/tet/readiness/{email}/complete
        /// Marca un task como completado
        /// </summary>
        [HttpPatch("readiness/{email}/complete")]
        public async Task<IActionResult> CompleteTask(string email, [FromBody] dynamic request)
        {
            try
            {
                string taskName = request.task ?? "unknown";
                await _tetService.CompleteTaskAsync(email, taskName);

                var record = await _tetService.GetByEmailAsync(email);
                return Ok(new { message = "Task completed", record });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error completing task for {email}", email);
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/tet/summary
        /// Obtiene resumen de preparación del equipo
        /// </summary>
        [HttpGet("summary")]
        public async Task<IActionResult> GetTeamSummary()
        {
            try
            {
                var summary = await _tetService.GetTeamReadinessSummaryAsync();
                return Ok(summary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting team summary");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/tet/all
        /// Obtiene todos los registros de disponibilidad
        /// </summary>
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var records = await _tetService.GetAllReadyAsync();
                return Ok(records);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all readiness records");
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
