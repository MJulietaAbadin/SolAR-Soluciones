import type { Metadata } from "next";
import Link from "next/link";
import styles from "./nosotros.module.css";

export const metadata: Metadata = {
  title: "Quiénes Somos | SolAR Soluciones",
  description:
    "Somos una empresa argentina especializada en instalación de sistemas solares fotovoltaicos. Conocé nuestro equipo, nuestra historia y nuestros valores.",
};

const valores = [
  {
    icono: "🌞",
    titulo: "Compromiso con la energía limpia",
    desc: "Creemos en un futuro donde cada hogar y empresa genera su propia energía renovable.",
  },
  {
    icono: "🤝",
    titulo: "Transparencia total",
    desc: "No vendemos humo. Te mostramos los números reales: cuánto ahorrás, cuánto cuesta, cuándo se recupera.",
  },
  {
    icono: "⚙️",
    titulo: "Excelencia técnica",
    desc: "Nuestros instaladores están certificados y trabajamos solo con equipos de primera calidad.",
  },
  {
    icono: "📍",
    titulo: "Presencia nacional",
    desc: "Instalamos en todo el país. Trabajamos con instaladores certificados en cada provincia.",
  },
];

const equipo = [
  { nombre: "Martín Ferreyra", rol: "CEO & Fundador", exp: "15 años en energías renovables" },
  { nombre: "Laura González", rol: "Directora Técnica", exp: "Ingeniera eléctrica – UBA" },
  { nombre: "Diego Molina", rol: "Jefe de Instalaciones", exp: "Técnico certificado ANRE" },
  { nombre: "Ana Brito", rol: "Comercial & Asesoría", exp: "Especialista en proyectos solares" },
];

export default function NosotrosPage() {
  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroBadge}>Quiénes somos</div>
          <h1 className={styles.heroTitulo}>
            Más de 10 años llevando el sol a hogares y empresas argentinas
          </h1>
          <p className={styles.heroSubtitulo}>
            SolAR Soluciones nació con la misión de hacer accesible la energía solar
            para todos. Desde Buenos Aires hasta la Patagonia, instalamos sistemas
            que realmente funcionan.
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="section">
        <div className="container">
          <div className={styles.historiaGrid}>
            <div className={styles.historiaTexto}>
              <p className={`badge badge-amarillo`} style={{ marginBottom: "1rem" }}>Nuestra historia</p>
              <h2 className={styles.historiaTitulo}>
                Empezamos con un panel en el techo de casa
              </h2>
              <p>
                En 2014, nuestro fundador Martín Ferreyra instaló los primeros paneles en su casa de
                Palermo. La factura de luz bajó un 80%. Los vecinos preguntaron. Y así nació SolAR Soluciones.
              </p>
              <p>
                Hoy somos un equipo de más de 20 profesionales. Hemos instalado más de 200 sistemas
                en 18 provincias argentinas. Pero seguimos teniendo la misma filosofía del primer día:
                hacer bien las cuentas y ser honestos con el cliente.
              </p>
              <div className={styles.historiaNums}>
                <div className={styles.historiaNum}>
                  <span>+200</span>
                  <small>Sistemas instalados</small>
                </div>
                <div className={styles.historiaNum}>
                  <span>18</span>
                  <small>Provincias cubiertas</small>
                </div>
                <div className={styles.historiaNum}>
                  <span>10+</span>
                  <small>Años de experiencia</small>
                </div>
              </div>
            </div>
            <div className={styles.historiaImagen}>
              <div className={styles.historiaImagenPlaceholder}>
                <svg width="60" height="60" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className={`section ${styles.valoresSection}`}>
        <div className="container">
          <h2 className="section-titulo">Nuestros valores</h2>
          <div className={styles.valoresGrid}>
            {valores.map((v, i) => (
              <div key={i} className={`card ${styles.valorCard}`}>
                <div className={styles.valorIcono}>{v.icono}</div>
                <h3 className={styles.valorTitulo}>{v.titulo}</h3>
                <p className={styles.valorDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="section">
        <div className="container">
          <h2 className="section-titulo">El equipo</h2>
          <p className="section-subtitulo">
            Profesionales con experiencia real en energía solar en Argentina.
          </p>
          <div className={styles.equipoGrid}>
            {equipo.map((m, i) => (
              <div key={i} className={`card ${styles.miembroCard}`}>
                <div className={styles.miembroAvatar}>
                  {m.nombre.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <h3 className={styles.miembroNombre}>{m.nombre}</h3>
                <p className={styles.miembroRol}>{m.rol}</p>
                <p className={styles.miembroExp}>{m.exp}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2>¿Querés trabajar en el sector solar?</h2>
          <p>Estamos creciendo y siempre buscamos instaladores certificados y asesores comerciales.</p>
          <Link href="/contacto" className="btn btn-primary" style={{ marginTop: "1.5rem" }}>
            Contactanos
          </Link>
        </div>
      </section>
    </>
  );
}
