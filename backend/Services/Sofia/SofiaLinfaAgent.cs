using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ElMediadorDeSofia.Services.Sofia
{
    /// <summary>
    /// LINFA AGENT - Sistema autónomo de monitoreo de RITMO
    /// Detecta el ritmo del sistema: ciclos, cadencia, sincronización
    /// Frecuencia: Lectura cada 60 segundos
    /// </summary>
    public class SofiaLinfaAgent
    {
        private readonly ILogger<SofiaLinfaAgent> _logger;
        private int _rhythmCount = 0;
        private List<RhythmCycle> _cycles = new();

        // Configuración circadiana (24h)
        private readonly Dictionary<(int, int), CircadianPhase> _circadianSchedule = new()
        {
            { (0, 3), CircadianPhase.DeepMaintenance },    // 00:00-03:00
            { (3, 6), CircadianPhase.Regeneration },       // 03:00-06:00
            { (6, 9), CircadianPhase.Awakening },          // 06:00-09:00
            { (9, 18), CircadianPhase.FullOperation },     // 09:00-18:00
            { (18, 24), CircadianPhase.NocturneMonitoring } // 18:00-24:00
        };

        public SofiaLinfaAgent(ILogger<SofiaLinfaAgent> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Lee el ritmo del sistema
        /// </summary>
        public async Task<RhythmMetrics> ReadRhythmAsync()
        {
            _rhythmCount++;

            var phase = GetCurrentCircadianPhase();
            var cycleTime = CalculateAverageCycleTime();
            var successRate = CalculateSuccessRate();
            var health = DetermineRhythmHealth(successRate, cycleTime);

            var metrics = new RhythmMetrics
            {
                RhythmNumber = _rhythmCount,
                Timestamp = DateTime.UtcNow,
                CircadianPhase = phase,
                AverageCycleTimeMin = cycleTime,
                SuccessRatePercent = successRate,
                Health = health,
                Status = GetStatusEmoji(health)
            };

            _logger.LogInformation(
                "🫀 LINFA RHYTHM #{Rhythm}: Phase={Phase} CycleTime={Cycle}min Success={Success}% [{Health}]",
                _rhythmCount, phase, Math.Round(cycleTime, 1), 
                Math.Round(successRate, 1), metrics.Status
            );

            return metrics;
        }

        /// <summary>
        /// Monitorea ritmo durante operación continua
        /// </summary>
        public async Task MonitorRhythmAsync(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                var metrics = await ReadRhythmAsync();

                // Alerta si el ritmo es irregular
                if (metrics.Health == RhythmHealth.Arrhythmia)
                {
                    _logger.LogError(
                        "🚨 LINFA ARRITMIA: Ritmo irregular detectado. Phase={Phase} Success={Success}%",
                        metrics.CircadianPhase, Math.Round(metrics.SuccessRatePercent, 1)
                    );
                    // Aquí podría activarse compensación automática
                }
                else if (metrics.Health == RhythmHealth.Irregular)
                {
                    _logger.LogWarning(
                        "⚠️ LINFA ADVIERTE: Ritmo levemente irregular (monitorear)"
                    );
                }

                await Task.Delay(60000, cancellationToken); // Lectura cada 60 segundos
            }
        }

        /// <summary>
        /// Registra un ciclo completado (job, deployment, etc)
        /// </summary>
        public void RegisterCycle(string jobName, bool success, double durationMinutes)
        {
            _cycles.Add(new RhythmCycle
            {
                JobName = jobName,
                Success = success,
                DurationMinutes = durationMinutes,
                Timestamp = DateTime.UtcNow
            });

            // Mantener solo últimos 1000 ciclos
            if (_cycles.Count > 1000)
                _cycles.RemoveAt(0);
        }

        /// <summary>
        /// Obtiene la fase circadiana actual
        /// </summary>
        public CircadianPhase GetCurrentCircadianPhase()
        {
            var hour = DateTime.Now.Hour;

            return hour switch
            {
                >= 0 and < 3 => CircadianPhase.DeepMaintenance,
                >= 3 and < 6 => CircadianPhase.Regeneration,
                >= 6 and < 9 => CircadianPhase.Awakening,
                >= 9 and < 18 => CircadianPhase.FullOperation,
                >= 18 and < 24 => CircadianPhase.NocturneMonitoring,
                _ => CircadianPhase.FullOperation
            };
        }

        /// <summary>
        /// Calcula tiempo promedio de ciclo
        /// </summary>
        private double CalculateAverageCycleTime()
        {
            if (_cycles.Count == 0) return 0;
            return _cycles.TakeLast(100).Average(c => c.DurationMinutes);
        }

        /// <summary>
        /// Calcula tasa de éxito reciente
        /// </summary>
        private double CalculateSuccessRate()
        {
            if (_cycles.Count == 0) return 100;
            var recentCycles = _cycles.TakeLast(100);
            var successCount = recentCycles.Count(c => c.Success);
            return (successCount / (double)recentCycles.Count()) * 100;
        }

        /// <summary>
        /// Determina salud del ritmo
        /// </summary>
        private RhythmHealth DetermineRhythmHealth(double successRate, double cycleTime)
        {
            if (successRate < 85 || cycleTime > 30)
                return RhythmHealth.Arrhythmia;
            else if (successRate < 90 || cycleTime > 20)
                return RhythmHealth.Irregular;
            else
                return RhythmHealth.Healthy;
        }

        private string GetStatusEmoji(RhythmHealth health)
        {
            return health switch
            {
                RhythmHealth.Healthy => "🟢 SALUDABLE",
                RhythmHealth.Irregular => "🟡 IRREGULAR",
                RhythmHealth.Arrhythmia => "🔴 ARRITMIA",
                _ => "⚪ DESCONOCIDO"
            };
        }
    }

    /// <summary>
    /// Métricas de ritmo del sistema
    /// </summary>
    public class RhythmMetrics
    {
        public int RhythmNumber { get; set; }
        public DateTime Timestamp { get; set; }
        public CircadianPhase CircadianPhase { get; set; }
        public double AverageCycleTimeMin { get; set; }
        public double SuccessRatePercent { get; set; }
        public RhythmHealth Health { get; set; }
        public string Status { get; set; }
    }

    /// <summary>
    /// Ciclo de ritmo (job, task, etc)
    /// </summary>
    public class RhythmCycle
    {
        public string JobName { get; set; }
        public bool Success { get; set; }
        public double DurationMinutes { get; set; }
        public DateTime Timestamp { get; set; }
    }

    public enum CircadianPhase
    {
        DeepMaintenance = 0,    // 00:00-03:00 :: Backups, security scans
        Regeneration = 1,        // 03:00-06:00 :: Optimization, cache cleanup
        Awakening = 2,           // 06:00-09:00 :: Health checks, test runs
        FullOperation = 3,       // 09:00-18:00 :: Normal operations
        NocturneMonitoring = 4   // 18:00-24:00 :: Passive monitoring, alerting
    }

    public enum RhythmHealth
    {
        Healthy = 0,
        Irregular = 1,
        Arrhythmia = 2
    }
}
