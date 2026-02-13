using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ElMediadorDeSofia.Data;
using ElMediadorDeSofia.Models;
using Microsoft.EntityFrameworkCore;

namespace ElMediadorDeSofia.Services
{
    public class PersonalWellbeingService
    {
        private readonly AppDbContext _context;

        public PersonalWellbeingService(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Crea toma de referencia de bienestar
        /// </summary>
        public async Task<PersonalWellbeingRecord> CreateBaselineAsync(string email, string personName)
        {
            var record = new PersonalWellbeingRecord
            {
                Email = email,
                PersonName = personName,
                CreatedBy = email,
                Status = "baseline",
                PeriodStartDate = DateTime.UtcNow,
                PeriodEndDate = DateTime.UtcNow.AddDays(1)
            };

            _context.PersonalWellbeing.Add(record);
            await _context.SaveChangesAsync();
            return record;
        }

        /// <summary>
        /// Obtiene el registro actual de bienestar
        /// </summary>
        public async Task<PersonalWellbeingRecord?> GetCurrentAsync(string email)
        {
            return await _context.PersonalWellbeing
                .Where(w => w.Email == email && w.IsActive)
                .OrderByDescending(w => w.PeriodStartDate)
                .FirstOrDefaultAsync();
        }

        /// <summary>
        /// Actualiza métricas de paz interior
        /// </summary>
        public async Task UpdatePazInteriorAsync(string email, int score, string description)
        {
            var record = await GetCurrentAsync(email) ?? await CreateBaselineAsync(email, "Unknown");

            record.PazInteriorScore = Math.Max(0, Math.Min(100, score));
            record.PazInteriorDescription = description;
            record.UpdatedAt = DateTime.UtcNow;
            record.CreatedBy = email;

            _context.PersonalWellbeing.Update(record);
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Registra horas de presencia
        /// </summary>
        public async Task UpdatePresenceAsync(string email, decimal hoursToday, decimal targetHours = 8)
        {
            var record = await GetCurrentAsync(email) ?? await CreateBaselineAsync(email, "Unknown");

            record.HoursPresenceDaily = hoursToday;
            record.HoursPresenceTarget = targetHours;
            
            // Calcula consistencia: % de horas completadas vs target
            record.PresenceConsistency = (int)((hoursToday / targetHours) * 100);
            record.PresenceConsistency = Math.Min(record.PresenceConsistency, 100);

            record.UpdatedAt = DateTime.UtcNow;
            record.CreatedBy = email;

            _context.PersonalWellbeing.Update(record);
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Registra impacto de automatización
        /// </summary>
        public async Task UpdateAutomationImpactAsync(string email, int tasksAutomated, decimal hoursRecovered)
        {
            var record = await GetCurrentAsync(email) ?? await CreateBaselineAsync(email, "Unknown");

            record.TasksAutomatedCount = tasksAutomated;
            record.TimeRecoveredHours = hoursRecovered;
            
            // Calcula % de impacto (máximo 100%)
            record.AutomationImpact = Math.Min(hoursRecovered * 2, 100);

            record.UpdatedAt = DateTime.UtcNow;
            record.CreatedBy = email;

            _context.PersonalWellbeing.Update(record);
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Registra actividades de mindfulness
        /// </summary>
        public async Task UpdateMindfulnessAsync(string email, int dailyMoments, int weeklyMinutes)
        {
            var record = await GetCurrentAsync(email) ?? await CreateBaselineAsync(email, "Unknown");

            record.DailyMindfulnessMoments = dailyMoments;
            record.WeeklyMeditationMinutes = weeklyMinutes;
            
            // Calcula ganancia de mindfulness
            var baselineMinutes = (record.BaselineRestHours * 60) / 7;
            record.MindfulnessGain = (int)((weeklyMinutes / (baselineMinutes + 1)) * 100);
            record.MindfulnessGain = Math.Min(record.MindfulnessGain, 100);

            record.Status = record.MindfulnessGain > 50 ? "accelerating" : "improving";
            record.UpdatedAt = DateTime.UtcNow;
            record.CreatedBy = email;

            _context.PersonalWellbeing.Update(record);
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Calcula proyección de crecimiento
        /// </summary>
        public decimal CalculateProjectedGrowth(PersonalWellbeingRecord record)
        {
            var components = new List<decimal>
            {
                record.PazInteriorScore / 100.0m,
                record.PresenceConsistency / 100.0m,
                record.AutomationImpact / 100.0m,
                record.MindfulnessGain / 100.0m
            };

            var avgImprovement = components.Average();
            // Proyecta 6 meses (26 semanas) con tasa de mejora compuesta
            var months6Growth = (decimal)Math.Pow((double)(1 + avgImprovement * 0.1m), 26) - 1;
            return Math.Round(months6Growth * 100, 2);
        }

        /// <summary>
        /// Obtiene resumen del equipo
        /// </summary>
        public async Task<object> GetTeamWellbeingSummaryAsync()
        {
            var records = await _context.PersonalWellbeing
                .Where(w => w.IsActive)
                .GroupBy(w => w.Email)
                .Select(g => g.OrderByDescending(w => w.PeriodStartDate).First())
                .ToListAsync();

            if (!records.Any())
                return new { TotalMembers = 0, AveragePazScore = 0, PresenceAverage = 0 };

            var avgPaz = records.Average(r => r.PazInteriorScore);
            var avgPresence = records.Average(r => r.PresenceConsistency);
            var avgMindfulness = records.Average(r => r.MindfulnessGain);
            var totalTimeRecovered = records.Sum(r => r.TimeRecoveredHours);

            return new
            {
                TotalMembers = records.Count,
                AveragePazScore = Math.Round(avgPaz, 2),
                AveragePresence = Math.Round(avgPresence, 2),
                AverageMindfulness = Math.Round(avgMindfulness, 2),
                TotalHoursRecovered = Math.Round(totalTimeRecovered, 2),
                StatusSummary = new
                {
                    Accelerating = records.Count(r => r.Status == "accelerating"),
                    Improving = records.Count(r => r.Status == "improving"),
                    Stable = records.Count(r => r.Status == "stable")
                }
            };
        }

        /// <summary>
        /// Obtiene historial de una persona
        /// </summary>
        public async Task<List<PersonalWellbeingRecord>> GetHistoryAsync(string email, int lastDays = 30)
        {
            var since = DateTime.UtcNow.AddDays(-lastDays);
            return await _context.PersonalWellbeing
                .Where(w => w.Email == email && w.PeriodStartDate >= since)
                .OrderByDescending(w => w.PeriodStartDate)
                .ToListAsync();
        }
    }
}
