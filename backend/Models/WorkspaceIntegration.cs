using System;
using System.ComponentModel.DataAnnotations;

namespace ElMediadorDeSofia.Models
{
    public class WorkspaceIntegration
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string WorkspaceId { get; set; } = null!;
        public string? IntegrationType { get; set; }
        public string? ConfigJson { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}