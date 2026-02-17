
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace ElMediadorDeSofia.Services
{
    /// <summary>
    /// Despachador de eventos central para el sistema
    /// Coordina la emisión de eventos desde todos los servicios
    /// </summary>
    public class EventDispatcher
    {
        private readonly ILogger<EventDispatcher> _logger;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly List<Func<object, Task>> _subscribers = new();
        private readonly object _syncRoot = new();

        public EventDispatcher(ILogger<EventDispatcher> logger, IServiceScopeFactory scopeFactory)
        {
            _logger = logger;
            _scopeFactory = scopeFactory;
        }

        /// <summary>
        /// Se suscribe a eventos
        /// </summary>
        public Action Subscribe(Func<object, Task> handler)
        {
            lock (_syncRoot)
            {
                _subscribers.Add(handler);
                _logger.LogInformation("Event subscriber registered. Total subscribers: {count}", _subscribers.Count);
            }

            return () =>
            {
                lock (_syncRoot)
                {
                    _subscribers.Remove(handler);
                    _logger.LogInformation("Event subscriber removed. Total subscribers: {count}", _subscribers.Count);
                }
            };
        }

        /// <summary>
        /// Publica un evento a todos los suscriptores
        /// </summary>
        public async Task PublishAsync(string eventType, object payload)
        {


            var payloadJson = System.Text.Json.JsonSerializer.Serialize(payload);
            var eventRecord = new EventRecord
            {
                Id = Guid.NewGuid(),
                AggregateType = "Generic", // Ajustar según el contexto si es necesario
                EventType = eventType,
                Timestamp = DateTime.UtcNow,
                Payload = payloadJson
            };

            using (var scope = _scopeFactory.CreateScope())
            {
                var _context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                _context.EventRecords.Add(eventRecord);
                await _context.SaveChangesAsync();
            }

            _logger.LogInformation("Publishing event: {eventType}", eventType);

            List<Func<object, Task>> subscribersSnapshot;
            lock (_syncRoot)
            {
                subscribersSnapshot = _subscribers.ToList();
            }

            var tasks = new List<Task>();
            foreach (var subscriber in subscribersSnapshot)
            {
                tasks.Add(subscriber(eventRecord));
            }

            await Task.WhenAll(tasks);
        }

        /// <summary>
        /// Publica evento de TET readiness actualizado
        /// </summary>
        public async Task PublishTETReadinessUpdateAsync(string email, int newScore, string status)
        {
            await PublishAsync("tet.readiness.updated", new { Email = email, Score = newScore, Status = status });
        }

        /// <summary>
        /// Publica evento de paz interior actualizada
        /// </summary>
        public async Task PublishPazInteriorUpdateAsync(string email, int score)
        {
            await PublishAsync("wellbeing.paz_interior.updated", new { Email = email, Score = score });
        }

        /// <summary>
        /// Publica evento de TCM snapshot
        /// </summary>
        public async Task PublishTCMSnapshotAsync(string email, int qiScore)
        {
            await PublishAsync("tcm.snapshot.created", new { Email = email, QiScore = qiScore });
        }

        /// <summary>
        /// Publica evento de orden creada
        /// </summary>
        public async Task PublishOrderCreatedAsync(Guid orderId, string qrCode, string customer)
        {
            await PublishAsync("order.created", new { OrderId = orderId, QrCode = qrCode, Customer = customer });
        }

        /// <summary>
        /// Publica evento de estado de orden cambiado
        /// </summary>
        public async Task PublishOrderStatusChangedAsync(Guid orderId, string previousStatus, string newStatus)
        {
            await PublishAsync("order.status_changed", new { OrderId = orderId, PreviousStatus = previousStatus, NewStatus = newStatus });
        }
    }
}
