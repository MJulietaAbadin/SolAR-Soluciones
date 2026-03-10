using Microsoft.AspNetCore.Mvc;
using SolarSoluciones.Api.Models;
using SolarSoluciones.Api.Services;

namespace SolarSoluciones.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProyectosController : ControllerBase
{
    private readonly IProyectoService _proyectoService;
    private readonly IEventoService _eventoService;

    public ProyectosController(IProyectoService proyectoService, IEventoService eventoService)
    {
        _proyectoService = proyectoService;
        _eventoService = eventoService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Proyecto>>> GetProyectos(
        [FromQuery] bool destacados = false)
    {
        var proyectos = await _proyectoService.GetProyectosAsync(destacados);
        return Ok(proyectos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Proyecto>> GetProyecto(int id)
    {
        var proyecto = await _proyectoService.GetProyectoByIdAsync(id);
        if (proyecto == null) return NotFound();

        await _eventoService.RegistrarAsync(new EventoWebRequest
        {
            TipoEvento = "VistaProyecto",
            Pagina = $"/proyectos/{id}",
            IpUsuario = HttpContext.Connection.RemoteIpAddress?.ToString(),
            UserAgent = Request.Headers.UserAgent
        });

        return Ok(proyecto);
    }
}
