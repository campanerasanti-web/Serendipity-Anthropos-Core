using System;
using System.ComponentModel.DataAnnotations;

namespace ElMediadorDeSofia.Models
{
    public class Lot
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string Name { get; set; } = string.Empty;

        public decimal ExpectedAmount { get; set; }

        public bool SheetSigned { get; set; } = false;

        public bool Closed { get; set; } = false;

        public DateTime? ClosedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
