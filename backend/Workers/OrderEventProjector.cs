using System;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using ElMediadorDeSofia.Data;
using ElMediadorDeSofia.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ElMediadorDeSofia.Workers
{
    /// <summary>
    /// Worker que proyecta eventos de órdenes a vistas agregadas y estadísticas
    /// Ejecuta cada 10 segundos procesando eventos pendientes
    /// </summary>
    public class OrderEventProjector : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<OrderEventProjector> _logger;

        public OrderEventProjector(
            IServiceProvider serviceProvider,
            ILogger<OrderEventProjector> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("OrderEventProjector iniciado - proyectando eventos de órdenes");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcessOrderEventsAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error procesando eventos de órdenes");
                }

                await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
            }

            _logger.LogInformation("OrderEventProjector detenido");
        }

        private async Task ProcessOrderEventsAsync()
        {
            using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var eventService = scope.ServiceProvider.GetRequiredService<EventService>();

            // Obtener eventos no procesados relacionados con órdenes
            var events = await eventService.GetUnprocessedEventsAsync(50);

            var orderEvents = events
                .Where(e => e.AggregateType == "Order")
                .ToList();

            if (orderEvents.Count == 0)
                return;

            _logger.LogInformation($"Procesando {orderEvents.Count} eventos de órdenes");

            foreach (var evt in orderEvents)
            {
                try
                {
                    await ProjectOrderEventAsync(db, evt);
                    
                    // Marcar evento como procesado
                    evt.Processed = true;
                    evt.ProcessedAt = DateTime.UtcNow;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error proyectando evento {evt.EventType} para orden {evt.AggregateId}");
                }
            }

            await db.SaveChangesAsync();
            _logger.LogInformation($"Eventos de órdenes procesados correctamente");
        }

        private async Task ProjectOrderEventAsync(AppDbContext db, Models.EventRecord evt)
        {
            switch (evt.EventType)
            {
                case "order.created":
                    await HandleOrderCreated(db, evt);
                    break;

                case "order.status_changed":
                    await HandleOrderStatusChanged(db, evt);
                    break;

                case "order.details_updated":
                    await HandleOrderDetailsUpdated(db, evt);
                    break;

                case "order.deleted":
                    await HandleOrderDeleted(db, evt);
                    break;

                case "order.qr_scanned":
                    await HandleOrderQrScanned(db, evt);
                    break;

                default:
                    _logger.LogWarning($"Tipo de evento desconocido para órdenes: {evt.EventType}");
                    break;
            }
        }

        private async Task HandleOrderCreated(AppDbContext db, Models.EventRecord evt)
        {
            _logger.LogInformation($"Proyectando order.created para {evt.AggregateId}");
            
            // Aquí podrías actualizar tablas de agregación, caché, o dashboards
            // Por ejemplo, actualizar contadores globales, enviar notificaciones, etc.
            
            // Ejemplo: verificar si la orden es urgente y enviar alerta
            var payload = JsonSerializer.Deserialize<JsonElement>(evt.Payload);
            if (payload.TryGetProperty("Priority", out var priority) && 
                priority.GetString() == "urgent")
            {
                _logger.LogWarning($"ALERTA: Orden urgente creada - {evt.AggregateId}");
            }

            await Task.CompletedTask;
        }

        private async Task HandleOrderStatusChanged(AppDbContext db, Models.EventRecord evt)
        {
            _logger.LogInformation($"Proyectando order.status_changed para {evt.AggregateId}");
            
            // Aquí podrías actualizar estadísticas agregadas
            var payload = JsonSerializer.Deserialize<JsonElement>(evt.Payload);
            
            if (payload.TryGetProperty("newStatus", out var newStatus))
            {
                var status = newStatus.GetString();
                
                // Si se completó una orden, registrar tiempo de resolución
                if (status == "completed")
                {
                    _logger.LogInformation($"Orden {evt.AggregateId} completada");
                }
                
                // Si se canceló, investigar motivo
                if (status == "cancelled")
                {
                    _logger.LogWarning($"Orden {evt.AggregateId} cancelada");
                }
            }

            await Task.CompletedTask;
        }

        private async Task HandleOrderDetailsUpdated(AppDbContext db, Models.EventRecord evt)
        {
            _logger.LogInformation($"Proyectando order.details_updated para {evt.AggregateId}");
            
            // Aquí podrías mantener un log de auditoría de cambios
            var payload = JsonSerializer.Deserialize<JsonElement>(evt.Payload);
            
            if (payload.TryGetProperty("changes", out var changes))
            {
                _logger.LogInformation($"Cambios registrados en orden {evt.AggregateId}: {changes}");
            }

            await Task.CompletedTask;
        }

        private async Task HandleOrderDeleted(AppDbContext db, Models.EventRecord evt)
        {
            _logger.LogInformation($"Proyectando order.deleted para {evt.AggregateId}");
            
            // Aquí podrías archivar datos, actualizar reportes, etc.
            var payload = JsonSerializer.Deserialize<JsonElement>(evt.Payload);
            
            if (payload.TryGetProperty("QrCode", out var qrCode))
            {
                _logger.LogInformation($"Orden con QR {qrCode.GetString()} eliminada");
            }

            await Task.CompletedTask;
        }

        private async Task HandleOrderQrScanned(AppDbContext db, Models.EventRecord evt)
        {
            _logger.LogInformation($"Proyectando order.qr_scanned para {evt.AggregateId}");
            
            // Aquí podrías actualizar contadores de escaneos, ubicaciones, etc.
            var payload = JsonSerializer.Deserialize<JsonElement>(evt.Payload);
            
            if (payload.TryGetProperty("scannedBy", out var scannedBy))
            {
                _logger.LogInformation($"QR escaneado por {scannedBy.GetString()}");
            }

            await Task.CompletedTask;
        }
    }
}
