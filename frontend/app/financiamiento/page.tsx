import type { Metadata } from "next";
import Link from "next/link";
import styles from "./financiamiento.module.css";

export const metadata: Metadata = {
  title: "Financiamiento e Incentivos | SolAR Soluciones",
  description:
    "Conocé las opciones de financiamiento y los incentivos fiscales para instalar paneles solares en Argentina. Planes de pago, subsidios y beneficios impositivos.",
};

const opciones = [
  {
    titulo: "Plan en cuotas propio",
    icono: "💳",
    descripcion:
      "Financiamos hasta el 80% del valor del sistema en cuotas fijas mensuales. Sin necesidad de banco ni gestión de préstamo.",
    destacado: true,
    items: [
      "Hasta 36 cuotas fijas",
      "Entrada desde el 20%",
      "Sin gestiones bancarias",
      "Aprobación en 48 horas",
    ],
  },
  {
    titulo: "Préstamos bancarios",
    icono: "🏦",
    descripcion:
      "Varios bancos en Argentina ofrecen líneas de crédito para energías renovables a tasa preferencial.",
    items: [
      "Banco Nación – Línea Energías Renovables",
      "BICE – Créditos sustentables",
      "Bancos provinciales con convenios",
      "Tasas desde el 20% TNA",
    ],
  },
  {
    titulo: "Leasing solar",
    icono: "📋",
    descripcion:
      "El sistema queda en tu techo y pagás una cuota mensual menor a lo que pagás de luz. Al final del contrato, el sistema es tuyo.",
    items: [
      "Sin inversión inicial grande",
      "Cuota fija por 60 meses",
      "Mantenimiento incluido",
      "Opción de compra al vencimiento",
    ],
  },
  {
    titulo: "Ley de energía distribuida",
    icono: "⚡",
    descripcion:
      "La Ley 27.424 permite inyectar excedentes a la red y cobrar créditos en tu factura de luz. Conectá a la red y generá más de lo que consumís.",
    items: [
      "Medidor bidireccional gratuito",
      "Créditos por excedentes inyectados",
      "Vigente en 22 provincias",
      "Tramitamos la conexión por vos",
    ],
  },
];

const beneficiosFiscales = [
  {
    titulo: "Exención de IVA",
    descripcion: "Los sistemas solares para generación de energía propia tienen exención del 21% de IVA según RG AFIP 4.220.",
  },
  {
    titulo: "Amortización acelerada",
    descripcion: "Las empresas pueden amortizar el 100% del valor del sistema en el primer ejercicio fiscal.",
  },
  {
    titulo: "Subsidios provinciales",
    descripcion: "Varias provincias (Mendoza, San Luis, Jujuy, Entre Ríos) otorgan subsidios de hasta el 30% del valor de instalación.",
  },
  {
    titulo: "Deducción en Ganancias",
    descripcion: "La inversión en sistemas de generación de energía renovable puede deducirse como gasto en el impuesto a las ganancias.",
  },
];

export default function FinanciamientoPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroBadge}>Financiamiento</div>
          <h1 className={styles.heroTitulo}>Hacelo posible con el plan que más te convenga</h1>
          <p className={styles.heroSubtitulo}>
            La inversión en energía solar se recupera sola. Te ayudamos a encontrar el plan
            de financiamiento ideal para que empieces a ahorrar desde el primer mes.
          </p>
        </div>
      </section>

      {/* Opciones */}
      <section className="section">
        <div className="container">
          <h2 className="section-titulo">Opciones de financiamiento</h2>
          <p className="section-subtitulo">
            Trabajamos con múltiples alternativas para que la inversión se adapte a tu situación.
          </p>
          <div className={styles.opcionesGrid}>
            {opciones.map((o, i) => (
              <div key={i} className={`card ${styles.opcionCard} ${o.destacado ? styles.destacado : ""}`}>
                {o.destacado && <div className={styles.badgeDestacado}>Más solicitado</div>}
                <div className={styles.opcionIcono}>{o.icono}</div>
                <h3 className={styles.opcionTitulo}>{o.titulo}</h3>
                <p className={styles.opcionDesc}>{o.descripcion}</p>
                <ul className={styles.opcionItems}>
                  {o.items.map((item, j) => (
                    <li key={j}>
                      <svg width="14" height="14" fill="none" stroke="var(--solar-verde)" strokeWidth="2.5" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios fiscales */}
      <section className={`section ${styles.fiscalSection}`}>
        <div className="container">
          <h2 className="section-titulo">Beneficios fiscales e impositivos</h2>
          <p className="section-subtitulo">
            El estado argentino incentiva la instalación de energías renovables con beneficios reales.
          </p>
          <div className={styles.fiscalGrid}>
            {beneficiosFiscales.map((b, i) => (
              <div key={i} className={styles.fiscalCard}>
                <div className={styles.fiscalNum}>{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <h3 className={styles.fiscalTitulo}>{b.titulo}</h3>
                  <p className={styles.fiscalDesc}>{b.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div>
              <h2>¿Querés saber cuánto te costaría la cuota?</h2>
              <p>Primero simulá tu sistema ideal y luego nuestro asesor te presenta las opciones de financiamiento.</p>
            </div>
            <Link href="/simulador" className="btn btn-primary">
              Empezar con el simulador →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
