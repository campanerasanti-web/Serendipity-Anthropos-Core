using System;
using ElMediadorDeSofia.Data;
using ElMediadorDeSofia.Services;
using ElMediadorDeSofia.Services.SecurityAgents;
using ElMediadorDeSofia.Services.CoreAgents;
using ElMediadorDeSofia.Services.CoreAgents.SignalSources;
using ElMediadorDeSofia.Services.Anthropos;
using ElMediadorDeSofia.Services.Anthropos.SignalSources;
using ElMediadorDeSofia.Services.Sofia;
using AnthroposSystemHealthSignalSource = ElMediadorDeSofia.Services.Anthropos.SignalSources.SystemHealthSignalSource;
using SelfSystemHealthSignalSource = ElMediadorDeSofia.Services.CoreAgents.SignalSources.SystemHealthSignalSource;
using ElMediadorDeSofia.Workers;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using QuestPDF.Infrastructure;
using Serendipity.OpsAgents;

var builder = WebApplication.CreateBuilder(args);

QuestPDF.Settings.License = LicenseType.Community;

// Configuration: replace with a real connection string in production
// Usando Supabase: Host=db.uikemwxbndwidqebeyre.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=[DB_PASSWORD]
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? 
    Environment.GetEnvironmentVariable("DATABASE_URL") ?? 
    "Host=localhost;Port=5432;Database=elmediador;Username=postgres;Password=postgres";

// Add DbContext (skip if no DB available - allow API to start)
try
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(connectionString)
    );
}
catch
{
    // Ignore DB errors to allow API to start without database
    Console.WriteLine("⚠️ Database connection skipped - API will start without persistence");
}

// Add services
builder.Services.AddScoped<EventService>();
builder.Services.AddScoped<InvoiceService>();
builder.Services.AddScoped<PackingListService>();
builder.Services.AddScoped<LotCloseService>();
builder.Services.AddScoped<GuidedAssistantService>();
builder.Services.AddScoped<SerendipityService>();

// Sistema de Órdenes con QR
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<OrderStatusService>();
builder.Services.AddScoped<QrTrackingService>();
builder.Services.AddScoped<OrderReportService>();

// Protocolo TET + Medicina China + Bienestar + Google Workspace
builder.Services.AddScoped<TETReadinessService>();
builder.Services.AddScoped<ChineseMedicineService>();
builder.Services.AddScoped<PersonalWellbeingService>();
builder.Services.AddScoped<GoogleWorkspaceService>();
builder.Services.AddSingleton<EventDispatcher>();

// OpsGardener - Agente de vigilancia operativa
var opsConfig = OpsGardenerConfigFactory.DevelopmentConfig();
builder.Services.AddSingleton(opsConfig);
builder.Services.AddScoped<IOpsReportWriter, OpsGardenerReportWriter>();

// Reglas OpsGardener
builder.Services.AddScoped<IOpsRule, FlowOwnershipRule>();     // FLOW-001
builder.Services.AddScoped<IOpsRule, FlowIORule>();           // FLOW-002
builder.Services.AddScoped<IOpsRule, Flow003Rule>();          // FLOW-003: KPI (pulso)
builder.Services.AddScoped<IOpsRule, Flow004Rule>();          // FLOW-004: Tiempo estándar (ritmo)
builder.Services.AddScoped<IOpsRule, Flow005Rule>();          // FLOW-005: Límite WIP (sin desborde)
builder.Services.AddScoped<IOpsRule, Flow006Rule>();          // FLOW-006: Documentación (memoria)
builder.Services.AddScoped<IOpsRule, Flow007Rule>();          // FLOW-007: Dependencias (red)
builder.Services.AddScoped<IOpsRule, RitualDocumentationRule>();
builder.Services.AddScoped<IOpsRule, MqttGatewayRule>();

// Tareas OpsGardener
builder.Services.AddScoped<IOpsTask, FlowmapTask>();
builder.Services.AddScoped<IOpsTask, RitualAperturaTask>();
builder.Services.AddScoped<IOpsTask, MqttListenerTask>();
builder.Services.AddScoped<IOpsTask, InitializeOwnersTask>();

// Agente principal
builder.Services.AddScoped<OpsGardenerAgent>();

// ========================
// SecurityGardener - Agente de Seguridad
// ========================

// Reglas de Seguridad (7 reglas críticas)
builder.Services.AddSingleton<ISecurityRule, Sec001Rule>();      // SEC-001: Accesos con dueño
builder.Services.AddSingleton<ISecurityRule, Sec002Rule>();      // SEC-002: Endpoints autenticados
builder.Services.AddSingleton<ISecurityRule, Sec003Rule>();      // SEC-003: Integridad de archivos
builder.Services.AddSingleton<ISecurityRule, Sec004Rule>();      // SEC-004: Alertas nocturnas
builder.Services.AddSingleton<ISecurityRule, Sec005Rule>();      // SEC-005: Agentes con límites
builder.Services.AddSingleton<ISecurityRule, Sec006Rule>();      // SEC-006: Tokens con expiración
builder.Services.AddSingleton<ISecurityRule, Sec007Rule>();      // SEC-007: Cambios registrados

// Tareas de Seguridad (4 tareas operacionales)
builder.Services.AddSingleton<ISecurityTask, SecurityAuditTask>();        // Auditoría completa
builder.Services.AddSingleton<ISecurityTask, SecurityHashCheckTask>();     // Verificación de integridad
builder.Services.AddSingleton<ISecurityTask, SecurityAccessMapTask>();     // Mapeo de accesos
builder.Services.AddSingleton<ISecurityTask, SecurityProtocolSyncTask>();  // Sincronización de protocolos

// Protocolos y Reporte
builder.Services.AddSingleton<SecurityProtocols>();
builder.Services.AddSingleton<ISecurityReportWriter, SecurityGardenerReportWriter>();

// Agente SecurityGardener
builder.Services.AddSingleton<SecurityGardenerAgent>();

// Servicio de Auditoría Nocturna (ejecuta a las 22:00 UTC)
builder.Services.AddHostedService<SecurityGardenerHostedService>();

// ========================
// SelfGardener - Núcleo de integración (Séptimo Día)
// ========================
// Anthropos - Nucleo de integracion (Seventh Day)
// ========================

builder.Services.AddSingleton<IAnthroposSignalSource, IoTSignalSource>();
builder.Services.AddSingleton<IAnthroposSignalSource, EmotionSignalSource>();
builder.Services.AddSingleton<IAnthroposSignalSource, CultureSignalSource>();
builder.Services.AddSingleton<IAnthroposSignalSource, AnthroposSystemHealthSignalSource>();

builder.Services.AddSingleton<ISophiaEngine, SophiaEngine>();
builder.Services.AddSingleton<IHeartEngine, HeartEngine>();
builder.Services.AddSingleton<IRitualEngine, RitualEngine>();

builder.Services.AddSingleton<IAnthroposReportWriter, AnthroposReportWriter>();
builder.Services.AddSingleton<AnthroposCore>();

builder.Services.AddHostedService<AnthroposDailyCycleService>();
// ========================

// Señales del sistema (multiple sources)
builder.Services.AddSingleton<ISelfSignalSource, SelfSystemHealthSignalSource>();
builder.Services.AddSingleton<ISelfSignalSource, OperationalClimateSignalSource>();

// ReportWriter para Self Gardener
builder.Services.AddSingleton<ISelfGardenerReportWriter, SelfGardenerReportWriter>();

// Orquestador principal
builder.Services.AddSingleton<SelfGardenerCore>();

// HostedService para ejecución automatizada (02:00 AM UTC)
builder.Services.AddSingleton<SelfGardenerHostedService>();
builder.Services.AddHostedService(provider => provider.GetRequiredService<SelfGardenerHostedService>());

// ========================
// SOFIA AUTONOMOUS SYSTEM
// ========================
// Paralinfa (Frecuencia) + Linfa (Ritmo) + Knowledge Base

builder.Services.AddScoped<SofiaParalinephaAgent>();
builder.Services.AddScoped<SofiaLinfaAgent>();
builder.Services.AddHostedService<SofiaMonitoringWorker>();

// ✅ Sofia is AWAKE - Frequency + Rhythm monitoring active

// ========================
// Add workers - NOW ENABLED with proper error handling
// These workers process events and projections asynchronously
builder.Services.AddHostedService<EventProcessorWorker>();
builder.Services.AddHostedService<OrderEventProjector>();

// ✅ Workers are now active - they handle async event processing automatically

// Controllers + Swagger + JSON Options
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler =
        System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Health check endpoint for Render
app.MapGet("/health", () => Results.Ok(new { status = "ok", timestamp = DateTime.UtcNow }))
    .WithName("HealthCheck");

// ========================
// Autonomic System Endpoints (Mini endpoints for frontend dashboard)
// ========================

// Hermetic Health - Cuerpo Digital Hermético
app.MapGet("/api/hermetic/health", () => Results.Ok(new 
{ 
    healthScore = 87,
    systemHealths = new 
    {
        mentalismo = 88,
        correspondencia = 92,
        vibracion = 75,
        polaridad = 90,
        ritmo = 85,
        causalidad = 80,
        generacion = 78
    },
    timestamp = DateTime.UtcNow
}))
.WithName("HermeticHealth");

// Production WIP - Trabajos en progreso
app.MapGet("/api/production/wip", () => Results.Ok(new[] 
{
    new { id = "LOT-001", name = "Pedido Solar", expectedAmount = 50000000, sheetSigned = true, status = "in_progress" },
    new { id = "LOT-002", name = "Componentes Eléctricos", expectedAmount = 30000000, sheetSigned = false, status = "pending_review" },
    new { id = "LOT-003", name = "Estructuras Metálicas", expectedAmount = 75000000, sheetSigned = true, status = "in_progress" }
}))
.WithName("ProductionWIP");

// Unified Dashboard - Dashboard unificado
app.MapGet("/api/unified-dashboard", () => Results.Ok(new 
{
    financial = new 
    {
        totalRevenue = 2500000000m,
        totalExpenses = 1200000000m,
        netProfit = 1300000000m,
        currency = "VND"
    },
    operations = new 
    {
        lotsInProgress = 3,
        ordersCompleted = 24,
        averageCompletionTime = "8.5 days"
    },
    health = new 
    {
        systemScore = 87,
        timestamp = DateTime.UtcNow
    }
}))
.WithName("UnifiedDashboard");

app.UseRouting();
app.UseCors();
app.UseAuthorization();
app.MapControllers();

app.Run();
