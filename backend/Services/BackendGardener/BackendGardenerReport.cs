using System;
using System.Collections.Generic;
using System.Linq;

namespace ElMediadorDeSofia.Services.BackendGardener;

/// <summary>
/// Backend Gardener Report Generator
/// Genera reportes en formato Markdown y Console
/// </summary>

public class ReportGenerator
{
    public static string GenerateConsoleReport(BackendGardenerReport report)
    {
        var lines = new List<string>
        {
            "\n╔════════════════════════════════════════════════════════╗",
            "║           🌱 BACKEND GARDENER REPORT                   ║",
            "╚════════════════════════════════════════════════════════╝\n",
            $"Generated: {report.Timestamp}",
            $"Status: {report.OverallStatus}",
            $"Completeness: {report.Completeness:F1}%\n"
        };

        // Rules
        var passedRules = report.Rules.Count(r => r.Passed);
        var failedRules = report.Rules.Count - passedRules;
        lines.Add($"📋 Rules: {passedRules}/{report.Rules.Count} passed, {failedRules} failed");

        // Tasks
        var completedTasks = report.Tasks.Count(t => t.Completed);
        var pendingTasks = report.Tasks.Count - completedTasks;
        lines.Add($"✅ Tasks: {completedTasks}/{report.Tasks.Count} completed, {pendingTasks} pending\n");

        // Top Recommendations
        lines.Add("🎯 Top 3 Recommendations:");
        foreach (var rec in report.Recommendations.Take(3))
        {
            lines.Add($"   {rec.Priority}. {rec.Title} ({rec.EstimatedHours}h)");
        }

        lines.Add("\n✨ Agent is ready to serve\n");

        return string.Join("\n", lines);
    }

    public static string GetStatusEmoji(string status) =>
        status switch
        {
            "EXCELLENT" => "🟢",
            "GOOD" => "🟡",
            "DEGRADED" => "🟠",
            "CRITICAL" => "🔴",
            _ => "⚪"
        };

    public static string GetProgressBar(decimal percentage, int width = 20)
    {
        var filled = (int)(percentage / 100 * width);
        var empty = width - filled;
        return $"[{new string('█', filled)}{new string('░', empty)}] {percentage:F1}%";
    }
}
