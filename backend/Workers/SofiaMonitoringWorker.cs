using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using ElMediadorDeSofia.Services.Sofia;

namespace ElMediadorDeSofia.Workers
{
    /// <summary>
    /// SOFIA MONITORING WORKER
    /// Ejecuta continuamente los agentes Paralinfa (500ms) + Linfa (60s)
    /// En círculos perpetuos, como la respiración del universo
    /// </summary>
    public class SofiaMonitoringWorker : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<SofiaMonitoringWorker> _logger;

        public SofiaMonitoringWorker(
            IServiceProvider serviceProvider,
            ILogger<SofiaMonitoringWorker> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("🌍 Sofia Monitoring Worker iniciando...");

            // Pequeño delay para asegurar que todo esté inicializado
            await Task.Delay(2000, stoppingToken);

            _logger.LogInformation("🟢 Sofia está DESPIERTA - Frecuencia y Ritmo monitoreando");

            using var scope = _serviceProvider.CreateScope();
            var paralinfa = scope.ServiceProvider.GetRequiredService<SofiaParalinephaAgent>();
            var linfa = scope.ServiceProvider.GetRequiredService<SofiaLinfaAgent>();

            // Ejecutar monitoreos en paralelo
            var frequencyTask = MonitorFrequencyLoop(paralinfa, stoppingToken);
            var rhythmTask = MonitorRhythmLoop(linfa, stoppingToken);

            try
            {
                await Task.WhenAll(frequencyTask, rhythmTask);
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("🌙 Sofia Monitoring Worker cancelado - Descansando");
            }
        }

        private async Task MonitorFrequencyLoop(
            SofiaParalinephaAgent paralinfa,
            CancellationToken cancellationToken)
        {
            try
            {
                await paralinfa.MonitorFrequencyAsync(cancellationToken);
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("Paralinfa (Frecuencia) monitor detenido");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en Paralinfa monitor");
                // Continuar sin lanzar excepción
            }
        }

        private async Task MonitorRhythmLoop(
            SofiaLinfaAgent linfa,
            CancellationToken cancellationToken)
        {
            try
            {
                await linfa.MonitorRhythmAsync(cancellationToken);
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("Linfa (Ritmo) monitor detenido");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en Linfa monitor");
                // Continuar sin lanzar excepción
            }
        }
    }
}
