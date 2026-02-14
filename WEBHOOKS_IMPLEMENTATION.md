# 🔗 External Webhooks Integration (D)

**Status:** ✅ IMPLEMENTED  
**Platform:** .NET 6+ Backend  
**Date:** 2026-02-15

## 🎯 Overview

Webhook system for receiving real-time events from external accounting systems (Xero, QuickBooks) and synchronizing data with Serendipity dashboard.

## 📦 Structure

```
backend/
├── Controllers/
│   └── WebhooksController.cs         # Webhook endpoints
├── Services/
│   └── WebhookProcessorService.cs    # Event processing logic
├── Models/
│   └── EventRecord.cs                # Event storage
└── Program.cs                        # DI configuration
```

## 🚀 Endpoints

### Xero Webhooks

```
POST /api/webhooks/xero/invoice
```

**Payload:**
```json
{
  "event": "CREATE|UPDATE|DELETE",
  "invoiceID": "xyz123",
  "total": 1500.00,
  "status": "AUTHORISED"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Webhook received and processed"
}
```

### QuickBooks Webhooks

```
POST /api/webhooks/quickbooks/invoice
```

**Payload:**
```json
{
  "eventType": "qbo.invoice.create",
  "id": "42",
  "totalAmt": 2000.00,
  "docStatus": "POSTED"
}
```

### Generic External Webhooks

```
POST /api/webhooks/external
```

Accepts any JSON payload with:
- `source` (string) — Event source name
- `eventType` (string) — Type of event
- Additional custom fields as needed

### List Recent Events

```
GET /api/webhooks/events?limit=50
```

**Response:**
```json
{
  "success": true,
  "events": [
    {
      "id": "uuid",
      "eventType": "xero.invoice.create",
      "source": "Xero",
      "data": "...",
      "createdAt": "2026-02-15T10:30:00Z"
    }
  ]
}
```

### Health Check

```
GET /api/webhooks/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-15T10:30:00Z",
  "version": "1.0.0"
}
```

## 🔄 Event Processing Flow

1. **Receive** → WebhooksController validates payload
2. **Log** → EventRecord stored in database
3. **Process** → WebhookProcessorService routes to handler
4. **Sync** → Data merged into Invoice/FixedCosts tables
5. **Notify** → Dashboard realtime subscription triggers refresh

## ⚡ Supported Events

### Xero

- `invoices.create` → New invoice synced
- `invoices.update` → Invoice details updated
- `invoices.delete` → Invoice removed

### QuickBooks

- `qbo.invoice.create` → New invoice synced
- `qbo.invoice.update` → Invoice details updated
- `qbo.invoice.delete` → Invoice removed

## 🔐 Security

### Webhook Validation

Add signature verification (recommended):

```csharp
[HttpPost("xero/invoice")]
public async Task<IActionResult> XeroInvoiceWebhook(
    [FromBody] Dictionary<string, object> payload,
    [FromHeader(Name = "x-webhook-signature")] string signature)
{
    if (!VerifySignature(payload, signature))
        return Unauthorized();
    
    // Process webhook
}
```

### IP Allowlisting

```csharp
// In Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("XeroWebhook", policyBuilder =>
    {
        policyBuilder.WithOrigins("*.xero.com")
                    .AllowAnyMethod()
                    .AllowAnyHeader();
    });
});
```

## 📊 Webhook Statistics

```
GET /api/webhooks/stats?days=7
```

**Response:**
```json
{
  "period_days": 7,
  "start_date": "2026-02-08T00:00:00Z",
  "total_events": 45,
  "by_source": [
    {
      "source": "Xero",
      "count": 28,
      "events": [...]
    },
    {
      "source": "QuickBooks",
      "count": 17,
      "events": [...]
    }
  ]
}
```

## 🔧 Configuration

### Environment Variables

```env
# Xero
XERO_WEBHOOK_SIGNING_KEY=your_key_here

# QuickBooks
QUICKBOOKS_WEBHOOK_SIGNING_KEY=your_key_here

# Archive old events after N days
WEBHOOK_ARCHIVE_DAYS=90
```

### Entity Framework Setup

```bash
# Create migration
dotnet ef migrations add AddWebhookSupport

# Apply migration
dotnet ef database update
```

## 🧪 Testing

### Test Webhook with cURL

```bash
# Xero invoice create
curl -X POST http://localhost:5000/api/webhooks/xero/invoice \
  -H "Content-Type: application/json" \
  -d '{
    "event": "CREATE",
    "invoiceID": "test123",
    "total": 500.00,
    "status": "AUTHORISED"
  }'

# QB invoice update
curl -X POST http://localhost:5000/api/webhooks/quickbooks/invoice \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "qbo.invoice.update",
    "id": "42",
    "totalAmt": 750.00,
    "docStatus": "POSTED"
  }'
```

### Health check

```bash
curl http://localhost:5000/api/webhooks/health
```

## 📈 Monitoring

### Log Webhook Events

Events logged to console + database:

```
[INF] Received Xero invoice webhook
[INF] Synced Xero invoice: xyz123
[INF] Processing QuickBooks webhook: qbo.invoice.create
```

### Dashboard Integration

Webhook events trigger:
1. Database update (invoices table)
2. Supabase postgres_changes event
3. React Query cache invalidation
4. Dashboard realtime refresh

**No additional UI changes needed** — existing dashboard automatically updates!

## 🚀 Deployment

### Docker

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:6.0
COPY --from=builder /app/dist /app
EXPOSE 80
CMD ["dotnet", "ElMediadorDeSofia.dll"]
```

### Cloud Deployment

```bash
# Azure
az webapp deployment source config-zip -g mygroup -n myapp --src publish.zip

# AWS
aws elasticbeanstalk create-application-version --app myapp --version-label v1 --source-bundle s3://mybucket/app.zip
```

## 📞 Support

- **API Base:** http://localhost:5000
- **Webhook Endpoint:** /api/webhooks/*
- **Database:** PostgreSQL via EF Core
- **Logging:** Serilog (configured in Program.cs)

---

**Next:** Configure Xero + QuickBooks connectors to POST to these endpoints.
