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
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<EventProcessorWorker> _logger;

        public EventProcessorWorker(IServiceScopeFactory scopeFactory, ILogger<EventProcessorWorker> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("EventProcessorWorker started");

            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _scopeFactory.CreateScope();
                var _events = scope.ServiceProvider.GetRequiredService<EventService>();
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
                        _logger.LogInformation("Processing event {EventType} for {AggregateType}:{AggregateId}", ev.EventType, ev.AggregateType, ev.AggregateId);
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
