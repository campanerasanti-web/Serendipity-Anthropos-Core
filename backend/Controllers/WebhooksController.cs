using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ElMediadorDeSofia.Models;
using ElMediadorDeSofia.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ElMediadorDeSofia.Controllers
{
    [ApiController]
    [Route("api/webhooks")]
    public class WebhooksController : ControllerBase
    {
        private readonly ILogger<WebhooksController> _logger;
        private readonly EventService _eventService;

        public WebhooksController(ILogger<WebhooksController> logger, EventService eventService)
        {
            _logger = logger;
            _eventService = eventService;
        }

        /// <summary>
        /// Receive Xero invoice webhooks
        /// POST /api/webhooks/xero/invoice
        /// </summary>
        [HttpPost("xero/invoice")]
        public async Task<IActionResult> XeroInvoiceWebhook([FromBody] Dictionary<string, object> payload)
        {
            try
            {
                _logger.LogInformation("Received Xero invoice webhook");

                if (payload == null || !payload.ContainsKey("event"))
                    return BadRequest(new { error = "Invalid payload" });

                var eventType = payload["event"].ToString();
                var invoiceData = new
                {
                    Source = "Xero",
                    EventType = eventType,
                    Timestamp = DateTime.UtcNow,
                    Payload = payload
                };

                // Log webhook event
                var record = new EventRecord
                {
                    Id = Guid.NewGuid(),
                    EventType = "xero.invoice." + eventType,
                    Source = "Xero",
                    Payload = System.Text.Json.JsonSerializer.Serialize(invoiceData),
                    CreatedAt = DateTime.UtcNow
                };

                await _eventService.LogEventAsync(record);

                return Ok(new { success = true, message = "Webhook received and processed" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing Xero webhook");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Receive QuickBooks webhook
        /// POST /api/webhooks/quickbooks/invoice
        /// </summary>
        [HttpPost("quickbooks/invoice")]
        public async Task<IActionResult> QuickBooksWebhook([FromBody] Dictionary<string, object> payload)
        {
            try
            {
                _logger.LogInformation("Received QuickBooks webhook");

                if (payload == null || !payload.ContainsKey("eventType"))
                    return BadRequest(new { error = "Invalid payload" });

                var eventType = payload["eventType"].ToString();
                var record = new EventRecord
                {
                    Id = Guid.NewGuid(),
                    EventType = "quickbooks.invoice." + eventType,
                    Source = "QuickBooks",
                    Payload = System.Text.Json.JsonSerializer.Serialize(payload),
                    CreatedAt = DateTime.UtcNow
                };

                await _eventService.LogEventAsync(record);

                return Ok(new { success = true, message = "Webhook received and processed" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing QuickBooks webhook");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Receive generic webhook events
        /// POST /api/webhooks/external
        /// </summary>
        [HttpPost("external")]
        public async Task<IActionResult> ExternalWebhook([FromBody] Dictionary<string, object> payload)
        {
            try
            {
                _logger.LogInformation("Received external webhook");

                if (payload == null)
                    return BadRequest(new { error = "Invalid payload" });

                var source = payload.ContainsKey("source") ? payload["source"].ToString() : "Unknown";
                var eventType = payload.ContainsKey("eventType") ? payload["eventType"].ToString() : "generic";

                var record = new EventRecord
                {
                    Id = Guid.NewGuid(),
                    EventType = source + "." + eventType,
                    Source = source,
                    Payload = System.Text.Json.JsonSerializer.Serialize(payload),
                    CreatedAt = DateTime.UtcNow
                };

                await _eventService.LogEventAsync(record);

                return Ok(new { success = true, message = "Webhook received and processed" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing external webhook");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// List recent webhook events
        /// GET /api/webhooks/events
        /// </summary>
        [HttpGet("events")]
        public async Task<IActionResult> GetRecentEvents([FromQuery] int limit = 50)
        {
            try
            {
                var events = await _eventService.GetRecentEventsAsync(limit);
                return Ok(new { success = true, events });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving webhook events");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Health check for webhooks endpoint
        /// GET /api/webhooks/health
        /// </summary>
        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new
            {
                status = "healthy",
                timestamp = DateTime.UtcNow,
                version = "1.0.0"
            });
        }
    }
}
