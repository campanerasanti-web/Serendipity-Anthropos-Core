using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElMediadorDeSofia.Models
{
    public enum PaymentStatus
    {
        Pending,
        Sent,
        Completed,
        Failed
    }

    public class PaymentOrder
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid InvoiceId { get; set; }

        [ForeignKey(nameof(InvoiceId))]
        public Invoice? Invoice { get; set; }

        public decimal Amount { get; set; }

        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? CompletedAt { get; set; }
    }
}
