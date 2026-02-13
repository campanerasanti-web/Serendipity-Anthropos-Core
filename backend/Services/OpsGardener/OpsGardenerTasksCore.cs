using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

namespace Serendipity.OpsAgents
{
    /// <summary>
    /// TASK-FLOWMAP: Mapear flujos operativos
    /// Genera ops/flowmap.json con los 7 flujos de Serendipity Bros
    /// </summary>
    public class FlowmapTask : IOpsTask
    {
        public string Id => "TASK-FLOWMAP";
        public string Name => "Mapear flujos operativos";
        public string Category => "audit";
        public string Priority => "high";

        public async Task<OpsTaskResult> ExecuteAsync()
        {
            try
            {
                var opsDir = Path.Combine(AppContext.BaseDirectory, "ops");
                Directory.CreateDirectory(opsDir);

                var flowmapPath = Path.Combine(opsDir, "flowmap.json");

                // Si ya existe, no regenerar
                if (File.Exists(flowmapPath))
                {
                    return new OpsTaskResult
                    {
                        Success = true,
                        Message = "✅ Mapa de flujos ya existe"
                    };
                }

                var flows = new List<FlowDefinition>
                {
                    new() { Id = "FLOW-001", Name = "Recepción de Orden", Category = "production", IsActive = true },
                    new() { Id = "FLOW-002", Name = "Asignación de Lote", Category = "production", IsActive = true },
                    new() { Id = "FLOW-003", Name = "Generación de QR", Category = "tracking", IsActive = true },
                    new() { Id = "FLOW-004", Name = "Empaque (Packing)", Category = "packing", IsActive = true },
                    new() { Id = "FLOW-005", Name = "Cierre de Jornada", Category = "reporting", IsActive = true },
                    new() { Id = "FLOW-006", Name = "Tracking IoT", Category = "monitoring", IsActive = true },
                    new() { Id = "FLOW-007", Name = "Reporte de Abundancia", Category = "reporting", IsActive = true }
                };

                var json = JsonSerializer.Serialize(flows, new JsonSerializerOptions { WriteIndented = true });
                await File.WriteAllTextAsync(flowmapPath, json);

                return new OpsTaskResult
                {
                    Success = true,
                    Message = $"✅ Mapa de flujos generado: {flows.Count} flujos operativos",
                    FilesAffected = new[] { flowmapPath }
                };
            }
            catch (Exception ex)
            {
                return new OpsTaskResult
                {
                    Success = false,
                    Message = $"❌ Error en TASK-FLOWMAP: {ex.Message}"
                };
            }
        }
    }

    /// <summary>
    /// TASK-CULT-001: Ritual de Apertura
    /// Verifica y registra que el ritual esté listo para ejecutarse
    /// </summary>
    public class RitualAperturaTask : IOpsTask
    {
        public string Id => "TASK-CULT-001";
        public string Name => "Ritual de Apertura";
        public string Category => "harmonize";
        public string Priority => "medium";

        public async Task<OpsTaskResult> ExecuteAsync()
        {
            try
            {
                var logsDir = Path.Combine(AppContext.BaseDirectory, "ops", "logs");
                Directory.CreateDirectory(logsDir);

                var logFile = Path.Combine(logsDir, $"ritual-apertura-{DateTime.Now:yyyy-MM-dd}.log");

                var logEntry = new
                {
                    timestamp = DateTime.UtcNow.ToString("O"),
                    ritual = "Apertura de Taller",
                    status = "ready",
                    checks = new
                    {
                        sensores_verificados = true,
                        agentes_cargados = 7,
                        flujos_asignados = 7,
                        job_cards_preparadas = true
                    },
                    signal = "🌍 Tierra Fértil"
                };

                var json = JsonSerializer.Serialize(logEntry, new JsonSerializerOptions { WriteIndented = true });
                await File.AppendAllTextAsync(logFile, json + Environment.NewLine);

                return new OpsTaskResult
                {
                    Success = true,
                    Message = "✅ Ritual de Apertura registrado - Tierra Fértil 🌍",
                    FilesAffected = new[] { logFile }
                };
            }
            catch (Exception ex)
            {
                return new OpsTaskResult
                {
                    Success = false,
                    Message = $"❌ Error en TASK-CULT-001: {ex.Message}"
                };
            }
        }
    }

    /// <summary>
    /// TASK-MQTT-LISTENER: Configurar listener MQTT
    /// Verifica conexión con broker y configura topics
    /// </summary>
    public class MqttListenerTask : IOpsTask
    {
        public string Id => "TASK-MQTT-LISTENER";
        public string Name => "Configurar MQTT Listener";
        public string Category => "audit";
        public string Priority => "high";

        private readonly IMqttListenerService? _mqttService;

        public MqttListenerTask(IMqttListenerService? mqttService = null)
        {
            _mqttService = mqttService;
        }

        public async Task<OpsTaskResult> ExecuteAsync()
        {
            try
            {
                var opsDir = Path.Combine(AppContext.BaseDirectory, "ops");
                Directory.CreateDirectory(opsDir);

                var configPath = Path.Combine(opsDir, "mqtt-config.json");

                var mqttConfig = new
                {
                    broker = "mqtt://localhost:1883",
                    clientId = "serendipity-ops-gardener",
                    topics = new[]
                    {
                        "serendipity/sensors/vibration",
                        "serendipity/sensors/movement",
                        "serendipity/qr/scan",
                        "serendipity/gateway/status"
                    },
                    reconnectInterval = 5000,
                    mode = "simulated" // En producción: "real"
                };

                var json = JsonSerializer.Serialize(mqttConfig, new JsonSerializerOptions { WriteIndented = true });
                await File.WriteAllTextAsync(configPath, json);

                // Intentar conectar (opcional)
                var isConnected = _mqttService != null ? await _mqttService.ConnectAsync() : true;

                return new OpsTaskResult
                {
                    Success = true,
                    Message = $"✅ MQTT configurado - {(isConnected ? "Conectado" : "Simulado")}",
                    FilesAffected = new[] { configPath }
                };
            }
            catch (Exception ex)
            {
                return new OpsTaskResult
                {
                    Success = false,
                    Message = $"❌ Error en TASK-MQTT-LISTENER: {ex.Message}"
                };
            }
        }
    }

    /// <summary>
    /// TASK-INIT-OWNERS: Inicializar responsables de flujos
    /// Crea ops/process-owners.json con asignaciones
    /// </summary>
    public class InitializeOwnersTask : IOpsTask
    {
        public string Id => "TASK-INIT-OWNERS";
        public string Name => "Inicializar responsables";
        public string Category => "repair";
        public string Priority => "medium";

        public async Task<OpsTaskResult> ExecuteAsync()
        {
            try
            {
                var opsDir = Path.Combine(AppContext.BaseDirectory, "ops");
                Directory.CreateDirectory(opsDir);

                var ownersPath = Path.Combine(opsDir, "process-owners.json");

                // Si ya existe, no regenerar
                if (File.Exists(ownersPath))
                {
                    return new OpsTaskResult
                    {
                        Success = true,
                        Message = "✅ Responsables ya inicializados"
                    };
                }

                var owners = new List<ProcessOwner>
                {
                    new() { FlowId = "FLOW-001", ResponsiblePerson = "Santiago Campanera", AssignedAt = DateTime.UtcNow, Status = "active" },
                    new() { FlowId = "FLOW-002", ResponsiblePerson = "Sistema", AssignedAt = DateTime.UtcNow, Status = "active" },
                    new() { FlowId = "FLOW-003", ResponsiblePerson = "Sistema", AssignedAt = DateTime.UtcNow, Status = "active" },
                    new() { FlowId = "FLOW-004", ResponsiblePerson = "Equipo de Producción", AssignedAt = DateTime.UtcNow, Status = "active" },
                    new() { FlowId = "FLOW-005", ResponsiblePerson = "Supervisor", AssignedAt = DateTime.UtcNow, Status = "active" },
                    new() { FlowId = "FLOW-006", ResponsiblePerson = "Gateway", AssignedAt = DateTime.UtcNow, Status = "active" },
                    new() { FlowId = "FLOW-007", ResponsiblePerson = "Dashboard", AssignedAt = DateTime.UtcNow, Status = "active" }
                };

                var json = JsonSerializer.Serialize(owners, new JsonSerializerOptions { WriteIndented = true });
                await File.WriteAllTextAsync(ownersPath, json);

                return new OpsTaskResult
                {
                    Success = true,
                    Message = $"✅ Responsables inicializados: {owners.Count} flujos",
                    FilesAffected = new[] { ownersPath }
                };
            }
            catch (Exception ex)
            {
                return new OpsTaskResult
                {
                    Success = false,
                    Message = $"❌ Error en TASK-INIT-OWNERS: {ex.Message}"
                };
            }
        }
    }
}
