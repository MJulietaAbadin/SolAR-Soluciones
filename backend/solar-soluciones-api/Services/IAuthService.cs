using SolarSoluciones.Api.Models;

namespace SolarSoluciones.Api.Services;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
}
