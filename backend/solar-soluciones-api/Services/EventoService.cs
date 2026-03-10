using Dapper;
using Microsoft.Data.SqlClient;
using SolarSoluciones.Api.Models;

namespace SolarSoluciones.Api.Services;

public class EventoService : IEventoService
{
    private readonly string _connectionString;

    public EventoService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    public async Task RegistrarAsync(EventoWebRequest request)
    {
        const string sql = @"
            INSERT INTO EventosWeb (TipoEvento, Pagina, IpUsuario, UserAgent)
            VALUES (@TipoEvento, @Pagina, @IpUsuario, @UserAgent)";

        using var conn = new SqlConnection(_connectionString);
        await conn.ExecuteAsync(sql, request);
    }
}
