using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SolarSoluciones.Api.Models;
using SolarSoluciones.Api.Services;
using System.Security.Claims;

namespace SolarSoluciones.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlogController : ControllerBase
{
    private readonly IBlogService _blogService;
    private readonly IEventoService _eventoService;

    public BlogController(IBlogService blogService, IEventoService eventoService)
    {
        _blogService = blogService;
        _eventoService = eventoService;
    }

    [HttpGet("articulos")]
    public async Task<ActionResult<IEnumerable<BlogArticulo>>> GetArticulos(
        [FromQuery] string? categoria = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 9)
    {
        var articulos = await _blogService.GetArticulosAsync(categoria, page, pageSize);
        return Ok(articulos);
    }

    [HttpGet("articulos/{slug}")]
    public async Task<ActionResult<BlogArticulo>> GetArticulo(string slug)
    {
        var articulo = await _blogService.GetArticuloBySlugAsync(slug);
        if (articulo == null) return NotFound();

        await _eventoService.RegistrarAsync(new EventoWebRequest
        {
            TipoEvento = "VistaArticulo",
            Pagina = $"/blog/{slug}",
            IpUsuario = HttpContext.Connection.RemoteIpAddress?.ToString(),
            UserAgent = Request.Headers.UserAgent
        });

        return Ok(articulo);
    }

    [HttpGet("categorias")]
    public async Task<ActionResult<IEnumerable<BlogCategoria>>> GetCategorias()
    {
        var categorias = await _blogService.GetCategoriasAsync();
        return Ok(categorias);
    }

    [HttpPost("articulos")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<ActionResult<object>> CrearArticulo([FromBody] BlogArticuloRequest request)
    {
        var autorIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(autorIdStr, out var autorId))
            return Unauthorized();

        var id = await _blogService.CrearArticuloAsync(request, autorId);
        return CreatedAtAction(nameof(GetArticulo), new { slug = request.Slug }, new { id });
    }

    [HttpPut("articulos/{id}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<ActionResult> ActualizarArticulo(int id, [FromBody] BlogArticuloRequest request)
    {
        var ok = await _blogService.ActualizarArticuloAsync(id, request);
        if (!ok) return NotFound();
        return NoContent();
    }
}
