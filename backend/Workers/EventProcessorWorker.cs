using System;
using System.Threading;
using System.Threading.Tasks;
using ElMediadorDeSofia.Data;
using ElMediadorDeSofia.Services;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ElMediadorDeSofia.Workers
{
    public class EventProcessorWorker : BackgroundService
    {
        private readonly EventService _events;
        private readonly AppDbContext _db;
        private readonly ILogger<EventProcessorWorker> _logger;

        public EventProcessorWorker(EventService events, AppDbContext db, ILogger<EventProcessorWorker> logger)
        {
            _events = events;
            _db = db;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("EventProcessorWorker started");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var batch = await _events.GetUnprocessedEventsAsync(100);
                    if (batch.Count == 0)
                    {
                        await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
                        continue;
                    }

                    foreach (var ev in batch)
                    {
                        // Simple processing: for demo, just mark processed and log
                        _logger.LogInformation("Processing event {EventType} for {AggregateType}:{AggregateId}", ev.EventType, ev.AggregateType, ev.AggregateId);

                        // In a real system, you would update denormalized read models here
                        ev.Processed = true;
                        ev.ProcessedAt = DateTime.UtcNow;

                        await _events.MarkProcessedAsync(ev);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing events");
                    await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
                }
            }

            _logger.LogInformation("EventProcessorWorker stopping");
        }
    }
}
