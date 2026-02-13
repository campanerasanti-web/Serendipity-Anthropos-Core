using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ElMediadorDeSofia.Services.SecurityAgents
{
    /// <summary>
    /// Servicio alojado que ejecuta SecurityGardener una vez por noche
    /// Horario: 22:00 UTC (por defecto) - configurable
    /// También puede ejecutarse manualmente por demanda
    /// </summary>
    public class SecurityGardenerHostedService : BackgroundService
    {
        private readonly ILogger<SecurityGardenerHostedService> _logger;
        private readonly IServiceProvider _serviceProvider;
        private readonly TimeSpan _executionTime;
        private Timer? _timer;

        /// <summary>
        /// Inicializa el servicio
        /// executionTime: Hora del día en que ejecutar (default: 22:00 = 10 PM UTC)
        /// </summary>
        public SecurityGardenerHostedService(
            ILogger<SecurityGardenerHostedService> logger,
            IServiceProvider serviceProvider,
            TimeSpan? executionTime = null)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
            _executionTime = executionTime ?? TimeSpan.Parse("22:00"); // Default: 10 PM UTC
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("🛡️ SecurityGardenerHostedService iniciado. Ejecutará diariamente a {Time} UTC", _executionTime);

            // Calcular tiempo hasta la próxima ejecución
            var now = DateTime.UtcNow;
            var scheduledTime = now.Date.Add(_executionTime);

            // Si ya pasó la hora hoy, programar para mañana
            if (now > scheduledTime)
            {
                scheduledTime = scheduledTime.AddDays(1);
            }

            var timeUntilExecution = scheduledTime - now;

            _logger.LogInformation("⏰ Próxima ejecución: {ScheduledTime} (en {Minutes} minutos)", 
                scheduledTime, timeUntilExecution.TotalMinutes);

            // Programar ejecución diaria
            _timer = new Timer(
                async (state) => await ExecuteSecurityAuditAsync(stoppingToken),
                null,
                timeUntilExecution,
                TimeSpan.FromHours(24)); // Repetir cada 24 horas

            // Esperar a que se cancele el servicio
            await Task.Delay(Timeout.Infinite, stoppingToken);
        }

        /// <summary>
        /// Ejecuta la auditoría de seguridad
        /// Puede ser llamada por el timer o manualmente
        /// </summary>
        public async Task ExecuteSecurityAuditAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                _logger.LogInformation("🛡️ Iniciando auditoría nocturna de seguridad...");

                // Crear scope para obtener servicios
                using (var scope = _serviceProvider.CreateScope())
                {
                    var agent = scope.ServiceProvider.GetRequiredService<SecurityGardenerAgent>();
                    var result = await agent.RunAsync();

                    _logger.LogInformation(@"
╔══════════════════════════════════════════════════════════════╗
║         🛡️ AUDITORÍA NOCTURNA - {time}                       ║
╚══════════════════════════════════════════════════════════════╝

  Reglas Evaluadas: {RulesEvaluated}
  Tareas Ejecutadas: {TasksExecuted}
  Problemas Críticos: {Critical}
  Advertencias: {Warnings}
  Estado: {Climate}

════════════════════════════════════════════════════════════════
", DateTime.UtcNow.ToString("HH:mm:ss"), result.RulesEvaluated, result.TasksExecuted, result.CriticalIssuesFound, result.WarningsFound, result.Climate);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error en auditoría nocturna de seguridad");
            }
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("🛡️ Deteniendo SecurityGardenerHostedService...");
            _timer?.Dispose();
            await base.StopAsync(cancellationToken);
        }
    }
}
