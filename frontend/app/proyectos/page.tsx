import type { Metadata } from "next";
import styles from "./proyectos.module.css";

export const metadata: Metadata = {
  title: "Proyectos Realizados | SolAR Soluciones",
  description:
    "Conocé las instalaciones solares que realizamos en todo el país. Casos reales con ahorros comprobados para hogares, comercios e industrias.",
};

const proyectos = [
  {
    titulo: "Residencia familiar en Palermo",
    tipo: "Residencial",
    sistema: "5.2 kWp",
    paneles: 13,
    facAntes: "$18.500",
    facDespues: "$2.800",
    ahorro: "85%",
    provincia: "Buenos Aires",
    descripcion: "Sistema instalado en techo plano con orientación norte óptima. El cliente eliminó casi por completo su factura de luz.",
  },
  {
    titulo: "Supermercado en Córdoba",
    tipo: "Comercial",
    sistema: "30 kWp",
    paneles: 75,
    facAntes: "$320.000",
    facDespues: "$128.000",
    ahorro: "60%",
    provincia: "Córdoba",
    descripcion: "Sistema de gran escala instalado en techo metálico. Reducción significativa de costos operativos del negocio.",
  },
  {
    titulo: "Vivienda unifamiliar en Mendoza",
    tipo: "Residencial",
    sistema: "3.6 kWp",
    paneles: 9,
    facAntes: "$12.000",
    facDespues: "$0",
    ahorro: "100%",
    provincia: "Mendoza",
    descripcion: "Sistema dimensionado para cubrir el 100% del consumo anual. Excedentes inyectados a la red con medición bidireccional.",
  },
  {
    titulo: "Planta industrial en Rosario",
    tipo: "Industrial",
    sistema: "120 kWp",
    paneles: 300,
    facAntes: "$1.200.000",
    facDespues: "$480.000",
    ahorro: "60%",
    provincia: "Santa Fe",
    descripcion: "Mega instalación en nave industrial. El proyecto incluye monitoreo en tiempo real y telemetría de producción.",
  },
  {
    titulo: "Finca vitivinícola en San Juan",
    tipo: "Agropecuario",
    sistema: "15 kWp",
    paneles: 38,
    facAntes: "$65.000",
    facDespues: "$16.000",
    ahorro: "75%",
    provincia: "San Juan",
    descripcion: "Sistema mixto para bombeo de riego y suministro de instalaciones. Ideal para zonas rurales con alta irradiación.",
  },
  {
    titulo: "Hotel boutique en Salta",
    tipo: "Comercial",
    sistema: "8 kWp",
    paneles: 20,
    facAntes: "$45.000",
    facDespues: "$11.000",
    ahorro: "75%",
    provincia: "Salta",
    descripcion: "Instalación integrada estéticamente en el diseño arquitectónico del establecimiento turístico.",
  },
];

const tiposColor: Record<string, string> = {
  Residencial: "badge-amarillo",
  Comercial: "badge-verde",
  Industrial: "badge-amarillo",
  Agropecuario: "badge-verde",
};

export default function ProyectosPage() {
  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroBadge}>Casos reales</div>
          <h1 className={styles.heroTitulo}>Proyectos ejecutados</h1>
          <p className={styles.heroSubtitulo}>
            Instalaciones reales en todo el país. Ahorros comprobados en hogares, comercios e industrias.
          </p>
        </div>
      </section>

      {/* Grilla */}
      <section className={`section`}>
        <div className="container">
          <div className={styles.grid}>
            {proyectos.map((p, i) => (
              <article key={i} className={`card ${styles.card}`}>
                <div className={styles.cardImagen}>
                  <div className={styles.cardPlaceholder}>
                    <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                  <span className={`badge ${tiposColor[p.tipo] || "badge-amarillo"} ${styles.cardBadge}`}>
                    {p.tipo}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitulo}>{p.titulo}</h2>
                  <p className={styles.cardDesc}>{p.descripcion}</p>

                  <div className={styles.cardStats}>
                    <div className={styles.cardStat}>
                      <span>Sistema</span>
                      <strong>{p.sistema}</strong>
                    </div>
                    <div className={styles.cardStat}>
                      <span>Paneles</span>
                      <strong>{p.paneles}</strong>
                    </div>
                    <div className={styles.cardStat}>
                      <span>Ahorro</span>
                      <strong className={styles.verde}>{p.ahorro}</strong>
                    </div>
                  </div>

                  <div className={styles.cardFactura}>
                    <div className={styles.facturaItem}>
                      <span>Factura antes</span>
                      <strong className={styles.rojo}>{p.facAntes}</strong>
                    </div>
                    <div className={styles.facturaFlecha}>→</div>
                    <div className={styles.facturaItem}>
                      <span>Factura ahora</span>
                      <strong className={styles.verde}>{p.facDespues}</strong>
                    </div>
                  </div>

                  <div className={styles.cardProvincia}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {p.provincia}
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
