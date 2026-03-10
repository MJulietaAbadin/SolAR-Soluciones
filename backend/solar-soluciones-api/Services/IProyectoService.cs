using SolarSoluciones.Api.Models;

namespace SolarSoluciones.Api.Services;

public interface IProyectoService
{
    Task<IEnumerable<Proyecto>> GetProyectosAsync(bool soloDestacados = false);
    Task<Proyecto?> GetProyectoByIdAsync(int id);
}
