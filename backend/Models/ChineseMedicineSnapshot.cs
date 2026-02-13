using System;

namespace ElMediadorDeSofia.Models
{
    /// <summary>
    /// Snapshot de métricas de Medicina China Tradicional (TCM)
    /// Qi Score, Yin-Yang Balance, 5 Elementos, Meridian Flow
    /// </summary>
    public class ChineseMedicineSnapshot
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        // Identificación
        public string PersonName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        
        // Qi Score General (0-100)
        public int QiScore { get; set; } = 50;
        public string QiQuality { get; set; } = "balanced"; // deficient, balanced, excess
        
        // Yin-Yang Balance (0-100, 50 = perfect balance)
        public int YinYangBalance { get; set; } = 50;
        public bool YinDominance { get; set; } = false;
        public bool YangDominance { get; set; } = false;
        
        // Los 5 Elementos (0-100 cada uno)
        public int FireElement { get; set; } = 50;     // Heart, joy
        public int EarthElement { get; set; } = 50;    // Spleen, thought
        public int MetalElement { get; set; } = 50;    // Lung, grief
        public int WaterElement { get; set; } = 50;    // Kidney, fear
        public int WoodElement { get; set; } = 50;     // Liver, anger
        
        // Blocked Elements Detection
        public int BlockedElementsCount { get; set; } = 0;
        public string? BlockedElements { get; set; } // JSON array of blocked elements
        
        // Meridian Flow
        public int MeridianFlowScore { get; set; } = 50; // 0-100
        public bool MeridianBlockageDetected { get; set; } = false;
        public string? BlockageLocations { get; set; } // JSON array
        
        // Energy Leaks Detection
        public int EnergyLeaksCount { get; set; } = 0;
        public string? EnergyLeakSources { get; set; } // JSON array
        
        // TCM Recommendations
        public string RecommendedTreatment { get; set; } = "none";
        public string? PracticesRecommended { get; set; } // JSON: qi-gong, acupressure, herbal-tea, sleep
        
        // Season & Constitutional Type
        public string ConstitutionalType { get; set; } = "neutral"; // yin, yang, damp-heat, qi-deficiency
        public string CurrentSeason { get; set; } = "winter";
        
        // Snapshot Period
        public DateTime SnapshotDate { get; set; } = DateTime.UtcNow;
        public DateTime NextRecommendedCheckup { get; set; } = DateTime.UtcNow.AddDays(30);
        
        // Auditoría
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; } = "system";
        
        // Analysis Notes
        public string? AnalysisNotes { get; set; }
        
        // Status
        public string Status { get; set; } = "active"; // active, archived, needs-intervention
    }
}
