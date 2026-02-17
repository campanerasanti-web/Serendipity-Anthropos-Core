using System;
using System.ComponentModel.DataAnnotations;

namespace ElMediadorDeSofia.Models
{
    public class Settings
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Key { get; set; } = null!;
        public string? Value { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}