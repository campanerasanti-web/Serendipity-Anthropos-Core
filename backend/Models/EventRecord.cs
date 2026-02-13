using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace ElMediadorDeSofia.Models
{
    public class EventRecord
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string AggregateType { get; set; } = string.Empty;

        [Required]
        public Guid AggregateId { get; set; }

        [Required]
        public string EventType { get; set; } = string.Empty;

        // Stored as jsonb in Postgres
        [Required]
        public string Payload { get; set; } = "{}";

        public string? CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool Processed { get; set; } = false;

        public DateTime? ProcessedAt { get; set; }

        // Legacy compatibility and extended support
        [NotMapped]
        public DateTime Timestamp 
        { 
            get => CreatedAt;
            set => CreatedAt = value;
        }

        [NotMapped]
        public Dictionary<string, object>? Data { get; set; }

        [NotMapped]
        public string? Status { get; set; }
    }
}
