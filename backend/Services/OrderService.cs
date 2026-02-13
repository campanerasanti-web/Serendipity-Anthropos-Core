using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ElMediadorDeSofia.Data;
using ElMediadorDeSofia.Models;
using Microsoft.EntityFrameworkCore;

namespace ElMediadorDeSofia.Services
{
    /// <summary>
    /// Servicio para gestión de órdenes con trazabilidad QR
    /// </summary>
    public class OrderService
    {
        private readonly AppDbContext _db;
        private readonly EventService _eventService;
        private readonly EventDispatcher _dispatcher;

        public OrderService(AppDbContext db, EventService eventService, EventDispatcher dispatcher)
        {
            _db = db;
            _eventService = eventService;
            _dispatcher = dispatcher;
        }

        /// <summary>
        /// Genera un código QR único para una orden
        /// </summary>
        private string GenerateQrCode()
        {
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            var random = new Random().Next(1000, 9999);
            return $"ORD-{timestamp}-{random}";
        }

        /// <summary>
        /// Crea una nueva orden
        /// </summary>
        public async Task<OrderRecord> CreateOrderAsync(
            string customer,
            string product,
            int quantity,
            DateTime dueDate,
            string priority = "normal",
            string? assignedTo = null,
            string? notes = null,
            string? createdBy = null)
        {
            var order = new OrderRecord
            {
                QrCode = GenerateQrCode(),
                Customer = customer,
                Product = product,
                Quantity = quantity,
                DueDate = dueDate,
                Priority = priority,
                Status = "pending",
                AssignedTo = assignedTo,
                Notes = notes,
                CreatedBy = createdBy,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            // Event sourcing: registrar evento order.created
            await _eventService.AppendEventAsync(
                "Order",
                order.Id,
                "order.created",
                new
                {
                    order.QrCode,
                    order.Customer,
                    order.Product,
                    order.Quantity,
                    order.DueDate,
                    order.Priority,
                    order.Status,
                    order.AssignedTo,
                    order.Notes
                },
                createdBy
            );

            await _dispatcher.PublishOrderCreatedAsync(order.Id, order.QrCode, order.Customer);

            return order;
        }

        /// <summary>
        /// Obtiene una orden por ID
        /// </summary>
        public async Task<OrderRecord?> GetOrderByIdAsync(Guid id)
        {
            return await _db.Orders.FirstOrDefaultAsync(o => o.Id == id);
        }

        /// <summary>
        /// Obtiene una orden por código QR
        /// </summary>
        public async Task<OrderRecord?> GetOrderByQrCodeAsync(string qrCode)
        {
            return await _db.Orders.FirstOrDefaultAsync(o => o.QrCode == qrCode);
        }

        /// <summary>
        /// Obtiene todas las órdenes (sin incluir eliminadas)
        /// </summary>
        public async Task<List<OrderRecord>> GetAllOrdersAsync()
        {
            return await _db.Orders
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        /// <summary>
        /// Obtiene órdenes filtradas por estado
        /// </summary>
        public async Task<List<OrderRecord>> GetOrdersByStatusAsync(string status)
        {
            return await _db.Orders
                .Where(o => o.Status == status)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        /// <summary>
        /// Obtiene órdenes vencidas
        /// </summary>
        public async Task<List<OrderRecord>> GetOverdueOrdersAsync()
        {
            var now = DateTime.UtcNow;
            return await _db.Orders
                .Where(o => o.DueDate < now && o.Status != "completed" && o.Status != "cancelled")
                .OrderBy(o => o.DueDate)
                .ToListAsync();
        }

        /// <summary>
        /// Actualiza los datos de una orden
        /// </summary>
        public async Task<OrderRecord?> UpdateOrderAsync(
            Guid id,
            string? customer = null,
            string? product = null,
            int? quantity = null,
            DateTime? dueDate = null,
            string? priority = null,
            string? assignedTo = null,
            string? notes = null,
            string? updatedBy = null)
        {
            var order = await _db.Orders.FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return null;

            var changes = new Dictionary<string, object>();

            if (customer != null && customer != order.Customer)
            {
                changes["customer"] = new { old = order.Customer, @new = customer };
                order.Customer = customer;
            }

            if (product != null && product != order.Product)
            {
                changes["product"] = new { old = order.Product, @new = product };
                order.Product = product;
            }

            if (quantity.HasValue && quantity.Value != order.Quantity)
            {
                changes["quantity"] = new { old = order.Quantity, @new = quantity.Value };
                order.Quantity = quantity.Value;
            }

            if (dueDate.HasValue && dueDate.Value != order.DueDate)
            {
                changes["dueDate"] = new { old = order.DueDate, @new = dueDate.Value };
                order.DueDate = dueDate.Value;
            }

            if (priority != null && priority != order.Priority)
            {
                changes["priority"] = new { old = order.Priority, @new = priority };
                order.Priority = priority;
            }

            if (assignedTo != null && assignedTo != order.AssignedTo)
            {
                changes["assignedTo"] = new { old = order.AssignedTo, @new = assignedTo };
                order.AssignedTo = assignedTo;
            }

            if (notes != null)
            {
                changes["notes"] = new { old = order.Notes, @new = notes };
                order.Notes = notes;
            }

            if (changes.Any())
            {
                order.UpdatedAt = DateTime.UtcNow;
                await _db.SaveChangesAsync();

                // Event sourcing: registrar evento order.details_updated
                await _eventService.AppendEventAsync(
                    "Order",
                    order.Id,
                    "order.details_updated",
                    new { changes },
                    updatedBy
                );
            }

            return order;
        }

        /// <summary>
        /// Elimina una orden (soft delete)
        /// </summary>
        public async Task<bool> DeleteOrderAsync(Guid id, string? deletedBy = null)
        {
            var order = await _db.Orders.IgnoreQueryFilters().FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return false;

            order.IsDeleted = true;
            order.DeletedAt = DateTime.UtcNow;
            order.DeletedBy = deletedBy;

            await _db.SaveChangesAsync();

            // Event sourcing: registrar evento order.deleted
            await _eventService.AppendEventAsync(
                "Order",
                order.Id,
                "order.deleted",
                new { order.QrCode, Reason = "Soft deleted by user" },
                deletedBy
            );

            return true;
        }

        /// <summary>
        /// Obtiene estadísticas de órdenes
        /// </summary>
        public async Task<object> GetOrderStatsAsync()
        {
            var total = await _db.Orders.CountAsync();
            var pending = await _db.Orders.CountAsync(o => o.Status == "pending");
            var inProgress = await _db.Orders.CountAsync(o => o.Status == "in-progress");
            var completed = await _db.Orders.CountAsync(o => o.Status == "completed");
            var cancelled = await _db.Orders.CountAsync(o => o.Status == "cancelled");
            
            var now = DateTime.UtcNow;
            var overdue = await _db.Orders.CountAsync(o => 
                o.DueDate < now && 
                o.Status != "completed" && 
                o.Status != "cancelled"
            );

            var urgent = await _db.Orders.CountAsync(o => o.Priority == "urgent");
            var high = await _db.Orders.CountAsync(o => o.Priority == "high");

            return new
            {
                total,
                byStatus = new { pending, inProgress, completed, cancelled },
                overdue,
                byPriority = new { urgent, high }
            };
        }
    }
}
