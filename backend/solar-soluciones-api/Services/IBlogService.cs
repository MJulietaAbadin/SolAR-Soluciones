using SolarSoluciones.Api.Models;

namespace SolarSoluciones.Api.Services;

public interface IBlogService
{
    Task<IEnumerable<BlogArticulo>> GetArticulosAsync(string? categoriaSlug = null, int page = 1, int pageSize = 9);
    Task<BlogArticulo?> GetArticuloBySlugAsync(string slug);
    Task<IEnumerable<BlogCategoria>> GetCategoriasAsync();
    Task<int> CrearArticuloAsync(BlogArticuloRequest request, int autorId);
    Task<bool> ActualizarArticuloAsync(int id, BlogArticuloRequest request);
}
