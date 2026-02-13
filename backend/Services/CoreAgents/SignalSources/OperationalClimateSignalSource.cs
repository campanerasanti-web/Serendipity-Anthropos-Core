using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace ElMediadorDeSofia.Services.CoreAgents.SignalSources
{
    /// <summary>
    /// Captura señales del clima operativo desde un archivo JSON.
    /// Simula lecturas de sensores o métricas externas.
    /// </summary>
    public class OperationalClimateSignalSource : ISelfSignalSource
    {
        private readonly ILogger<OperationalClimateSignalSource> _logger;
        private readonly string _climateFile = "self/climate-sensor.json";

        public OperationalClimateSignalSource(ILogger<OperationalClimateSignalSource> logger)
        {
            _logger = logger;
        }

        public async Task<SelfSignal> CaptureAsync()
        {
            var signal = new SelfSignal
            {
                Timestamp = DateTime.UtcNow,
                Source = "operational-climate",
                Mode = "harmonize"
            };

            try
            {
                // Ensure climate file exists with seed data
                if (!File.Exists(_climateFile))
                {
                    await CreateDefaultClimateFile();
                }

                var json = await File.ReadAllTextAsync(_climateFile);
                using var doc = JsonDocument.Parse(json);
                var root = doc.RootElement;

                // Extract metrics
                if (root.TryGetProperty("temperature", out var tempElem))
                    signal.Context["temperature"] = tempElem.GetDouble();

                if (root.TryGetProperty("humidity", out var humidityElem))
                    signal.Context["humidity"] = humidityElem.GetDouble();

                if (root.TryGetProperty("pressure", out var pressureElem))
                    signal.Context["pressure"] = pressureElem.GetString();

                if (root.TryGetProperty("wind_speed", out var windElem))
                    signal.Context["wind_speed"] = windElem.GetDouble();

                if (root.TryGetProperty("rainfall", out var rainElem))
                    signal.Context["rainfall"] = rainElem.GetDouble();

                if (root.TryGetProperty("alerts", out var alertsElem))
                {
                    var alerts = new List<string>();
                    foreach (var alert in alertsElem.EnumerateArray())
                    {
                        alerts.Add(alert.GetString() ?? "unknown");
                    }
                    signal.Context["alerts"] = alerts;
                }

                _logger.LogInformation("✅ OperationalClimateSignal capturada desde {File}", _climateFile);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Error leyendo climate sensor");
                signal.Context["error"] = ex.Message;
            }

            return signal;
        }

        private async Task CreateDefaultClimateFile()
        {
            try
            {
                Directory.CreateDirectory(Path.GetDirectoryName(_climateFile)!);

                var defaultClimate = new
                {
                    timestamp = DateTime.UtcNow.ToString("o"),
                    temperature = 22.5,
                    humidity = 45.0,
                    pressure = "normal",
                    wind_speed = 0.0,
                    rainfall = 0.0,
                    alerts = new string[] { }
                };

                var json = JsonSerializer.Serialize(defaultClimate, new JsonSerializerOptions { WriteIndented = true });
                await File.WriteAllTextAsync(_climateFile, json);

                _logger.LogInformation("✅ Archivo de clima creado en {Path}", _climateFile);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Error creando archivo de clima");
            }
        }
    }
}
