using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SolarSoluciones.Api.Models;
using SolarSoluciones.Api.Services;

namespace SolarSoluciones.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class ParametrosController : ControllerBase
{
    private readonly IParametrosService _parametrosService;

    public ParametrosController(IParametrosService parametrosService)
    {
        _parametrosService = parametrosService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ParametrosSimulador>>> GetParametros()
    {
        var parametros = await _parametrosService.GetTodosAsync();
        return Ok(parametros);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> ActualizarParametros(int id, [FromBody] ParametrosSimulador request)
    {
        var ok = await _parametrosService.ActualizarAsync(id, request);
        if (!ok) return NotFound();
        return NoContent();
    }
}
