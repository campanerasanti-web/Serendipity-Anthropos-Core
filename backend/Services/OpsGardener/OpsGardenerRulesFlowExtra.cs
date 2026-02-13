using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace Serendipity.OpsAgents
{
    // FLOW-004: Todo flujo debe tener un tiempo estándar (ritmo)
    public class Flow004Rule : IOpsRule
    {
        private readonly ILogger<Flow004Rule> _logger;
        private readonly string _flowMapPath = "ops/flowmap.json";
        private readonly string _timeMapPath = "ops/flow-times.json";

        public string Id => "FLOW-004";
        public string Name => "Todo flujo debe tener un tiempo estándar";
        public string Severity => "warning";
        public string Category => "flow";

        public Flow004Rule(ILogger<Flow004Rule> logger) => _logger = logger;

        public async Task<OpsRuleResult> ValidateAsync()
        {
            if (!File.Exists(_flowMapPath))
                return new OpsRuleResult { Passed = false, Message = "flowmap.json no existe." };

            if (!File.Exists(_timeMapPath))
                return new OpsRuleResult { Passed = false, Message = "flow-times.json no existe." };

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var flows = JsonSerializer.Deserialize<List<FlowDefinition>>(await File.ReadAllTextAsync(_flowMapPath), options) ?? new();
            var flowIds = flows.Select(f => f.Id).ToList();
            var times = JsonSerializer.Deserialize<Dictionary<string, int>>(await File.ReadAllTextAsync(_timeMapPath), options) ?? new();

            var details = new List<string>();

            foreach (var flow in flowIds)
            {
                if (!times.ContainsKey(flow) || times[flow] <= 0)
                {
                    details.Add($"⏱ {flow} - ritmo indefinido");
                }
            }

            if (!details.Any())
            {
                return new OpsRuleResult 
                { 
                    Passed = true, 
                    Message = "⏰ Todos los flujos tienen ritmo marcado. El compás es constante.",
                    Details = details
                };
            }

            return new OpsRuleResult
            {
                Passed = false,
                Message = $"Hay {details.Count} flujos sin tiempo estándar.",
                Details = details
            };
        }

        public async Task<OpsFixResult?> AutoFixAsync()
        {
            if (!File.Exists(_timeMapPath))
                return new OpsFixResult { Success = false, Message = "flow-times.json no existe." };

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var times = JsonSerializer.Deserialize<Dictionary<string, int>>(await File.ReadAllTextAsync(_timeMapPath), options) ?? new();
            var flows = JsonSerializer.Deserialize<List<FlowDefinition>>(await File.ReadAllTextAsync(_flowMapPath), options) ?? new();
            var flowIds = flows.Select(f => f.Id).ToList();

            var fixedFlows = new List<string>();

            foreach (var flow in flowIds)
            {
                if (!times.ContainsKey(flow) || times[flow] <= 0)
                {
                    times[flow] = 1;
                    fixedFlows.Add(flow);
                    _logger.LogWarning("⏱ Asignando ritmo provisional a {Flow}: 1 minuto.", flow);
                }
            }

            await File.WriteAllTextAsync(_timeMapPath,
                JsonSerializer.Serialize(times, new JsonSerializerOptions { WriteIndented = true }));

            return new OpsFixResult
            {
                Success = true,
                Message = $"Se estableció ritmo provisional en {fixedFlows.Count} flujos.",
                FilesAffected = new[] { _timeMapPath }
            };
        }
    }

    // FLOW-005: Todo flujo debe tener límite de WIP (sin desborde)
    public class Flow005Rule : IOpsRule
    {
        private readonly ILogger<Flow005Rule> _logger;
        private readonly string _flowMapPath = "ops/flowmap.json";
        private readonly string _wipMapPath = "ops/flow-wip-limits.json";

        public string Id => "FLOW-005";
        public string Name => "Todo flujo debe tener límite de WIP";
        public string Severity => "warning";
        public string Category => "flow";

        public Flow005Rule(ILogger<Flow005Rule> logger) => _logger = logger;

        public async Task<OpsRuleResult> ValidateAsync()
        {
            if (!File.Exists(_flowMapPath))
                return new OpsRuleResult { Passed = false, Message = "flowmap.json no existe." };

            if (!File.Exists(_wipMapPath))
                return new OpsRuleResult { Passed = false, Message = "flow-wip-limits.json no existe." };

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var flows = JsonSerializer.Deserialize<List<FlowDefinition>>(await File.ReadAllTextAsync(_flowMapPath), options) ?? new();
            var flowIds = flows.Select(f => f.Id).ToList();
            var wips = JsonSerializer.Deserialize<Dictionary<string, int>>(await File.ReadAllTextAsync(_wipMapPath), options) ?? new();

            var details = new List<string>();

            foreach (var flow in flowIds)
            {
                if (!wips.ContainsKey(flow) || wips[flow] <= 0)
                {
                    details.Add($"📦 {flow} - riesgo de saturación");
                }
            }

            if (!details.Any())
            {
                return new OpsRuleResult 
                { 
                    Passed = true, 
                    Message = "🛡 Todos los flujos tienen límite de WIP. Sin desborde.",
                    Details = details
                };
            }

            return new OpsRuleResult
            {
                Passed = false,
                Message = $"Hay {details.Count} flujos sin límite de WIP.",
                Details = details
            };
        }

        public async Task<OpsFixResult?> AutoFixAsync()
        {
            if (!File.Exists(_wipMapPath))
                return new OpsFixResult { Success = false, Message = "flow-wip-limits.json no existe." };

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var wips = JsonSerializer.Deserialize<Dictionary<string, int>>(await File.ReadAllTextAsync(_wipMapPath), options) ?? new();
            var flows = JsonSerializer.Deserialize<List<FlowDefinition>>(await File.ReadAllTextAsync(_flowMapPath), options) ?? new();
            var flowIds = flows.Select(f => f.Id).ToList();

            var fixedFlows = new List<string>();

            foreach (var flow in flowIds)
            {
                if (!wips.ContainsKey(flow) || wips[flow] <= 0)
                {
                    wips[flow] = 5;
                    fixedFlows.Add(flow);
                    _logger.LogWarning("📦 Asignando límite de WIP provisional a {Flow}: 5.", flow);
                }
            }

            await File.WriteAllTextAsync(_wipMapPath,
                JsonSerializer.Serialize(wips, new JsonSerializerOptions { WriteIndented = true }));

            return new OpsFixResult
            {
                Success = true,
                Message = $"Se estableció límite de WIP provisional en {fixedFlows.Count} flujos.",
                FilesAffected = new[] { _wipMapPath }
            };
        }
    }

    // FLOW-006: Todo flujo debe tener documentación mínima (memoria escrita)
    public class Flow006Rule : IOpsRule
    {
        private readonly ILogger<Flow006Rule> _logger;
        private readonly string _flowMapPath = "ops/flowmap.json";
        private readonly string _docsPath = "ops/flow-docs.json";

        public string Id => "FLOW-006";
        public string Name => "Todo flujo debe tener documentación mínima";
        public string Severity => "warning";
        public string Category => "flow";

        public Flow006Rule(ILogger<Flow006Rule> logger) => _logger = logger;

        public async Task<OpsRuleResult> ValidateAsync()
        {
            if (!File.Exists(_flowMapPath))
                return new OpsRuleResult { Passed = false, Message = "flowmap.json no existe." };

            if (!File.Exists(_docsPath))
                return new OpsRuleResult { Passed = false, Message = "flow-docs.json no existe." };

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var flows = JsonSerializer.Deserialize<List<FlowDefinition>>(await File.ReadAllTextAsync(_flowMapPath), options) ?? new();
            var flowIds = flows.Select(f => f.Id).ToList();
            var docs = JsonSerializer.Deserialize<Dictionary<string, string>>(await File.ReadAllTextAsync(_docsPath), options) ?? new();

            var details = new List<string>();

            foreach (var flow in flowIds)
            {
                if (!docs.ContainsKey(flow) || string.IsNullOrWhiteSpace(docs[flow]))
                {
                    details.Add($"📜 {flow} - memoria pendiente");
                }
            }

            if (!details.Any())
            {
                return new OpsRuleResult 
                { 
                    Passed = true, 
                    Message = "📖 Todos los flujos tienen documentación. La memoria está escrita.",
                    Details = details
                };
            }

            return new OpsRuleResult
            {
                Passed = false,
                Message = $"Hay {details.Count} flujos sin documentación.",
                Details = details
            };
        }

        public async Task<OpsFixResult?> AutoFixAsync()
        {
            if (!File.Exists(_docsPath))
                return new OpsFixResult { Success = false, Message = "flow-docs.json no existe." };

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var docs = JsonSerializer.Deserialize<Dictionary<string, string>>(await File.ReadAllTextAsync(_docsPath), options) ?? new();
            var flows = JsonSerializer.Deserialize<List<FlowDefinition>>(await File.ReadAllTextAsync(_flowMapPath), options) ?? new();
            var flowIds = flows.Select(f => f.Id).ToList();

            var fixedFlows = new List<string>();

            foreach (var flow in flowIds)
            {
                if (!docs.ContainsKey(flow) || string.IsNullOrWhiteSpace(docs[flow]))
                {
                    docs[flow] = "DOCUMENTACION_PENDIENTE";
                    fixedFlows.Add(flow);
                    _logger.LogWarning("📜 Marcando documentación pendiente en {Flow}.", flow);
                }
            }

            await File.WriteAllTextAsync(_docsPath,
                JsonSerializer.Serialize(docs, new JsonSerializerOptions { WriteIndented = true }));

            return new OpsFixResult
            {
                Success = true,
                Message = $"Se marcó documentación pendiente en {fixedFlows.Count} flujos.",
                FilesAffected = new[] { _docsPath }
            };
        }
    }

    // FLOW-007: Todo flujo debe tener al menos una dependencia mapeada (red visible)
    public class Flow007Rule : IOpsRule
    {
        private readonly ILogger<Flow007Rule> _logger;
        private readonly string _flowMapPath = "ops/flowmap.json";
        private readonly string _depsPath = "ops/flow-deps.json";

        public string Id => "FLOW-007";
        public string Name => "Todo flujo debe tener dependencia mapeada";
        public string Severity => "info";
        public string Category => "flow";

        public Flow007Rule(ILogger<Flow007Rule> logger) => _logger = logger;

        public async Task<OpsRuleResult> ValidateAsync()
        {
            if (!File.Exists(_flowMapPath))
                return new OpsRuleResult { Passed = false, Message = "flowmap.json no existe." };

            if (!File.Exists(_depsPath))
                return new OpsRuleResult { Passed = false, Message = "flow-deps.json no existe." };

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var flows = JsonSerializer.Deserialize<List<FlowDefinition>>(await File.ReadAllTextAsync(_flowMapPath), options) ?? new();
            var flowIds = flows.Select(f => f.Id).ToList();
            var deps = JsonSerializer.Deserialize<Dictionary<string, FlowDeps>>(await File.ReadAllTextAsync(_depsPath), options) ?? new();

            var details = new List<string>();

            foreach (var flow in flowIds)
            {
                if (!deps.ContainsKey(flow))
                {
                    details.Add($"🔗 {flow} - red ciega (sin dependencias)");
                }
                else
                {
                    var d = deps[flow];
                    var hasPrev = d.Previous != null && d.Previous.Count > 0;
                    var hasNext = d.Next != null && d.Next.Count > 0;

                    if (!hasPrev && !hasNext)
                    {
                        details.Add($"🔗 {flow} - red ciega (sin conexiones)");
                    }
                }
            }

            if (!details.Any())
            {
                return new OpsRuleResult 
                { 
                    Passed = true, 
                    Message = "🌐 Todos los flujos están conectados. La red es visible.",
                    Details = details
                };
            }

            return new OpsRuleResult
            {
                Passed = false,
                Message = $"Hay {details.Count} flujos sin dependencias mapeadas.",
                Details = details
            };
        }

        public async Task<OpsFixResult?> AutoFixAsync()
        {
            if (!File.Exists(_depsPath))
                return new OpsFixResult { Success = false, Message = "flow-deps.json no existe." };

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var deps = JsonSerializer.Deserialize<Dictionary<string, FlowDeps>>(await File.ReadAllTextAsync(_depsPath), options) ?? new();
            var flows = JsonSerializer.Deserialize<List<FlowDefinition>>(await File.ReadAllTextAsync(_flowMapPath), options) ?? new();
            var flowIds = flows.Select(f => f.Id).ToList();

            var fixedFlows = new List<string>();

            foreach (var flow in flowIds)
            {
                if (!deps.ContainsKey(flow))
                {
                    deps[flow] = new FlowDeps { Previous = new List<string>(), Next = new List<string>() };
                }

                var d = deps[flow];
                var hasPrev = d.Previous != null && d.Previous.Count > 0;
                var hasNext = d.Next != null && d.Next.Count > 0;

                if (!hasPrev && !hasNext)
                {
                    d.Next ??= new List<string>();
                    d.Next.Add("DEPENDENCIA_PENDIENTE");
                    fixedFlows.Add(flow);
                    _logger.LogWarning("🔗 Marcando dependencia pendiente en {Flow}.", flow);
                }
            }

            await File.WriteAllTextAsync(_depsPath,
                JsonSerializer.Serialize(deps, new JsonSerializerOptions { WriteIndented = true }));

            return new OpsFixResult
            {
                Success = true,
                Message = $"Se marcaron dependencias pendientes en {fixedFlows.Count} flujos.",
                FilesAffected = new[] { _depsPath }
            };
        }
    }

    // Helper class for FLOW-007 dependency mapping
    public class FlowDeps
    {
        public List<string>? Previous { get; set; }
        public List<string>? Next { get; set; }
    }
}
