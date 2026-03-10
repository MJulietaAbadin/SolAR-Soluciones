using Dapper;
using Microsoft.Data.SqlClient;
using SolarSoluciones.Api.Models;

namespace SolarSoluciones.Api.Services;

public class LeadService : ILeadService
{
    private readonly string _connectionString;

    public LeadService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    public async Task<int> CrearLeadAsync(LeadRequest request)
    {
        const string sql = @"
            INSERT INTO Leads (Nombre, Email, Telefono, Ciudad, Provincia, TipoPropiedad,
                ConsumoAproximadoKwh, MontoFactura, OpcionSimuladorElegida, SimulacionId,
                Mensaje, Origen, Estado)
            OUTPUT INSERTED.Id
            VALUES (@Nombre, @Email, @Telefono, @Ciudad, @Provincia, @TipoPropiedad,
                @ConsumoAproximadoKwh, @MontoFactura, @OpcionSimuladorElegida, @SimulacionId,
                @Mensaje, @Origen, 'Nuevo')";

        using var conn = new SqlConnection(_connectionString);
        return await conn.ExecuteScalarAsync<int>(sql, request);
    }

    public async Task<IEnumerable<Lead>> GetLeadsAsync(string? estado = null, int page = 1, int pageSize = 20)
    {
        var where = estado != null ? "WHERE Estado = @Estado" : "";
        var sql = $@"
            SELECT * FROM Leads {where}
            ORDER BY FechaCreacion DESC
            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";

        using var conn = new SqlConnection(_connectionString);
        return await conn.QueryAsync<Lead>(sql, new
        {
            Estado = estado,
            Offset = (page - 1) * pageSize,
            PageSize = pageSize
        });
    }

    public async Task<Lead?> GetLeadByIdAsync(int id)
    {
        using var conn = new SqlConnection(_connectionString);
        return await conn.QueryFirstOrDefaultAsync<Lead>(
            "SELECT * FROM Leads WHERE Id = @Id", new { Id = id });
    }

    public async Task<bool> ActualizarEstadoAsync(int id, string estado)
    {
        using var conn = new SqlConnection(_connectionString);
        var rows = await conn.ExecuteAsync(
            "UPDATE Leads SET Estado = @Estado, FechaActualizacion = GETDATE() WHERE Id = @Id",
            new { Id = id, Estado = estado });
        return rows > 0;
    }
}
