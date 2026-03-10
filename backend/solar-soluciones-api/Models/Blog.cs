namespace SolarSoluciones.Api.Models;

public class BlogArticulo
{
    public int Id { get; set; }
    public int CategoriaId { get; set; }
    public string CategoriaNombre { get; set; } = string.Empty;
    public string CategoriaSlug { get; set; } = string.Empty;
    public string? AutorNombre { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Resumen { get; set; }
    public string? Contenido { get; set; }
    public string? ImagenPortada { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public bool Publicado { get; set; }
    public DateTime? FechaPublicacion { get; set; }
    public DateTime FechaCreacion { get; set; }
}

public class BlogCategoria
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public bool Activo { get; set; }
}

public class BlogArticuloRequest
{
    public int CategoriaId { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Resumen { get; set; }
    public string? Contenido { get; set; }
    public string? ImagenPortada { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public bool Publicado { get; set; }
    public DateTime? FechaPublicacion { get; set; }
}
