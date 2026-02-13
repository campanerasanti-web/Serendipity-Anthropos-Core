using System;
using System.Collections.Generic;
using System.Text.Json;

namespace ElMediadorDeSofia.Models
{
    public class AssistantStep
    {
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public List<string> Actions { get; set; } = new List<string>();
    }

    public class AssistantSuggestion
    {
        public string Field { get; set; } = string.Empty;
        public string Issue { get; set; } = string.Empty;
        public string Recommendation { get; set; } = string.Empty;
    }

    public class AssistantRequest
    {
        public Guid LotId { get; set; }
        public string? Step { get; set; }
        public JsonElement? Data { get; set; }
    }

    public class AssistantResponse
    {
        public AssistantStep? NextStep { get; set; }
        public List<AssistantSuggestion> Suggestions { get; set; } = new List<AssistantSuggestion>();
        public List<string> Warnings { get; set; } = new List<string>();
        public object? FinalPackage { get; set; }
    }
}
