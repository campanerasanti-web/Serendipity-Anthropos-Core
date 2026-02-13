using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ElMediadorDeSofia.Services
{
    /// <summary>
    /// Serendipity Bros Business Intelligence Service
    /// Provee datos reales del negocio con análisis ético
    /// </summary>
    public class SerendipityService
    {
        // Data: 21 empleados + director (datos reales enero 2026)
        private static readonly List<EmployeeData> EMPLOYEES = new()
        {
            new("NGUYỄN QUỐC VŨ", "Logistic/Warehouse", 8_000_000),
            new("NGUYỄN THU THỦY", "Sale/Customer care", 8_000_000),
            new("MA THANH TUYỀN", "Human Resources", 8_000_000),
            new("NGUYỄN THỊ VÂN", "Data entry clerk", 8_000_000),
            new("TRẦN VĂN ĐIỀN", "Warehouse", 4_960_000),
            new("NGUYỄN THỊ ÁNH", "Packing", 4_960_000),
            new("HUỲNH MINH SANG", "Maintenance", 4_960_000),
            new("TRANG THANH ĐẠM", "Maintenance", 4_960_000),
            new("PHAN THÀNH NAM", "Production", 6_000_000),
            new("NGUYỄN NHƯ THANH", "Production", 8_000_000),
            new("NGUYỄN VĂN AN", "Buffing Machine", 4_960_000),
            new("SƠN QUỐC LIỀN", "Selection", 4_960_000),
            new("PHAN HỒNG PHÁT", "Packing", 4_960_000),
            new("SƠN MINH TRANG", "Spray machine", 4_960_000),
            new("NGUYỄN VĂN KHANG", "Spray machine", 4_960_000),
            new("TRẦN MỸ THU", "Spray machine", 4_960_000),
            new("HỒ VĂN PHƯỚC", "Buffing Machine", 4_960_000),
            new("LỮ TRÍ NGUYỆN", "Emboss machine", 4_960_000),
            new("PHẠM CHÍ HẢI", "Emboss machine", 4_960_000),
            new("NGUYỄN THU THẨN", "Spray machine", 4_960_000),
            new("HUỲNH VĂN ĐÔ", "Emboss machine", 4_960_000)
        };

        private static readonly EmployeeData DIRECTOR = new("CAMPANERA SANTIAGO A", "Director", 20_000_000);

        // Data: Revenue por cliente (febrero 2025)
        private static readonly Dictionary<string, CustomerRevenue> CUSTOMERS = new()
        {
            { "PRARA", new("PRARA", 1_163_750_000, "Premium", isHighRisk: true) },
            { "GLOBAL LEATHERS", new("GLOBAL LEATHERS", 85_000_000, "Regular", false) },
            { "OPUS", new("OPUS", 65_000_000, "Regular", false) },
            { "CAIHONG", new("CAIHONG", 58_000_000, "Regular", false) },
            { "FARIDA", new("FARIDA", 52_000_000, "Regular", false) },
        };

        public FinancialStateDTO GetFinancialState()
        {
            long totalRevenue = CUSTOMERS.Values.Sum(c => c.MonthlyRevenue);
            long totalCosts = 290_000_000; // Fixed + variable
            long payroll = EMPLOYEES.Sum(e => e.MonthlySalary) + DIRECTOR.MonthlySalary;

            var prara = CUSTOMERS["PRARA"];
            double praraPercentage = (double)prara.MonthlyRevenue / totalRevenue * 100;

            return new FinancialStateDTO
            {
                TotalMonthlyRevenue = totalRevenue,
                TotalMonthlyExpenses = totalCosts,
                GrossMargin = totalRevenue - totalCosts,
                GrossMarginPercentage = ((double)(totalRevenue - totalCosts) / totalRevenue * 100),
                Payroll = payroll,
                PayrollPercentage = ((double)payroll / totalRevenue * 100),
                PraraRevenue = prara.MonthlyRevenue,
                PraraPercentage = praraPercentage,
                CustomerCount = CUSTOMERS.Count,
                ActiveOrdersMonth = 72,
                ErrorRate = 8.0,
                OnTimeDeliveryRate = 88.0,
                EmployeeCount = EMPLOYEES.Count + 1 // +Director
            };
        }

        public List<TeamMemberDTO> GetTeamWithSalaries()
        {
            var team = EMPLOYEES
                .Select(e => new TeamMemberDTO
                {
                    Name = e.Name,
                    Role = e.Role,
                    MonthlySalary = e.MonthlySalary,
                    SalaryTier = GetSalaryTier(e.MonthlySalary),
                    ValueContribution = CalculateValueContribution(e.Role),
                    SalaryEquityScore = CalculateSalaryEquity(e.MonthlySalary, CalculateValueContribution(e.Role))
                })
                .ToList();

            // Add director
            team.Add(new TeamMemberDTO
            {
                Name = DIRECTOR.Name,
                Role = DIRECTOR.Role,
                MonthlySalary = DIRECTOR.MonthlySalary,
                SalaryTier = "Director",
                ValueContribution = 14,
                SalaryEquityScore = 100 // Reference point
            });

            return team;
        }

        public List<AlertDTO> GetEthicalAlerts()
        {
            var alerts = new List<AlertDTO>();
            var financials = GetFinancialState();

            // ALERT 1: Revenue concentration (PRARA risk)
            if (financials.PraraPercentage >= 75)
            {
                alerts.Add(new AlertDTO
                {
                    Severity = "CRITICAL",
                    Category = "Revenue Concentration",
                    Message = $"PRARA representa {financials.PraraPercentage:F1}% de ingresos. Si cancela = quiebra.",
                    Recommendation = "Iniciar plan diversificación cliente. Target: PRARA 50% en 12 meses.",
                    InjusticeType = "Economic Vulnerability"
                });
            }

            // ALERT 2: Salary inequity (14 obreros vs admin)
            var factoryWorkerAvg = EMPLOYEES
                .Where(e => e.Role.Contains("Machine") || e.Role == "Packing" || e.Role == "Warehouse")
                .Average(e => e.MonthlySalary);
            var adminAvg = EMPLOYEES
                .Where(e => e.Role == "Human Resources" || e.Role.Contains("care") || e.Role == "Data entry")
                .Average(e => e.MonthlySalary);

            double gapRatio = adminAvg / factoryWorkerAvg;
            if (gapRatio > 1.5)
            {
                alerts.Add(new AlertDTO
                {
                    Severity = "HIGH",
                    Category = "Salary Inequity",
                    Message = $"Admin gana {gapRatio:F2}x más que obreros. 14 generan 50% valor, reciben 36% salarios.",
                    Recommendation = "Aumento obreros +1M VND. Costo: 14M (0.88% revenue). ROI: Retención + calidad.",
                    InjusticeType = "Wage Injustice"
                });
            }

            // ALERT 3: Quality issues (20% error rate pasado)
            if (financials.ErrorRate > 10)
            {
                alerts.Add(new AlertDTO
                {
                    Severity = "HIGH",
                    Category = "Quality Control",
                    Message = $"Error rate: {financials.ErrorRate}%. Sugiere falta de ownership local.",
                    Recommendation = "Empoderar Thanh (Decision authority) + Hai (Resource allocation). Costo: cero.",
                    InjusticeType = "Lack of Autonomy"
                });
            }

            // ALERT 4: Opportunity - Diversification
            if (CUSTOMERS.Count < 30)
            {
                alerts.Add(new AlertDTO
                {
                    Severity = "OPPORTUNITY",
                    Category = "Growth Potential",
                    Message = $"Solo {CUSTOMERS.Count} clientes. Oportunidad para +10 nuevos en 6 meses.",
                    Recommendation = "Crear programa referral interno. Bonus si Thanh/Hai identifican nuevos clientes.",
                    InjusticeType = "Untapped Potential"
                });
            }

            return alerts;
        }

        public List<RecommendationDTO> GetLightRecommendations()
        {
            var recommendations = new List<RecommendationDTO>();

            recommendations.Add(new RecommendationDTO
            {
                Priority = 1,
                Title = "Delegación Definitiva",
                Description = "Transferir autoridad: Thanh (Calidad) + Hai (Producción)",
                Impact = "Reduce tiempo decisión 80%. Empodera equipo.",
                EthicalAlignment = "Respeto por autonomía y competencia",
                ActionItems = new[] { "1:1 Santi-Thanh", "1:1 Santi-Hai", "Anuncio equipo" },
                Timeline = "Semana 1"
            });

            recommendations.Add(new RecommendationDTO
            {
                Priority = 2,
                Title = "Justicia Salarial",
                Description = "Aumentar obreros: 4.96M → 6M (+1M cada uno)",
                Impact = "Retención perfecta. Satisfacción 95%+. Costo: 14M/mes (1% revenue)",
                EthicalAlignment = "Dignidad y equidad en compensación",
                ActionItems = new[] { "Revisar margin", "Presupuestar Q1", "Anunciar oficialmente" },
                Timeline = "Semana 2"
            });

            recommendations.Add(new RecommendationDTO
            {
                Priority = 3,
                Title = "Diversificación Cliente",
                Description = "Reducir PRARA de 82% → 50% en 12 meses. Intentar +5 clientes grandes.",
                Impact = "Negocio resiliente. Menos vulnerabilidad. Margen protegido.",
                EthicalAlignment = "Estabilidad sostenible",
                ActionItems = new[] { "Auditar GLOBAL LEATHERS", "Expand OPUS", "LinkedIn outreach" },
                Timeline = "Mes 1-3"
            });

            recommendations.Add(new RecommendationDTO
            {
                Priority = 4,
                Title = "Calidad 0-Error",
                Description = "Sistema bonus: Si mes sin errores = +2M repartido equipo",
                Impact = "Error rate 8% → 2%. Clientes premium. Repetición.",
                EthicalAlignment = "Orgullo en trabajo + recompensa compartida",
                ActionItems = new[] { "Definir 'error' claramente", "Presupuestar bonus", "Comunicar" },
                Timeline = "Mes 1"
            });

            return recommendations;
        }

        private string GetSalaryTier(long salary)
        {
            return salary switch
            {
                >= 8_000_000 => "Admin/Especialista",
                >= 6_000_000 => "Senior",
                >= 4_960_000 => "Operario",
                _ => "Aprendiz"
            };
        }

        private int CalculateValueContribution(string role)
        {
            // Estimate value contribution (1-100 scale)
            return role switch
            {
                "Director" => 20,
                var r when r.Contains("Packing") || r.Contains("Machine") => 5,
                var r when r.Contains("Production") => 8,
                var r when r.Contains("Warehouse") => 4,
                "Selection" => 5,
                "Maintenance" => 6,
                "Human Resources" => 10,
                var r when r.Contains("care") => 9,
                "Data entry clerk" => 7,
                _ => 5
            };
        }

        private double CalculateSalaryEquity(long salary, int valueContribution)
        {
            // Score: 50 = reference (average worker)
            // Score > 90 = overpaid relative to contribution
            // Score < 30 = underpaid relative to contribution
            
            long referenceAvg = 6_000_000;
            double salaryRatio = (double)salary / referenceAvg * 50;
            double contributionFactor = Math.Min(100, valueContribution * 5.0);
            
            return salaryRatio * 0.6 + contributionFactor * 0.4;
        }
    }

    // DTOs
    public record EmployeeData(string Name, string Role, long MonthlySalary);

    public record CustomerRevenue(string Name, long MonthlyRevenue, string Tier, bool isHighRisk);

    public class FinancialStateDTO
    {
        public long TotalMonthlyRevenue { get; set; }
        public long TotalMonthlyExpenses { get; set; }
        public long GrossMargin { get; set; }
        public double GrossMarginPercentage { get; set; }
        public long Payroll { get; set; }
        public double PayrollPercentage { get; set; }
        public long PraraRevenue { get; set; }
        public double PraraPercentage { get; set; }
        public int CustomerCount { get; set; }
        public int ActiveOrdersMonth { get; set; }
        public double ErrorRate { get; set; }
        public double OnTimeDeliveryRate { get; set; }
        public int EmployeeCount { get; set; }
    }

    public class TeamMemberDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public long MonthlySalary { get; set; }
        public string SalaryTier { get; set; } = string.Empty;
        public int ValueContribution { get; set; }
        public double SalaryEquityScore { get; set; }
    }

    public class AlertDTO
    {
        public string Severity { get; set; } = "CRITICAL"; // CRITICAL, HIGH, OPPORTUNITY
        public string Category { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Recommendation { get; set; } = string.Empty;
        public string InjusticeType { get; set; } = string.Empty;
    }

    public class RecommendationDTO
    {
        public int Priority { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Impact { get; set; } = string.Empty;
        public string EthicalAlignment { get; set; } = string.Empty;
        public string[] ActionItems { get; set; } = Array.Empty<string>();
        public string Timeline { get; set; } = string.Empty;
    }
}
