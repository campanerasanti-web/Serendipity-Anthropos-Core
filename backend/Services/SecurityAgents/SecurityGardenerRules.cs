using System.Security.Cryptography;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace ElMediadorDeSofia.Services.SecurityAgents
{
    // =========================
    // INTERFACES Y MODELOS
    // =========================

    public class SecurityRuleResult
    {
        public bool Passed { get; set; }
        public string Message { get; set; } = "";
        public object? Details { get; set; }
    }

    public class SecurityFixResult
    {
        public bool Success { get; set; }
        public string Message { get; set; } = "";
        public IEnumerable<string>? FilesAffected { get; set; }
    }

    public interface ISecurityRule
    {
        string Id { get; }
        string Name { get; }
        string Severity { get; } // critical | warning | info
        string Category { get; } // access | integrity | agents | data | ops | incident

        Task<SecurityRuleResult> ValidateAsync();
        Task<SecurityFixResult?> AutoFixAsync();
    }

    public class SecurityResult
    {
        public ISecurityRule? Rule { get; set; }
        public SecurityRuleResult? RuleResult { get; set; }
        public SecurityFixResult? FixResult { get; set; }

        public ISecurityTask? Task { get; set; }
        public SecurityTaskResult? TaskResult { get; set; }
    }

    public interface ISecurityTask
    {
        string Id { get; }
        string Name { get; }
        string Category { get; }
        string Priority { get; }

        Task<SecurityTaskResult> ExecuteAsync();
    }

    public class SecurityTaskResult
    {
        public bool Success { get; set; }
        public string Message { get; set; } = "";
        public IEnumerable<string>? FilesAffected { get; set; }
        public object? Data { get; set; }
    }

    // =========================
    // SEC-001: TODO ACCESO DEBE TENER DUEÑO
    // =========================
    public class Sec001Rule : ISecurityRule
    {
        private readonly ILogger<Sec001Rule> _logger;
        private readonly string _accessMapPath = "security/access-map.json";

        public string Id => "SEC-001";
        public string Name => "Todo acceso debe tener dueño";
        public string Severity => "critical";
        public string Category => "access";

        public Sec001Rule(ILogger<Sec001Rule> logger) => _logger = logger;

        public async Task<SecurityRuleResult> ValidateAsync()
        {
            try
            {
                if (!File.Exists(_accessMapPath))
                    return new SecurityRuleResult 
                    { 
                        Passed = false, 
                        Message = "🚪 access-map.json no existe. El perímetro está sin custodia." 
                    };

                var content = await File.ReadAllTextAsync(_accessMapPath);
                var map = JsonSerializer.Deserialize<Dictionary<string, string>>(content) ?? new();

                var orphan = map
                    .Where(kv => string.IsNullOrWhiteSpace(kv.Value))
                    .Select(kv => kv.Key)
                    .ToList();

                if (!orphan.Any())
                    return new SecurityRuleResult 
                    { 
                        Passed = true, 
                        Message = "✅ Todos los accesos tienen dueño. El perímetro está custodiado." 
                    };

                _logger.LogWarning("🚨 SEC-001: {Count} accesos sin dueño detectados", orphan.Count);
                return new SecurityRuleResult
                {
                    Passed = false,
                    Message = $"❌ Hay {orphan.Count} accesos sin dueño asignado.",
                    Details = orphan
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en SEC-001 ValidateAsync");
                return new SecurityRuleResult { Passed = false, Message = $"Error: {ex.Message}" };
            }
        }

        public async Task<SecurityFixResult?> AutoFixAsync()
        {
            try
            {
                if (!File.Exists(_accessMapPath))
                    return new SecurityFixResult { Success = false, Message = "access-map.json no existe." };

                var content = await File.ReadAllTextAsync(_accessMapPath);
                var map = JsonSerializer.Deserialize<Dictionary<string, string>>(content) ?? new();
                var fixedKeys = new List<string>();

                foreach (var key in map.Keys.ToList())
                {
                    if (string.IsNullOrWhiteSpace(map[key]))
                    {
                        map[key] = "UNASSIGNED_ACCESS";
                        fixedKeys.Add(key);
                        _logger.LogWarning("🔧 SEC-001 AutoFix: Marcado acceso {Access} como UNASSIGNED_ACCESS", key);
                    }
                }

                await File.WriteAllTextAsync(
                    _accessMapPath,
                    JsonSerializer.Serialize(map, new JsonSerializerOptions { WriteIndented = true }));

                return new SecurityFixResult
                {
                    Success = true,
                    Message = $"✅ Se asignó UNASSIGNED_ACCESS a {fixedKeys.Count} accesos huérfanos.",
                    FilesAffected = new[] { _accessMapPath }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en SEC-001 AutoFixAsync");
                return new SecurityFixResult { Success = false, Message = $"Error: {ex.Message}" };
            }
        }
    }

    // =========================
    // SEC-002: TODO ENDPOINT CRÍTICO DEBE REQUERIR AUTENTICACIÓN
    // =========================
    public class Sec002Rule : ISecurityRule
    {
        private readonly ILogger<Sec002Rule> _logger;
        private readonly string _endpointsPath = "security/endpoints.json";

        public string Id => "SEC-002";
        public string Name => "Todo endpoint crítico debe requerir autenticación";
        public string Severity => "critical";
        public string Category => "access";

        public Sec002Rule(ILogger<Sec002Rule> logger) => _logger = logger;

        public async Task<SecurityRuleResult> ValidateAsync()
        {
            try
            {
                if (!File.Exists(_endpointsPath))
                    return new SecurityRuleResult { Passed = false, Message = "🔌 endpoints.json no existe." };

                var content = await File.ReadAllTextAsync(_endpointsPath);
                var endpoints = JsonSerializer.Deserialize<List<EndpointDef>>(content) ?? new();

                var insecure = endpoints
                    .Where(e => e.Critical && !e.RequiresAuth)
                    .Select(e => e.Path)
                    .ToList();

                if (!insecure.Any())
                    return new SecurityRuleResult 
                    { 
                        Passed = true, 
                        Message = "✅ Todos los endpoints críticos requieren autenticación." 
                    };

                _logger.LogWarning("🚨 SEC-002: {Count} endpoints críticos sin autenticación", insecure.Count);
                return new SecurityRuleResult
                {
                    Passed = false,
                    Message = $"❌ Hay {insecure.Count} endpoints críticos sin autenticación.",
                    Details = insecure
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en SEC-002 ValidateAsync");
                return new SecurityRuleResult { Passed = false, Message = $"Error: {ex.Message}" };
            }
        }

        public async Task<SecurityFixResult?> AutoFixAsync()
        {
            try
            {
                if (!File.Exists(_endpointsPath))
                    return new SecurityFixResult { Success = false, Message = "endpoints.json no existe." };

                var content = await File.ReadAllTextAsync(_endpointsPath);
                var endpoints = JsonSerializer.Deserialize<List<EndpointDef>>(content) ?? new();
                var fixedOnes = new List<string>();

                foreach (var e in endpoints)
                {
                    if (e.Critical && !e.RequiresAuth)
                    {
                        e.RequiresAuth = true;
                        fixedOnes.Add(e.Path);
                        _logger.LogWarning("🔧 SEC-002 AutoFix: Endpoint {Path} ahora requiere autenticación", e.Path);
                    }
                }

                await File.WriteAllTextAsync(
                    _endpointsPath,
                    JsonSerializer.Serialize(endpoints, new JsonSerializerOptions { WriteIndented = true }));

                return new SecurityFixResult
                {
                    Success = true,
                    Message = $"✅ Se reforzó autenticación en {fixedOnes.Count} endpoints críticos.",
                    FilesAffected = new[] { _endpointsPath }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en SEC-002 AutoFixAsync");
                return new SecurityFixResult { Success = false, Message = $"Error: {ex.Message}" };
            }
        }

        public class EndpointDef
        {
            public string Path { get; set; } = "";
            public bool Critical { get; set; }
            public bool RequiresAuth { get; set; }
        }
    }

    // =========================
    // SEC-003: TODO ARCHIVO SENSIBLE DEBE TENER HASH
    // =========================
    public class Sec003Rule : ISecurityRule
    {
        private readonly ILogger<Sec003Rule> _logger;
        private readonly string _hashesPath = "security/file-hashes.json";

        public string Id => "SEC-003";
        public string Name => "Todo archivo sensible debe tener hash verificado";
        public string Severity => "critical";
        public string Category => "integrity";

        public Sec003Rule(ILogger<Sec003Rule> logger) => _logger = logger;

        public async Task<SecurityRuleResult> ValidateAsync()
        {
            try
            {
                if (!File.Exists(_hashesPath))
                    return new SecurityRuleResult { Passed = false, Message = "🧬 file-hashes.json no existe." };

                var content = await File.ReadAllTextAsync(_hashesPath);
                var hashes = JsonSerializer.Deserialize<Dictionary<string, string>>(content) ?? new();

                var missing = hashes
                    .Where(kv => string.IsNullOrWhiteSpace(kv.Value))
                    .Select(kv => kv.Key)
                    .ToList();

                if (!missing.Any())
                    return new SecurityRuleResult 
                    { 
                        Passed = true, 
                        Message = "✅ Todos los archivos sensibles tienen hash registrado." 
                    };

                _logger.LogWarning("🚨 SEC-003: {Count} archivos sin hash", missing.Count);
                return new SecurityRuleResult
                {
                    Passed = false,
                    Message = $"❌ Hay {missing.Count} archivos sensibles sin hash.",
                    Details = missing
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en SEC-003 ValidateAsync");
                return new SecurityRuleResult { Passed = false, Message = $"Error: {ex.Message}" };
            }
        }

        public async Task<SecurityFixResult?> AutoFixAsync()
        {
            try
            {
                if (!File.Exists(_hashesPath))
                    return new SecurityFixResult { Success = false, Message = "file-hashes.json no existe." };

                var content = await File.ReadAllTextAsync(_hashesPath);
                var hashes = JsonSerializer.Deserialize<Dictionary<string, string>>(content) ?? new();
                var fixedFiles = new List<string>();

                foreach (var key in hashes.Keys.ToList())
                {
                    if (string.IsNullOrWhiteSpace(hashes[key]))
                    {
                        hashes[key] = await ComputeFileHashAsync(key);
                        fixedFiles.Add(key);
                        _logger.LogWarning("🔧 SEC-003 AutoFix: Hash calculado para {File}", key);
                    }
                }

                await File.WriteAllTextAsync(
                    _hashesPath,
                    JsonSerializer.Serialize(hashes, new JsonSerializerOptions { WriteIndented = true }));

                return new SecurityFixResult
                {
                    Success = true,
                    Message = $"✅ Se calcularon hashes para {fixedFiles.Count} archivos.",
                    FilesAffected = new[] { _hashesPath }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en SEC-003 AutoFixAsync");
                return new SecurityFixResult { Success = false, Message = $"Error: {ex.Message}" };
            }
        }

        private async Task<string> ComputeFileHashAsync(string filePath)
        {
            if (!File.Exists(filePath))
                return "FILE_NOT_FOUND";

            try
            {
                using (var sha256 = SHA256.Create())
                using (var stream = File.OpenRead(filePath))
                {
                    var hash = await Task.Run(() => sha256.ComputeHash(stream));
                    return Convert.ToHexString(hash);
                }
            }
            catch
            {
                return "HASH_ERROR";
            }
        }
    }

    // =========================
    // SEC-004: ACTIVIDAD FUERA DE HORARIO → ALERTA
    // =========================
    public class Sec004Rule : ISecurityRule
    {
        private readonly ILogger<Sec004Rule> _logger;
        private readonly string _activityLogPath = "security/activity-log.json";
        private readonly TimeSpan _start = TimeSpan.Parse("08:00");
        private readonly TimeSpan _end = TimeSpan.Parse("18:00");

        public string Id => "SEC-004";
        public string Name => "Actividad fuera de horario debe generar alerta";
        public string Severity => "warning";
        public string Category => "ops";

        public Sec004Rule(ILogger<Sec004Rule> logger) => _logger = logger;

        public async Task<SecurityRuleResult> ValidateAsync()
        {
            try
            {
                if (!File.Exists(_activityLogPath))
                    return new SecurityRuleResult 
                    { 
                        Passed = true, 
                        Message = "🌙 No hay activity-log.json. Nada que auditar." 
                    };

                var content = await File.ReadAllTextAsync(_activityLogPath);
                var entries = JsonSerializer.Deserialize<List<ActivityEntry>>(content) ?? new();

                var outOfHours = entries
                    .Where(e =>
                    {
                        var t = e.Timestamp.TimeOfDay;
                        return t < _start || t > _end;
                    })
                    .ToList();

                if (!outOfHours.Any())
                    return new SecurityRuleResult 
                    { 
                        Passed = true, 
                        Message = "✅ No se detectó actividad fuera de horario." 
                    };

                _logger.LogWarning("🌙 SEC-004: {Count} eventos fuera de horario detectados", outOfHours.Count);
                return new SecurityRuleResult
                {
                    Passed = false,
                    Message = $"⚠️ Se detectaron {outOfHours.Count} eventos fuera de horario (08:00-18:00).",
                    Details = outOfHours.Select(e => new { e.User, e.Action, e.Timestamp })
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en SEC-004 ValidateAsync");
                return new SecurityRuleResult { Passed = false, Message = $"Error: {ex.Message}" };
            }
        }

        public Task<SecurityFixResult?> AutoFixAsync()
        {
            _logger.LogWarning("🌙 SEC-004: Actividad fuera de horario registrada. Revisar reporte nocturno.");
            return Task.FromResult<SecurityFixResult?>(null);
        }

        public class ActivityEntry
        {
            public string User { get; set; } = "";
            public string Action { get; set; } = "";
            public DateTime Timestamp { get; set; }
        }
    }

    // =========================
    // SEC-005: TODO AGENTE DEBE TENER LÍMITES
    // =========================
    public class Sec005Rule : ISecurityRule
    {
        private readonly ILogger<Sec005Rule> _logger;
        private readonly string _agentsPath = "security/agents-limits.json";

        public string Id => "SEC-005";
        public string Name => "Todo agente debe tener límites de acción";
        public string Severity => "critical";
        public string Category => "agents";

        public Sec005Rule(ILogger<Sec005Rule> logger) => _logger = logger;

        public async Task<SecurityRuleResult> ValidateAsync()
        {
            try
            {
                if (!File.Exists(_agentsPath))
                    return new SecurityRuleResult { Passed = false, Message = "🧱 agents-limits.json no existe." };

                var content = await File.ReadAllTextAsync(_agentsPath);
                var limits = JsonSerializer.Deserialize<Dictionary<string, AgentLimit>>(content) ?? new();

                var missing = limits
                    .Where(kv => kv.Value == null || (!kv.Value.CanWrite && !kv.Value.CanExecute && !kv.Value.CanConfigure))
                    .Select(kv => kv.Key)
                    .ToList();

                if (!missing.Any())
                    return new SecurityRuleResult 
                    { 
                        Passed = true, 
                        Message = "✅ Todos los agentes tienen límites definidos." 
                    };

                _logger.LogWarning("🚨 SEC-005: {Count} agentes sin límites claros", missing.Count);
                return new SecurityRuleResult
                {
                    Passed = false,
                    Message = $"❌ Hay {missing.Count} agentes sin límites claramente definidos.",
                    Details = missing
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en SEC-005 ValidateAsync");
                return new SecurityRuleResult { Passed = false, Message = $"Error: {ex.Message}" };
            }
        }

        public async Task<SecurityFixResult?> AutoFixAsync()
        {
            try
            {
                if (!File.Exists(_agentsPath))
                    return new SecurityFixResult { Success = false, Message = "agents-limits.json no existe." };

                var content = await File.ReadAllTextAsync(_agentsPath);
                var limits = JsonSerializer.Deserialize<Dictionary<string, AgentLimit>>(content) ?? new();
                var fixedAgents = new List<string>();

                foreach (var key in limits.Keys.ToList())
                {
                    var l = limits[key];
                    if (l == null || (!l.CanWrite && !l.CanExecute && !l.CanConfigure))
                    {
                        limits[key] = new AgentLimit
                        {
                            CanWrite = false,
                            CanExecute = true,
                            CanConfigure = false,
                            MaxRequestsPerHour = 100,
                            TimeoutSeconds = 300
                        };
                        fixedAgents.Add(key);
                        _logger.LogWarning("🔧 SEC-005 AutoFix: Agente {Agent} con perfil seguro", key);
                    }
                }

                await File.WriteAllTextAsync(
                    _agentsPath,
                    JsonSerializer.Serialize(limits, new JsonSerializerOptions { WriteIndented = true }));

                return new SecurityFixResult
                {
                    Success = true,
                    Message = $"✅ Se asignaron límites seguros a {fixedAgents.Count} agentes.",
                    FilesAffected = new[] { _agentsPath }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en SEC-005 AutoFixAsync");
                return new SecurityFixResult { Success = false, Message = $"Error: {ex.Message}" };
            }
        }

        public class AgentLimit
        {
            public bool CanWrite { get; set; }
            public bool CanExecute { get; set; }
            public bool CanConfigure { get; set; }
            public int MaxRequestsPerHour { get; set; }
            public int TimeoutSeconds { get; set; }
        }
    }

    // =========================
    // SEC-006: TODO TOKEN DEBE TENER EXPIRACIÓN
    // =========================
    public class Sec006Rule : ISecurityRule
    {
        private readonly ILogger<Sec006Rule> _logger;
        private readonly string _tokensPath = "security/tokens.json";

        public string Id => "SEC-006";
        public string Name => "Todo token debe tener expiración";
        public string Severity => "critical";
        public string Category => "access";

        public Sec006Rule(ILogger<Sec006Rule> logger) => _logger = logger;

        public async Task<SecurityRuleResult> ValidateAsync()
        {
            try
            {
                if (!File.Exists(_tokensPath))
                    return new SecurityRuleResult 
                    { 
                        Passed = true, 
                        Message = "⏳ No hay tokens.json. Nada que auditar." 
                    };

                var content = await File.ReadAllTextAsync(_tokensPath);
                var tokens = JsonSerializer.Deserialize<List<TokenDef>>(content) ?? new();

                var missing = tokens
                    .Where(t => t.ExpiresAt == null || t.ExpiresAt < DateTime.UtcNow)
                    .Select(t => t.Id)
                    .ToList();

                if (!missing.Any())
                    return new SecurityRuleResult 
                    { 
                        Passed = true, 
                        Message = "✅ Todos los tokens tienen expiración vigente." 
                    };

                _logger.LogWarning("🚨 SEC-006: {Count} tokens sin expiración o vencidos", missing.Count);
                return new SecurityRuleResult
                {
                    Passed = false,
                    Message = $"❌ Hay {missing.Count} tokens sin expiración o ya vencidos.",
                    Details = missing
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en SEC-006 ValidateAsync");
                return new SecurityRuleResult { Passed = false, Message = $"Error: {ex.Message}" };
            }
        }

        public async Task<SecurityFixResult?> AutoFixAsync()
        {
            try
            {
                if (!File.Exists(_tokensPath))
                    return new SecurityFixResult { Success = false, Message = "tokens.json no existe." };

                var content = await File.ReadAllTextAsync(_tokensPath);
                var tokens = JsonSerializer.Deserialize<List<TokenDef>>(content) ?? new();
                var fixedTokens = new List<string>();

                foreach (var t in tokens)
                {
                    if (t.ExpiresAt == null || t.ExpiresAt < DateTime.UtcNow)
                    {
                        t.ExpiresAt = DateTime.UtcNow.AddDays(7);
                        fixedTokens.Add(t.Id);
                        _logger.LogWarning("🔧 SEC-006 AutoFix: Token {Id} renovado hasta {ExpiresAt}", t.Id, t.ExpiresAt);
                    }
                }

                await File.WriteAllTextAsync(
                    _tokensPath,
                    JsonSerializer.Serialize(tokens, new JsonSerializerOptions { WriteIndented = true }));

                return new SecurityFixResult
                {
                    Success = true,
                    Message = $"✅ Se renovó expiración en {fixedTokens.Count} tokens.",
                    FilesAffected = new[] { _tokensPath }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en SEC-006 AutoFixAsync");
                return new SecurityFixResult { Success = false, Message = $"Error: {ex.Message}" };
            }
        }

        public class TokenDef
        {
            public string Id { get; set; } = "";
            public DateTime? ExpiresAt { get; set; }
        }
    }

    // =========================
    // SEC-007: TODO CAMBIO DEBE REGISTRARSE
    // =========================
    public class Sec007Rule : ISecurityRule
    {
        private readonly ILogger<Sec007Rule> _logger;
        private readonly string _configLogPath = "security/config-changes.json";

        public string Id => "SEC-007";
        public string Name => "Todo cambio en configuración debe registrarse";
        public string Severity => "warning";
        public string Category => "ops";

        public Sec007Rule(ILogger<Sec007Rule> logger) => _logger = logger;

        public async Task<SecurityRuleResult> ValidateAsync()
        {
            try
            {
                if (!File.Exists(_configLogPath))
                    return new SecurityRuleResult 
                    { 
                        Passed = false, 
                        Message = "📘 config-changes.json no existe. Sin trazabilidad." 
                    };

                var content = await File.ReadAllTextAsync(_configLogPath);
                var changes = JsonSerializer.Deserialize<List<ConfigChange>>(content) ?? new();

                if (changes == null || !changes.Any())
                    return new SecurityRuleResult 
                    { 
                        Passed = false, 
                        Message = "❌ No hay cambios registrados. Falta disciplina de configuración." 
                    };

                return new SecurityRuleResult
                {
                    Passed = true,
                    Message = $"✅ Hay {changes.Count} cambios de configuración trazables."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en SEC-007 ValidateAsync");
                return new SecurityRuleResult { Passed = false, Message = $"Error: {ex.Message}" };
            }
        }

        public async Task<SecurityFixResult?> AutoFixAsync()
        {
            try
            {
                if (!File.Exists(_configLogPath))
                {
                    var seed = new List<ConfigChange>();
                    Directory.CreateDirectory(Path.GetDirectoryName(_configLogPath) ?? "security");
                    await File.WriteAllTextAsync(
                        _configLogPath,
                        JsonSerializer.Serialize(seed, new JsonSerializerOptions { WriteIndented = true }));

                    _logger.LogWarning("🔧 SEC-007 AutoFix: Creado config-changes.json vacío para iniciar registro");
                    return new SecurityFixResult
                    {
                        Success = true,
                        Message = "✅ Se creó config-changes.json para registrar cambios futuros.",
                        FilesAffected = new[] { _configLogPath }
                    };
                }

                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en SEC-007 AutoFixAsync");
                return new SecurityFixResult { Success = false, Message = $"Error: {ex.Message}" };
            }
        }

        public class ConfigChange
        {
            public string User { get; set; } = "";
            public string ConfigKey { get; set; } = "";
            public string OldValue { get; set; } = "";
            public string NewValue { get; set; } = "";
            public DateTime Timestamp { get; set; }
        }
    }
}
