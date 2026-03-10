import Link from "next/link";
import styles from "./page.module.css";
import SeccionBeneficios from "@/components/Secciones/SeccionBeneficios";
import SeccionComoFunciona from "@/components/Secciones/SeccionComoFunciona";
import SeccionProyectosHome from "@/components/Secciones/SeccionProyectosHome";
import SeccionCTA from "@/components/Secciones/SeccionCTA";

export default function HomePage() {
  return (
    <>
      {/* ---- HERO ---- */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <span>Energía solar en Argentina</span>
          </div>
          <h1 className={styles.heroTitulo}>
            Dejá de pagar luz cara.
            <br />
            <span className={styles.heroAmarillo}>Pasate a la energía solar.</span>
          </h1>
          <p className={styles.heroSubtitulo}>
            Instalamos sistemas fotovoltaicos a medida para hogares y empresas.
            Ahorrá hasta un 100% en tu factura y generá tu propia energía limpia.
          </p>
          <div className={styles.heroBotones}>
            <Link href="/simulador" className="btn btn-primary">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              Simulá tu ahorro gratis
            </Link>
            <Link href="/proyectos" className="btn btn-outline">
              Ver proyectos realizados
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>+200</span>
              <span className={styles.statLabel}>Proyectos instalados</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>100%</span>
              <span className={styles.statLabel}>Ahorro posible</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>5-7</span>
              <span className={styles.statLabel}>Años retorno inversión</span>
            </div>
          </div>
        </div>

        {/* Olas decorativas */}
        <div className={styles.heroWave}>
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40L48 45.3C96 50.7 192 61.3 288 61.3C384 61.3 480 50.7 576 45.3C672 40 768 40 864 43.7C960 47.3 1056 54.7 1152 54.7C1248 54.7 1344 47.3 1392 43.7L1440 40V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0V40Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ---- SIMULADOR CTA ---- */}
      <section className={styles.simuladorCta}>
        <div className="container">
          <div className={styles.simuladorCtaCard}>
            <div className={styles.simuladorCtaTexto}>
              <h2>¿Cuánto podés ahorrar con solar?</h2>
              <p>Ingresá tu consumo mensual y descubrí el sistema ideal para tu caso en segundos.</p>
            </div>
            <Link href="/simulador" className="btn btn-primary">
              Calculá ahora →
            </Link>
          </div>
        </div>
      </section>

      {/* ---- BENEFICIOS ---- */}
      <SeccionBeneficios />

      {/* ---- CÓMO FUNCIONA ---- */}
      <SeccionComoFunciona />

      {/* ---- PROYECTOS DESTACADOS ---- */}
      <SeccionProyectosHome />

      {/* ---- CTA FINAL ---- */}
      <SeccionCTA />
    </>
  );
}
