using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Serendipity.OpsAgents
{
    public interface IOpsTask
    {
        string Id { get; }
        string Name { get; }
        string Category { get; } // audit | repair | harmonize | create | optimize
        string Priority { get; } // immediate | high | medium | low

        Task<OpsTaskResult> ExecuteAsync();
    }

    public class OpsTaskResult
    {
        public bool Success { get; set; }
        public string Message { get; set; } = "";
        public IEnumerable<string>? FilesAffected { get; set; }
    }
}
