using System;

namespace ElMediadorDeSofia.Models
{
    /// <summary>
    /// Registro de métricas de bienestar personal 
    /// Paz Interior, Presencia, Automatización, Mindfulness
    /// </summary>
    public class PersonalWellbeingRecord
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        // Identificación
        public string PersonName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        
        // Métricas de Paz Interior (0-100)
        public int PazInteriorScore { get; set; } = 50;
        public string PazInteriorDescription { get; set; } = "Estado neutral inicial";
        
        // Métricas de Presencia (horas/dia)
        public decimal HoursPresenceDaily { get; set; } = 0;
        public decimal HoursPresenceTarget { get; set; } = 8;
        public int PresenceConsistency { get; set; } = 0; // 0-100%
        
        // Impacto de Automatización
        public decimal AutomationImpact { get; set; } = 0; // % de mejora
        public int TasksAutomatedCount { get; set; } = 0;
        public decimal TimeRecoveredHours { get; set; } = 0;
        
        // Mindfulness Metrics
        public int DailyMindfulnessMoments { get; set; } = 0;
        public int WeeklyMeditationMinutes { get; set; } = 0;
        public int MindfulnessGain { get; set; } = 0; // 0-100%
        
        // Baseline Comparisons
        public decimal BaselineRestHours { get; set; } = 6;
        public decimal BaselineFocusScore { get; set; } = 50;
        public decimal CurrentRestHours { get; set; } = 6;
        public decimal CurrentFocusScore { get; set; } = 50;
        
        // Proyección 6 meses
        public decimal ProjectedGrowth6Months { get; set; } = 0; // %
        public string WellbeingTarget { get; set; } = "Paz Interior Integral";
        
        // Período de Reporte
        public DateTime PeriodStartDate { get; set; } = DateTime.UtcNow;
        public DateTime PeriodEndDate { get; set; } = DateTime.UtcNow.AddDays(1);
        
        // Auditoría
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; } = "system";
        
        // Estado
        public bool IsActive { get; set; } = true;
        public string Status { get; set; } = "baseline"; // baseline, improving, stable, accelerating
    }
}
