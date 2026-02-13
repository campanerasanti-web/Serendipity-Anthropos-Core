using Microsoft.AspNetCore.Mvc;
using ElMediadorDeSofia.Services;

namespace ElMediadorDeSofia.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(ILogger<DashboardController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// GET /api/dashboard/daily
        /// Obtiene métricas diarias del dashboard (ingresos, gastos, saldo neto)
        /// </summary>
        [HttpGet("daily")]
        public async Task<IActionResult> GetDailyDashboard()
        {
            try
            {
                // Por ahora retornamos datos estáticos/agregados
                // En producción, esto consultaría la BD para el día actual
                var today = DateOnly.FromDateTime(DateTime.Today);
                
                var response = new
                {
                    date = today,
                    totalIncomes = 4750.49m,
                    totalFixedCosts = 15600m,
                    netFlow = 4750.49m - 15600m,
                    invoiceCount = 3,
                    narrative = "Día de consolidación de la abundancia"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetDailyDashboard");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/dashboard/projection?month=2&year=2026
        /// Obtiene proyección mensual de flujo de caja
        /// </summary>
        [HttpGet("projection")]
        public async Task<IActionResult> GetMonthlyProjection([FromQuery] int month, [FromQuery] int year)
        {
            try
            {
                // Proyección simplificada
                var daysInMonth = DateTime.DaysInMonth(year, month);
                var avgDailyIncome = 4750.49m / 15m; // últimos 15 días promedio
                var projectedMonthlyIncome = avgDailyIncome * daysInMonth;
                var projectedNetCashflow = projectedMonthlyIncome - 15600m;

                var response = new
                {
                    month,
                    year,
                    projectedIncome = Math.Round(projectedMonthlyIncome, 2),
                    projectedFixedCosts = 15600m,
                    projectedNetCashflow = Math.Round(projectedNetCashflow, 2),
                    confidence = 0.72m,
                    narrative = projectedNetCashflow > 0 
                        ? "Proyección positiva: se espera superávit en este mes"
                        : "Proyección deficitaria: se requiere atención"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetMonthlyProjection");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/dashboard/trends
        /// Obtiene tendencias de los últimos 30 días
        /// </summary>
        [HttpGet("trends")]
        public async Task<IActionResult> GetTrends()
        {
            try
            {
                var trends = new
                {
                    period = "30 days",
                    averageDailyIncome = 4750.49m / 15m,
                    trend = "stable",
                    volatility = 0.12m,
                    bestDay = 850.00m,
                    worstDay = 120.50m
                };

                return Ok(trends);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetTrends");
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
