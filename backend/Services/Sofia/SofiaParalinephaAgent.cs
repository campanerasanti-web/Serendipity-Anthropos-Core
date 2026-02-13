using System;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ElMediadorDeSofia.Services.Sofia
{
    /// <summary>
    /// PARALINFA AGENT - Sistema autónomo de monitoreo de FRECUENCIA
    /// Detecta el pulso del sistema: latencia, throughput, CPU, memoria
    /// Frecuencia: Lectura cada 500ms
    /// </summary>
    public class SofiaParalinephaAgent
    {
        private readonly ILogger<SofiaParalinephaAgent> _logger;
        private readonly Process _currentProcess = Process.GetCurrentProcess();
        private int _pulseCount = 0;
        private double _averageLatency = 0;
        private int _requestsPerSecond = 0;

        // Umbrales
        private const int NORMAL_LATENCY = 100;      // ms
        private const int WARNING_LATENCY = 500;     // ms
        private const int CRITICAL_LATENCY = 1000;   // ms

        private const int NORMAL_CPU = 70;           // %
        private const int WARNING_CPU = 85;          // %
        private const int CRITICAL_CPU = 95;         // %

        public SofiaParalinephaAgent(ILogger<SofiaParalinephaAgent> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Lee el pulso del sistema (frecuencia actual)
        /// </summary>
        public async Task<FrequencyMetrics> ReadPulseAsync()
        {
            _pulseCount++;

            var cpuUsage = GetCpuUsagePercent();
            var memoryUsage = GetMemoryUsagePercent();
            var latency = _averageLatency;
            var rps = _requestsPerSecond;

            var health = DetermineHealth(cpuUsage, latency);

            var metrics = new FrequencyMetrics
            {
                PulseNumber = _pulseCount,
                Timestamp = DateTime.UtcNow,
                CpuUsagePercent = cpuUsage,
                MemoryUsagePercent = memoryUsage,
                AverageLatencyMs = latency,
                RequestsPerSecond = rps,
                Health = health,
                Status = GetStatusEmoji(health)
            };

            _logger.LogInformation(
                "🫀 PARALINFA PULSE #{Pulse}: CPU={Cpu}% MEM={Mem}% LAT={Lat}ms RPS={Rps} [{Health}]",
                _pulseCount, Math.Round(cpuUsage, 1), Math.Round(memoryUsage, 1),
                Math.Round(latency, 0), rps, metrics.Status
            );

            return metrics;
        }

        /// <summary>
        /// Monitorea frecuencia durante operación
        /// </summary>
        public async Task MonitorFrequencyAsync(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                var metrics = await ReadPulseAsync();

                // Alerta si es anormal
                if (metrics.Health == FrequencyHealth.Critical)
                {
                    _logger.LogError(
                        "🚨 PARALINFA CRÍTICA: Frecuencia crítica detectada. CPU={Cpu}% LAT={Lat}ms",
                        Math.Round(metrics.CpuUsagePercent, 1),
                        Math.Round(metrics.AverageLatencyMs, 0)
                    );
                    // Aquí podría activarse un circuit breaker
                }
                else if (metrics.Health == FrequencyHealth.Warning)
                {
                    _logger.LogWarning(
                        "⚠️ PARALINFA ADVIERTE: Frecuencia elevada (pero estable)"
                    );
                }

                await Task.Delay(500, cancellationToken); // Lectura cada 500ms
            }
        }

        /// <summary>
        /// Determina la salud basada en frecuencia
        /// </summary>
        private FrequencyHealth DetermineHealth(double cpu, double latency)
        {
            if (cpu > CRITICAL_CPU || latency > CRITICAL_LATENCY)
                return FrequencyHealth.Critical;
            else if (cpu > WARNING_CPU || latency > WARNING_LATENCY)
                return FrequencyHealth.Warning;
            else
                return FrequencyHealth.Normal;
        }

        /// <summary>
        /// Obtiene uso de CPU actual
        /// </summary>
        private double GetCpuUsagePercent()
        {
            try
            {
                var cpuCounter = new PerformanceCounter("Processor", "% Processor Time", "_Total");
                cpuCounter.NextValue();
                return cpuCounter.NextValue();
            }
            catch
            {
                return 0; // Fallback si no está disponible
            }
        }

        /// <summary>
        /// Obtiene uso de Memoria actual
        /// </summary>
        private double GetMemoryUsagePercent()
        {
            var totalMemory = GC.GetTotalMemory(false);
            var workingSet = _currentProcess.WorkingSet64;
            return (double)workingSet / (1024 * 1024 * 1024) * 100; // Convertir a %
        }

        private string GetStatusEmoji(FrequencyHealth health)
        {
            return health switch
            {
                FrequencyHealth.Normal => "🟢 NORMAL",
                FrequencyHealth.Warning => "🟡 WARNING",
                FrequencyHealth.Critical => "🔴 CRITICAL",
                _ => "⚪ UNKNOWN"
            };
        }
    }

    /// <summary>
    /// Métricas de frecuencia del sistema
    /// </summary>
    public class FrequencyMetrics
    {
        public int PulseNumber { get; set; }
        public DateTime Timestamp { get; set; }
        public double CpuUsagePercent { get; set; }
        public double MemoryUsagePercent { get; set; }
        public double AverageLatencyMs { get; set; }
        public int RequestsPerSecond { get; set; }
        public FrequencyHealth Health { get; set; }
        public string Status { get; set; }
    }

    public enum FrequencyHealth
    {
        Normal = 0,
        Warning = 1,
        Critical = 2
    }
}
