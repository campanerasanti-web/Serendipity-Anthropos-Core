// ============================================================================
// PROGRAM.CS - CONFIGURACIÓN REQUERIDA PARA INTELLIGENT DASHBOARD
// ============================================================================
// VERIFICACIONES Y CAMBIOS NECESARIOS EN tu Program.cs

/*
📋 CHECKLIST - Asegúrate de que Program.cs tenga esto:

1. SERVICIOS REGISTRADOS (en builder.Services):
   ✅ builder.Services.AddControllers();
   ✅ builder.Services.AddScoped<EventService>();
   ✅ builder.Services.AddScoped<GuidedAssistantService>();
   ✅ builder.Services.AddDbContext<AppDbContext>(...);
   ✅ builder.Services.AddCors(...);

2. MIDDLEWARE MAPEADO (en app):
   ✅ app.UseCors(...);
   ✅ app.MapControllers();
   ✅ app.MapRazorPages();

3. ENDPOINTS REGISTRADOS:
   ✅ POST /api/manual-input
   ✅ POST /api/anthropos/run
   ✅ GET /api/anthropos/last-report
   ✅ GET /health (health check)

================================
*/

/*
EJEMPLO COMPLETO DE PROGRAM.CS:

using ElMediadorDeSofia.Data;
using ElMediadorDeSofia.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplicationBuilder.CreateBuilder(args);

// ========== SERVICIOS ==========

// Controllers
builder.Services.AddControllers();

// CORS - Permitir solicitudes del frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5177", "http://localhost:5176")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Services
builder.Services.AddScoped<EventService>();
builder.Services.AddScoped<GuidedAssistantService>();
builder.Services.AddScoped<InvoiceService>();
builder.Services.AddScoped<LotCloseService>();
builder.Services.AddScoped<PackingListService>();

// Logging
builder.Services.AddLogging(config =>
{
    config.AddConsole();
    config.AddDebug();
});

// ========== APP ==========

var app = builder.Build();

// Middleware de CORS ANTES de Controllers
app.UseCors("AllowFrontend");

// Controllers
app.MapControllers();

// Health Check (opcional pero recomendado)
app.MapGet("/health", async (IServiceProvider services) =>
{
    var db = services.GetRequiredService<AppDbContext>();
    try
    {
        await db.EventRecords.CountAsync();
        return Results.Ok(new { status = "healthy", timestamp = DateTime.Now });
    }
    catch
    {
        return Results.StatusCode(500);
    }
});

// Ejecutar
app.Run("http://localhost:5000");

// ========= FIN PROGRAM.CS ==========
*/

// NOTAS IMPORTANTES:

// 1. VERIFICAR APPSETTINGS:
//    {
//      "ConnectionStrings": {
//        "DefaultConnection": "Host=localhost;Database=sofia_db;Username=postgres;Password=..."
//      }
//    }

// 2. VERIFICAR MODELOS (en Data/AppDbContext.cs):
//    - ✅ DbSet<EventRecord> EventRecords
//    - ✅ DbSet<Invoice> Invoices
//    - ✅ DbSet<FixedCosts> FixedCosts
//    - ✅ DbSet<DailyMetrics> DailyMetrics

// 3. MIGRATIONS:
//    dotnet ef migrations add InitialCreate
//    dotnet ef database update

// 4. CARPETA UPLOADS:
//    Crear en raíz del backend: mkdir uploads
//    Asegurar permisos de escritura

// 5. LOGS DE EJECUCIÓN:
//    - En consola verás:
//      ✅ "info: Microsoft.Hosting.Lifetime[0]"
//      ✅ "Now listening on: http://localhost:5000"
//      ✅ "Application started"

// 6. PRUEBA LOS ENDPOINTS:
//    curl http://localhost:5000/health
//    curl -X POST http://localhost:5000/api/anthropos/run

// ✅ SI TODO FUNCIONA:
//    - Frontend envía POST /api/manual-input ✅
//    - Backend guarda datos ✅
//    - Frontend invalida queries ✅
//    - Dashboard se refresca ✅
//    - POST /api/anthropos/run ejecuta agentes ✅

// ⚠️ ERRORES COMUNES:
// 1. "Cannot POST /api/manual-input"
//    → Falta: app.MapControllers();

// 2. "CORS error: No 'Access-Control-Allow-Origin'"
//    → Falta: app.UseCors("AllowFrontend");

// 3. "Cannot connect to database"
//    → Revisar: ConnectionString en appsettings.json

// 4. "IntelligentDashboardController not found"
//    → Asegúrate que está en Controllers/IntelligentDashboardController.cs
//    → Verifica namespace: namespace ElMediadorDeSofia.Controllers;

// 5. "EventService method not found"
//    → Asegúrate de compilar: dotnet build
//    → Ve que AnthroposAgentsExtension.cs esté compilado
