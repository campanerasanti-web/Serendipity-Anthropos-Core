using System;
using System.ComponentModel.DataAnnotations;

namespace ElMediadorDeSofia.Models
{
    public class GoogleUser
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string GoogleId { get; set; } = null!;
        [Required]
        public string Email { get; set; } = null!;
        public string? Name { get; set; }
        public string? Picture { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
