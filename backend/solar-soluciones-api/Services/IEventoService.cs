using SolarSoluciones.Api.Models;

namespace SolarSoluciones.Api.Services;

public interface IEventoService
{
    Task RegistrarAsync(EventoWebRequest request);
}
