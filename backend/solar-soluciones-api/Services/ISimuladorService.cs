using SolarSoluciones.Api.Models;

namespace SolarSoluciones.Api.Services;

public interface ISimuladorService
{
    Task<SimulacionResult> CalcularAsync(SimulacionRequest request);
    Task<IEnumerable<string>> GetProvinciasAsync();
    Task<ParametrosSimulador?> GetParametrosByProvinciaAsync(string provincia);
}
