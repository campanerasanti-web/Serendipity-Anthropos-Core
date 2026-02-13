using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace Serendipity.OpsAgents
{
    // FLOW-003: Todo flujo debe tener un KPI (pulso del sistema)
    public class Flow003Rule : IOpsRule
    {
        private readonly ILogger<Flow003Rule> _logger;
        private readonly string _flowMapPath = "ops/flowmap.json";
        private readonly string _kpiMapPath = "ops/flow-kpis.json";

        public string Id => "FLOW-003";
        public string Name => "Todo flujo debe tener un KPI";
        public string Severity => "critical";
        public string Category => "flow";

        public Flow003Rule(ILogger<Flow003Rule> logger)
        {
            _logger = logger;
        }

        public async Task<OpsRuleResult> ValidateAsync()
        {
            if (!File.Exists(_flowMapPath))
                return new OpsRuleResult { Passed = false, Message = "flowmap.json no existe." };

            if (!File.Exists(_kpiMapPath))
                return new OpsRuleResult { Passed = false, Message = "flow-kpis.json no existe." };

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var flows = JsonSerializer.Deserialize<List<FlowDefinition>>(await File.ReadAllTextAsync(_flowMapPath), options) ?? new();
            var flowIds = flows.Select(f => f.Id).ToList();
            var kpis = JsonSerializer.Deserialize<Dictionary<string, string>>(await File.ReadAllTextAsync(_kpiMapPath), options) ?? new();

            var details = new List<string>();

            foreach (var flow in flowIds)
            {
                if (!kpis.ContainsKey(flow))
                {
                    details.Add($"💔 {flow} - flujo sin pulso");
                }
                else if (string.IsNullOrWhiteSpace(kpis[flow]))
                {
                    details.Add($"💤 {flow} - latido débil");
                }
                else if (kpis[flow] == "UNDEFINED_KPI")
                {
                    details.Add($"🌱 {flow} - conciencia por despertar");
                }
            }

            if (!details.Any())
            {
                return new OpsRuleResult
                {
                    Passed = true,
                    Message = "💓 Todos los flujos tienen pulso. El sistema está vivo.",
                    Details = details
                };
            }

            return new OpsRuleResult
            {
                Passed = false,
                Message = $"Hay {details.Count} flujos sin pulso completo.",
                Details = details
            };
        }

        public async Task<OpsFixResult?> AutoFixAsync()
        {
            if (!File.Exists(_kpiMapPath))
                return new OpsFixResult { Success = false, Message = "flow-kpis.json no existe." };

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var kpis = JsonSerializer.Deserialize<Dictionary<string, string>>(await File.ReadAllTextAsync(_kpiMapPath), options) ?? new();
            var flows = JsonSerializer.Deserialize<List<FlowDefinition>>(await File.ReadAllTextAsync(_flowMapPath), options) ?? new();
            var flowIds = flows.Select(f => f.Id).ToList();

            var fixedFlows = new List<string>();

            foreach (var flow in flowIds)
            {
                if (!kpis.ContainsKey(flow) || string.IsNullOrWhiteSpace(kpis[flow]))
                {
                    kpis[flow] = "UNDEFINED_KPI";
                    fixedFlows.Add(flow);
                    _logger.LogWarning("🫀 Asignando pulso provisional a {Flow}.", flow);
                }
            }

            await File.WriteAllTextAsync(
                _kpiMapPath,
                JsonSerializer.Serialize(kpis, new JsonSerializerOptions { WriteIndented = true })
            );

            return new OpsFixResult
            {
                Success = true,
                Message = $"Se restauró pulso provisional a {fixedFlows.Count} flujos.",
                FilesAffected = new[] { _kpiMapPath }
            };
        }
    }
}
