using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Util.Store;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Util.Store;
using System.IO;
using System.Threading;

namespace ElMediadorDeSofia.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly string[] _scopes = new[]
        {
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile"
        };

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("google/login")]
        public IActionResult GoogleLogin()
        {
            var clientId = _configuration["Google:ClientId"];
            var redirectUri = _configuration["GOOGLE_OAUTH_CALLBACK_URL"] ?? "http://localhost:5000/api/auth/google/callback";
            var scope = string.Join(" ", _scopes);
            var state = Guid.NewGuid().ToString();
            var url = $"https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id={clientId}&redirect_uri={Uri.EscapeDataString(redirectUri)}&scope={Uri.EscapeDataString(scope)}&access_type=offline&prompt=consent&state={state}";
            return Redirect(url);
        }

        [HttpGet("google/callback")]
        public async Task<IActionResult> GoogleCallback([FromQuery] string code, [FromQuery] string state)
        {
            var credPath = _configuration["GOOGLE_APPLICATION_CREDENTIALS"] ?? "Secrets/credentials.json";
            var redirectUri = _configuration["GOOGLE_OAUTH_CALLBACK_URL"] ?? "http://localhost:5000/api/auth/google/callback";
            var clientSecrets = GoogleClientSecrets.FromFile(credPath).Secrets;
            var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
            {
                ClientSecrets = clientSecrets,
                Scopes = new[] {
                    "openid",
                    "email",
                    "profile",
                    "https://www.googleapis.com/auth/userinfo.email",
                    "https://www.googleapis.com/auth/userinfo.profile"
                },
                DataStore = new FileDataStore("GoogleAuthTokens", true)
            });
            TokenResponse token = await flow.ExchangeCodeForTokenAsync(
                userId: "user",
                code: code,
                redirectUri: redirectUri,
                taskCancellationToken: CancellationToken.None
            );
            if (!string.IsNullOrEmpty(token.AccessToken))
            {
                return Ok(new { message = "Autenticación exitosa", accessToken = token.AccessToken });
            }
            else
            {
                return BadRequest(new { error = "No se pudo obtener el token de acceso" });
            }
        }
    }
}
