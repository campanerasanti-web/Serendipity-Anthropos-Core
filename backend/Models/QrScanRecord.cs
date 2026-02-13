using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElMediadorDeSofia.Models
{
    /// <summary>
    /// Registro de escaneos de códigos QR
    /// </summary>
    public class QrScanRecord
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
        /// Código QR escaneado
        /// </summary>
        [Required]
        [MaxLength(100)]
        public string QrCode { get; set; } = string.Empty;

        /// <summary>
        /// Usuario que escaneó
        /// </summary>
        [MaxLength(100)]
        public string? ScannedBy { get; set; }

        /// <summary>
        /// Fecha y hora del escaneo
        /// </summary>
        public DateTime ScannedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Ubicación GPS (opcional)
        /// </summary>
        [MaxLength(200)]
        public string? Location { get; set; }

        /// <summary>
        /// Dispositivo desde el que se escaneó
        /// </summary>
        [MaxLength(200)]
        public string? Device { get; set; }

        /// <summary>
        /// Datos adicionales del escaneo en JSON
        /// </summary>
        public string? Metadata { get; set; }
    }
}
