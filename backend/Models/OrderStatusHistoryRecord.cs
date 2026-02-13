using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElMediadorDeSofia.Models
{
    /// <summary>
    /// Historial de cambios de estado de una orden
    /// </summary>
    public class OrderStatusHistoryRecord
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        /// <summary>
        /// ID de la orden asociada
        /// </summary>
        [Required]
        public Guid OrderId { get; set; }

        /// <summary>
        /// Relación con la orden
        /// </summary>
        [ForeignKey(nameof(OrderId))]
        public OrderRecord? Order { get; set; }

        /// <summary>
        /// Estado anterior
        /// </summary>
        [MaxLength(20)]
        public string? PreviousStatus { get; set; }

        /// <summary>
        /// Nuevo estado
        /// </summary>
        [Required]
        [MaxLength(20)]
        public string NewStatus { get; set; } = string.Empty;

        /// <summary>
        /// Motivo del cambio
        /// </summary>
        public string? Reason { get; set; }

        /// <summary>
        /// Usuario que realizó el cambio
        /// </summary>
        [MaxLength(100)]
        public string? ChangedBy { get; set; }

        /// <summary>
        /// Fecha del cambio
        /// </summary>
        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Datos adicionales en JSON
        /// </summary>
        public string? Metadata { get; set; }
    }
}
