using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ElMediadorDeSofia.Services;
using Microsoft.AspNetCore.Mvc;

namespace ElMediadorDeSofia.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GoogleWorkspaceController : ControllerBase
    {
        private readonly GoogleWorkspaceService _googleWorkspaceService;
        private readonly ILogger<GoogleWorkspaceController> _logger;
        private readonly Data.AppDbContext _db;

        public GoogleWorkspaceController(GoogleWorkspaceService googleWorkspaceService, ILogger<GoogleWorkspaceController> logger, Data.AppDbContext db)
        {
            _googleWorkspaceService = googleWorkspaceService;
            _logger = logger;
            _db = db;
        }

        /// <summary>
        /// GET /api/auth/google/login
        /// Inicia el flujo OAuth con Google
        /// </summary>
        [HttpGet("/api/auth/google/login")]
        public async Task<IActionResult> GoogleLogin()
        {
            var clientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID");
            var callbackUrl = Environment.GetEnvironmentVariable("GOOGLE_OAUTH_CALLBACK_URL");
            var scopes = new[] {
                "https://www.googleapis.com/auth/userinfo.email",
                "https://www.googleapis.com/auth/userinfo.profile"
            };
            var scopeParam = string.Join(" ", scopes);
            var authUrl = $"https://accounts.google.com/o/oauth2/v2/auth?client_id={clientId}&redirect_uri={callbackUrl}&response_type=code&scope={Uri.EscapeDataString(scopeParam)}&access_type=offline&prompt=consent";
            return Redirect(authUrl);
        }

        /// <summary>
        /// GET /api/auth/google/callback
        /// Callback de Google OAuth
        /// </summary>
        [HttpGet("/api/auth/google/callback")]
        public async Task<IActionResult> GoogleCallback([FromQuery] string code)
        {
            if (string.IsNullOrEmpty(code))
                return BadRequest(new { error = "Missing code" });

            var clientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID");
            var clientSecret = ""; // Si tienes client_secret, colócalo aquí o como variable de entorno
            var callbackUrl = Environment.GetEnvironmentVariable("GOOGLE_OAUTH_CALLBACK_URL");

            using var http = new System.Net.Http.HttpClient();
            var tokenRequest = new System.Net.Http.FormUrlEncodedContent(new[]
            {
                new System.Collections.Generic.KeyValuePair<string, string>("code", code),
                new System.Collections.Generic.KeyValuePair<string, string>("client_id", clientId),
                new System.Collections.Generic.KeyValuePair<string, string>("client_secret", clientSecret),
                new System.Collections.Generic.KeyValuePair<string, string>("redirect_uri", callbackUrl),
                new System.Collections.Generic.KeyValuePair<string, string>("grant_type", "authorization_code")
            });
            var tokenResponse = await http.PostAsync("https://oauth2.googleapis.com/token", tokenRequest);
            var tokenJson = await tokenResponse.Content.ReadAsStringAsync();
            if (!tokenResponse.IsSuccessStatusCode)
                return StatusCode(500, new { error = "Token exchange failed", details = tokenJson });

            var tokenData = System.Text.Json.JsonDocument.Parse(tokenJson).RootElement;
            var accessToken = tokenData.GetProperty("access_token").GetString();

            // Obtener datos del usuario
            http.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
            var userInfoResponse = await http.GetAsync("https://www.googleapis.com/oauth2/v2/userinfo");
            var userInfoJson = await userInfoResponse.Content.ReadAsStringAsync();
            if (!userInfoResponse.IsSuccessStatusCode)
                return StatusCode(500, new { error = "User info failed", details = userInfoJson });

            // Parsear datos del usuario
            var userElement = System.Text.Json.JsonDocument.Parse(userInfoJson).RootElement;
            var googleId = userElement.GetProperty("id").GetString();
            var email = userElement.GetProperty("email").GetString();
            var name = userElement.TryGetProperty("name", out var n) ? n.GetString() : null;
            var picture = userElement.TryGetProperty("picture", out var p) ? p.GetString() : null;

            // Guardar o actualizar usuario en base de datos
            var user = _db.GoogleUsers.FirstOrDefault(u => u.GoogleId == googleId);
            if (user == null)
            {
                user = new Models.GoogleUser
                {
                    GoogleId = googleId!,
                    Email = email!,
                    Name = name,
                    Picture = picture
                };
                _db.GoogleUsers.Add(user);
            }
            else
            {
                user.Email = email!;
                user.Name = name;
                user.Picture = picture;
            }
            await _db.SaveChangesAsync();

            // Devuelve los datos reales del usuario autenticado
            return Ok(new { token = tokenData, user });
        }

        /// <summary>
        /// GET /api/google-workspace/user/{email}
        /// Obtiene perfil del usuario desde Google Workspace
        /// </summary>
        [HttpGet("user/{email}")]
        public async Task<IActionResult> GetUserProfile(string email)
        {
            try
            {
                var profile = await _googleWorkspaceService.GetUserProfileAsync(email);
                return Ok(profile);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user profile for {email}", email);
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/google-workspace/availability/{email}
        /// Obtiene calendario de disponibilidad
        /// </summary>
        [HttpGet("availability/{email}")]
        public async Task<IActionResult> GetAvailability(string email, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            try
            {
                var start = startDate ?? DateTime.Today;
                var end = endDate ?? DateTime.Today.AddDays(7);

                var availability = await _googleWorkspaceService.GetAvailabilityCalendarAsync(email, start, end);
                return Ok(availability);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching availability for {email}", email);
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// POST /api/google-workspace/email
        /// Envía email desde Google Workspace
        /// </summary>
        [HttpPost("email")]
        public async Task<IActionResult> SendEmail([FromBody] dynamic request)
        {
            try
            {
                string to = request.to ?? throw new ArgumentException("to is required");
                string subject = request.subject ?? "No subject";
                string body = request.body ?? "No body";
                string? cc = request.cc;

                var result = await _googleWorkspaceService.SendEmailAsync(to, subject, body, cc);
                return Ok(new { success = result, message = "Email sent" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending email");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// POST /api/google-workspace/event
        /// Crea evento en calendario
        /// </summary>
        [HttpPost("event")]
        public async Task<IActionResult> CreateEvent([FromBody] dynamic request)
        {
            try
            {
                string email = request.email ?? throw new ArgumentException("email is required");
                string title = request.title ?? "No title";
                DateTime startTime = request.startTime ?? DateTime.Now;
                DateTime endTime = request.endTime ?? DateTime.Now.AddHours(1);
                string? description = request.description;
                string[]? attendees = request.attendees;

                var eventResult = await _googleWorkspaceService.CreateCalendarEventAsync(email, title, startTime, endTime, description, attendees);
                return Ok(eventResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating calendar event");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/google-workspace/team
        /// Obtiene lista de miembros del equipo
        /// </summary>
        [HttpGet("team")]
        public async Task<IActionResult> GetTeamMembers()
        {
            try
            {
                var members = await _googleWorkspaceService.GetTeamMembersAsync();
                return Ok(members);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching team members");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/google-workspace/team-stats
        /// Obtiene estadísticas de uso del equipo
        /// </summary>
        [HttpGet("team-stats")]
        public async Task<IActionResult> GetTeamStatistics()
        {
            try
            {
                var stats = await _googleWorkspaceService.GetTeamStatisticsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching team statistics");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// PATCH /api/google-workspace/presence
        /// Sincroniza estado de presencia
        /// </summary>
        [HttpPatch("presence")]
        public async Task<IActionResult> SyncPresence([FromBody] dynamic request)
        {
            try
            {
                string email = request.email ?? "unknown@serendipity.com";
                string status = request.status ?? "available"; // available, away, do-not-disturb, offline

                var result = await _googleWorkspaceService.SyncPresenceDataAsync(email, status);
                return Ok(new { success = result, message = "Presence synced" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error syncing presence");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/google-workspace/health
        /// Health check
        /// </summary>
        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { status = "ok", service = "Google Workspace Mock API", timestamp = DateTime.UtcNow });
        }
    }
}
