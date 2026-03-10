namespace SolarSoluciones.Api.Models;

public class SimulacionRequest
{
    public string Provincia { get; set; } = string.Empty;
    public decimal ConsumoMensualKwh { get; set; }
    public string? TipoPropiedad { get; set; }
    public decimal? MontoFacturaMensual { get; set; }
    public string? IpUsuario { get; set; }
}
