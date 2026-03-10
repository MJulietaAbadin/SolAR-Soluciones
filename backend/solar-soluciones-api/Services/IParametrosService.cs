using SolarSoluciones.Api.Models;

namespace SolarSoluciones.Api.Services;

public interface IParametrosService
{
    Task<IEnumerable<ParametrosSimulador>> GetTodosAsync();
    Task<bool> ActualizarAsync(int id, ParametrosSimulador parametros);
}
