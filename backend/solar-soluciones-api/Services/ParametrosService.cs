using Dapper;
using Microsoft.Data.SqlClient;
using SolarSoluciones.Api.Models;

namespace SolarSoluciones.Api.Services;

public class ParametrosService : IParametrosService
{
    private readonly string _connectionString;

    public ParametrosService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    public async Task<IEnumerable<ParametrosSimulador>> GetTodosAsync()
    {
        using var conn = new SqlConnection(_connectionString);
        return await conn.QueryAsync<ParametrosSimulador>(
            "SELECT * FROM ParametrosSimulador ORDER BY Provincia");
    }

    public async Task<bool> ActualizarAsync(int id, ParametrosSimulador p)
    {
        const string sql = @"
            UPDATE ParametrosSimulador SET
                HorasSolPicoDiarias = @HorasSolPicoDiarias,
                PrecioKwhRed = @PrecioKwhRed,
                CostoPorWpInstalado = @CostoPorWpInstalado,
                EficienciaSistema = @EficienciaSistema,
                FactorCO2KgPorKwh = @FactorCO2KgPorKwh,
                WpPorPanel = @WpPorPanel,
                M2PorPanel = @M2PorPanel,
                FechaActualizacion = GETDATE()
            WHERE Id = @Id";

        using var conn = new SqlConnection(_connectionString);
        var rows = await conn.ExecuteAsync(sql, new
        {
            Id = id,
            p.HorasSolPicoDiarias, p.PrecioKwhRed, p.CostoPorWpInstalado,
            p.EficienciaSistema, p.FactorCO2KgPorKwh, p.WpPorPanel, p.M2PorPanel
        });
        return rows > 0;
    }
}
