using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Channels;
using System.Threading.Tasks;
using ElMediadorDeSofia.Models;
using ElMediadorDeSofia.Services;
using Microsoft.AspNetCore.Mvc;

namespace ElMediadorDeSofia.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        private readonly OrderService _orderService;
        private readonly OrderStatusService _statusService;
        private readonly EventDispatcher _dispatcher;
        private readonly OrderReportService _reportService;

        public OrdersController(
            OrderService orderService,
            OrderStatusService statusService,
            EventDispatcher dispatcher,
            OrderReportService reportService)
        {
            _orderService = orderService;
            _statusService = statusService;
            _dispatcher = dispatcher;
            _reportService = reportService;
        }

        /// <summary>
        /// POST /api/orders - Crear nueva orden
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
        {
            try
            {
                var order = await _orderService.CreateOrderAsync(
                    request.Customer,
                    request.Product,
                    request.Quantity,
                    request.DueDate,
                    request.Priority ?? "normal",
                    request.AssignedTo,
                    request.Notes,
                    request.CreatedBy
                );

                return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/orders/{id} - Obtener orden por ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(Guid id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null)
                return NotFound(new { error = "Orden no encontrada" });

            return Ok(order);
        }

        /// <summary>
        /// GET /api/orders - Obtener todas las órdenes
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllOrders([FromQuery] string? status = null)
        {
            try
            {
                List<OrderRecord> orders;

                if (!string.IsNullOrEmpty(status))
                {
                    orders = await _orderService.GetOrdersByStatusAsync(status);
                }
                else
                {
                    orders = await _orderService.GetAllOrdersAsync();
                }

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/orders/overdue - Obtener órdenes vencidas
        /// </summary>
        [HttpGet("overdue")]
        public async Task<IActionResult> GetOverdueOrders()
        {
            var orders = await _orderService.GetOverdueOrdersAsync();
            return Ok(orders);
        }

        /// <summary>
        /// PATCH /api/orders/{id} - Actualizar orden
        /// </summary>
        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateOrder(Guid id, [FromBody] UpdateOrderRequest request)
        {
            try
            {
                var order = await _orderService.UpdateOrderAsync(
                    id,
                    request.Customer,
                    request.Product,
                    request.Quantity,
                    request.DueDate,
                    request.Priority,
                    request.AssignedTo,
                    request.Notes,
                    request.UpdatedBy
                );

                if (order == null)
                    return NotFound(new { error = "Orden no encontrada" });

                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// PATCH /api/orders/{id}/status - Cambiar estado de orden
        /// </summary>
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> ChangeOrderStatus(Guid id, [FromBody] ChangeStatusRequest request)
        {
            try
            {
                var order = await _statusService.ChangeOrderStatusAsync(
                    id,
                    request.NewStatus,
                    request.Reason,
                    request.ChangedBy,
                    request.Metadata
                );

                if (order == null)
                    return NotFound(new { error = "Orden no encontrada" });

                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/orders/{id}/history - Obtener historial de estados
        /// </summary>
        [HttpGet("{id}/history")]
        public async Task<IActionResult> GetOrderHistory(Guid id)
        {
            var history = await _statusService.GetOrderStatusHistoryAsync(id);
            return Ok(history);
        }

        /// <summary>
        /// DELETE /api/orders/{id} - Eliminar orden (soft delete)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(Guid id, [FromQuery] string? deletedBy = null)
        {
            var success = await _orderService.DeleteOrderAsync(id, deletedBy);
            if (!success)
                return NotFound(new { error = "Orden no encontrada" });

            return Ok(new { message = "Orden eliminada correctamente" });
        }

        /// <summary>
        /// GET /api/orders/stats - Obtener estadísticas
        /// </summary>
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var stats = await _orderService.GetOrderStatsAsync();
            return Ok(stats);
        }

        /// <summary>
        /// GET /api/orders/stream - Stream de eventos en tiempo real (SSE)
        /// </summary>
        [HttpGet("stream")]
        public async Task StreamEvents()
        {
            Response.Headers.Add("Content-Type", "text/event-stream");
            Response.Headers.Add("Cache-Control", "no-cache");
            Response.Headers.Add("X-Accel-Buffering", "no");

            var channel = Channel.CreateUnbounded<string>();

            var unsubscribe = _dispatcher.Subscribe(evt =>
            {
                var payload = JsonSerializer.Serialize(evt);
                channel.Writer.TryWrite(payload);
                return Task.CompletedTask;
            });

            try
            {
                await foreach (var message in channel.Reader.ReadAllAsync(HttpContext.RequestAborted))
                {
                    await Response.WriteAsync($"data: {message}\n\n");
                    await Response.Body.FlushAsync();
                }
            }
            finally
            {
                unsubscribe();
            }
        }

        /// <summary>
        /// GET /api/orders/daily-report - Genera PDF de cierre de jornada
        /// </summary>
        [HttpGet("daily-report")]
        public async Task<IActionResult> GetDailyReport([FromQuery] DateTime? date = null)
        {
            var reportDate = (date ?? DateTime.UtcNow).Date;
            var pdfBytes = await _reportService.GenerateDailyReportAsync(reportDate);
            var fileName = $"Cierre_Jornada_{reportDate:yyyyMMdd}.pdf";

            return File(pdfBytes, "application/pdf", fileName);
        }
    }

    // DTO Models
    public class CreateOrderRequest
    {
        public string Customer { get; set; } = string.Empty;
        public string Product { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public DateTime DueDate { get; set; }
        public string? Priority { get; set; }
        public string? AssignedTo { get; set; }
        public string? Notes { get; set; }
        public string? CreatedBy { get; set; }
    }

    public class UpdateOrderRequest
    {
        public string? Customer { get; set; }
        public string? Product { get; set; }
        public int? Quantity { get; set; }
        public DateTime? DueDate { get; set; }
        public string? Priority { get; set; }
        public string? AssignedTo { get; set; }
        public string? Notes { get; set; }
        public string? UpdatedBy { get; set; }
    }

    public class ChangeStatusRequest
    {
        public string NewStatus { get; set; } = string.Empty;
        public string? Reason { get; set; }
        public string? ChangedBy { get; set; }
        public Dictionary<string, object>? Metadata { get; set; }
    }
}
