using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ElMediadorDeSofia.Services.CoreAgents
{
    /// <summary>
    /// Ejecuta el ciclo Sabbath (Séptimo Día) automáticamente cada noche a las 02:00 AM UTC.
    /// También permite invocación manual vía inyección de dependencias.
    /// </summary>
    public class SelfGardenerHostedService : IHostedService
    {
        private readonly ILogger<SelfGardenerHostedService> _logger;
        private readonly SelfGardenerCore _core;
        private Timer? _timer;
        private readonly TimeSpan _scheduledTime = new(2, 0, 0); // 02:00 AM UTC

        public SelfGardenerHostedService(
            ILogger<SelfGardenerHostedService> logger,
            SelfGardenerCore core)
        {
            _logger = logger;
            _core = core;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("🕊️ SelfGardenerHostedService iniciando (Séptimo Día)");

            // Calcular tiempo hasta la siguiente ejecución (02:00 AM)
            var now = DateTime.UtcNow;
            var scheduledToday = now.Date.Add(_scheduledTime);

            TimeSpan timeUntilExecution;
            if (now < scheduledToday)
            {
                // Todavía no ha pasado las 02:00 AM de hoy
                timeUntilExecution = scheduledToday - now;
            }
            else
            {
                // Ya pasaron las 02:00 AM, ejecutar mañana
                timeUntilExecution = scheduledToday.AddDays(1) - now;
            }

            _logger.LogInformation("⏰ Próxima ejecución del Sabbath en {Minutes} minutos", timeUntilExecution.TotalMinutes);

            // Crear timer que ejecute cada 24 horas
            _timer = new Timer(
                async _ => await ExecuteSabbathCycleAsync(),
                null,
                timeUntilExecution,
                TimeSpan.FromHours(24) // Ejecutar cada 24 horas después
            );

            await Task.CompletedTask;
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("🕊️ SelfGardenerHostedService deteniendo");
            _timer?.Dispose();
            await Task.CompletedTask;
        }

        /// <summary>
        /// Ejecuta el ciclo Sabbath manual o automáticamente
        /// </summary>
        public async Task ExecuteSabbathCycleAsync()
        {
            try
            {
                _logger.LogInformation("🕊️ ► Iniciando ciclo Sabbath (Séptimo Día)");
                await _core.RunSabbathCycleAsync("harmonize");
                _logger.LogInformation("🕊️ ◄ Ciclo Sabbath completado");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error en ciclo Sabbath");
            }
        }
    }
}
