using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ElMediadorDeSofia.Data;
using ElMediadorDeSofia.Models;
using Microsoft.EntityFrameworkCore;

namespace ElMediadorDeSofia.Services
{
    public class ChineseMedicineService
    {
        private readonly AppDbContext _context;

        public ChineseMedicineService(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Crea o actualiza un snapshot TCM para una persona
        /// </summary>
        public async Task<ChineseMedicineSnapshot> CreateOrUpdateSnapshotAsync(
            string email, 
            string personName,
            int qiScore,
            int[] elementScores // fire, earth, metal, water, wood
        )
        {
            var existing = await _context.ChineseMedicineSnapshots
                .OrderByDescending(s => s.SnapshotDate)
                .FirstOrDefaultAsync(s => s.Email == email);

            var snapshot = new ChineseMedicineSnapshot
            {
                Email = email,
                PersonName = personName,
                QiScore = qiScore,
                FireElement = elementScores.Length > 0 ? elementScores[0] : 50,
                EarthElement = elementScores.Length > 1 ? elementScores[1] : 50,
                MetalElement = elementScores.Length > 2 ? elementScores[2] : 50,
                WaterElement = elementScores.Length > 3 ? elementScores[3] : 50,
                WoodElement = elementScores.Length > 4 ? elementScores[4] : 50,
                CreatedBy = email,
                SnapshotDate = DateTime.UtcNow
            };

            // Detecta desequilibrios
            snapshot.YinYangBalance = CalculateYinYangBalance(elementScores);
            snapshot.BlockedElementsCount = DetectBlockedElements(elementScores, out var blocked);
            snapshot.BlockedElements = blocked;
            snapshot.MeridianFlowScore = CalculateMeridianFlow(elementScores);
            snapshot.QiQuality = DetermineQiQuality(qiScore);
            snapshot.ConstitutionalType = DetermineConstitutionalType(elementScores);
            snapshot.Status = qiScore >= 70 ? "active" : "needs-intervention";

            _context.ChineseMedicineSnapshots.Add(snapshot);
            await _context.SaveChangesAsync();

            return snapshot;
        }

        /// <summary>
        /// Obtiene el snapshot más reciente de una persona
        /// </summary>
        public async Task<ChineseMedicineSnapshot?> GetLatestSnapshotAsync(string email)
        {
            return await _context.ChineseMedicineSnapshots
                .Where(s => s.Email == email)
                .OrderByDescending(s => s.SnapshotDate)
                .FirstOrDefaultAsync();
        }

        /// <summary>
        /// Obtiene historial de snapshots de una persona
        /// </summary>
        public async Task<List<ChineseMedicineSnapshot>> GetSnapshotHistoryAsync(string email, int lastDays = 30)
        {
            var since = DateTime.UtcNow.AddDays(-lastDays);
            return await _context.ChineseMedicineSnapshots
                .Where(s => s.Email == email && s.SnapshotDate >= since)
                .OrderByDescending(s => s.SnapshotDate)
                .ToListAsync();
        }

        /// <summary>
        /// Calcula balance Yin-Yang
        /// </summary>
        private int CalculateYinYangBalance(int[] elementScores)
        {
            if (elementScores.Length < 5) return 50;

            // Yin elements: Earth, Metal, Water
            // Yang elements: Fire, Wood
            var yin = (elementScores[1] + elementScores[2] + elementScores[3]) / 3;
            var yang = (elementScores[0] + elementScores[4]) / 2;

            // Calcula balance: 50 es perfecto balance
            var balance = Math.Abs(yin - yang);
            return Math.Max(0, Math.Min(100, 100 - balance));
        }

        /// <summary>
        /// Detecta elementos bloqueados (< 40)
        /// </summary>
        private int DetectBlockedElements(int[] elementScores, out string? blocked)
        {
            var elements = new[] { "Fire", "Earth", "Metal", "Water", "Wood" };
            var blockedList = new List<string>();

            for (int i = 0; i < elementScores.Length; i++)
            {
                if (elementScores[i] < 40)
                    blockedList.Add(elements[i]);
            }

            blocked = blockedList.Any() ? string.Join(",", blockedList) : null;
            return blockedList.Count;
        }

        /// <summary>
        /// Calcula flujo de meridiano
        /// </summary>
        private int CalculateMeridianFlow(int[] elementScores)
        {
            if (elementScores.Length < 5) return 50;
            // Promedio de todos los elementos indica flujo
            return (int)elementScores.Average();
        }

        /// <summary>
        /// Determina cualidad del Qi
        /// </summary>
        private string DetermineQiQuality(int score)
        {
            return score >= 70 ? "balanced"
                : score >= 50 ? "neutral"
                : "deficient";
        }

        /// <summary>
        /// Determina tipo constitucional
        /// </summary>
        private string DetermineConstitutionalType(int[] elementScores)
        {
            if (elementScores.Length < 5) return "neutral";

            var maxScore = elementScores.Max();
            var maxIndex = Array.IndexOf(elementScores, maxScore);

            return maxIndex switch
            {
                0 => "yang-excess",      // Fire too high
                1 => "damp-heat",       // Earth excess
                2 => "metal-deficiency",// Metal low
                3 => "qi-deficiency",   // Water/Kidney low
                4 => "wood-stagnation", // Liver stagnation
                _ => "neutral"
            };
        }

        /// <summary>
        /// Obtiene recomendaciones de tratamiento
        /// </summary>
        public string GetTreatmentRecommendation(ChineseMedicineSnapshot snapshot)
        {
            if (snapshot.QiScore >= 70)
                return "Mantener equilibrio: Qi Gong diario, té de hierbas, 8h sueño";

            var blocked = string.IsNullOrEmpty(snapshot.BlockedElements)
                ? "general"
                : snapshot.BlockedElements;

            return blocked switch
            {
                "Fire" => "Enfría emociones (miedo/alegría). Acupresión PC-8, té verde.",
                "Earth" => "Armoniza digestión (preocupación). Masaje abdomen, arroz integral.",
                "Metal" => "Fortalece pulmones (duelo). Respiración profunda, jengibre.",
                "Water" => "Nutre riñones (miedo). Acupresión K-3, descanso profundo.",
                "Wood" => "Libera hígado (ira). Acupresión LV-3, caminar en naturaleza.",
                _ => "Equilibrado. Mantener rutina actual."
            };
        }

        /// <summary>
        /// Obtiene promedio de Qi del equipo
        /// </summary>
        public async Task<object> GetTeamTCMSummaryAsync()
        {
            var latestSnapshots = await _context.ChineseMedicineSnapshots
                .FromSqlRaw(
                    @"SELECT DISTINCT ON (email) * FROM ""ChineseMedicineSnapshots"" 
                      ORDER BY email, ""SnapshotDate"" DESC")
                .ToListAsync();

            var avgQi = latestSnapshots.Any() ? latestSnapshots.Average(s => s.QiScore) : 0;
            var balancedCount = latestSnapshots.Count(s => s.YinYangBalance >= 60);

            return new
            {
                TeamAverageQi = Math.Round(avgQi, 2),
                TotalMembers = latestSnapshots.Count,
                BalancedMembers = balancedCount,
                MethodsCount = (int)_context.ChineseMedicineSnapshots.Count(),
                RecommendedAction = avgQi >= 70 ? "Mantener equilibrio" : "Intervención necesaria"
            };
        }
    }
}
