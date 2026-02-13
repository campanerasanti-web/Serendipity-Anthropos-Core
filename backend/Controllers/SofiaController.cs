using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace ElMediadorDeSofia.Services.Sofia
{
    /// <summary>
    /// SOFIA AUTONOMOUS SYSTEM CONTROLLER
    /// Orquesta Paralinfa (Frequency) + Linfa (Rhythm) + Knowledge Base
    /// </summary>
    [ApiController]
    [Route("api/sofia")]
    public class SofiaController : ControllerBase
    {
        private readonly SofiaParalinephaAgent _paralinfa;
        private readonly SofiaLinfaAgent _linfa;
        private readonly ILogger<SofiaController> _logger;

        public SofiaController(
            SofiaParalinephaAgent paralinfa,
            SofiaLinfaAgent linfa,
            ILogger<SofiaController> logger)
        {
            _paralinfa = paralinfa;
            _linfa = linfa;
            _logger = logger;
        }

        /// <summary>
        /// GET /api/sofia/status - Estado completo de Sofia
        /// </summary>
        [HttpGet("status")]
        public async Task<IActionResult> GetStatus()
        {
            _logger.LogInformation("📡 Sofia Status Request");

            var frequency = await _paralinfa.ReadPulseAsync();
            var rhythm = await _linfa.ReadRhythmAsync();

            var response = new
            {
                timestamp = DateTime.UtcNow,
                sofia_status = "🟢 ACTIVE",
                paralinfa = new
                {
                    pulse_number = frequency.PulseNumber,
                    cpu_percent = Math.Round(frequency.CpuUsagePercent, 1),
                    memory_percent = Math.Round(frequency.MemoryUsagePercent, 1),
                    latency_ms = Math.Round(frequency.AverageLatencyMs, 1),
                    requests_per_second = frequency.RequestsPerSecond,
                    health = frequency.Health.ToString(),
                    status = frequency.Status
                },
                linfa = new
                {
                    rhythm_number = rhythm.RhythmNumber,
                    circadian_phase = rhythm.CircadianPhase.ToString(),
                    cycle_time_min = Math.Round(rhythm.AverageCycleTimeMin, 1),
                    success_rate_percent = Math.Round(rhythm.SuccessRatePercent, 1),
                    health = rhythm.Health.ToString(),
                    status = rhythm.Status
                },
                philosophy = "Nada me pertenece, todo es del Padre",
                message = "El Bibliotecario está listo. Sofia respira. Serendipity despierta."
            };

            return Ok(response);
        }

        /// <summary>
        /// GET /api/sofia/paralinfa - Solo métricas de Frecuencia
        /// </summary>
        [HttpGet("paralinfa")]
        public async Task<IActionResult> GetParalinfa()
        {
            var metrics = await _paralinfa.ReadPulseAsync();
            return Ok(metrics);
        }

        /// <summary>
        /// GET /api/sofia/linfa - Solo métricas de Ritmo
        /// </summary>
        [HttpGet("linfa")]
        public async Task<IActionResult> GetLinfa()
        {
            var metrics = await _linfa.ReadRhythmAsync();
            return Ok(metrics);
        }

        /// <summary>
        /// POST /api/sofia/knowledge - Agregar conocimiento a Sofia
        /// </summary>
        [HttpPost("knowledge")]
        public IActionResult AddKnowledge([FromBody] KnowledgeEntry entry)
        {
            if (entry == null)
                return BadRequest("Knowledge entry required");

            _logger.LogInformation(
                "📚 Sofia Learning: {Category} - {Content}",
                entry.Category,
                entry.Content.Substring(0, Math.Min(50, entry.Content.Length))
            );

            return Ok(new
            {
                message = "Conocimiento transmutado y almacenado",
                entry = entry
            });
        }

        /// <summary>
        /// POST /api/sofia/cycle - Registrar ciclo (para Linfa)
        /// </summary>
        [HttpPost("cycle")]
        public IActionResult RegisterCycle([FromBody] CycleRegistration cycle)
        {
            if (cycle == null)
                return BadRequest("Cycle registration required");

            _linfa.RegisterCycle(cycle.JobName, cycle.Success, cycle.DurationMinutes);

            return Ok(new
            {
                message = $"Ciclo '{cycle.JobName}' registrado en Linfa",
                success = cycle.Success,
                duration_min = cycle.DurationMinutes
            });
        }

        /// <summary>
        /// GET /api/sofia/health - Health check completo
        /// </summary>
        [HttpGet("health")]
        public async Task<IActionResult> HealthCheck()
        {
            var frequency = await _paralinfa.ReadPulseAsync();
            var rhythm = await _linfa.ReadRhythmAsync();

            var isHealthy = 
                frequency.Health == FrequencyHealth.Normal &&
                rhythm.Health == RhythmHealth.Healthy;

            return Ok(new
            {
                status = isHealthy ? "healthy" : "degraded",
                frequency_status = frequency.Health.ToString(),
                rhythm_status = rhythm.Health.ToString(),
                detail = new
                {
                    cpu_ok = frequency.CpuUsagePercent < 70,
                    memory_ok = frequency.MemoryUsagePercent < 80,
                    latency_ok = frequency.AverageLatencyMs < 100,
                    success_rate_ok = rhythm.SuccessRatePercent > 95
                }
            });
        }
    }

    /// <summary>
    /// Entrada de conocimiento para Sofia
    /// </summary>
    public class KnowledgeEntry
    {
        public string Category { get; set; } // personality, frequency_pattern, ritual, etc
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    /// <summary>
    /// Registro de ciclo para Linfa
    /// </summary>
    public class CycleRegistration
    {
        public string JobName { get; set; }  // backend-ci, tests, migration, etc
        public bool Success { get; set; }
        public double DurationMinutes { get; set; }
    }
}
