using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ElMediadorDeSofia.Data;
using ElMediadorDeSofia.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ElMediadorDeSofia.Services
{
    public class WebhookProcessorService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<WebhookProcessorService> _logger;

        public WebhookProcessorService(AppDbContext context, ILogger<WebhookProcessorService> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Process Xero webhook and sync invoice data
        /// </summary>
        public async Task<bool> ProcessXeroWebhookAsync(string eventType, Dictionary<string, object> data)
        {
            try
            {
                _logger.LogInformation($"Processing Xero webhook: {eventType}");

                switch (eventType.ToLower())
                {
                    case "invoices.create":
                    case "invoices.update":
                        return await SyncXeroInvoiceAsync(data);

                    case "invoices.delete":
                        return await DeleteXeroInvoiceAsync(data);

                    default:
                        _logger.LogWarning($"Unknown Xero event type: {eventType}");
                        return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing Xero webhook");
                return false;
            }
        }

        /// <summary>
        /// Process QuickBooks webhook and sync invoice data
        /// </summary>
        public async Task<bool> ProcessQuickBooksWebhookAsync(string eventType, Dictionary<string, object> data)
        {
            try
            {
                _logger.LogInformation($"Processing QuickBooks webhook: {eventType}");

                switch (eventType.ToLower())
                {
                    case "qbo.invoice.create":
                    case "qbo.invoice.update":
                        return await SyncQBInvoiceAsync(data);

                    case "qbo.invoice.delete":
                        return await DeleteQBInvoiceAsync(data);

                    default:
                        _logger.LogWarning($"Unknown QuickBooks event type: {eventType}");
                        return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing QuickBooks webhook");
                return false;
            }
        }

        private async Task<bool> SyncXeroInvoiceAsync(Dictionary<string, object> data)
        {
            try
            {
                // Extract invoice details from Xero payload
                if (data == null || !data.ContainsKey("invoiceID"))
                    return false;

                var invoiceId = data["invoiceID"].ToString();
                var amount = decimal.TryParse(data.ContainsKey("total") ? data["total"].ToString() : "0", out decimal total) ? total : 0;
                var status = data.ContainsKey("status") ? data["status"].ToString() : "DRAFT";

                var invoice = new Invoice
                {
                    Id = Guid.NewGuid(),
                    ExternalId = invoiceId,
                    Source = "Xero",
                    Amount = amount,
                    Status = status,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Invoices.Add(invoice);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Synced Xero invoice: {invoiceId}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error syncing Xero invoice");
                return false;
            }
        }

        private async Task<bool> SyncQBInvoiceAsync(Dictionary<string, object> data)
        {
            try
            {
                if (data == null || !data.ContainsKey("id"))
                    return false;

                var invoiceId = data["id"].ToString();
                var amount = decimal.TryParse(data.ContainsKey("totalAmt") ? data["totalAmt"].ToString() : "0", out decimal total) ? total : 0;
                var status = data.ContainsKey("docStatus") ? data["docStatus"].ToString() : "DRAFT";

                var invoice = new Invoice
                {
                    Id = Guid.NewGuid(),
                    ExternalId = invoiceId,
                    Source = "QuickBooks",
                    Amount = amount,
                    Status = status,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Invoices.Add(invoice);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Synced QB invoice: {invoiceId}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error syncing QB invoice");
                return false;
            }
        }

        private async Task<bool> DeleteXeroInvoiceAsync(Dictionary<string, object> data)
        {
            try
            {
                var invoiceId = data?["invoiceID"]?.ToString();
                if (string.IsNullOrEmpty(invoiceId))
                    return false;

                var invoice = await _context.Invoices.FirstOrDefaultAsync(i => i.ExternalId == invoiceId && i.Source == "Xero");
                if (invoice != null)
                {
                    _context.Invoices.Remove(invoice);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"Deleted Xero invoice: {invoiceId}");
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting Xero invoice");
                return false;
            }
        }

        private async Task<bool> DeleteQBInvoiceAsync(Dictionary<string, object> data)
        {
            try
            {
                var invoiceId = data?["id"]?.ToString();
                if (string.IsNullOrEmpty(invoiceId))
                    return false;

                var invoice = await _context.Invoices.FirstOrDefaultAsync(i => i.ExternalId == invoiceId && i.Source == "QuickBooks");
                if (invoice != null)
                {
                    _context.Invoices.Remove(invoice);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"Deleted QB invoice: {invoiceId}");
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting QB invoice");
                return false;
            }
        }

        /// <summary>
        /// Get webhook processing statistics
        /// </summary>
        public async Task<object> GetWebhookStatsAsync(int days = 7)
        {
            try
            {
                var startDate = DateTime.UtcNow.AddDays(-days);
                var events = await _context.EventRecords
                    .Where(e => e.CreatedAt >= startDate)
                    .GroupBy(e => e.Source)
                    .Select(g => new
                    {
                        Source = g.Key,
                        Count = g.Count(),
                        Events = g.Select(e => new { e.EventType, e.CreatedAt }).ToList()
                    })
                    .ToListAsync();

                return new
                {
                    period_days = days,
                    start_date = startDate,
                    total_events = events.Sum(e => e.Count),
                    by_source = events
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error computing webhook stats");
                return null;
            }
        }
    }
}
