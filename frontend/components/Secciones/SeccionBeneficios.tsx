import styles from "./Secciones.module.css";

const beneficios = [
  {
    icono: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
    ),
    titulo: "Energía limpia e ilimitada",
    descripcion: "El sol es una fuente inagotable. Generá tu propia electricidad sin emisiones de CO2 y contribuí al cuidado del planeta.",
  },
  {
    icono: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
    titulo: "Ahorro desde el primer mes",
    descripcion: "Reducí tu factura de luz hasta un 100%. La inversión se recupera en 5 a 7 años y después generás energía a costo casi cero.",
  },
  {
    icono: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    titulo: "Sistema de monitoreo",
    descripcion: "Controlá la generación de tu sistema en tiempo real desde tu celular. Sabé cuánto generás y cuánto ahorrás cada día.",
  },
  {
    icono: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    titulo: "Garantía y respaldo",
    descripcion: "Paneles con garantía de producción de 25 años. Inversores y mano de obra garantizados. Instalación certificada por profesionales.",
  },
  {
    icono: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    titulo: "Instalación profesional",
    descripcion: "Equipo técnico certificado. Tramitamos la conexión a la red con la distribuidora eléctrica y te asesoramos en todo el proceso.",
  },
  {
    icono: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
    titulo: "Aumenta el valor de tu propiedad",
    descripcion: "Una propiedad con sistema solar tiene mayor valor de mercado. Es una inversión que se valora en cada tasación inmobiliaria.",
  },
];

export default function SeccionBeneficios() {
  return (
    <section className={`section ${styles.beneficios}`}>
      <div className="container">
        <p className={`badge badge-amarillo ${styles.badgeCenter}`}>¿Por qué solar?</p>
        <h2 className="section-titulo">Beneficios de la energía solar</h2>
        <p className="section-subtitulo">
          Más de 200 familias y empresas ya eligieron transformar la energía del sol en ahorro real.
        </p>

        <div className={styles.beneficiosGrid}>
          {beneficios.map((b, i) => (
            <div key={i} className={`card ${styles.beneficioCard}`}>
              <div className={styles.beneficioIcono}>{b.icono}</div>
              <h3 className={styles.beneficioTitulo}>{b.titulo}</h3>
              <p className={styles.beneficioDesc}>{b.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
