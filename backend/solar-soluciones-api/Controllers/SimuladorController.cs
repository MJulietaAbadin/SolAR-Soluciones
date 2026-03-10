using Microsoft.AspNetCore.Mvc;
using SolarSoluciones.Api.Models;
using SolarSoluciones.Api.Services;

namespace SolarSoluciones.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SimuladorController : ControllerBase
{
    private readonly ISimuladorService _simuladorService;
    private readonly IEventoService _eventoService;

    public SimuladorController(ISimuladorService simuladorService, IEventoService eventoService)
    {
        _simuladorService = simuladorService;
        _eventoService = eventoService;
    }

    [HttpPost("calcular")]
    public async Task<ActionResult<SimulacionResult>> Calcular([FromBody] SimulacionRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Provincia))
            return BadRequest("Provincia requerida");

        if (request.ConsumoMensualKwh <= 0)
            return BadRequest("Consumo mensual debe ser mayor a 0");

        request.IpUsuario = HttpContext.Connection.RemoteIpAddress?.ToString();

        var result = await _simuladorService.CalcularAsync(request);

        await _eventoService.RegistrarAsync(new EventoWebRequest
        {
            TipoEvento = "SimuladorUsado",
            Pagina = "/simulador",
            IpUsuario = request.IpUsuario,
            UserAgent = Request.Headers.UserAgent
        });

        return Ok(result);
    }

    [HttpGet("provincias")]
    public async Task<ActionResult<IEnumerable<string>>> GetProvincias()
    {
        var provincias = await _simuladorService.GetProvinciasAsync();
        return Ok(provincias);
    }
}
