using System;
using System.Collections.Generic;

namespace Serendipity.OpsAgents
{
    public enum OpsMode
    {
        Audit,
        Repair,
        Harmonize,
        Full
    }

    public class OpsGardenerConfig
    {
        public OpsMode Mode { get; set; } = OpsMode.Audit;
        public bool AutoFix { get; set; } = false;
    }

    public class OpsGardenerResult
    {
        public IOpsRule? Rule { get; set; }
        public OpsRuleResult? RuleResult { get; set; }
        public OpsFixResult? FixResult { get; set; }

        public IOpsTask? Task { get; set; }
        public OpsTaskResult? TaskResult { get; set; }
    }

    public class OpsUnusualEnergyEvent
    {
        public string Topic { get; set; } = "";
        public string Payload { get; set; } = "";
        public DateTime Timestamp { get; set; }
    }

    public interface IOpsReportWriter
    {
        Task WriteAsync(IList<OpsGardenerResult> results, OpsGardenerConfig config);
    }
}
