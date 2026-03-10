import Link from "next/link";
import styles from "./Secciones.module.css";

export default function SeccionCTA() {
  return (
    <section className={styles.ctaFinal}>
      <div className="container">
        <div className={styles.ctaFinalInner}>
          <div className={styles.ctaFinalTexto}>
            <h2>¿Listo para dejar de pagar luz cara?</h2>
            <p>
              Más de 200 familias y empresas ya lo hicieron. El simulador es gratis y sin compromiso.
            </p>
          </div>
          <div className={styles.ctaFinalBotones}>
            <Link href="/simulador" className="btn btn-primary">
              Simulá tu ahorro gratis
            </Link>
            <Link href="/contacto" className="btn btn-outline">
              Contactar un asesor
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
