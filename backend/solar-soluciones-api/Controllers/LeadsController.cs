using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SolarSoluciones.Api.Models;
using SolarSoluciones.Api.Services;

namespace SolarSoluciones.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LeadsController : ControllerBase
{
    private readonly ILeadService _leadService;
    private readonly IEventoService _eventoService;

    public LeadsController(ILeadService leadService, IEventoService eventoService)
    {
        _leadService = leadService;
        _eventoService = eventoService;
    }

    [HttpPost]
    public async Task<ActionResult<object>> Crear([FromBody] LeadRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Nombre) ||
            string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Telefono))
            return BadRequest("Nombre, email y teléfono son requeridos");

        var id = await _leadService.CrearLeadAsync(request);

        var tipoEvento = request.OpcionSimuladorElegida switch
        {
            "100%" => "OpcionElegida100",
            "50%" => "OpcionElegida50",
            "25%" => "OpcionElegida25",
            _ => "FormularioEnviado"
        };

        await _eventoService.RegistrarAsync(new EventoWebRequest
        {
            TipoEvento = tipoEvento,
            Pagina = "/simulador",
            IpUsuario = HttpContext.Connection.RemoteIpAddress?.ToString(),
            UserAgent = Request.Headers.UserAgent
        });

        return Ok(new { id, mensaje = "¡Gracias! Nos pondremos en contacto a la brevedad." });
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Comercial")]
    public async Task<ActionResult<IEnumerable<Lead>>> GetLeads(
        [FromQuery] string? estado = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var leads = await _leadService.GetLeadsAsync(estado, page, pageSize);
        return Ok(leads);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,Comercial")]
    public async Task<ActionResult<Lead>> GetLead(int id)
    {
        var lead = await _leadService.GetLeadByIdAsync(id);
        if (lead == null) return NotFound();
        return Ok(lead);
    }

    [HttpPatch("{id}/estado")]
    [Authorize(Roles = "Admin,Comercial")]
    public async Task<ActionResult> ActualizarEstado(int id, [FromBody] ActualizarEstadoRequest request)
    {
        var ok = await _leadService.ActualizarEstadoAsync(id, request.Estado);
        if (!ok) return NotFound();
        return NoContent();
    }
}

public class ActualizarEstadoRequest
{
    public string Estado { get; set; } = string.Empty;
}
