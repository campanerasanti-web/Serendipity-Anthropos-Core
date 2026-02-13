using System;
using System.Threading.Tasks;
using ElMediadorDeSofia.Services;
using Microsoft.AspNetCore.Mvc;

namespace ElMediadorDeSofia.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChineseMedicineController : ControllerBase
    {
        private readonly ChineseMedicineService _tcmService;
        private readonly ILogger<ChineseMedicineController> _logger;

        public ChineseMedicineController(ChineseMedicineService tcmService, ILogger<ChineseMedicineController> logger)
        {
            _tcmService = tcmService;
            _logger = logger;
        }

        /// <summary>
        /// POST /api/chinese-medicine/snapshot
        /// Crea un nuevo snapshot TCM
        /// </summary>
        [HttpPost("snapshot")]
        public async Task<IActionResult> CreateSnapshot([FromBody] dynamic request)
        {
            try
            {
                string email = request.email ?? "unknown@serendipity.com";
                string personName = request.personName ?? "Unknown";
                int qiScore = request.qiScore ?? 50;
                int[] elementScores = request.elementScores ?? new int[] { 50, 50, 50, 50, 50 };

                var snapshot = await _tcmService.CreateOrUpdateSnapshotAsync(email, personName, qiScore, elementScores);
                return Ok(snapshot);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating TCM snapshot");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/chinese-medicine/snapshot/{email}
        /// Obtiene el snapshot más reciente de una persona
        /// </summary>
        [HttpGet("snapshot/{email}")]
        public async Task<IActionResult> GetLatestSnapshot(string email)
        {
            try
            {
                var snapshot = await _tcmService.GetLatestSnapshotAsync(email);
                if (snapshot == null)
                    return NotFound(new { message = $"No TCM snapshot for {email}" });

                var recommendation = _tcmService.GetTreatmentRecommendation(snapshot);
                return Ok(new { snapshot, recommendation });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting snapshot for {email}", email);
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/chinese-medicine/history/{email}
        /// Obtiene historial de snapshots
        /// </summary>
        [HttpGet("history/{email}")]
        public async Task<IActionResult> GetHistory(string email, [FromQuery] int days = 30)
        {
            try
            {
                var history = await _tcmService.GetSnapshotHistoryAsync(email, days);
                return Ok(history);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting snapshot history for {email}", email);
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/chinese-medicine/team-summary
        /// Obtiene resumen TCM del equipo
        /// </summary>
        [HttpGet("team-summary")]
        public async Task<IActionResult> GetTeamSummary()
        {
            try
            {
                var summary = await _tcmService.GetTeamTCMSummaryAsync();
                return Ok(summary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting team TCM summary");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/chinese-medicine/elements
        /// Retorna referencia de los 5 elementos
        /// </summary>
        [HttpGet("elements")]
        public IActionResult GetElements()
        {
            return Ok(new
            {
                Elements = new[]
                {
                    new { Name = "Fire", Organ = "Heart", Emotion = "Joy", Color = "Red", Taste = "Bitter", Season = "Summer" },
                    new { Name = "Earth", Organ = "Spleen/Stomach", Emotion = "Pensiveness", Color = "Yellow", Taste = "Sweet", Season = "Late Summer" },
                    new { Name = "Metal", Organ = "Lung/Large Intestine", Emotion = "Grief", Color = "White", Taste = "Pungent", Season = "Fall" },
                    new { Name = "Water", Organ = "Kidney/Bladder", Emotion = "Fear", Color = "Blue/Black", Taste = "Salty", Season = "Winter" },
                    new { Name = "Wood", Organ = "Liver/Gallbladder", Emotion = "Anger", Color = "Green", Taste = "Sour", Season = "Spring" }
                }
            });
        }

        /// <summary>
        /// POST /api/chinese-medicine/recommendation
        /// Obtiene recomendación personalizada
        /// </summary>
        [HttpPost("recommendation")]
        public IActionResult GetRecommendation([FromBody] dynamic request)
        {
            try
            {
                int qiScore = request.qiScore ?? 50;
                int[] elementScores = request.elementScores ?? new int[] { 50, 50, 50, 50, 50 };

                // Crear snapshot temporal para obtener recomendación
                var tempSnapshot = new global::ElMediadorDeSofia.Models.ChineseMedicineSnapshot
                {
                    QiScore = qiScore,
                    FireElement = elementScores.Length > 0 ? elementScores[0] : 50,
                    EarthElement = elementScores.Length > 1 ? elementScores[1] : 50,
                    MetalElement = elementScores.Length > 2 ? elementScores[2] : 50,
                    WaterElement = elementScores.Length > 3 ? elementScores[3] : 50,
                    WoodElement = elementScores.Length > 4 ? elementScores[4] : 50
                };

                var recommendation = _tcmService.GetTreatmentRecommendation(tempSnapshot);
                return Ok(new { recommendation });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting recommendation");
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
