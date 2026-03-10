import type { Metadata } from "next";
import Link from "next/link";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Blog de Energía Solar | SolAR Soluciones",
  description:
    "Artículos educativos sobre paneles solares, ahorro energético, financiamiento y novedades del sector solar en Argentina.",
};

// Artículos de muestra (en producción vienen de la API)
const articulos = [
  {
    slug: "cuanto-ahorra-sistema-solar-argentina",
    titulo: "¿Cuánto realmente se ahorra con un sistema solar en Argentina?",
    resumen: "Analizamos los números reales de 50 instalaciones y calculamos el retorno promedio por provincia y tipo de consumo.",
    categoria: "Ahorro Energético",
    categoriaSlug: "ahorro-energetico",
    autor: "Laura González",
    fecha: "2026-02-15",
    imagen: null,
  },
  {
    slug: "ley-27424-energia-distribuida-argentina",
    titulo: "Ley 27.424: Cómo vender energía solar a la red en Argentina",
    resumen: "Todo sobre la ley de generación distribuida. Qué provincias están adheridas, cómo se tramita y qué créditos podés recibir.",
    categoria: "Energía Solar Argentina",
    categoriaSlug: "energia-solar-argentina",
    autor: "Martín Ferreyra",
    fecha: "2026-01-28",
    imagen: null,
  },
  {
    slug: "financiamiento-paneles-solares-2026",
    titulo: "Opciones de financiamiento para paneles solares en 2026",
    resumen: "Comparamos todas las líneas de crédito disponibles: banco Nación, BICE, bancos provinciales y planes propios.",
    categoria: "Financiamiento",
    categoriaSlug: "financiamiento",
    autor: "Ana Brito",
    fecha: "2026-01-10",
    imagen: null,
  },
  {
    slug: "paneles-solares-departamento-argentina",
    titulo: "¿Se pueden instalar paneles solares en un departamento?",
    resumen: "La guía completa para propietarios de departamentos. Balcones, terrazas comunitarias y las opciones legales disponibles.",
    categoria: "Instalaciones",
    categoriaSlug: "instalaciones",
    autor: "Diego Molina",
    fecha: "2025-12-20",
    imagen: null,
  },
  {
    slug: "impacto-ambiental-energia-solar",
    titulo: "El impacto ambiental real de los paneles solares",
    resumen: "Calculamos cuánto CO2 se evita, cuántos árboles equivalen y cuál es la huella de carbono de fabricar un panel solar.",
    categoria: "Ahorro Energético",
    categoriaSlug: "ahorro-energetico",
    autor: "Laura González",
    fecha: "2025-12-05",
    imagen: null,
  },
  {
    slug: "subsidios-energia-solar-provincias-argentina",
    titulo: "Subsidios provinciales para energía solar en Argentina 2026",
    resumen: "Mendoza, San Luis, Jujuy, Entre Ríos y más. Un mapa actualizado de subsidios disponibles provincia por provincia.",
    categoria: "Financiamiento",
    categoriaSlug: "financiamiento",
    autor: "Ana Brito",
    fecha: "2025-11-18",
    imagen: null,
  },
];

const categorias = [
  "Todos",
  "Ahorro Energético",
  "Instalaciones",
  "Financiamiento",
  "Energía Solar Argentina",
  "Novedades",
];

function formatFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroBadge}>Blog educativo</div>
          <h1 className={styles.heroTitulo}>Todo sobre energía solar en Argentina</h1>
          <p className={styles.heroSubtitulo}>
            Artículos escritos por nuestros técnicos y asesores para que tomes la mejor decisión.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Filtros de categoría */}
          <div className={styles.categorias}>
            {categorias.map((c) => (
              <button key={c} className={`${styles.catBtn} ${c === "Todos" ? styles.catActivo : ""}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Artículo destacado */}
          <article className={`card ${styles.articuloDestacado}`}>
            <div className={styles.articuloDestacadoImagen}>
              <div className={styles.articuloPlaceholder}>
                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M4 6h16M4 12h16M4 18h7"/>
                </svg>
              </div>
            </div>
            <div className={styles.articuloDestacadoBody}>
              <span className={`badge badge-amarillo`}>{articulos[0].categoria}</span>
              <h2 className={styles.articuloDestacadoTitulo}>
                <Link href={`/blog/${articulos[0].slug}`}>{articulos[0].titulo}</Link>
              </h2>
              <p className={styles.articuloResumen}>{articulos[0].resumen}</p>
              <div className={styles.articuloMeta}>
                <span>{articulos[0].autor}</span>
                <span>·</span>
                <span>{formatFecha(articulos[0].fecha)}</span>
              </div>
              <Link href={`/blog/${articulos[0].slug}`} className="btn btn-primary">
                Leer artículo →
              </Link>
            </div>
          </article>

          {/* Grilla de artículos */}
          <div className={styles.grid}>
            {articulos.slice(1).map((a) => (
              <article key={a.slug} className={`card ${styles.articuloCard}`}>
                <div className={styles.articuloImagen}>
                  <div className={styles.articuloPlaceholder}>
                    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M4 6h16M4 12h16M4 18h7"/>
                    </svg>
                  </div>
                </div>
                <div className={styles.articuloBody}>
                  <span className={`badge badge-amarillo ${styles.articuloCat}`}>{a.categoria}</span>
                  <h3 className={styles.articuloTitulo}>
                    <Link href={`/blog/${a.slug}`}>{a.titulo}</Link>
                  </h3>
                  <p className={styles.articuloResumen}>{a.resumen}</p>
                  <div className={styles.articuloMeta}>
                    <span>{a.autor}</span>
                    <span>·</span>
                    <span>{formatFecha(a.fecha)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
