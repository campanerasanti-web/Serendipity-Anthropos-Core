using Microsoft.AspNetCore.Mvc;
using ElMediadorDeSofia.Services;
using System;
using System.IO;
using System.Threading.Tasks;

namespace ElMediadorDeSofia.Controllers;

/// <summary>
/// Controlador para el Dashboard Inteligente Unificado
/// - Ingreso manual de datos financieros
/// - Checkup total del Anthropos
/// </summary>
[ApiController]
[Route("api")]
public class IntelligentDashboardController : ControllerBase
{
    private readonly ILogger<IntelligentDashboardController> _logger;
    private readonly GuidedAssistantService _assistantService;
    private readonly EventService _eventService;

    public IntelligentDashboardController(
        ILogger<IntelligentDashboardController> logger,
        GuidedAssistantService assistantService,
        EventService eventService)
    {
        _logger = logger;
        _assistantService = assistantService;
        _eventService = eventService;
    }

    /// <summary>
    /// POST /api/manual-input
    /// Recibe datos manuales de ingresos, costos y adjuntos.
    /// Guarda como EventRecord o actualiza dashboardData según corresponda.
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPost("manual-input")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(500)]
    public async Task<IActionResult> SubmitManualInput(CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("📥 Recibiendo ingreso manual de datos...");

            // Extraer datos del FormData
            var manualIncomeStr = Request.Form["manual_income"].ToString();
            var manualFixedCostsStr = Request.Form["manual_fixed_costs"].ToString();
            var attachment = Request.Form.Files.FirstOrDefault();
            var recordingDateStr = Request.Form["recording_date"].ToString();

            // Validar y convertir
            decimal manualIncome = 0;
            decimal manualFixedCosts = 0;

            if (!string.IsNullOrEmpty(manualIncomeStr) && decimal.TryParse(manualIncomeStr, out var income))
            {
                manualIncome = income;
            }

            if (!string.IsNullOrEmpty(manualFixedCostsStr) && decimal.TryParse(manualFixedCostsStr, out var costs))
            {
                manualFixedCosts = costs;
            }

            var recordingDate = DateTime.TryParse(recordingDateStr, out var date) ? date : DateTime.Now;

            // Procesar archivo si existe
            string attachmentPath = null;
            if (attachment != null && attachment.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
                Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = $"manual_{DateTime.Now:yyyyMMdd_HHmmss}_{attachment.FileName}";
                attachmentPath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(attachmentPath, FileMode.Create))
                {
                    await attachment.CopyToAsync(stream, cancellationToken);
                }

                _logger.LogInformation($"📎 Archivo adjunto guardado: {uniqueFileName}");
            }

            // Crear evento de ingreso manual
            var eventPayload = new Dictionary<string, object>
            {
                { "manual_income", manualIncome },
                { "manual_fixed_costs", manualFixedCosts },
                { "attachment_path", attachmentPath },
                { "input_source", "unified_dashboard" },
            };

            var eventRecord = await _eventService.RecordEventAsync(
                aggregateType: "UnifiedDashboard",
                aggregateId: Guid.NewGuid(),
                eventType: "MANUAL_INPUT",
                payload: System.Text.Json.JsonSerializer.Serialize(eventPayload),
                createdBy: User?.Identity?.Name ?? "system",
                cancellationToken: cancellationToken
            );

            _logger.LogInformation($"✅ Datos manuales registrados: Ingresos=${manualIncome}, Costos=${manualFixedCosts}");

            return Ok(new
            {
                success = true,
                message = "Datos manuales registrados exitosamente",
                data = new
                {
                    manualIncome = manualIncome,
                    manualFixedCosts = manualFixedCosts,
                    attachmentPath = attachmentPath,
                    timestamp = recordingDate,
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"❌ Error en ingreso manual: {ex.Message}");
            return StatusCode(500, new
            {
                success = false,
                message = "Error al procesar datos manuales",
                error = ex.Message,
            });
        }
    }

    /// <summary>
    /// POST /api/anthropos/run
    /// Ejecuta el checkup total:
    /// - OpsGardener (optimización operativa)
    /// - SecurityGardener (análisis de riesgos)
    /// - AnthroposCore (Súper Agente)
    /// - Self Gardener (coherencia emocional)
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPost("anthropos/run")]
    [ProducesResponseType(200)]
    [ProducesResponseType(500)]
    public async Task<IActionResult> RunFullCheckup(CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("🤖 Iniciando Checkup Total (Súper Agente)...");

            var checkupResults = new Dictionary<string, object>();

            // 1. OpsGardener - Optimización operativa
            _logger.LogInformation("🌱 [1/4] OpsGardener analizando operaciones...");
            try
            {
                var opsResult = await _assistantService.RunOperationalOptimizationAsync(cancellationToken);
                checkupResults["opsGardener"] = new { status = "completed", result = opsResult };
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"⚠️ OpsGardener warning: {ex.Message}");
                checkupResults["opsGardener"] = new { status = "warning", error = ex.Message };
            }

            // 2. SecurityGardener - Análisis de riesgos
            _logger.LogInformation("🛡️ [2/4] SecurityGardener evaluando riesgos...");
            try
            {
                var secResult = await _assistantService.RunSecurityAnalysisAsync(cancellationToken);
                checkupResults["securityGardener"] = new { status = "completed", result = secResult };
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"⚠️ SecurityGardener warning: {ex.Message}");
                checkupResults["securityGardener"] = new { status = "warning", error = ex.Message };
            }

            // 3. AnthroposCore - Súper Agente (inteligencia unificada)
            _logger.LogInformation("🧠 [3/4] AnthroposCore ejecutando análisis inteligente...");
            try
            {
                var anthroposResult = await _assistantService.RunAnthroposCoreAnalysisAsync(cancellationToken);
                checkupResults["anthroposCore"] = new { status = "completed", result = anthroposResult };
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"⚠️ AnthroposCore warning: {ex.Message}");
                checkupResults["anthroposCore"] = new { status = "warning", error = ex.Message };
            }

            // 4. Self Gardener - Coherencia emocional
            _logger.LogInformation("❤️ [4/4] Self Gardener sincronizando coherencia...");
            try
            {
                var selfResult = await _assistantService.RunSelfGardenerSyncAsync(cancellationToken);
                checkupResults["selfGardener"] = new { status = "completed", result = selfResult };
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"⚠️ Self Gardener warning: {ex.Message}");
                checkupResults["selfGardener"] = new { status = "warning", error = ex.Message };
            }

            // Crear evento de checkup completado
            var checkupPayload = System.Text.Json.JsonSerializer.Serialize(checkupResults);
            var checkupEvent = await _eventService.RecordEventAsync(
                aggregateType: "Anthropos",
                aggregateId: Guid.NewGuid(),
                eventType: "ANTHROPOS_CHECKUP",
                payload: checkupPayload,
                createdBy: "anthropos-system",
                cancellationToken: cancellationToken
            );

            _logger.LogInformation("✅ Checkup Total completado. Súper Agente en control.");

            return Ok(new
            {
                success = true,
                message = "Checkup total completado exitosamente",
                status = "completed",
                agentsRun = new
                {
                    opsGardener = true,
                    securityGardener = true,
                    anthroposCore = true,
                    selfGardener = true,
                },
                results = checkupResults,
                timestamp = DateTime.Now,
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"❌ Error en checkup total: {ex.Message}\n{ex.StackTrace}");
            return StatusCode(500, new
            {
                success = false,
                message = "Error al ejecutar checkup total",
                status = "error",
                error = ex.Message,
                timestamp = DateTime.Now,
            });
        }
    }

    /// <summary>
    /// GET /api/anthropos/last-report
    /// Retorna el último reporte generado por el Súper Agente (AnthroposCore)
    /// </summary>
    [HttpGet("anthropos/last-report")]
    [ProducesResponseType(200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetLastAnthroposReport(CancellationToken cancellationToken)
    {
        try
        {
            var lastReport = await _eventService.GetLastEventByTypeAsync("ANTHROPOS_CHECKUP", cancellationToken);

            if (lastReport == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "No hay reportes del Anthropos disponibles",
                });
            }

            return Ok(new
            {
                success = true,
                data = lastReport,
                timestamp = lastReport.Timestamp,
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"❌ Error obteniendo último reporte: {ex.Message}");
            return StatusCode(500, new
            {
                success = false,
                message = "Error al obtener último reporte",
                error = ex.Message,
            });
        }
    }
}
