using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using SolarSoluciones.Api.Models;

namespace SolarSoluciones.Api.Services;

public class AuthService : IAuthService
{
    private readonly string _connectionString;
    private readonly IConfiguration _configuration;

    public AuthService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        _configuration = configuration;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        using var conn = new SqlConnection(_connectionString);
        var usuario = await conn.QueryFirstOrDefaultAsync<Usuario>(
            "SELECT * FROM Usuarios WHERE Email = @Email AND Activo = 1",
            new { request.Email });

        if (usuario == null) return null;

        if (!BCrypt.Net.BCrypt.Verify(request.Password, usuario.PasswordHash))
            return null;

        // Actualizar ultimo login
        await conn.ExecuteAsync(
            "UPDATE Usuarios SET UltimoLogin = GETDATE() WHERE Id = @Id",
            new { usuario.Id });

        var token = GenerarToken(usuario);
        var expirationHours = _configuration.GetValue<int>("Jwt:ExpirationHours", 8);

        return new LoginResponse
        {
            Token = token,
            Nombre = usuario.Nombre,
            Email = usuario.Email,
            Rol = usuario.Rol,
            Expiracion = DateTime.UtcNow.AddHours(expirationHours)
        };
    }

    private string GenerarToken(Usuario usuario)
    {
        var key = _configuration["Jwt:Key"]!;
        var issuer = _configuration["Jwt:Issuer"]!;
        var audience = _configuration["Jwt:Audience"]!;
        var expirationHours = _configuration.GetValue<int>("Jwt:ExpirationHours", 8);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new Claim(ClaimTypes.Email, usuario.Email),
            new Claim(ClaimTypes.Name, usuario.Nombre),
            new Claim(ClaimTypes.Role, usuario.Rol)
        };

        var keyBytes = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(keyBytes, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(expirationHours),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
