using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using ElMediadorDeSofia.Data;
using ElMediadorDeSofia.Models;
using Microsoft.EntityFrameworkCore;

namespace ElMediadorDeSofia.Services
{
    /// <summary>
    /// Servicio para gestión de escaneos QR
    /// </summary>
    public class QrTrackingService
    {
        private readonly AppDbContext _db;
        private readonly EventService _eventService;

        public QrTrackingService(AppDbContext db, EventService eventService)
        {
            _db = db;
            _eventService = eventService;
        }

        /// <summary>
        /// Registra un escaneo de código QR
        /// </summary>
        public async Task<QrScanRecord?> RegisterScanAsync(
            string qrCode,
            string? scannedBy = null,
            string? location = null,
            string? device = null,
            Dictionary<string, object>? metadata = null)
        {
            // Buscar la orden por código QR
            var order = await _db.Orders.FirstOrDefaultAsync(o => o.QrCode == qrCode);
            if (order == null) return null;

            // Crear registro de escaneo
            var scanRecord = new QrScanRecord
            {
                OrderId = order.Id,
                QrCode = qrCode,
                ScannedBy = scannedBy,
                ScannedAt = DateTime.UtcNow,
                Location = location,
                Device = device,
                Metadata = metadata != null ? JsonSerializer.Serialize(metadata) : null
            };

            _db.QrScans.Add(scanRecord);
            await _db.SaveChangesAsync();

            // Event sourcing: registrar evento order.qr_scanned
            await _eventService.AppendEventAsync(
                "Order",
                order.Id,
                "order.qr_scanned",
                new
                {
                    qrCode,
                    scannedBy,
                    location,
                    device,
                    metadata
                },
                scannedBy
            );

            return scanRecord;
        }

        /// <summary>
        /// Obtiene el historial de escaneos de una orden
        /// </summary>
        public async Task<List<QrScanRecord>> GetOrderScanHistoryAsync(Guid orderId)
        {
            return await _db.QrScans
                .Where(s => s.OrderId == orderId)
                .OrderByDescending(s => s.ScannedAt)
                .ToListAsync();
        }

        /// <summary>
        /// Obtiene el historial de escaneos de un código QR
        /// </summary>
        public async Task<List<QrScanRecord>> GetQrScanHistoryAsync(string qrCode)
        {
            return await _db.QrScans
                .Include(s => s.Order)
                .Where(s => s.QrCode == qrCode)
                .OrderByDescending(s => s.ScannedAt)
                .ToListAsync();
        }

        /// <summary>
        /// Obtiene todos los escaneos recientes
        /// </summary>
        public async Task<List<QrScanRecord>> GetRecentScansAsync(int limit = 100)
        {
            return await _db.QrScans
                .Include(s => s.Order)
                .OrderByDescending(s => s.ScannedAt)
                .Take(limit)
                .ToListAsync();
        }

        /// <summary>
        /// Obtiene estadísticas de escaneos
        /// </summary>
        public async Task<object> GetScanStatsAsync()
        {
            var totalScans = await _db.QrScans.CountAsync();

            var today = DateTime.UtcNow.Date;
            var scansToday = await _db.QrScans.CountAsync(s => s.ScannedAt >= today);

            var thisWeek = today.AddDays(-7);
            var scansThisWeek = await _db.QrScans.CountAsync(s => s.ScannedAt >= thisWeek);

            var thisMonth = today.AddMonths(-1);
            var scansThisMonth = await _db.QrScans.CountAsync(s => s.ScannedAt >= thisMonth);

            var scansByUser = await _db.QrScans
                .Where(s => s.ScannedBy != null)
                .GroupBy(s => s.ScannedBy)
                .Select(g => new { user = g.Key, count = g.Count() })
                .OrderByDescending(x => x.count)
                .Take(10)
                .ToListAsync();

            var mostScannedOrders = await _db.QrScans
                .GroupBy(s => s.OrderId)
                .Select(g => new { orderId = g.Key, count = g.Count() })
                .OrderByDescending(x => x.count)
                .Take(10)
                .ToListAsync();

            return new
            {
                totalScans,
                scansToday,
                scansThisWeek,
                scansThisMonth,
                scansByUser,
                mostScannedOrders
            };
        }

        /// <summary>
        /// Obtiene información de una orden mediante su código QR
        /// </summary>
        public async Task<OrderRecord?> GetOrderByQrCodeAsync(string qrCode)
        {
            return await _db.Orders.FirstOrDefaultAsync(o => o.QrCode == qrCode);
        }
    }
}
