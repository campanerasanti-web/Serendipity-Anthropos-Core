using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ElMediadorDeSofia.Services;
using Microsoft.AspNetCore.Mvc;

namespace ElMediadorDeSofia.Controllers
{
    [ApiController]
    [Route("api/qr")]
    public class QrController : ControllerBase
    {
        private readonly QrTrackingService _qrService;

        public QrController(QrTrackingService qrService)
        {
            _qrService = qrService;
        }

        /// <summary>
        /// GET /api/qr/{qrCode} - Obtener orden por código QR
        /// </summary>
        [HttpGet("{qrCode}")]
        public async Task<IActionResult> GetOrderByQrCode(string qrCode)
        {
            var order = await _qrService.GetOrderByQrCodeAsync(qrCode);
            if (order == null)
                return NotFound(new { error = "Orden no encontrada para el código QR proporcionado" });

            return Ok(order);
        }

        /// <summary>
        /// POST /api/qr/scan - Registrar escaneo de código QR
        /// </summary>
        [HttpPost("scan")]
        public async Task<IActionResult> RegisterScan([FromBody] RegisterScanRequest request)
        {
            try
            {
                var scanRecord = await _qrService.RegisterScanAsync(
                    request.QrCode,
                    request.ScannedBy,
                    request.Location,
                    request.Device,
                    request.Metadata
                );

                if (scanRecord == null)
                    return NotFound(new { error = "Orden no encontrada para el código QR proporcionado" });

                return Ok(scanRecord);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/qr/{qrCode}/history - Obtener historial de escaneos
        /// </summary>
        [HttpGet("{qrCode}/history")]
        public async Task<IActionResult> GetQrScanHistory(string qrCode)
        {
            var history = await _qrService.GetQrScanHistoryAsync(qrCode);
            return Ok(history);
        }

        /// <summary>
        /// GET /api/qr/scans/recent - Obtener escaneos recientes
        /// </summary>
        [HttpGet("scans/recent")]
        public async Task<IActionResult> GetRecentScans([FromQuery] int limit = 100)
        {
            var scans = await _qrService.GetRecentScansAsync(limit);
            return Ok(scans);
        }

        /// <summary>
        /// GET /api/qr/stats - Obtener estadísticas de escaneos
        /// </summary>
        [HttpGet("stats")]
        public async Task<IActionResult> GetScanStats()
        {
            var stats = await _qrService.GetScanStatsAsync();
            return Ok(stats);
        }
    }

    // DTO Model
    public class RegisterScanRequest
    {
        public string QrCode { get; set; } = string.Empty;
        public string? ScannedBy { get; set; }
        public string? Location { get; set; }
        public string? Device { get; set; }
        public Dictionary<string, object>? Metadata { get; set; }
    }
}
