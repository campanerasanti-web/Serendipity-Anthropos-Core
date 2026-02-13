using System;
using System.Threading.Tasks;
using ElMediadorDeSofia.Services;
using Microsoft.AspNetCore.Mvc;

namespace ElMediadorDeSofia.Controllers
{
    [ApiController]
    [Route("api/lots")]
    public class LotCloseController : ControllerBase
    {
        private readonly LotCloseService _lotClose;

        public LotCloseController(LotCloseService lotClose)
        {
            _lotClose = lotClose;
        }

        [HttpPost("close/{lotId:guid}")]
        public async Task<IActionResult> Close(Guid lotId, [FromQuery] string user = "system")
        {
            try
            {
                var result = await _lotClose.CloseLotAsync(lotId, user);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
