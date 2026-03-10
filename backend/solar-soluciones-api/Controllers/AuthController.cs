using Microsoft.AspNetCore.Mvc;
using SolarSoluciones.Api.Models;
using SolarSoluciones.Api.Services;

namespace SolarSoluciones.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password))
            return BadRequest("Email y contraseña requeridos");

        var response = await _authService.LoginAsync(request);
        if (response == null)
            return Unauthorized(new { mensaje = "Credenciales incorrectas" });

        return Ok(response);
    }
}
