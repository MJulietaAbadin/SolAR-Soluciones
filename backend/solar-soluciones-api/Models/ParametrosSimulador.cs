namespace SolarSoluciones.Api.Models;

public class ParametrosSimulador
{
    public int Id { get; set; }
    public string Provincia { get; set; } = string.Empty;
    public decimal HorasSolPicoDiarias { get; set; }
    public decimal PrecioKwhRed { get; set; }
    public decimal CostoPorWpInstalado { get; set; }
    public decimal EficienciaSistema { get; set; }
    public decimal FactorCO2KgPorKwh { get; set; }
    public int WpPorPanel { get; set; }
    public decimal M2PorPanel { get; set; }
    public DateTime FechaActualizacion { get; set; }
}
