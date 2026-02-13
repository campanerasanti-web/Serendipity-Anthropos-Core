using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Serendipity.OpsAgents
{
    public interface IOpsRule
    {
        string Id { get; }
        string Name { get; }
        string Severity { get; } // critical | warning | info
        string Category { get; } // flow | culture | clarity | alignment | cadence | expansion

        Task<OpsRuleResult> ValidateAsync();
        Task<OpsFixResult?> AutoFixAsync();
    }

    public class OpsRuleResult
    {
        public bool Passed { get; set; }
        public string Message { get; set; } = "";
        public object? Details { get; set; }
    }

    public class OpsFixResult
    {
        public bool Success { get; set; }
        public string Message { get; set; } = "";
        public IEnumerable<string>? FilesAffected { get; set; }
    }
}
