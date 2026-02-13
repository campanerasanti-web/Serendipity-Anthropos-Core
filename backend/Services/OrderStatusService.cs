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
    /// Servicio para gestión de estados de órdenes y su historial
    /// </summary>
    public class OrderStatusService
    {
        private readonly AppDbContext _db;
        private readonly EventService _eventService;
        private readonly EventDispatcher _dispatcher;

        public OrderStatusService(AppDbContext db, EventService eventService, EventDispatcher dispatcher)
        {
            _db = db;
            _eventService = eventService;
            _dispatcher = dispatcher;
        }

        /// <summary>
        /// Cambia el estado de una orden
        /// </summary>
        public async Task<OrderRecord?> ChangeOrderStatusAsync(
            Guid orderId,
            string newStatus,
            string? reason = null,
            string? changedBy = null,
            Dictionary<string, object>? metadata = null)
        {
            var order = await _db.Orders.FirstOrDefaultAsync(o => o.Id == orderId);
            if (order == null) return null;

            var previousStatus = order.Status;

            // Si el estado no cambió, no hacer nada
            if (previousStatus == newStatus)
                return order;

            // Actualizar estado de la orden
            order.Status = newStatus;
            order.UpdatedAt = DateTime.UtcNow;

            // Crear registro de historial
            var historyRecord = new OrderStatusHistoryRecord
            {
                OrderId = orderId,
                PreviousStatus = previousStatus,
                NewStatus = newStatus,
                Reason = reason,
                ChangedBy = changedBy,
                ChangedAt = DateTime.UtcNow,
                Metadata = metadata != null ? JsonSerializer.Serialize(metadata) : null
            };

            _db.OrderStatusHistory.Add(historyRecord);
            await _db.SaveChangesAsync();

            // Event sourcing: registrar evento order.status_changed
            await _eventService.AppendEventAsync(
                "Order",
                orderId,
                "order.status_changed",
                new
                {
                    previousStatus,
                    newStatus,
                    reason,
                    metadata
                },
                changedBy
            );

            await _dispatcher.PublishOrderStatusChangedAsync(orderId, previousStatus, newStatus);

            return order;
        }

        /// <summary>
        /// Obtiene el historial de estados de una orden
        /// </summary>
        public async Task<List<OrderStatusHistoryRecord>> GetOrderStatusHistoryAsync(Guid orderId)
        {
            return await _db.OrderStatusHistory
                .Where(h => h.OrderId == orderId)
                .OrderByDescending(h => h.ChangedAt)
                .ToListAsync();
        }

        /// <summary>
        /// Obtiene todos los cambios de estado recientes (últimos 100)
        /// </summary>
        public async Task<List<OrderStatusHistoryRecord>> GetRecentStatusChangesAsync(int limit = 100)
        {
            return await _db.OrderStatusHistory
                .Include(h => h.Order)
                .OrderByDescending(h => h.ChangedAt)
                .Take(limit)
                .ToListAsync();
        }

        /// <summary>
        /// Obtiene estadísticas de cambios de estado
        /// </summary>
        public async Task<object> GetStatusChangeStatsAsync()
        {
            var totalChanges = await _db.OrderStatusHistory.CountAsync();

            var changesByStatus = await _db.OrderStatusHistory
                .GroupBy(h => h.NewStatus)
                .Select(g => new { status = g.Key, count = g.Count() })
                .ToListAsync();

            var today = DateTime.UtcNow.Date;
            var changesThisMonth = await _db.OrderStatusHistory
                .Where(h => h.ChangedAt >= today.AddMonths(-1))
                .CountAsync();

            return new
            {
                totalChanges,
                changesByStatus,
                changesThisMonth
            };
        }
    }
}
