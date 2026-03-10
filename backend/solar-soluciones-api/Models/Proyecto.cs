namespace SolarSoluciones.Api.Models;

public class Proyecto
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string TipoCliente { get; set; } = string.Empty;
    public string Provincia { get; set; } = string.Empty;
    public string? Ciudad { get; set; }
    public decimal SistemaInstaladoKw { get; set; }
    public int PanelesInstalados { get; set; }
    public decimal? FacturaAntes { get; set; }
    public decimal? FacturaDespues { get; set; }
    public decimal? PorcentajeAhorro { get; set; }
    public string? Descripcion { get; set; }
    public bool Destacado { get; set; }
    public bool Activo { get; set; }
    public DateTime? FechaInstalacion { get; set; }
    public DateTime FechaCreacion { get; set; }
    public List<string> Imagenes { get; set; } = new();
    public string? ImagenPrincipal { get; set; }
}
