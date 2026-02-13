using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace ElMediadorDeSofia.Services.CoreAgents.SignalSources
{
    /// <summary>
    /// Captura señales básicas de salud del sistema:
    /// - Memory usage
    /// - Process count
    /// - Thread count
    /// </summary>
    public class SystemHealthSignalSource : ISelfSignalSource
    {
        private readonly ILogger<SystemHealthSignalSource> _logger;

        public SystemHealthSignalSource(ILogger<SystemHealthSignalSource> logger)
        {
            _logger = logger;
        }

        public async Task<SelfSignal> CaptureAsync()
        {
            return await Task.Run(() =>
            {
                var signal = new SelfSignal
                {
                    Timestamp = DateTime.UtcNow,
                    Source = "system-health",
                    Mode = "audit"
                };

                try
                {
                    // Memory Usage (managed heap only)
                    var memUsage = GC.GetTotalMemory(false) / (1024.0 * 1024.0); // MB
                    signal.Context["memory_mb"] = Math.Round(memUsage, 2);

                    // Memory status
                    signal.Context["memory_status"] = memUsage > 1000 ? "high" : "normal";

                    // Process and Thread count
                    var currentProcess = System.Diagnostics.Process.GetCurrentProcess();
                    signal.Context["thread_count"] = currentProcess.Threads.Count;
                    signal.Context["working_set_mb"] = Math.Round(currentProcess.WorkingSet64 / (1024.0 * 1024.0), 2);
                    signal.Context["process_id"] = currentProcess.Id;

                    // Overall Health
                    var health = DetermineHealth(memUsage);
                    signal.Context["health_status"] = health;

                    _logger.LogInformation("✅ SystemHealthSignal capturada: MEM={Mem}MB, Health={Health}",
                        Math.Round(memUsage, 1), health);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "⚠️ Error capturando SystemHealthSignal");
                    signal.Context["error"] = ex.Message;
                    signal.Context["health_status"] = "unknown";
                }

                return signal;
            });
        }

        private string DetermineHealth(double memoryMb)
        {
            if (memoryMb > 2000)
                return "critical";
            if (memoryMb > 1500)
                return "warning";
            if (memoryMb > 1000)
                return "elevated";
            return "healthy";
        }
    }
}
