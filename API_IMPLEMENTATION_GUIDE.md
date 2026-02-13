# API IMPLEMENTATION GUIDE
## Complete Backend Integration for Anthropos Dashboard

---

## 📋 OVERVIEW

This guide shows how to implement the 8 required API endpoints in either:
1. **Express.js (Node.js)** - Frontend-native stack
2. **.NET 8.0** - Existing backend infrastructure

Both will enable the `IntelligentDashboard.tsx` and `TemploInterior.tsx` components to function.

---

## 🚀 OPTION 1: EXPRESS.JS BACKEND

### Setup

```bash
# Install dependencies
npm install express multer cors dotenv typescript ts-node @types/express @types/node

# Create .env file
cat > .env << 'EOF'
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
DATABASE_URL=your_database_url
EOF

# Run server
npx ts-node backend/api-server.ts
```

### File: `backend/api-server.ts` ✅ ALREADY CREATED

Contains all 8 endpoints with mock data + integration points for:
- `OpsGardenerAgent.AnalyzeManualInput()`
- `SecurityGardenerAgent.RunCheckup()`
- `SelfGardener.EvaluateHeart()`
- `SophiaEngine.GenerateInsights()`

### Integration Points (TODO):

**In `POST /api/manual-input`:**
```typescript
// Line 185-195: Replace mock with real agents
const opsResult = await OpsGardenerAgent.AnalyzeManualInput({
  income: parseFloat(income),
  costs: parseFloat(costs),
  description
});

// Store file in cloud
const storageUrl = await uploadToCloudStorage(req.file);
```

**In `POST /api/anthropos/run`:**
```typescript
// Line 239-250: Execute all agents in parallel
const [ops, security, heart, insights] = await Promise.all([
  OpsGardenerAgent.RunCheckupAsync(),
  SecurityGardenerAgent.RunCheckupAsync(),
  SelfGardener.EvaluateHeartAsync(),
  SophiaEngine.GenerateInsightsAsync()
]);

// Aggregate into AnthroposReport
const report = AggregateCheckupResults(ops, security, heart, insights);
```

---

## 🔌 OPTION 2: .NET 8.0 BACKEND

### Install Dependencies

```bash
dotnet add package Microsoft.AspNetCore.Mvc
dotnet add package System.ComponentModel.DataAnnotations
```

### Create Controller: `backend/Controllers/DashboardController.cs`

```csharp
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using YourNamespace.Models;
using YourNamespace.Services;

namespace YourNamespace.Controllers;

[ApiController]
[Route("api")]
[Produces("application/json")]
public class DashboardController : ControllerBase
{
    private readonly IFinancialService _financialService;
    private readonly IAnthroposService _anthroposService;
    private readonly IOpsGardenerAgent _opsGardener;
    private readonly ISecurityGardenerAgent _securityGardener;

    public DashboardController(
        IFinancialService financial,
        IAnthroposService anthropos,
        IOpsGardenerAgent opsGardener,
        ISecurityGardenerAgent securityGardener)
    {
        _financialService = financial;
        _anthroposService = anthropos;
        _opsGardener = opsGardener;
        _securityGardener = securityGardener;
    }

    // ============================================================
    // FINANCIAL DATA ENDPOINTS (6 GET)
    // ============================================================

    /// <summary>
    /// GET /api/unified-dashboard
    /// Returns current financial metrics and system health
    /// Frontend uses: useQuery({ queryKey: ['dashboard'] })
    /// </summary>
    [HttpGet("unified-dashboard")]
    [ProducesResponseType(typeof(StatsDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUnifiedDashboard()
    {
        try
        {
            var stats = await _financialService.GetCurrentStatsAsync();
            return Ok(stats);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to fetch dashboard", message = ex.Message });
        }
    }

    /// <summary>
    /// GET /api/last-30-days-metrics
    /// Returns daily revenue metrics for past 30 days
    /// Frontend uses: useQuery({ queryKey: ['metrics'] })
    /// </summary>
    [HttpGet("last-30-days-metrics")]
    [ProducesResponseType(typeof(List<MetricDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLast30DaysMetrics()
    {
        try
        {
            var metrics = await _financialService.GetLast30DaysMetricsAsync();
            return Ok(metrics);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to fetch metrics" });
        }
    }

    /// <summary>
    /// GET /api/cashflow-prediction
    /// Returns 30-day cash flow projection
    /// Frontend uses: useQuery({ queryKey: ['prediction'] })
    /// </summary>
    [HttpGet("cashflow-prediction")]
    [ProducesResponseType(typeof(PredictionDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCashFlowPrediction()
    {
        try
        {
            var prediction = await _financialService.GetCashFlowPredictionAsync();
            return Ok(prediction);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to fetch prediction" });
        }
    }

    /// <summary>
    /// GET /api/todays-insight
    /// Returns AI-generated insight for today
    /// Frontend uses: useQuery({ queryKey: ['insight'] })
    /// </summary>
    [HttpGet("todays-insight")]
    [ProducesResponseType(typeof(TodaysInsightDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTodaysInsight()
    {
        try
        {
            var insight = await _anthroposService.GetTodaysInsightAsync();
            return Ok(insight);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to fetch today's insight" });
        }
    }

    /// <summary>
    /// GET /api/period-analytics
    /// Returns analytics for specified period
    /// Frontend uses: useQuery({ queryKey: ['period'] })
    /// Query params: ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
    /// </summary>
    [HttpGet("period-analytics")]
    [ProducesResponseType(typeof(PeriodAnalyticsDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPeriodAnalytics(
        [FromQuery] string? startDate = null,
        [FromQuery] string? endDate = null)
    {
        try
        {
            var analytics = await _financialService.GetPeriodAnalyticsAsync(startDate, endDate);
            return Ok(analytics);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to fetch period analytics" });
        }
    }

    /// <summary>
    /// GET /api/anthropos/last-report
    /// Returns latest Anthropos checkup report
    /// Frontend uses: useQuery({ queryKey: ['anthropos'] })
    /// </summary>
    [HttpGet("anthropos/last-report")]
    [ProducesResponseType(typeof(AnthroposReportDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLastAnthroposReport()
    {
        try
        {
            var report = await _anthroposService.GetLastReportAsync();
            return Ok(report);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to fetch Anthropos report" });
        }
    }

    // ============================================================
    // MUTATION ENDPOINTS (2 POST)
    // ============================================================

    /// <summary>
    /// POST /api/manual-input
    /// Process manual financial data input with optional file attachment
    /// Frontend calls: useMutation({ mutationFn: submitManualData })
    /// 
    /// Form Data:
    /// - income: number (required)
    /// - costs: number (required)
    /// - description: string (optional)
    /// - attachment: File (optional)
    /// 
    /// Integration: Calls OpsGardenerAgent.AnalyzeManualInput()
    /// </summary>
    [HttpPost("manual-input")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(ManualInputResponseDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> SubmitManualInput(
        [FromForm] decimal income,
        [FromForm] decimal costs,
        [FromForm] string? description = null,
        [FromForm] IFormFile? attachment = null)
    {
        try
        {
            // Validate
            if (income < 0 || costs < 0)
            {
                return BadRequest(new { error = "Income and costs must be non-negative" });
            }

            // Store file if provided
            string? filePath = null;
            if (attachment != null)
            {
                filePath = await StoreAttachmentAsync(attachment);
            }

            // 🔌 INTEGRATION POINT 1: Call OpsGardenerAgent
            var opsResult = await _opsGardener.AnalyzeManualInputAsync(new ManualInputCommand
            {
                Income = income,
                Costs = costs,
                Description = description,
                AttachmentPath = filePath,
                RecordedAt = DateTime.UtcNow
            });

            // Store in database
            var manualEntry = await _financialService.StoreManualInputAsync(new ManualInputDto
            {
                Income = income,
                Costs = costs,
                Description = description,
                AttachmentPath = filePath,
                CreatedAt = DateTime.UtcNow
            });

            return Ok(new
            {
                success = true,
                data = new
                {
                    id = manualEntry.Id,
                    created_at = manualEntry.CreatedAt,
                    income,
                    costs,
                    description,
                    attachment_path = filePath,
                    processed = true,
                    ops_analysis = opsResult
                },
                message = "Manual data processed successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                error = "Failed to process manual input",
                details = ex.Message
            });
        }
    }

    /// <summary>
    /// POST /api/anthropos/run
    /// Execute full Super Agent checkup
    /// Frontend calls: useMutation({ mutationFn: runFullCheckup })
    /// 
    /// Executes in parallel:
    /// - OpsGardenerAgent.RunCheckupAsync()
    /// - SecurityGardenerAgent.RunCheckupAsync()
    /// - SelfGardener.EvaluateHeartAsync()
    /// - SophiaEngine.GenerateInsightsAsync()
    /// 
    /// Returns: Complete AnthroposReport with aggregated results
    /// </summary>
    [HttpPost("anthropos/run")]
    [ProducesResponseType(typeof(CheckupResponseDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> RunFullCheckup()
    {
        try
        {
            var startTime = DateTime.UtcNow;

            // 🔌 INTEGRATION POINT 2: Execute all agents in parallel
            var (opsCheckup, securityCheckup, heartState, insights) = await Task.WhenAll(
                _opsGardener.RunCheckupAsync(),
                _securityGardener.RunCheckupAsync(),
                _anthroposService.GetHeartStateAsync(),
                _anthroposService.GenerateInsightsAsync()
            ).ContinueWith(async t => {
                var results = await t;
                return (
                    ops: results[0],
                    security: results[1],
                    heart: results[2],
                    insights: results[3]
                );
            }).Unwrap();

            // Aggregate into comprehensive report
            var report = new AnthroposReportDto
            {
                SystemMood = DetermineSystemMood(opsCheckup, heartState),
                HeartCoherence = heartState.Coherence,
                EmotionalLoad = heartState.EmotionalLoad,
                OperationalLoad = opsCheckup.OperationalLoad,
                DroughtPoints = securityCheckup.Vulnerabilities,
                SophiaInsights = insights,
                SecurityRisks = securityCheckup.Risks,
                FullCycle = new
                {
                    timestamp = DateTime.UtcNow.ToString("o"),
                    status = "complete",
                    duration_ms = (DateTime.UtcNow - startTime).TotalMilliseconds
                },
                LastSyncTime = DateTime.UtcNow.ToString("o")
            };

            // Store report in database
            await _anthroposService.StoreReportAsync(report);

            return Ok(new
            {
                success = true,
                checkup_id = $"CHK-{DateTime.UtcNow.Ticks}",
                report,
                duration_ms = (DateTime.UtcNow - startTime).TotalMilliseconds,
                message = "Full checkup completed"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                error = "Failed to run full checkup",
                details = ex.Message
            });
        }
    }

    // ============================================================
    // HELPER METHODS
    // ============================================================

    private async Task<string> StoreAttachmentAsync(IFormFile file)
    {
        // TODO: Implement cloud storage upload (S3, Azure Blob, Google Cloud)
        // For now, save locally
        var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
        Directory.CreateDirectory(uploadsDir);

        var fileName = $"{DateTime.UtcNow.Ticks}-{file.FileName}";
        var filePath = Path.Combine(uploadsDir, fileName);

        using (var stream = System.IO.File.Create(filePath))
        {
            await file.CopyToAsync(stream);
        }

        return filePath;
    }

    private string DetermineSystemMood(OpsCheckupResult ops, HeartStateDto heart)
    {
        // Logic to determine: fertile, stressed, fragmented, flowing
        if (heart.Coherence > 80 && ops.OperationalLoad < 60)
            return "flowing";
        if (heart.Coherence < 50 && ops.OperationalLoad > 75)
            return "stressed";
        if (ops.Fragmentation > 70)
            return "fragmented";
        return "fertile";
    }
}
```

### Register in `backend/Program.cs`

```csharp
// Add to DI Container
builder.Services.AddScoped<IFinancialService, FinancialService>();
builder.Services.AddScoped<IAnthroposService, AnthroposService>();
builder.Services.AddScoped<IOpsGardenerAgent, OpsGardenerAgent>();
builder.Services.AddScoped<ISecurityGardenerAgent, SecurityGardenerAgent>();

// Add to pipeline
app.MapControllers();
app.UseRouting();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
```

---

## 📊 DTOs (Data Transfer Objects)

Create `backend/Models/DashboardDtos.cs`:

```csharp
namespace YourNamespace.Models;

// Financial DTOs
public record StatsDto(
    FinancialDto Financial,
    int Health,
    List<AlertDto> Alerts);

public record FinancialDto(
    decimal TotalMonthlyRevenue,
    decimal TotalMonthlyExpenses,
    decimal GrossMarginPercentage);

public record AlertDto(
    string Severity, // CRITICAL, WARNING, INFO
    string Message);

public record MetricDto(
    string Date,
    decimal AverageDailyRevenue,
    decimal MaxDailyRevenue,
    decimal MinDailyRevenue,
    decimal VariancePercentage);

public record PredictionDto(
    decimal ProjectedRevenue30d,
    decimal ConfidenceLevel);

public record TodaysInsightDto(
    string Narrative,
    decimal ConfidenceScore);

public record PeriodAnalyticsDto(
    string Period,
    decimal Revenue,
    decimal Expenses,
    decimal Margin,
    int AlertsCount);

// Anthropos DTOs
public record AnthroposReportDto(
    string SystemMood,
    int HeartCoherence,
    int EmotionalLoad,
    int OperationalLoad,
    List<string> DroughtPoints,
    List<InsightDto> SophiaInsights,
    List<RiskDto> SecurityRisks,
    CycleDto FullCycle,
    string LastSyncTime);

public record InsightDto(
    string Category,
    string Insight);

public record RiskDto(
    string Risk,
    string Severity); // low, medium, high, critical

public record CycleDto(
    string Timestamp,
    string Status,
    double DurationMs);

// Manual Input DTOs
public record ManualInputDto(
    decimal Income,
    decimal Costs,
    string? Description,
    string? AttachmentPath,
    DateTime CreatedAt);

public record ManualInputCommand(
    decimal Income,
    decimal Costs,
    string? Description,
    string? AttachmentPath,
    DateTime RecordedAt);

public record ManualInputResponseDto(
    bool Success,
    object Data,
    string Message);

public record CheckupResponseDto(
    bool Success,
    string CheckupId,
    AnthroposReportDto Report,
    double DurationMs,
    string Message);
```

---

## 🔗 FRONTEND INTEGRATION

The frontend (`src/services/queries.ts`) is already configured to:

1. Point to `http://localhost:5000` (or `VITE_API_URL` env var)
2. Call all 8 endpoints with correct query/mutation syntax
3. Auto-invalidate caches after mutations

### Environment Variable (`.env.local`)

```env
VITE_API_URL=http://localhost:5000
```

### React Query Hooks

```tsx
// In components, use:
const dashboardQuery = useQuery({
  queryKey: ['dashboard'],
  queryFn: fetchUnifiedDashboard,
  staleTime: 5 * 60 * 1000
});

const checkupMutation = useMutation({
  mutationFn: runFullCheckup,
  onSuccess: () => invalidateAllQueries(queryClient)
});
```

---

## ✅ CHECKLIST

### Express Backend
- [ ] Create `.env` file with PORT, SUPABASE_URL, DATABASE_URL
- [ ] Install dependencies: `npm install express multer cors dotenv`
- [ ] Run `api-server.ts` with mock data
- [ ] Replace mock data with real functions from agents
- [ ] Connect to database
- [ ] Deploy to Fly.io, Railway, or Heroku

### .NET Backend
- [ ] Create `DashboardController.cs` with 8 endpoints
- [ ] Create DTOs in `Models/DashboardDtos.cs`
- [ ] Register services in `Program.cs`
- [ ] Implement `IFinancialService`
- [ ] Implement `IAnthroposService`
- [ ] Connect to Supabase/PostgreSQL
- [ ] Deploy

### Frontend
- [ ] Set `VITE_API_URL` environment variable
- [ ] Test `IntelligentDashboard.tsx` with mock queries
- [ ] Test `TemploInterior.tsx` with mock queries
- [ ] Verify manual input form uploads files
- [ ] Test Super Agent checkup button
- [ ] Deploy to Vercel/GitHub Pages

---

## 🎯 FINAL STATUS

Once all endpoints are implemented and connected:

- ✅ Financial dashboard shows real data
- ✅ Manual data input saves to database
- ✅ File uploads persist to cloud storage
- ✅ Super Agent checkup runs all agents in parallel
- ✅ Anthropos state updates in real-time
- ✅ System rating: **100/100** ✨

---

## 📞 SUPPORT

- Express API: `api-server.ts` (already created with all endpoints)
- .NET Integration: Follow DashboardController.cs pattern
- Frontend: All queries in `src/services/queries.ts` ready to use
- Types: All TypeScript interfaces in `src/types/index.ts`

**Everything is ready for you to connect the agents! 🚀**
