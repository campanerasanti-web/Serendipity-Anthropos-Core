using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ElMediadorDeSofia.Data;
using ElMediadorDeSofia.Models;
using Microsoft.EntityFrameworkCore;

namespace ElMediadorDeSofia.Services
{
    public class TETReadinessService
    {
        private readonly AppDbContext _context;

        public TETReadinessService(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Obtiene o crea un registro de disponibilidad TET para una persona
        /// </summary>
        public async Task<TETReadinessRecord> GetOrCreateAsync(string email, string name, string role)
        {
            var existing = await _context.TETReadiness
                .FirstOrDefaultAsync(r => r.Email == email && !r.IsDeleted);

            if (existing != null)
                return existing;

            var record = new TETReadinessRecord
            {
                Email = email,
                Name = name,
                Role = role,
                ReadinessScore = 0,
                ProtocolStatus = "pending",
                CreatedBy = email
            };

            _context.TETReadiness.Add(record);
            await _context.SaveChangesAsync();
            return record;
        }

        /// <summary>
        /// Obtiene el registro de disponibilidad por email
        /// </summary>
        public async Task<TETReadinessRecord?> GetByEmailAsync(string email)
        {
            return await _context.TETReadiness
                .FirstOrDefaultAsync(r => r.Email == email && !r.IsDeleted);
        }

        /// <summary>
        /// Obtiene todos los registros de disponibilidad TET
        /// </summary>
        public async Task<List<TETReadinessRecord>> GetAllReadyAsync()
        {
            return await _context.TETReadiness
                .Where(r => !r.IsDeleted)
                .OrderByDescending(r => r.ReadinessScore)
                .ToListAsync();
        }

        /// <summary>
        /// Actualiza el score de disponibilidad basado en checklist completion
        /// </summary>
        public async Task<int> CalculateReadinessScoreAsync(TETReadinessRecord record)
        {
            int score = 0;

            // Cada item completado suma puntos
            if (record.CsvLoaded) score += 15;
            if (record.QrGenerated) score += 15;
            if (record.VietnamAssignmentComplete) score += 20;
            if (record.SystemTestsPassed) score += 20;
            if (record.PersonalPanelConfigured) score += 15;
            if (record.LanguagePreferenceSet) score += 15;

            record.ReadinessScore = Math.Min(score, 100);

            // Actualiza el estado según el score
            record.ProtocolStatus = score >= 100 ? "completed" 
                : score >= 70 ? "ready" 
                : score >= 40 ? "in-progress"
                : "pending";

            record.UpdatedAt = DateTime.UtcNow;
            record.UpdatedBy = record.Email;

            _context.TETReadiness.Update(record);
            await _context.SaveChangesAsync();

            return record.ReadinessScore;
        }

        /// <summary>
        /// Marca un ítem como completado
        /// </summary>
        public async Task CompleteTaskAsync(string email, string taskName)
        {
            var record = await GetByEmailAsync(email);
            if (record == null)
                throw new InvalidOperationException($"No readiness record found for {email}");

            switch (taskName.ToLower())
            {
                case "csv":
                    record.CsvLoaded = true;
                    break;
                case "qr":
                    record.QrGenerated = true;
                    break;
                case "vietnam":
                    record.VietnamAssignmentComplete = true;
                    break;
                case "tests":
                    record.SystemTestsPassed = true;
                    break;
                case "panel":
                    record.PersonalPanelConfigured = true;
                    break;
                case "language":
                    record.LanguagePreferenceSet = true;
                    break;
                default:
                    throw new InvalidOperationException($"Unknown task: {taskName}");
            }

            await CalculateReadinessScoreAsync(record);
        }

        /// <summary>
        /// Obtiene resumen de preparación del equipo
        /// </summary>
        public async Task<object> GetTeamReadinessSummaryAsync()
        {
            var records = await GetAllReadyAsync();
            var totalReady = records.Count;
            var fullyReady = records.Count(r => r.ReadinessScore >= 100);
            var almostReady = records.Count(r => r.ReadinessScore >= 70 && r.ReadinessScore < 100);
            var needsWork = records.Count(r => r.ReadinessScore < 70);

            var avgScore = totalReady > 0 ? records.Average(r => r.ReadinessScore) : 0;

            return new
            {
                TotalMembers = totalReady,
                FullyReady = fullyReady,
                AlmostReady = almostReady,
                NeedsWork = needsWork,
                AverageScore = Math.Round(avgScore, 2),
                TeamReadinessPercentage = totalReady > 0 ? Math.Round((fullyReady * 100.0) / totalReady, 2) : 0
            };
        }
    }
}
