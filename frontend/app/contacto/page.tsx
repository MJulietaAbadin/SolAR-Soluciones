"use client";

import { useState } from "react";
import styles from "./contacto.module.css";
import { fetchApi } from "@/lib/api";

export default function ContactoPage() {
  const [form, setForm] = useState({
    nombre: "", email: "", telefono: "", ciudad: "",
    provincia: "", mensaje: "", origen: "Formulario",
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.telefono) {
      setError("Completá los campos obligatorios");
      return;
    }
    setEnviando(true);
    try {
      await fetchApi("/api/leads", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setEnviado(true);
    } catch {
      setError("Error al enviar. Intentá nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroBadge}>Contacto</div>
          <h1 className={styles.heroTitulo}>Hablemos de tu proyecto solar</h1>
          <p className={styles.heroSubtitulo}>
            Nuestros asesores están listos para ayudarte. Respondemos en menos de 24 horas hábiles.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {/* Formulario */}
            <div className={styles.formCol}>
              <div className={styles.formCard}>
                <h2 className={styles.formTitulo}>Envianos tu consulta</h2>

                {enviado ? (
                  <div className={styles.exito}>
                    <div className={styles.exitoIcono}>✅</div>
                    <h3>¡Mensaje enviado!</h3>
                    <p>Nos pondremos en contacto a la brevedad. También podés escribirnos por WhatsApp para una respuesta más rápida.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formRow}>
                      <div className="form-group">
                        <label className="form-label">Nombre y apellido *</label>
                        <input type="text" name="nombre" value={form.nombre} onChange={handleChange} className="form-input" placeholder="Juan García" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email *</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} className="form-input" placeholder="juan@email.com" required />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className="form-group">
                        <label className="form-label">Teléfono *</label>
                        <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} className="form-input" placeholder="+54 9 11 XXXX-XXXX" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Ciudad</label>
                        <input type="text" name="ciudad" value={form.ciudad} onChange={handleChange} className="form-input" placeholder="Buenos Aires" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Provincia</label>
                      <input type="text" name="provincia" value={form.provincia} onChange={handleChange} className="form-input" placeholder="Buenos Aires" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mensaje</label>
                      <textarea name="mensaje" value={form.mensaje} onChange={handleChange} className="form-textarea" placeholder="Contanos sobre tu proyecto..." rows={5} />
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={enviando}>
                      {enviando ? "Enviando..." : "Enviar consulta"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Info */}
            <div className={styles.infoCol}>
              <div className={styles.infoCard}>
                <h3 className={styles.infoTitulo}>Información de contacto</h3>
                <div className={styles.infoItems}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoItemIcono}>📞</div>
                    <div>
                      <strong>Teléfono</strong>
                      <p>+54 9 11 0000-0000</p>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoItemIcono}>✉️</div>
                    <div>
                      <strong>Email</strong>
                      <p>info@solarsoluciones.com.ar</p>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoItemIcono}>📍</div>
                    <div>
                      <strong>Oficina central</strong>
                      <p>Buenos Aires, Argentina</p>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoItemIcono}>🕐</div>
                    <div>
                      <strong>Horario de atención</strong>
                      <p>Lun–Vie 9:00 a 18:00 hs</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mapa placeholder */}
              <div className={styles.mapaPlaceholder}>
                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Buenos Aires, Argentina</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
