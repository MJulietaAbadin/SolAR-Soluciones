import styles from "./Secciones.module.css";

const pasos = [
  {
    num: "01",
    titulo: "Simulás tu ahorro",
    descripcion: "Ingresás tu consumo mensual en kWh y tu provincia. Nuestro simulador calcula al instante las 3 opciones de sistema solar para tu caso.",
  },
  {
    num: "02",
    titulo: "Elegís tu opción",
    descripcion: "Seleccionás el porcentaje de ahorro que más te conviene: 100%, 50% o 25%. Un asesor comercial te contacta con el presupuesto personalizado.",
  },
  {
    num: "03",
    titulo: "Instalamos tu sistema",
    descripcion: "Nuestro equipo técnico realiza el relevamiento, el proyecto eléctrico y la instalación. Tramitamos la conexión a la red por vos.",
  },
  {
    num: "04",
    titulo: "Empezás a ahorrar",
    descripcion: "Desde el primer día de operación tu medidor gira para atrás. Monitoreable en tiempo real desde tu smartphone.",
  },
];

export default function SeccionComoFunciona() {
  return (
    <section className={`section ${styles.comoFunciona}`}>
      <div className="container">
        <p className={`badge badge-verde ${styles.badgeCenter}`}>El proceso</p>
        <h2 className="section-titulo" style={{ color: "white" }}>¿Cómo funciona?</h2>
        <p className="section-subtitulo" style={{ color: "rgba(255,255,255,0.7)" }}>
          Del simulador a los paneles en el techo, te acompañamos en cada paso.
        </p>

        <div className={styles.pasosGrid}>
          {pasos.map((paso, i) => (
            <div key={i} className={styles.pasoCard}>
              <div className={styles.pasoNum}>{paso.num}</div>
              <h3 className={styles.pasoTitulo}>{paso.titulo}</h3>
              <p className={styles.pasoDesc}>{paso.descripcion}</p>
              {i < pasos.length - 1 && (
                <div className={styles.pasoFlecha}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
