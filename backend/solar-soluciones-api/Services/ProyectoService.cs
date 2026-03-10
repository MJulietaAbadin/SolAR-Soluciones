using Dapper;
using Microsoft.Data.SqlClient;
using SolarSoluciones.Api.Models;

namespace SolarSoluciones.Api.Services;

public class ProyectoService : IProyectoService
{
    private readonly string _connectionString;

    public ProyectoService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    public async Task<IEnumerable<Proyecto>> GetProyectosAsync(bool soloDestacados = false)
    {
        var where = soloDestacados ? "AND Destacado = 1" : "";
        var sql = $"SELECT * FROM Proyectos WHERE Activo = 1 {where} ORDER BY FechaInstalacion DESC";

        using var conn = new SqlConnection(_connectionString);
        var proyectos = (await conn.QueryAsync<Proyecto>(sql)).ToList();

        foreach (var p in proyectos)
        {
            var imagenes = await conn.QueryAsync<(string Url, bool EsPrincipal)>(
                "SELECT UrlImagen, EsPrincipal FROM ProyectoImagenes WHERE ProyectoId = @Id ORDER BY Orden",
                new { p.Id });

            p.Imagenes = imagenes.Select(i => i.Url).ToList();
            p.ImagenPrincipal = imagenes.FirstOrDefault(i => i.EsPrincipal).Url
                ?? imagenes.FirstOrDefault().Url;
        }

        return proyectos;
    }

    public async Task<Proyecto?> GetProyectoByIdAsync(int id)
    {
        using var conn = new SqlConnection(_connectionString);
        var proyecto = await conn.QueryFirstOrDefaultAsync<Proyecto>(
            "SELECT * FROM Proyectos WHERE Id = @Id AND Activo = 1", new { Id = id });

        if (proyecto == null) return null;

        var imagenes = await conn.QueryAsync<(string Url, bool EsPrincipal)>(
            "SELECT UrlImagen, EsPrincipal FROM ProyectoImagenes WHERE ProyectoId = @Id ORDER BY Orden",
            new { Id = id });

        proyecto.Imagenes = imagenes.Select(i => i.Url).ToList();
        proyecto.ImagenPrincipal = imagenes.FirstOrDefault(i => i.EsPrincipal).Url
            ?? imagenes.FirstOrDefault().Url;

        return proyecto;
    }
}
