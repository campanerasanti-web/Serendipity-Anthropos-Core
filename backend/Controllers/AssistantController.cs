using System.Threading.Tasks;
using ElMediadorDeSofia.Models;
using ElMediadorDeSofia.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ElMediadorDeSofia.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssistantController : ControllerBase
    {
        private readonly GuidedAssistantService _assistant;
        private readonly ILogger<AssistantController> _logger;

        public AssistantController(GuidedAssistantService assistant, ILogger<AssistantController> logger)
        {
            _assistant = assistant;
            _logger = logger;
        }

        [HttpPost("next-step")]
        public async Task<IActionResult> NextStep([FromBody] AssistantRequest request)
        {
            if (request == null)
                return BadRequest(new { message = "Request body is required." });

            var result = await _assistant.GetNextStepAsync(request);
            return Ok(result);
        }
    }
}
