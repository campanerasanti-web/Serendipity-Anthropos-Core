using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using ElMediadorDeSofia.Data;
using ElMediadorDeSofia.Models;
using Microsoft.Extensions.Logging;

namespace ElMediadorDeSofia.Services
{
    public partial class GuidedAssistantService
    {
        private readonly AppDbContext _db;
        private readonly LotCloseService _lotCloseService;
        private readonly ILogger<GuidedAssistantService> _logger;

        public GuidedAssistantService(AppDbContext db, LotCloseService lotCloseService, ILogger<GuidedAssistantService> logger)
        {
            _db = db;
            _lotCloseService = lotCloseService;
            _logger = logger;
        }

        public async Task<AssistantResponse> GetNextStepAsync(AssistantRequest context)
        {
            var resp = new AssistantResponse();
            var lot = await _db.Lots.FindAsync(context.LotId);
            if (lot == null)
            {
                resp.NextStep = new AssistantStep { Title = "Lote no encontrado", Message = "No se encontró el lote especificado.", Actions = new List<string>() };
                resp.Warnings.Add("Lote inválido");
                return resp;
            }

            // Basic flow coordinator
            var step = (context.Step ?? "start").ToLowerInvariant();

            // Always include analysis and suggestions
            var suggestions = await SuggestCorrectionsAsync(lot);
            resp.Suggestions = suggestions;

            switch (step)
            {
                case "start":
                    resp.NextStep = new AssistantStep
                    {
                        Title = "Revisemos los datos",
                        Message = "Empecemos analizando el lote para detectar problemas comunes (sheet firmado, rechazo, productividad).",
                        Actions = new List<string> { "analyze", "validate", "calculate", "prepare" }
                    };
                    break;

                case "analyze":
                    var analysis = await AnalyzeLotAsync(lot);
                    resp.NextStep = new AssistantStep
                    {
                        Title = "Análisis del lote",
                        Message = analysis.Message,
                        Actions = new List<string> { "validate", "suggest", "calculate" }
                    };
                    if (analysis.Warnings != null) resp.Warnings.AddRange(analysis.Warnings);
                    break;

                case "validate":
                    // return validation step
                    var valSuggestions = suggestions.Where(s => !string.IsNullOrEmpty(s.Issue)).ToList();
                    resp.NextStep = new AssistantStep
                    {
                        Title = "Validaciones",
                        Message = "Revisa las sugerencias y corrige los campos indicados antes de cerrar.",
                        Actions = new List<string> { "suggest", "calculate", "prepare" }
                    };
                    resp.Suggestions = valSuggestions;
                    break;

                case "calculate":
                    var metrics = await CalculateMetricsAsync(lot);
                    resp.NextStep = new AssistantStep
                    {
                        Title = "Cálculo de productividad",
                        Message = $"Productividad estimada: {metrics.Productivity:F2} | Sf facturables: {metrics.SfFacturables:F2}",
                        Actions = new List<string> { "suggest", "prepare" }
                    };
                    break;

                case "suggest":
                    resp.NextStep = new AssistantStep
                    {
                        Title = "Sugerencias",
                        Message = "Estas son las recomendaciones detectadas para mejorar la calidad del lote.",
                        Actions = new List<string> { "prepare", "calculate" }
                    };
                    break;

                case "prepare":
                case "close":
                    resp.NextStep = new AssistantStep
                    {
                        Title = "Preparar paquete final",
                        Message = "El asistente preparará factura y packing list. Confirma cerrar el lote para generar el paquete.",
                        Actions = new List<string> { "confirm_close", "cancel" }
                    };
                    break;

                case "confirm_close":
                    try
                    {
                        var finalPackage = await PrepareFinalPackageAsync(lot);
                        resp.FinalPackage = finalPackage;
                        resp.NextStep = new AssistantStep
                        {
                            Title = "Paquete final listo",
                            Message = "Factura y packing list generados. Revisa antes de enviar.",
                            Actions = new List<string> { "send", "download" }
                        };
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error preparando paquete final");
                        resp.NextStep = new AssistantStep { Title = "Error", Message = "No se pudo preparar el paquete final." };
                        resp.Warnings.Add(ex.Message);
                    }
                    break;

                default:
                    resp.NextStep = new AssistantStep { Title = "Continuar", Message = "Seleccione la siguiente acción.", Actions = new List<string> { "analyze", "validate", "calculate", "prepare" } };
                    break;
            }

            return resp;
        }

        public async Task<(string Message, List<string>? Warnings)> AnalyzeLotAsync(object lotObj)
        {
            // Accept either EF entity dynamic or typed Lot
            try
            {
                dynamic lot = lotObj;
                bool sheetSigned = false;
                decimal rejection = 0m;

                try { sheetSigned = (bool)lot.SheetSigned; } catch { }
                try { rejection = Convert.ToDecimal(lot.RejectionRate); } catch { }

                var warnings = new List<string>();
                if (!sheetSigned) warnings.Add("Hoja de trabajo no firmada.");
                if (rejection > 0.20m) warnings.Add("Tasa de rechazo mayor al 20% — imposible cerrar sin revisión.");
                else if (rejection > 0.10m) warnings.Add("Tasa de rechazo alta (>10%) — revisar calidad.");

                var message = "Análisis completado.";
                if (warnings.Count > 0) message = string.Join(" ", warnings);

                return (message, warnings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AnalyzeLotAsync error");
                return ("No se pudo analizar el lote.", new List<string> { ex.Message });
            }
        }

        public async Task<List<AssistantSuggestion>> SuggestCorrectionsAsync(object lotObj)
        {
            var suggestions = new List<AssistantSuggestion>();
            try
            {
                dynamic lot = lotObj;
                bool sheetSigned = false;
                decimal rejection = 0m;

                try { sheetSigned = (bool)lot.SheetSigned; } catch { }
                try { rejection = Convert.ToDecimal(lot.RejectionRate); } catch { }

                if (!sheetSigned)
                {
                    suggestions.Add(new AssistantSuggestion
                    {
                        Field = "SheetSigned",
                        Issue = "Hoja de trabajo no firmada",
                        Recommendation = "Solicita la firma del encargado antes de cerrar el lote."
                    });
                }

                if (rejection > 0.10m)
                {
                    suggestions.Add(new AssistantSuggestion
                    {
                        Field = "RejectionRate",
                        Issue = $"Tasa de rechazo {rejection:P1}",
                        Recommendation = "Revisar causas de rechazo y corregir procesos o rechazar el lote."
                    });
                }

                return suggestions;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SuggestCorrectionsAsync error");
                return suggestions;
            }
        }

        public async Task<(decimal SfFacturables, decimal Productivity)> CalculateMetricsAsyncDynamic(object lotObj)
        {
            try
            {
                dynamic lot = lotObj;
                decimal mh = 0m;
                decimal ot = 0m;
                decimal rejection = 0m;
                decimal sf = 0m;
                try { mh = Convert.ToDecimal(lot.MH); } catch { }
                try { ot = Convert.ToDecimal(lot.OT); } catch { }
                try { rejection = Convert.ToDecimal(lot.RejectionRate); } catch { }
                try { sf = Convert.ToDecimal(lot.SfTotal); } catch { }

                var sfFacturables = sf * (1 - rejection);
                var productivity = mh + ot > 0 ? sfFacturables / (mh + ot) : 0m;

                return (sfFacturables, productivity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CalculateMetricsAsyncDynamic error");
                return (0m, 0m);
            }
        }

        public async Task<(decimal SfFacturables, decimal Productivity)> CalculateMetricsAsync(dynamic lot)
        {
            return await CalculateMetricsAsyncDynamic(lot);
        }

        public async Task<object> PrepareFinalPackageAsync(object lotObj)
        {
            try
            {
                dynamic lot = lotObj;
                Guid id;
                try { id = (Guid)lot.Id; } catch { id = Guid.Empty; }
                if (id == Guid.Empty) throw new Exception("Lote inválido");

                // Use existing LotCloseService to prepare invoice + packing list in a single flow
                var final = await _lotCloseService.CloseLotAsync(id, "assistant");
                if (final == null)
                {
                    return new { message = "No se generó paquete." };
                }

                return final;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "PrepareFinalPackageAsync error");
                throw;
            }
        }
    }
}
