using Microsoft.Extensions.Logging;

namespace ElMediadorDeSofia.Services.SecurityAgents
{
    // =========================
    // PROTOCOLOS DE SEGURIDAD
    // =========================

    /// <summary>
    /// Define los 7 protocolos de seguridad del sistema
    /// PROTO-001 a PROTO-007 mapean directamente a SEC-001 a SEC-007
    /// </summary>
    public class SecurityProtocol
    {
        public string Id { get; set; } = "";
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public string RelatedRules { get; set; } = "";
        public string Icon { get; set; } = "";
        public string CriticalityLevel { get; set; } = ""; // critical | warning | info
    }

    public class SecurityProtocols
    {
        private readonly ILogger<SecurityProtocols> _logger;

        public SecurityProtocols(ILogger<SecurityProtocols> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Retorna la lista completa de 7 protocolos de seguridad
        /// </summary>
        public List<SecurityProtocol> GetAllProtocols()
        {
            return new List<SecurityProtocol>
            {
                // =========================
                // PROTO-001: ACCESOS
                // =========================
                new SecurityProtocol
                {
                    Id = "PROTO-001",
                    Name = "Protocolo de Accesos",
                    Description = "Control y custodia de todos los puntos de acceso al sistema. Todo acceso debe tener dueño único y responsable.",
                    RelatedRules = "SEC-001, SEC-002",
                    Icon = "🚪",
                    CriticalityLevel = "critical"
                },

                // =========================
                // PROTO-002: INTEGRIDAD
                // =========================
                new SecurityProtocol
                {
                    Id = "PROTO-002",
                    Name = "Protocolo de Integridad",
                    Description = "Verificación de integridad de archivos sensibles mediante hashing criptográfico. Detección de manipulación no autorizada.",
                    RelatedRules = "SEC-003",
                    Icon = "🧬",
                    CriticalityLevel = "critical"
                },

                // =========================
                // PROTO-003: VIGILANCIA NOCTURNA
                // =========================
                new SecurityProtocol
                {
                    Id = "PROTO-003",
                    Name = "Protocolo de Vigilancia Nocturna",
                    Description = "Monitoreo de actividad fuera de horario laboral (antes 08:00 y después 18:00). Generación de alertas automáticas.",
                    RelatedRules = "SEC-004",
                    Icon = "🌙",
                    CriticalityLevel = "warning"
                },

                // =========================
                // PROTO-004: AGENTES
                // =========================
                new SecurityProtocol
                {
                    Id = "PROTO-004",
                    Name = "Protocolo de Agentes",
                    Description = "Asignación y cumplimiento de límites de acción para agentes automatizados. Prevención de escalonamiento de privilegios.",
                    RelatedRules = "SEC-005",
                    Icon = "🧱",
                    CriticalityLevel = "critical"
                },

                // =========================
                // PROTO-005: DATOS
                // =========================
                new SecurityProtocol
                {
                    Id = "PROTO-005",
                    Name = "Protocolo de Datos (Tokens)",
                    Description = "Gestión del ciclo de vida de tokens de autenticación. Asignación de expiración y renovación automática.",
                    RelatedRules = "SEC-006",
                    Icon = "⏳",
                    CriticalityLevel = "critical"
                },

                // =========================
                // PROTO-006: OPERACIONES
                // =========================
                new SecurityProtocol
                {
                    Id = "PROTO-006",
                    Name = "Protocolo de Operaciones",
                    Description = "Registro y trazabilidad de todos los cambios de configuración del sistema. Auditoría completa de cambios.",
                    RelatedRules = "SEC-007",
                    Icon = "📘",
                    CriticalityLevel = "warning"
                },

                // =========================
                // PROTO-007: INCIDENTES
                // =========================
                new SecurityProtocol
                {
                    Id = "PROTO-007",
                    Name = "Protocolo de Incidentes",
                    Description = "Detección, escalamiento y resolución de incidentes de seguridad. Coordinación de respuesta automática y manual.",
                    RelatedRules = "SEC-001, SEC-002, SEC-003, SEC-004, SEC-005, SEC-006, SEC-007",
                    Icon = "🆘",
                    CriticalityLevel = "critical"
                }
            };
        }

        /// <summary>
        /// Retorna un protocolo por ID
        /// </summary>
        public SecurityProtocol? GetProtocolById(string id)
        {
            var protocol = GetAllProtocols().FirstOrDefault(p => p.Id == id);
            if (protocol == null)
            {
                _logger.LogWarning("Protocolo {Id} no encontrado", id);
            }
            return protocol;
        }

        /// <summary>
        /// Retorna protocolos por nivel de criticidad
        /// </summary>
        public List<SecurityProtocol> GetProtocolsByCriticality(string level)
        {
            return GetAllProtocols()
                .Where(p => p.CriticalityLevel == level)
                .ToList();
        }

        /// <summary>
        /// Retorna protocolos relacionados a una regla específica
        /// </summary>
        public List<SecurityProtocol> GetProtocolsByRule(string ruleId)
        {
            return GetAllProtocols()
                .Where(p => p.RelatedRules.Contains(ruleId))
                .ToList();
        }

        /// <summary>
        /// Genera resumen de protocolos activos
        /// </summary>
        public string GenerateProtocolSummary()
        {
            var protocols = GetAllProtocols();
            var summary = $@"
╔══════════════════════════════════════════════════════════════╗
║         🛡️ SECURITY PROTOCOLS SUMMARY - 7 PROTOCOLOS        ║
╚══════════════════════════════════════════════════════════════╝

{string.Join("\n", protocols.Select((p, i) => 
$@"  {i + 1}. {p.Icon} {p.Id} - {p.Name}
     Criticidad: {p.CriticalityLevel}
     Reglas: {p.RelatedRules}
     Desc: {p.Description}"))}

════════════════════════════════════════════════════════════════
Total: {protocols.Count} protocolos activos
Críticos: {protocols.Count(p => p.CriticalityLevel == "critical")}
Advertencias: {protocols.Count(p => p.CriticalityLevel == "warning")}
════════════════════════════════════════════════════════════════
";
            return summary;
        }

        /// <summary>
        /// Valida que todos los protocolos estén implementados
        /// </summary>
        public (bool isHealthy, string status) HealthCheck()
        {
            var protocols = GetAllProtocols();
            var expectedCount = 7;

            if (protocols.Count != expectedCount)
            {
                return (false, $"❌ Se esperaban {expectedCount} protocolos, se encontraron {protocols.Count}");
            }

            var critical = protocols.Where(p => p.CriticalityLevel == "critical").ToList();
            if (critical.Count != 5)
            {
                return (false, $"❌ Se esperaban 5 protocolos críticos, se encontraron {critical.Count}");
            }

            _logger.LogInformation("✅ SecurityProtocols HealthCheck: All 7 protocols active");
            return (true, "✅ Todos los 7 protocolos están activos y sincronizados");
        }
    }
}
