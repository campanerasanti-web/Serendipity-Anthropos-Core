using System;

namespace ElMediadorDeSofia.Models
{
    /// <summary>
    /// Registro de disponibilidad del Protocolo TET (Tết Nguyên Đán)
    /// Captura métricas de preparación para el evento del 13 de febrero de 2026
    /// </summary>
    public class TETReadinessRecord
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        // Identificación
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        
        // Métricas de Disponibilidad TET
        public int ReadinessScore { get; set; } // 0-100
        public bool CsvLoaded { get; set; } = false;
        public bool QrGenerated { get; set; } = false;
        public bool VietnamAssignmentComplete { get; set; } = false;
        public bool SystemTestsPassed { get; set; } = false;
        public bool PersonalPanelConfigured { get; set; } = false;
        public bool LanguagePreferenceSet { get; set; } = false;
        public string PreferredLanguage { get; set; } = "es";
        
        // Estado del Protocolo
        public string ProtocolStatus { get; set; } = "pending"; // pending, in-progress, ready, completed
        
        // Notas y Observaciones
        public string? Notes { get; set; }
        
        // Auditoría
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; } = "system";
        public string UpdatedBy { get; set; } = "system";
        
        // Soft Delete
        public bool IsDeleted { get; set; } = false;
        public DateTime? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
    }
}
