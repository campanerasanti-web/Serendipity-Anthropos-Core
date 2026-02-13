using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElMediadorDeSofia.Models
{
    public class Invoice
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid LotId { get; set; }

        [ForeignKey(nameof(LotId))]
        public Lot? Lot { get; set; }

        public decimal Amount { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool Applied { get; set; } = false;

        public string? PdfPath { get; set; }

        public DateTime? AppliedAt { get; set; }
    }
}
