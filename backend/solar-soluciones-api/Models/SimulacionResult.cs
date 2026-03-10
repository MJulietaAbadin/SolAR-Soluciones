namespace SolarSoluciones.Api.Models;

public class SimulacionResult
{
    public int SimulacionId { get; set; }
    public string Provincia { get; set; } = string.Empty;
    public decimal ConsumoMensualKwh { get; set; }
    public OpcionSimulacion Opcion100 { get; set; } = new();
    public OpcionSimulacion Opcion50 { get; set; } = new();
    public OpcionSimulacion Opcion25 { get; set; } = new();
}

public class OpcionSimulacion
{
    public string Porcentaje { get; set; } = string.Empty; // "100%", "50%", "25%"
    public decimal SistemaKw { get; set; }
    public int Paneles { get; set; }
    public decimal SuperficieM2 { get; set; }
    public decimal AhorroMensual { get; set; }
    public decimal AhorroAnual { get; set; }
    public int RetornoMinAnios { get; set; }
    public int RetornoMaxAnios { get; set; }
    public decimal CO2AnualTn { get; set; }
    public int Arboles { get; set; }
}
