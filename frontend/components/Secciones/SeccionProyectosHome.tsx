import Link from "next/link";
import styles from "./Secciones.module.css";

// Proyectos de muestra (en producción vienen de la API)
const proyectos = [
  {
    titulo: "Residencia familiar en Palermo",
    tipo: "Residencial",
    sistema: "5.2 kWp",
    paneles: 13,
    ahorro: "85%",
    provincia: "Buenos Aires",
    imagen: null,
  },
  {
    titulo: "Supermercado en Córdoba",
    tipo: "Comercial",
    sistema: "30 kWp",
    paneles: 75,
    ahorro: "60%",
    provincia: "Córdoba",
    imagen: null,
  },
  {
    titulo: "Vivienda unifamiliar en Mendoza",
    tipo: "Residencial",
    sistema: "3.6 kWp",
    paneles: 9,
    ahorro: "100%",
    provincia: "Mendoza",
    imagen: null,
  },
];

export default function SeccionProyectosHome() {
  return (
    <section className={`section ${styles.proyectosHome}`}>
      <div className="container">
        <p className={`badge badge-amarillo ${styles.badgeCenter}`}>Casos reales</p>
        <h2 className="section-titulo">Proyectos ejecutados</h2>
        <p className="section-subtitulo">
          Instalaciones reales con ahorros comprobados en todo el país.
        </p>

        <div className={styles.proyectosGrid}>
          {proyectos.map((p, i) => (
            <div key={i} className={`card ${styles.proyectoCard}`}>
              <div className={styles.proyectoImagen}>
                <div className={styles.proyectoPlaceholder}>
                  <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    <polyline points="9,22 9,12 15,12 15,22"/>
                  </svg>
                </div>
                <span className={`badge badge-amarillo ${styles.proyectoBadgeTipo}`}>{p.tipo}</span>
              </div>
              <div className={styles.proyectoInfo}>
                <h3 className={styles.proyectoTitulo}>{p.titulo}</h3>
                <div className={styles.proyectoStats}>
                  <div className={styles.proyectoStat}>
                    <span className={styles.proyectoStatLabel}>Sistema</span>
                    <span className={styles.proyectoStatVal}>{p.sistema}</span>
                  </div>
                  <div className={styles.proyectoStat}>
                    <span className={styles.proyectoStatLabel}>Paneles</span>
                    <span className={styles.proyectoStatVal}>{p.paneles}</span>
                  </div>
                  <div className={styles.proyectoStat}>
                    <span className={styles.proyectoStatLabel}>Ahorro</span>
                    <span className={`${styles.proyectoStatVal} ${styles.proyectoAhorro}`}>{p.ahorro}</span>
                  </div>
                </div>
                <p className={styles.proyectoUbicacion}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {p.provincia}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.centrado}>
          <Link href="/proyectos" className="btn btn-secondary">
            Ver todos los proyectos
          </Link>
        </div>
      </div>
    </section>
  );
}
