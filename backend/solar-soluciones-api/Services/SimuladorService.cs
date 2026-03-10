using Dapper;
using Microsoft.Data.SqlClient;
using SolarSoluciones.Api.Models;

namespace SolarSoluciones.Api.Services;

public class SimuladorService : ISimuladorService
{
    private readonly string _connectionString;

    public SimuladorService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string no configurada");
    }

    public async Task<SimulacionResult> CalcularAsync(SimulacionRequest request)
    {
        var parametros = await GetParametrosByProvinciaAsync(request.Provincia)
            ?? throw new ArgumentException($"Provincia '{request.Provincia}' no encontrada");

        var op100 = CalcularOpcion(request.ConsumoMensualKwh, 1.0m, parametros, "100%");
        var op50 = CalcularOpcion(request.ConsumoMensualKwh, 0.5m, parametros, "50%");
        var op25 = CalcularOpcion(request.ConsumoMensualKwh, 0.25m, parametros, "25%");

        // Guardar en base de datos
        int simulacionId = await GuardarSimulacionAsync(request, op100, op50, op25);

        return new SimulacionResult
        {
            SimulacionId = simulacionId,
            Provincia = request.Provincia,
            ConsumoMensualKwh = request.ConsumoMensualKwh,
            Opcion100 = op100,
            Opcion50 = op50,
            Opcion25 = op25
        };
    }

    private static OpcionSimulacion CalcularOpcion(
        decimal consumoMensual, decimal porcentaje,
        ParametrosSimulador p, string label)
    {
        decimal consumoCubierto = consumoMensual * porcentaje;

        // Sistema necesario en kWp
        decimal sistemaKw = consumoCubierto / (p.HorasSolPicoDiarias * 30m * p.EficienciaSistema);
        sistemaKw = Math.Round(sistemaKw, 2);

        // Paneles y superficie
        int paneles = (int)Math.Ceiling(sistemaKw * 1000m / p.WpPorPanel);
        decimal superficieM2 = Math.Round(paneles * p.M2PorPanel, 1);

        // Ahorros
        decimal ahorroMensual = Math.Round(consumoCubierto * p.PrecioKwhRed, 0);
        decimal ahorroAnual = ahorroMensual * 12m;

        // Retorno de inversión
        decimal costoTotal = sistemaKw * 1000m * p.CostoPorWpInstalado;
        int retornoMin = (int)Math.Floor(costoTotal * 0.9m / ahorroAnual);
        int retornoMax = (int)Math.Ceiling(costoTotal * 1.1m / ahorroAnual);

        // Impacto ambiental
        decimal co2AnualTn = Math.Round(consumoCubierto * 12m * p.FactorCO2KgPorKwh / 1000m, 2);
        int arboles = (int)Math.Ceiling(co2AnualTn * 1000m / 21.77m);

        return new OpcionSimulacion
        {
            Porcentaje = label,
            SistemaKw = sistemaKw,
            Paneles = paneles,
            SuperficieM2 = superficieM2,
            AhorroMensual = ahorroMensual,
            AhorroAnual = ahorroAnual,
            RetornoMinAnios = retornoMin,
            RetornoMaxAnios = retornoMax,
            CO2AnualTn = co2AnualTn,
            Arboles = arboles
        };
    }

    private async Task<int> GuardarSimulacionAsync(
        SimulacionRequest req,
        OpcionSimulacion op100, OpcionSimulacion op50, OpcionSimulacion op25)
    {
        const string sql = @"
            INSERT INTO SimulacionesSolares (
                Provincia, TipoPropiedad, ConsumoMensualKwh, MontoFacturaMensual,
                Op100_SistemaKw, Op100_Paneles, Op100_SuperficieM2, Op100_AhorroMensual,
                Op100_AhorroAnual, Op100_RetornoMinAnios, Op100_RetornoMaxAnios, Op100_CO2AnualTn, Op100_Arboles,
                Op50_SistemaKw, Op50_Paneles, Op50_SuperficieM2, Op50_AhorroMensual,
                Op50_AhorroAnual, Op50_RetornoMinAnios, Op50_RetornoMaxAnios, Op50_CO2AnualTn, Op50_Arboles,
                Op25_SistemaKw, Op25_Paneles, Op25_SuperficieM2, Op25_AhorroMensual,
                Op25_AhorroAnual, Op25_RetornoMinAnios, Op25_RetornoMaxAnios, Op25_CO2AnualTn, Op25_Arboles,
                IpUsuario
            )
            OUTPUT INSERTED.Id
            VALUES (
                @Provincia, @TipoPropiedad, @ConsumoMensualKwh, @MontoFacturaMensual,
                @Op100_SistemaKw, @Op100_Paneles, @Op100_SuperficieM2, @Op100_AhorroMensual,
                @Op100_AhorroAnual, @Op100_RetornoMinAnios, @Op100_RetornoMaxAnios, @Op100_CO2AnualTn, @Op100_Arboles,
                @Op50_SistemaKw, @Op50_Paneles, @Op50_SuperficieM2, @Op50_AhorroMensual,
                @Op50_AhorroAnual, @Op50_RetornoMinAnios, @Op50_RetornoMaxAnios, @Op50_CO2AnualTn, @Op50_Arboles,
                @Op25_SistemaKw, @Op25_Paneles, @Op25_SuperficieM2, @Op25_AhorroMensual,
                @Op25_AhorroAnual, @Op25_RetornoMinAnios, @Op25_RetornoMaxAnios, @Op25_CO2AnualTn, @Op25_Arboles,
                @IpUsuario
            )";

        using var conn = new SqlConnection(_connectionString);
        return await conn.ExecuteScalarAsync<int>(sql, new
        {
            req.Provincia,
            req.TipoPropiedad,
            req.ConsumoMensualKwh,
            req.MontoFacturaMensual,
            Op100_SistemaKw = op100.SistemaKw, Op100_Paneles = op100.Paneles,
            Op100_SuperficieM2 = op100.SuperficieM2, Op100_AhorroMensual = op100.AhorroMensual,
            Op100_AhorroAnual = op100.AhorroAnual, Op100_RetornoMinAnios = op100.RetornoMinAnios,
            Op100_RetornoMaxAnios = op100.RetornoMaxAnios, Op100_CO2AnualTn = op100.CO2AnualTn,
            Op100_Arboles = op100.Arboles,
            Op50_SistemaKw = op50.SistemaKw, Op50_Paneles = op50.Paneles,
            Op50_SuperficieM2 = op50.SuperficieM2, Op50_AhorroMensual = op50.AhorroMensual,
            Op50_AhorroAnual = op50.AhorroAnual, Op50_RetornoMinAnios = op50.RetornoMinAnios,
            Op50_RetornoMaxAnios = op50.RetornoMaxAnios, Op50_CO2AnualTn = op50.CO2AnualTn,
            Op50_Arboles = op50.Arboles,
            Op25_SistemaKw = op25.SistemaKw, Op25_Paneles = op25.Paneles,
            Op25_SuperficieM2 = op25.SuperficieM2, Op25_AhorroMensual = op25.AhorroMensual,
            Op25_AhorroAnual = op25.AhorroAnual, Op25_RetornoMinAnios = op25.RetornoMinAnios,
            Op25_RetornoMaxAnios = op25.RetornoMaxAnios, Op25_CO2AnualTn = op25.CO2AnualTn,
            Op25_Arboles = op25.Arboles,
            req.IpUsuario
        });
    }

    public async Task<IEnumerable<string>> GetProvinciasAsync()
    {
        using var conn = new SqlConnection(_connectionString);
        return await conn.QueryAsync<string>(
            "SELECT Provincia FROM ParametrosSimulador ORDER BY Provincia");
    }

    public async Task<ParametrosSimulador?> GetParametrosByProvinciaAsync(string provincia)
    {
        using var conn = new SqlConnection(_connectionString);
        return await conn.QueryFirstOrDefaultAsync<ParametrosSimulador>(
            "SELECT * FROM ParametrosSimulador WHERE Provincia = @Provincia",
            new { Provincia = provincia });
    }
}
