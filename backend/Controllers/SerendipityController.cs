using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using ElMediadorDeSofia.Services;

namespace ElMediadorDeSofia.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SerendipityController : ControllerBase
    {
        private readonly SerendipityService _serendipityService;

        public SerendipityController()
        {
            _serendipityService = new SerendipityService();
        }

        /// <summary>
        /// Obtener estado financiero de Serendipity Bros
        /// </summary>
        [HttpGet("financial")]
        public ActionResult<FinancialStateDTO> GetFinancialState()
        {
            try
            {
                var financials = _serendipityService.GetFinancialState();
                return Ok(new
                {
                    success = true,
                    data = financials,
                    timestamp = System.DateTime.UtcNow
                });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }

        /// <summary>
        /// Obtener equipo con análisis salarial
        /// </summary>
        [HttpGet("team")]
        public ActionResult<List<TeamMemberDTO>> GetTeam()
        {
            try
            {
                var team = _serendipityService.GetTeamWithSalaries();
                return Ok(new
                {
                    success = true,
                    data = team,
                    count = team.Count,
                    timestamp = System.DateTime.UtcNow
                });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }

        /// <summary>
        /// Obtener alertas éticas identificadas
        /// </summary>
        [HttpGet("alerts")]
        public ActionResult<List<AlertDTO>> GetAlerts()
        {
            try
            {
                var alerts = _serendipityService.GetEthicalAlerts();
                var critical = alerts.FindAll(a => a.Severity == "CRITICAL").Count;
                var high = alerts.FindAll(a => a.Severity == "HIGH").Count;
                
                return Ok(new
                {
                    success = true,
                    data = alerts,
                    summary = new { critical, high, total = alerts.Count },
                    timestamp = System.DateTime.UtcNow
                });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }

        /// <summary>
        /// Obtener recomendaciones de "Luz" (decisions alineadas con bien común)
        /// </summary>
        [HttpGet("recommendations")]
        public ActionResult<List<RecommendationDTO>> GetRecommendations()
        {
            try
            {
                var recommendations = _serendipityService.GetLightRecommendations();
                return Ok(new
                {
                    success = true,
                    data = recommendations,
                    count = recommendations.Count,
                    timestamp = System.DateTime.UtcNow
                });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }

        /// <summary>
        /// Obtener todo: Financial + Team + Alerts + Recommendations (respuesta completa)
        /// Formateado para sincronización con cliente móvil
        /// </summary>
        [HttpGet("dashboard")]
        public ActionResult GetDashboard()
        {
            try
            {
                var financialState = _serendipityService.GetFinancialState();
                
                return Ok(new
                {
                    success = true,
                    financial = new
                    {
                        totalIncome = financialState.TotalMonthlyRevenue,
                        totalExpenses = financialState.TotalMonthlyExpenses,
                        cashFlow = financialState.GrossMargin,
                        forecast = (long)(financialState.GrossMargin * 1.05), // 5% projection
                        payroll = financialState.Payroll,
                        margin = financialState.GrossMarginPercentage,
                        praraPercentage = financialState.PraraPercentage,
                        customerCount = financialState.CustomerCount,
                        employeeCount = financialState.EmployeeCount
                    },
                    data = new
                    {
                        team = _serendipityService.GetTeamWithSalaries(),
                        alerts = _serendipityService.GetEthicalAlerts(),
                        recommendations = _serendipityService.GetLightRecommendations()
                    },
                    timestamp = System.DateTime.UtcNow
                });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }

        /// <summary>
        /// Health check - verifica que Serendipity service esté operativo
        /// </summary>
        [HttpGet("health")]
        public ActionResult GetHealth()
        {
            return Ok(new
            {
                status = "operational",
                service = "Serendipity Business Intelligence",
                version = "1.0.0",
                timestamp = System.DateTime.UtcNow
            });
        }
    }
}
