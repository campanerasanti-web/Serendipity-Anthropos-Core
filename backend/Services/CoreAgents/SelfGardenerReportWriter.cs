using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace ElMediadorDeSofia.Services.CoreAgents
{
    public class SelfGardenerReportWriter : ISelfGardenerReportWriter
    {
        private readonly ILogger<SelfGardenerReportWriter> _logger;
        private readonly string _reportsDir = "self/reports";

        public SelfGardenerReportWriter(ILogger<SelfGardenerReportWriter> logger)
        {
            _logger = logger;
        }

        public async Task WriteAsync(SelfState state, IList<string> logs)
        {
            try
            {
                Directory.CreateDirectory(_reportsDir);
                var date = DateTime.UtcNow.ToString("yyyy-MM-dd_HH-mm");
                var path = Path.Combine(_reportsDir, $"self-report-{date}.md");

                var content = GenerateMarkdownReport(state, logs, date);

                await File.WriteAllTextAsync(path, content);
                _logger.LogInformation("✅ Self report guardado en {Path}", path);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error escribiendo Self report");
            }
        }

        private string GenerateMarkdownReport(SelfState state, IList<string> logs, string date)
        {
            var moodEmoji = state.OverallMood switch
            {
                "fertile" => "🌱",
                "stressed" => "⚠️",
                "fragmented" => "🌪️",
                "flowing" => "🌊",
                _ => "❓"
            };

            return $@"# {moodEmoji} Self Report — {date}

## Estado General del Sistema

- **Estado global**: {moodEmoji} **{state.OverallMood}**
- **Puntos de sequía**: {state.DroughtPoints.Count}
- **Riesgos de seguridad**: {state.SecurityRisks.Count}
- **Problemas de flujo**: {state.FlowIssues.Count}

---

## Diagnóstico Detallado

### Puntos de Sequía (Desierto)

*Áreas donde falta dueño, KPI, tiempo o documentación:*

{(state.DroughtPoints.Any() 
    ? string.Join("\n", state.DroughtPoints.Select((x, i) => $"{i + 1}. {x}")) 
    : "_✅ Ninguno — El sistema está bien regado._")}

### Riesgos de Seguridad (Amenazas)

{(state.SecurityRisks.Any() 
    ? string.Join("\n", state.SecurityRisks.Select((x, i) => $"{i + 1}. {x}")) 
    : "_✅ Ninguno — El perímetro está seguro._")}

### Problemas de Flujo (Congestión)

{(state.FlowIssues.Any() 
    ? string.Join("\n", state.FlowIssues.Select((x, i) => $"{i + 1}. {x}")) 
    : "_✅ Ninguno — Todo fluye libremente._")}

---

## Registro de Ciclo (Trazabilidad)

```
{string.Join("\n", logs)}
```

---

## Interpretación del Clima

| Clima | Significado | Acción |
|-------|-------------|--------|
| 🌱 **fertile** | Todo sano, sin riesgos | Mantener vigilancia |
| 🌊 **flowing** | Ligeros problemas, manejables | Monitorear |
| 🌪️ **fragmented** | Múltiples problemas operacionales | Investigar sequía |
| ⚠️ **stressed** | Riesgo de seguridad crítico | Escalada inmediata |

---

### Meta-nota

Este reporte fue generado por el **Séptimo Día** — ciclo de reflexión automática del sistema.  
Cada noche, después de que cierren todas las puertas (02:00 AM UTC), el sistema se observa a sí mismo.

**Fecha**: {DateTime.UtcNow:u}
";
        }
    }
}
