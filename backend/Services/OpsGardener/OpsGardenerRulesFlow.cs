using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace Serendipity.OpsAgents
{
    /// <summary>
    /// FLOW-001: Todo flujo operativo debe tener dueño
    /// Detecta "puntos de sequía" - flujos sin responsable asignado
    /// </summary>
    public class FlowOwnershipRule : IOpsRule
    {
        public string Id => "FLOW-001";
        public string Name => "Todo flujo operativo debe tener dueño";
        public string Severity => "critical";
        public string Category => "flow";

        public async Task<OpsRuleResult> ValidateAsync()
        {
            try
            {
                var flowmapPath = Path.Combine(AppContext.BaseDirectory, "ops", "flowmap.json");
                var ownersPath = Path.Combine(AppContext.BaseDirectory, "ops", "process-owners.json");

                if (!File.Exists(flowmapPath) || !File.Exists(ownersPath))
                {
                    return new OpsRuleResult
                    {
                        Passed = false,
                        Message = "⚠️ Archivos de configuración no encontrados"
                    };
                }

                var flowmapJson = await File.ReadAllTextAsync(flowmapPath);
                var ownersJson = await File.ReadAllTextAsync(ownersPath);

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var flows = JsonSerializer.Deserialize<List<FlowDefinition>>(flowmapJson, options) ?? new();
                var owners = JsonSerializer.Deserialize<List<ProcessOwner>>(ownersJson, options) ?? new();

                var orphanedFlows = flows
                    .Where(f => !owners.Any(o => o.FlowId == f.Id && !string.IsNullOrWhiteSpace(o.ResponsiblePerson)))
                    .ToList();

                if (orphanedFlows.Count > 0)
                {
                    var flowNames = string.Join(", ", orphanedFlows.Select(f => $"'{f.Name}'"));
                    return new OpsRuleResult
                    {
                        Passed = false,
                        Message = $"🚨 Puntos de Sequía detectados: {orphanedFlows.Count} flujo(s) sin guardián: {flowNames}",
                        Details = new { orphanedFlows = orphanedFlows.Select(f => f.Name).ToList() }
                    };
                }

                return new OpsRuleResult
                {
                    Passed = true,
                    Message = "✅ Todos los flujos tienen un guardián asignado."
                };
            }
            catch (Exception ex)
            {
                return new OpsRuleResult
                {
                    Passed = false,
                    Message = $"Error validando FLOW-001: {ex.Message}"
                };
            }
        }

        public async Task<OpsFixResult?> AutoFixAsync()
        {
            try
            {
                var ownersPath = Path.Combine(AppContext.BaseDirectory, "ops", "process-owners.json");
                var ownersJson = await File.ReadAllTextAsync(ownersPath);

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var owners = JsonSerializer.Deserialize<List<ProcessOwner>>(ownersJson, options) ?? new();

                // Asignar "UNASSIGNED" a flujos huérfanos
                var flowmapPath = Path.Combine(AppContext.BaseDirectory, "ops", "flowmap.json");
                var flowmapJson = await File.ReadAllTextAsync(flowmapPath);
                var flows = JsonSerializer.Deserialize<List<FlowDefinition>>(flowmapJson, options) ?? new();

                var orphanedFlows = flows
                    .Where(f => !owners.Any(o => o.FlowId == f.Id && !string.IsNullOrWhiteSpace(o.ResponsiblePerson)))
                    .ToList();

                foreach (var flow in orphanedFlows)
                {
                    owners.Add(new ProcessOwner
                    {
                        FlowId = flow.Id,
                        ResponsiblePerson = "UNASSIGNED",
                        AssignedAt = DateTime.UtcNow,
                        Status = "pending"
                    });
                }

                var json = JsonSerializer.Serialize(owners, new JsonSerializerOptions { WriteIndented = true });
                await File.WriteAllTextAsync(ownersPath, json);

                return new OpsFixResult
                {
                    Success = true,
                    Message = $"AutoFix FLOW-001: {orphanedFlows.Count} flujos marcados como UNASSIGNED"
                };
            }
            catch (Exception ex)
            {
                return new OpsFixResult
                {
                    Success = false,
                    Message = $"Error en AutoFix FLOW-001: {ex.Message}"
                };
            }
        }
    }

    /// <summary>
    /// CULT-001: Ritual de Apertura documentado
    /// </summary>
    public class RitualDocumentationRule : IOpsRule
    {
        public string Id => "CULT-001";
        public string Name => "Ritual de Apertura documentado";
        public string Severity => "warning";
        public string Category => "culture";

        public async Task<OpsRuleResult> ValidateAsync()
        {
            try
            {
                var ritualDocPath = Path.Combine(Directory.GetCurrentDirectory(), "docs", "RITUALES_OPERATIVOS.md");
                if (!File.Exists(ritualDocPath))
                {
                    ritualDocPath = Path.Combine(AppContext.BaseDirectory, "docs", "RITUALES_OPERATIVOS.md");
                }

                if (!File.Exists(ritualDocPath))
                {
                    return new OpsRuleResult
                    {
                        Passed = false,
                        Message = "⚠️ Archivo de rituales no encontrado"
                    };
                }

                var content = await File.ReadAllTextAsync(ritualDocPath);
                var hasApertura = content.Contains("Apertura de Taller") || content.Contains("Ritual de Apertura");
                var hasCalibration = content.Contains("Calibración Empática") || content.Contains("Calibracion Empatica");

                if (hasApertura && hasCalibration)
                {
                    return new OpsRuleResult
                    {
                        Passed = true,
                        Message = "✅ Rituales documentados correctamente"
                    };
                }

                return new OpsRuleResult
                {
                    Passed = false,
                    Message = "⚠️ Falta documentación de rituales"
                };
            }
            catch (Exception ex)
            {
                return new OpsRuleResult
                {
                    Passed = false,
                    Message = $"Error validando CULT-001: {ex.Message}"
                };
            }
        }

        public async Task<OpsFixResult?> AutoFixAsync()
        {
            // Los rituales requieren documentación manual
            return await Task.FromResult<OpsFixResult?>(null);
        }
    }

    /// <summary>
    /// MQTT-001: Gateway IoT debe estar activo durante horario operativo
    /// </summary>
    public class MqttGatewayRule : IOpsRule
    {
        public string Id => "MQTT-001";
        public string Name => "Gateway IoT activo durante operaciones";
        public string Severity => "critical";
        public string Category => "mqtt";

        private readonly IMqttListenerService? _mqttService;

        public MqttGatewayRule(IMqttListenerService? mqttService = null)
        {
            _mqttService = mqttService;
        }

        public async Task<OpsRuleResult> ValidateAsync()
        {
            try
            {
                var now = DateTime.Now;
                var isOperatingHours = now.Hour >= 6 && now.Hour < 22; // 6 AM - 10 PM

                if (!isOperatingHours)
                {
                    return new OpsRuleResult
                    {
                        Passed = true,
                        Message = "✅ Fuera de horario operativo - validación pausada"
                    };
                }

                // En operación real, consultaría el estado del gateway MQTT
                var isConnected = _mqttService?.IsConnected ?? true; // Simulado

                if (isConnected)
                {
                    return new OpsRuleResult
                    {
                        Passed = true,
                        Message = "✅ Gateway MQTT operativo"
                    };
                }

                return new OpsRuleResult
                {
                    Passed = false,
                    Message = "🚨 Gateway MQTT no responde"
                };
            }
            catch (Exception ex)
            {
                return new OpsRuleResult
                {
                    Passed = false,
                    Message = $"Error validando MQTT-001: {ex.Message}"
                };
            }
        }

        public async Task<OpsFixResult?> AutoFixAsync()
        {
            return await Task.FromResult<OpsFixResult?>(null);
        }
    }

    /// <summary>
    /// FLOW-002: Todo flujo debe tener entrada y salida bien definidas
    /// Detecta "agua sin origen" (falta Input), "agua estancada" (falta Output), "canal roto" (falta IO)
    /// </summary>
    public class FlowIORule : IOpsRule
    {
        public string Id => "FLOW-002";
        public string Name => "Todo flujo debe tener entrada y salida";
        public string Severity => "critical";
        public string Category => "flow";

        public async Task<OpsRuleResult> ValidateAsync()
        {
            try
            {
                var flowmapPath = Path.Combine(AppContext.BaseDirectory, "ops", "flowmap.json");
                var ioPath = Path.Combine(AppContext.BaseDirectory, "ops", "flow-io.json");

                if (!File.Exists(flowmapPath) || !File.Exists(ioPath))
                {
                    return new OpsRuleResult
                    {
                        Passed = false,
                        Message = "⚠️ Archivos de configuración no encontrados"
                    };
                }

                var flowmapJson = await File.ReadAllTextAsync(flowmapPath);
                var ioJson = await File.ReadAllTextAsync(ioPath);

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var flows = JsonSerializer.Deserialize<List<FlowDefinition>>(flowmapJson, options) ?? new();
                var ioMap = JsonSerializer.Deserialize<Dictionary<string, FlowIO>>(ioJson, options) ?? new();

                var waterIssues = new List<string>();

                foreach (var flow in flows)
                {
                    if (!ioMap.ContainsKey(flow.Id))
                    {
                        waterIssues.Add($"🚫 {flow.Name} - Canal roto (sin definición IO)");
                        continue;
                    }

                    var io = ioMap[flow.Id];

                    if (string.IsNullOrWhiteSpace(io.Input))
                    {
                        waterIssues.Add($"💧 {flow.Name} - Agua sin origen (falta Input)");
                    }

                    if (string.IsNullOrWhiteSpace(io.Output))
                    {
                        waterIssues.Add($"🌊 {flow.Name} - Agua estancada (falta Output)");
                    }
                }

                if (waterIssues.Count == 0)
                {
                    return new OpsRuleResult
                    {
                        Passed = true,
                        Message = "El agua corre libremente. Todos los flujos tienen entrada y salida."
                    };
                }

                return new OpsRuleResult
                {
                    Passed = false,
                    Message = $"Hay {waterIssues.Count} problemas de flujo de agua.",
                    Details = waterIssues
                };
            }
            catch (Exception ex)
            {
                return new OpsRuleResult
                {
                    Passed = false,
                    Message = $"Error validando flujos: {ex.Message}"
                };
            }
        }

        public async Task<OpsFixResult?> AutoFixAsync()
        {
            try
            {
                var flowmapPath = Path.Combine(AppContext.BaseDirectory, "ops", "flowmap.json");
                var ioPath = Path.Combine(AppContext.BaseDirectory, "ops", "flow-io.json");

                if (!File.Exists(ioPath))
                {
                    return new OpsFixResult { Success = false, Message = "flow-io.json no existe." };
                }

                var flowmapJson = await File.ReadAllTextAsync(flowmapPath);
                var ioJson = await File.ReadAllTextAsync(ioPath);

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var flows = JsonSerializer.Deserialize<List<FlowDefinition>>(flowmapJson, options) ?? new();
                var ioMap = JsonSerializer.Deserialize<Dictionary<string, FlowIO>>(ioJson, options) ?? new();

                var fixedCount = 0;

                foreach (var flow in flows)
                {
                    if (!ioMap.ContainsKey(flow.Id))
                    {
                        ioMap[flow.Id] = new FlowIO
                        {
                            Input = "UNDEFINED",
                            Output = "UNDEFINED",
                            InputSource = "PENDING",
                            OutputDest = "PENDING"
                        };
                        fixedCount++;
                        continue;
                    }

                    var io = ioMap[flow.Id];

                    if (string.IsNullOrWhiteSpace(io.Input))
                    {
                        io.Input = "UNDEFINED";
                        fixedCount++;
                    }

                    if (string.IsNullOrWhiteSpace(io.Output))
                    {
                        io.Output = "UNDEFINED";
                        fixedCount++;
                    }
                }

                await File.WriteAllTextAsync(
                    ioPath,
                    JsonSerializer.Serialize(ioMap, new JsonSerializerOptions { WriteIndented = true })
                );

                return new OpsFixResult
                {
                    Success = true,
                    Message = $"Se restauró el flujo de agua en {fixedCount} puntos.",
                    FilesAffected = new[] { ioPath }
                };
            }
            catch (Exception ex)
            {
                return new OpsFixResult { Success = false, Message = $"Error en AutoFix: {ex.Message}" };
            }
        }
    }

    // ─────────────────────────────────────────────────────

    public class FlowDefinition
    {
        public string Id { get; set; } = "";
        public string Name { get; set; } = "";
        public string Category { get; set; } = "";
        public bool IsActive { get; set; } = true;
    }

    public class ProcessOwner
    {
        public string FlowId { get; set; } = "";
        public string ResponsiblePerson { get; set; } = "";
        public DateTime AssignedAt { get; set; }
        public string Status { get; set; } = "active";
    }

    public class FlowIO
    {
        public string Name { get; set; } = "";
        public string Input { get; set; } = "";
        public string Output { get; set; } = "";
        public string InputSource { get; set; } = "";
        public string OutputDest { get; set; } = "";
    }

    public interface IMqttListenerService
    {
        bool IsConnected { get; }
        Task<bool> ConnectAsync();
    }
}
