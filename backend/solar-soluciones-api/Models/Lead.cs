namespace SolarSoluciones.Api.Models;

public class Lead
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string? Ciudad { get; set; }
    public string Provincia { get; set; } = string.Empty;
    public string? TipoPropiedad { get; set; }
    public decimal? ConsumoAproximadoKwh { get; set; }
    public decimal? MontoFactura { get; set; }
    public string? OpcionSimuladorElegida { get; set; }
    public int? SimulacionId { get; set; }
    public string? Mensaje { get; set; }
    public string Origen { get; set; } = "Formulario";
    public string Estado { get; set; } = "Nuevo";
    public DateTime FechaCreacion { get; set; }
    public DateTime FechaActualizacion { get; set; }
}

public class LeadRequest
{
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string? Ciudad { get; set; }
    public string Provincia { get; set; } = string.Empty;
    public string? TipoPropiedad { get; set; }
    public decimal? ConsumoAproximadoKwh { get; set; }
    public decimal? MontoFactura { get; set; }
    public string? OpcionSimuladorElegida { get; set; }
    public int? SimulacionId { get; set; }
    public string? Mensaje { get; set; }
    public string Origen { get; set; } = "Formulario";
}
