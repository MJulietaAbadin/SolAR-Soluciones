using Microsoft.AspNetCore.Mvc;
using SolarSoluciones.Api.Models;
using SolarSoluciones.Api.Services;

namespace SolarSoluciones.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventosController : ControllerBase
{
    private readonly IEventoService _eventoService;

    public EventosController(IEventoService eventoService)
    {
        _eventoService = eventoService;
    }

    [HttpPost]
    public async Task<ActionResult> Registrar([FromBody] EventoWebRequest request)
    {
        request.IpUsuario = HttpContext.Connection.RemoteIpAddress?.ToString();
        request.UserAgent = Request.Headers.UserAgent;
        await _eventoService.RegistrarAsync(request);
        return NoContent();
    }
}
