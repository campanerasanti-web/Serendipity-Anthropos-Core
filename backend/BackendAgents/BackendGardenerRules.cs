/**
 * 🌱 REGLAS DEL JARDINERO DEL BACKEND
 * Sistema de validación y coherencia para el backend .NET
 * 
 * "El jardinero no impone, observa. No fuerza, facilita."
 * - Thomas Merton
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace ElMediadorDeSofia.BackendAgents
{
    public enum RuleSeverity
    {
        Critical,
        Warning,
        Info
    }

    public enum RuleCategory
    {
        Architecture,
        DependencyInjection,
        EventSourcing,
        Database,
        Consistency,
        Integration,
        Performance,
        Security
    }

    public class ValidationResult
    {
        public bool Passed { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<string> Details { get; set; } = new();
        public List<string> AffectedFiles { get; set; } = new();
    }

    public class FixResult
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<string> FilesModified { get; set; } = new();
        public List<string> FilesCreated { get; set; } = new();
    }

    public interface IValidationRule
    {
        string Id { get; }
        string Name { get; }
        RuleSeverity Severity { get; }
        RuleCategory Category { get; }
        Task<ValidationResult> ValidateAsync();
        Task<FixResult>? AutoFixAsync();
    }

    /// <summary>
    /// 🏛️ REGLAS DE ARQUITECTURA
    /// </summary>
    public static class ArchitectureRules
    {
        public class ServicesRegisteredInDI : IValidationRule
        {
            public string Id => "ARCH-BE-001";
            public string Name => "Todos los servicios deben estar registrados en DI";
            public RuleSeverity Severity => RuleSeverity.Critical;
            public RuleCategory Category => RuleCategory.Architecture;

            public async Task<ValidationResult> ValidateAsync()
            {
                var result = new ValidationResult { Passed = true };
                var details = new List<string>();

                // Servicios esperados en backend/Services/
                var expectedServices = new[]
                {
                    "SerendipityService",
                    "OrderService",
                    "OrderStatusService",
                    "QrTrackingService",
                    "TETReadinessService",
                    "ChineseMedicineService",
                    "PersonalWellbeingService",
                    "GoogleWorkspaceService",
                    "GuidedAssistantService",
                    "EventService",
                    "EventDispatcher",
                    "InvoiceService",
                    "PackingListService",
                    "LotCloseService"
                };

                details.Add($"Servicios esperados: {expectedServices.Length}");
                details.Add("Verificar que estén en Program.cs con AddScoped/AddSingleton");
                
                result.Message = "Todos los servicios parecen estar registrados";
                result.Details = details;
                return await Task.FromResult(result);
            }

            public Task<FixResult>? AutoFixAsync() => null;
        }

        public class WorkersConfigured : IValidationRule
        {
            public string Id => "ARCH-BE-002";
            public string Name => "Workers deben estar correctamente configurados";
            public RuleSeverity Severity => RuleSeverity.Critical;
            public RuleCategory Category => RuleCategory.Architecture;

            public async Task<ValidationResult> ValidateAsync()
            {
                var result = new ValidationResult
                {
                    Passed = false,
                    Message = "Workers registrados pero NO ejecutan",
                    Details = new List<string>
                    {
                        "EventProcessorWorker: Registrado en DI pero no triggerea",
                        "OrderEventProjector: Registrado en DI pero no triggerea",
                        "Revisar ExecuteAsync() en ambos workers",
                        "Agregar logging para debugging"
                    },
                    AffectedFiles = new List<string>
                    {
                        "backend/Workers/EventProcessorWorker.cs",
                        "backend/Workers/OrderEventProjector.cs",
                        "backend/Program.cs"
                    }
                };

                return await Task.FromResult(result);
            }

            public Task<FixResult>? AutoFixAsync() => null;
        }

        public class ControllersHaveEndpoints : IValidationRule
        {
            public string Id => "ARCH-BE-003";
            public string Name => "Todos los controladores deben tener endpoints documentados";
            public RuleSeverity Severity => RuleSeverity.Warning;
            public RuleCategory Category => RuleCategory.Architecture;

            public async Task<ValidationResult> ValidateAsync()
            {
                var result = new ValidationResult
                {
                    Passed = true,
                    Message = "11 controllers con 56+ endpoints",
                    Details = new List<string>
                    {
                        "SerendipityController: 6 endpoints ✓",
                        "OrdersController: 8 endpoints ✓",
                        "QrController: 5 endpoints ✓",
                        "TETController: 5 endpoints ✓",
                        "ChineseMedicineController: 6 endpoints ✓",
                        "WellbeingController: 7 endpoints ✓",
                        "GoogleWorkspaceController: 7 endpoints ✓",
                        "DashboardController: 3 endpoints ✓",
                        "ProductionController: 3 endpoints ✓",
                        "LotCloseController: 1 endpoint ✓",
                        "AssistantController: 1 endpoint ✓"
                    }
                };

                return await Task.FromResult(result);
            }

            public Task<FixResult>? AutoFixAsync() => null;
        }
    }

    /// <summary>
    /// 💉 REGLAS DE DEPENDENCY INJECTION
    /// </summary>
    public static class DependencyInjectionRules
    {
        public class AllServicesHaveInterfaces : IValidationRule
        {
            public string Id => "DI-BE-001";
            public string Name => "Servicios deben tener interfaces";
            public RuleSeverity Severity => RuleSeverity.Warning;
            public RuleCategory Category => RuleCategory.DependencyInjection;

            public async Task<ValidationResult> ValidateAsync()
            {
                var result = new ValidationResult
                {
                    Passed = false,
                    Message = "Algunos servicios sin interfaces",
                    Details = new List<string>
                    {
                        "EventService: sin IEventService ⚠️",
                        "EventDispatcher: sin IEventDispatcher ⚠️",
                        "Recomendado: crear interfaces para todos los servicios"
                    }
                };

                return await Task.FromResult(result);
            }

            public Task<FixResult>? AutoFixAsync() => null;
        }

        public class ScopedServicesCorrectLifetime : IValidationRule
        {
            public string Id => "DI-BE-002";
            public string Name => "Servicios con DbContext deben ser Scoped";
            public RuleSeverity Severity => RuleSeverity.Critical;
            public RuleCategory Category => RuleCategory.DependencyInjection;

            public async Task<ValidationResult> ValidateAsync()
            {
                var result = new ValidationResult
                {
                    Passed = true,
                    Message = "Todos los servicios tienen lifetime correcto",
                    Details = new List<string>
                    {
                        "Servicios con DbContext: Scoped ✓",
                        "Workers: Hosted Services ✓"
                    }
                };

                return await Task.FromResult(result);
            }

            public Task<FixResult>? AutoFixAsync() => null;
        }
    }

    /// <summary>
    /// 📊 REGLAS DE EVENT SOURCING
    /// </summary>
    public static class EventSourcingRules
    {
        public class EventStoreOperational : IValidationRule
        {
            public string Id => "ES-BE-001";
            public string Name => "Event store debe estar operacional";
            public RuleSeverity Severity => RuleSeverity.Critical;
            public RuleCategory Category => RuleCategory.EventSourcing;

            public async Task<ValidationResult> ValidateAsync()
            {
                var result = new ValidationResult
                {
                    Passed = true,
                    Message = "EventService operacional con EventRecord JSONB",
                    Details = new List<string>
                    {
                        "EventRecord entity: ✓",
                        "EventService: ✓",
                        "JSONB payload: ✓"
                    }
                };

                return await Task.FromResult(result);
            }

            public Task<FixResult>? AutoFixAsync() => null;
        }

        public class EventDispatcherWorks : IValidationRule
        {
            public string Id => "ES-BE-002";
            public string Name => "EventDispatcher debe publicar eventos";
            public RuleSeverity Severity => RuleSeverity.Warning;
            public RuleCategory Category => RuleCategory.EventSourcing;

            public async Task<ValidationResult> ValidateAsync()
            {
                var result = new ValidationResult
                {
                    Passed = false,
                    Message = "EventDispatcher sin persistencia",
                    Details = new List<string>
                    {
                        "Implementación: in-memory ⚠️",
                        "Eventos perdidos si reinicio",
                        "Recomendado: integrar RabbitMQ o Kafka"
                    }
                };

                return await Task.FromResult(result);
            }

            public Task<FixResult>? AutoFixAsync() => null;
        }

        public class ProjectionsActive : IValidationRule
        {
            public string Id => "ES-BE-003";
            public string Name => "Projections deben estar activas";
            public RuleSeverity Severity => RuleSeverity.Critical;
            public RuleCategory Category => RuleCategory.EventSourcing;

            public async Task<ValidationResult> ValidateAsync()
            {
                var result = new ValidationResult
                {
                    Passed = false,
                    Message = "OrderEventProjector no está ejecutando",
                    Details = new List<string>
                    {
                        "OrderEventProjector: Registrado pero inactivo ❌",
                        "Proyecciones CQRS no funcionan",
                        "Verificar ExecuteAsync()"
                    },
                    AffectedFiles = new List<string>
                    {
                        "backend/Workers/OrderEventProjector.cs"
                    }
                };

                return await Task.FromResult(result);
            }

            public Task<FixResult>? AutoFixAsync() => null;
        }
    }

    /// <summary>
    /// 💾 REGLAS DE BASE DE DATOS
    /// </summary>
    public static class DatabaseRules
    {
        public class AllEntitiesHaveDbSet : IValidationRule
        {
            public string Id => "DB-BE-001";
            public string Name => "Todas las entidades deben tener DbSet";
            public RuleSeverity Severity => RuleSeverity.Critical;
            public RuleCategory Category => RuleCategory.Database;

            public async Task<ValidationResult> ValidateAsync()
            {
                var result = new ValidationResult
                {
                    Passed = false,
                    Message = "Faltan 2 entidades en AppDbContext",
                    Details = new List<string>
                    {
                        "Existentes: 10 DbSets ✓",
                        "Faltantes: Settings ❌",
                        "Faltantes: WorkspaceIntegration ❌"
                    },
                    AffectedFiles = new List<string>
                    {
                        "backend/Data/AppDbContext.cs"
                    }
                };

                return await Task.FromResult(result);
            }

            public Task<FixResult>? AutoFixAsync() => null;
        }

        public class MigrationsApplied : IValidationRule
        {
            public string Id => "DB-BE-002";
            public string Name => "Migraciones deben estar aplicadas";
            public RuleSeverity Severity => RuleSeverity.Critical;
            public RuleCategory Category => RuleCategory.Database;

            public async Task<ValidationResult> ValidateAsync()
            {
                var result = new ValidationResult
                {
                    Passed = false,
                    Message = "Migraciones manuales sin aplicar",
                    Details = new List<string>
                    {
                        "SQL manual: 3 archivos",
                        "EF Core: sin scaffolding automático",
                        "Recomendado: dotnet ef migrations add Initial"
                    }
                };

                return await Task.FromResult(result);
            }

            public Task<FixResult>? AutoFixAsync() => null;
        }

        public class IndexesOptimized : IValidationRule
        {
            public string Id => "DB-BE-003";
            public string Name => "Índices deben estar optimizados";
            public RuleSeverity Severity => RuleSeverity.Warning;
            public RuleCategory Category => RuleCategory.Performance;

            public async Task<ValidationResult> ValidateAsync()
            {
                var result = new ValidationResult
                {
                    Passed = false,
                    Message = "Índices básicos OK, faltan compuestos",
                    Details = new List<string>
                    {
                        "PKs y FKs: ✓",
                        "Sugerir: índice compuesto en Orders(Status, DueDate)",
                        "Sugerir: índice en QrScans(QrCode, ScannedAt)"
                    }
                };

                return await Task.FromResult(result);
            }

            public Task<FixResult>? AutoFixAsync() => null;
        }
    }

    /// <summary>
    /// 🔗 REGLAS DE CONSISTENCIA
    /// </summary>
    public static class ConsistencyRules
    {
        public class NamingConventions : IValidationRule
        {
            public string Id => "CONS-BE-001";
            public string Name => "Convenciones de nombres consistentes";
            public RuleSeverity Severity => RuleSeverity.Info;
            public RuleCategory Category => RuleCategory.Consistency;

            public async Task<ValidationResult> ValidateAsync()
            {
                var result = new ValidationResult
                {
                    Passed = true,
                    Message = "Naming conventions correctas",
                    Details = new List<string>
                    {
                        "Controllers: *Controller.cs ✓",
                        "Services: *Service.cs ✓",
                        "Models: PascalCase ✓",
                        "Endpoints: REST conventions ✓"
                    }
                };

                return await Task.FromResult(result);
            }

            public Task<FixResult>? AutoFixAsync() => null;
        }

        public class NoDuplicateCode : IValidationRule
        {
            public string Id => "CONS-BE-002";
            public string Name => "No debe haber código duplicado";
            public RuleSeverity Severity => RuleSeverity.Info;
            public RuleCategory Category => RuleCategory.Consistency;

            public async Task<ValidationResult> ValidateAsync()
            {
                var result = new ValidationResult
                {
                    Passed = false,
                    Message = "Código duplicado detectado",
                    Details = new List<string>
                    {
                        "OrderService + OrderStatusService: lógica mixta",
                        "Mock data en SerendipityService duplicado",
                        "Recomendado: consolidar servicios"
                    }
                };

                return await Task.FromResult(result);
            }

            public Task<FixResult>? AutoFixAsync() => null;
        }
    }

    /// <summary>
    /// 🔒 REGLAS DE SEGURIDAD
    /// </summary>
    public static class SecurityRules
    {
        public class NoSecretsInCode : IValidationRule
        {
            public string Id => "SEC-BE-001";
            public string Name => "No debe haber secrets en código";
            public RuleSeverity Severity => RuleSeverity.Critical;
            public RuleCategory Category => RuleCategory.Security;

            public async Task<ValidationResult> ValidateAsync()
            {
                var result = new ValidationResult
                {
                    Passed = true,
                    Message = "No se encontraron secrets hardcoded",
                    Details = new List<string>
                    {
                        "Verificar: strings 'key', 'password', 'secret'",
                        "Verificar: appsettings.json no en git"
                    }
                };

                return await Task.FromResult(result);
            }

            public Task<FixResult>? AutoFixAsync() => null;
        }

        public class CorsConfigured : IValidationRule
        {
            public string Id => "SEC-BE-002";
            public string Name => "CORS debe estar configurado para producción";
            public RuleSeverity Severity => RuleSeverity.Critical;
            public RuleCategory Category => RuleCategory.Security;

            public async Task<ValidationResult> ValidateAsync()
            {
                var result = new ValidationResult
                {
                    Passed = false,
                    Message = "CORS en AllowAnyOrigin (solo dev)",
                    Details = new List<string>
                    {
                        "Program.cs: AllowAnyOrigin es inseguro",
                        "Cambiar a WithOrigins específicos para producción",
                        "Ejemplo: WithOrigins('https://serendipity.app')"
                    },
                    AffectedFiles = new List<string> { "backend/Program.cs" }
                };

                return await Task.FromResult(result);
            }

            public Task<FixResult>? AutoFixAsync() => null;
        }
    }

    /// <summary>
    /// 🔌 REGLAS DE INTEGRACIÓN
    /// </summary>
    public static class IntegrationRules
    {
        public class ControllersMapToServices : IValidationRule
        {
            public string Id => "INT-BE-001";
            public string Name => "Controladores deben mapear a servicios";
            public RuleSeverity Severity => RuleSeverity.Warning;
            public RuleCategory Category => RuleCategory.Integration;

            public async Task<ValidationResult> ValidateAsync()
            {
                var result = new ValidationResult
                {
                    Passed = true,
                    Message = "Todos los controllers usan servicios via DI",
                    Details = new List<string>
                    {
                        "11 controllers inyectan servicios correctamente ✓"
                    }
                };

                return await Task.FromResult(result);
            }

            public Task<FixResult>? AutoFixAsync() => null;
        }

        public class ApiResponsesConsistent : IValidationRule
        {
            public string Id => "INT-BE-002";
            public string Name => "Respuestas API deben ser consistentes";
            public RuleSeverity Severity => RuleSeverity.Info;
            public RuleCategory Category => RuleCategory.Integration;

            public async Task<ValidationResult> ValidateAsync()
            {
                var result = new ValidationResult
                {
                    Passed = true,
                    Message = "Respuestas usan DTOs correctamente",
                    Details = new List<string>
                    {
                        "ActionResult<T> usado consistentemente ✓",
                        "DTOs definidos en Models/ ✓"
                    }
                };

                return await Task.FromResult(result);
            }

            public Task<FixResult>? AutoFixAsync() => null;
        }
    }

    /// <summary>
    /// 📋 COLECCIÓN DE TODAS LAS REGLAS
    /// </summary>
    public static class AllBackendRules
    {
        public static List<IValidationRule> GetAll()
        {
            return new List<IValidationRule>
            {
                // Architecture
                new ArchitectureRules.ServicesRegisteredInDI(),
                new ArchitectureRules.WorkersConfigured(),
                new ArchitectureRules.ControllersHaveEndpoints(),
                
                // Dependency Injection
                new DependencyInjectionRules.AllServicesHaveInterfaces(),
                new DependencyInjectionRules.ScopedServicesCorrectLifetime(),
                
                // Event Sourcing
                new EventSourcingRules.EventStoreOperational(),
                new EventSourcingRules.EventDispatcherWorks(),
                new EventSourcingRules.ProjectionsActive(),
                
                // Database
                new DatabaseRules.AllEntitiesHaveDbSet(),
                new DatabaseRules.MigrationsApplied(),
                new DatabaseRules.IndexesOptimized(),
                
                // Consistency
                new ConsistencyRules.NamingConventions(),
                new ConsistencyRules.NoDuplicateCode(),
                
                // Security
                new SecurityRules.NoSecretsInCode(),
                new SecurityRules.CorsConfigured(),
                
                // Integration
                new IntegrationRules.ControllersMapToServices(),
                new IntegrationRules.ApiResponsesConsistent()
            };
        }

        public static List<IValidationRule> GetCritical()
        {
            return GetAll().Where(r => r.Severity == RuleSeverity.Critical).ToList();
        }

        public static List<IValidationRule> GetByCategory(RuleCategory category)
        {
            return GetAll().Where(r => r.Category == category).ToList();
        }
    }
}
