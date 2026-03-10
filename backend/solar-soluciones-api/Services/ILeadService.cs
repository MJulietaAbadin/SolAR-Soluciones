using SolarSoluciones.Api.Models;

namespace SolarSoluciones.Api.Services;

public interface ILeadService
{
    Task<int> CrearLeadAsync(LeadRequest request);
    Task<IEnumerable<Lead>> GetLeadsAsync(string? estado = null, int page = 1, int pageSize = 20);
    Task<Lead?> GetLeadByIdAsync(int id);
    Task<bool> ActualizarEstadoAsync(int id, string estado);
}
