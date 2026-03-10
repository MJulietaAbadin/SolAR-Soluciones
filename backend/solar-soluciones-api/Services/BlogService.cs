using Dapper;
using Microsoft.Data.SqlClient;
using SolarSoluciones.Api.Models;

namespace SolarSoluciones.Api.Services;

public class BlogService : IBlogService
{
    private readonly string _connectionString;

    public BlogService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    public async Task<IEnumerable<BlogArticulo>> GetArticulosAsync(
        string? categoriaSlug = null, int page = 1, int pageSize = 9)
    {
        var where = categoriaSlug != null
            ? "AND bc.Slug = @CategoriaSlug"
            : "";

        var sql = $@"
            SELECT ba.*, bc.Nombre as CategoriaNombre, bc.Slug as CategoriaSlug,
                   u.Nombre as AutorNombre
            FROM BlogArticulos ba
            JOIN BlogCategorias bc ON ba.CategoriaId = bc.Id
            LEFT JOIN Usuarios u ON ba.AutorId = u.Id
            WHERE ba.Publicado = 1 {where}
            ORDER BY ba.FechaPublicacion DESC
            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";

        using var conn = new SqlConnection(_connectionString);
        return await conn.QueryAsync<BlogArticulo>(sql, new
        {
            CategoriaSlug = categoriaSlug,
            Offset = (page - 1) * pageSize,
            PageSize = pageSize
        });
    }

    public async Task<BlogArticulo?> GetArticuloBySlugAsync(string slug)
    {
        const string sql = @"
            SELECT ba.*, bc.Nombre as CategoriaNombre, bc.Slug as CategoriaSlug,
                   u.Nombre as AutorNombre
            FROM BlogArticulos ba
            JOIN BlogCategorias bc ON ba.CategoriaId = bc.Id
            LEFT JOIN Usuarios u ON ba.AutorId = u.Id
            WHERE ba.Slug = @Slug AND ba.Publicado = 1";

        using var conn = new SqlConnection(_connectionString);
        return await conn.QueryFirstOrDefaultAsync<BlogArticulo>(sql, new { Slug = slug });
    }

    public async Task<IEnumerable<BlogCategoria>> GetCategoriasAsync()
    {
        using var conn = new SqlConnection(_connectionString);
        return await conn.QueryAsync<BlogCategoria>(
            "SELECT * FROM BlogCategorias WHERE Activo = 1 ORDER BY Nombre");
    }

    public async Task<int> CrearArticuloAsync(BlogArticuloRequest request, int autorId)
    {
        const string sql = @"
            INSERT INTO BlogArticulos (CategoriaId, AutorId, Titulo, Slug, Resumen, Contenido,
                ImagenPortada, MetaTitle, MetaDescription, Publicado, FechaPublicacion)
            OUTPUT INSERTED.Id
            VALUES (@CategoriaId, @AutorId, @Titulo, @Slug, @Resumen, @Contenido,
                @ImagenPortada, @MetaTitle, @MetaDescription, @Publicado, @FechaPublicacion)";

        using var conn = new SqlConnection(_connectionString);
        return await conn.ExecuteScalarAsync<int>(sql, new
        {
            request.CategoriaId, AutorId = autorId, request.Titulo, request.Slug,
            request.Resumen, request.Contenido, request.ImagenPortada,
            request.MetaTitle, request.MetaDescription, request.Publicado,
            request.FechaPublicacion
        });
    }

    public async Task<bool> ActualizarArticuloAsync(int id, BlogArticuloRequest request)
    {
        const string sql = @"
            UPDATE BlogArticulos SET
                CategoriaId = @CategoriaId, Titulo = @Titulo, Slug = @Slug,
                Resumen = @Resumen, Contenido = @Contenido, ImagenPortada = @ImagenPortada,
                MetaTitle = @MetaTitle, MetaDescription = @MetaDescription,
                Publicado = @Publicado, FechaPublicacion = @FechaPublicacion
            WHERE Id = @Id";

        using var conn = new SqlConnection(_connectionString);
        var rows = await conn.ExecuteAsync(sql, new { Id = id, request.CategoriaId,
            request.Titulo, request.Slug, request.Resumen, request.Contenido,
            request.ImagenPortada, request.MetaTitle, request.MetaDescription,
            request.Publicado, request.FechaPublicacion });
        return rows > 0;
    }
}
