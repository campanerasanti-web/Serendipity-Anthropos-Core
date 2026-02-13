using System;
using System.ComponentModel.DataAnnotations;

namespace ElMediadorDeSofia.Models
{
    /// <summary>
    /// Orden de producción con trazabilidad QR y semáforo de estados
    /// </summary>
    public class OrderRecord
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        /// <summary>
        /// Código QR único generado para la orden
        /// </summary>
        [Required]
        [MaxLength(100)]
        public string QrCode { get; set; } = string.Empty;

        /// <summary>
        /// Cliente o destinatario de la orden
        /// </summary>
        [Required]
        [MaxLength(200)]
        public string Customer { get; set; } = string.Empty;

        /// <summary>
        /// Producto o servicio solicitado
        /// </summary>
        [Required]
        [MaxLength(200)]
        public string Product { get; set; } = string.Empty;

        /// <summary>
        /// Cantidad solicitada
        /// </summary>
        [Required]
        public int Quantity { get; set; }

        /// <summary>
        /// Fecha de vencimiento de la orden
        /// </summary>
        [Required]
        public DateTime DueDate { get; set; }

        /// <summary>
        /// Prioridad: urgent, high, normal, low
        /// </summary>
        [Required]
        [MaxLength(20)]
        public string Priority { get; set; } = "normal";

        /// <summary>
        /// Estado actual: pending, in-progress, completed, cancelled
        /// </summary>
        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "pending";

        /// <summary>
        /// Trabajador asignado
        /// </summary>
        [MaxLength(200)]
        public string? AssignedTo { get; set; }

        /// <summary>
        /// Notas adicionales
        /// </summary>
        public string? Notes { get; set; }

        /// <summary>
        /// Fecha de creación
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Última actualización
        /// </summary>
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Usuario que creó la orden
        /// </summary>
        [MaxLength(100)]
        public string? CreatedBy { get; set; }

        /// <summary>
        /// Si la orden ha sido eliminada (soft delete)
        /// </summary>
        public bool IsDeleted { get; set; } = false;

        /// <summary>
        /// Fecha de eliminación
        /// </summary>
        public DateTime? DeletedAt { get; set; }

        /// <summary>
        /// Usuario que eliminó la orden
        /// </summary>
        [MaxLength(100)]
        public string? DeletedBy { get; set; }
    }
}
