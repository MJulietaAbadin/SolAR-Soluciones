namespace SolarSoluciones.Api.Models;

public class EventoWebRequest
{
    public string TipoEvento { get; set; } = string.Empty;
    public string? Pagina { get; set; }
    public string? IpUsuario { get; set; }
    public string? UserAgent { get; set; }
}
