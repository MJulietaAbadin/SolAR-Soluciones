"use client";

import { useState } from "react";
import styles from "./ContactoModal.module.css";
import { fetchApi } from "@/lib/api";
import type { OpcionSimulacion, LeadRequest } from "@/types/simulador";

interface Props {
  opcion: OpcionSimulacion;
  simulacionId: number;
  provincia: string;
  consumo: number;
  onCerrar: () => void;
}

export default function ContactoModal({ opcion, simulacionId, provincia, consumo, onCerrar }: Props) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    ciudad: "",
    mensaje: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.telefono) {
      setError("Completá nombre, email y teléfono para continuar");
      return;
    }

    setEnviando(true);
    setError("");

    try {
      const body: LeadRequest = {
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        ciudad: form.ciudad || undefined,
        provincia,
        consumoAproximadoKwh: consumo,
        opcionSimuladorElegida: opcion.porcentaje,
        simulacionId,
        mensaje: form.mensaje || undefined,
        origen: "Simulador",
      };

      await fetchApi("/api/leads", {
        method: "POST",
        body: JSON.stringify(body),
      });

      setEnviado(true);
    } catch {
      setError("Ocurrió un error al enviar. Intentá nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onCerrar()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.titulo}>
              ¡Excelente elección!
            </h2>
            <p className={styles.subtitulo}>
              Opción <strong>{opcion.porcentaje}</strong> – Sistema de{" "}
              <strong>{opcion.sistemaKw} kWp</strong> ({opcion.paneles} paneles)
            </p>
          </div>
          <button className={styles.cerrar} onClick={onCerrar} aria-label="Cerrar">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {enviado ? (
          <div className={styles.exito}>
            <div className={styles.exitoIcono}>
              <svg width="40" height="40" fill="none" stroke="var(--solar-verde)" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3>¡Consulta enviada!</h3>
            <p>
              Recibimos tu consulta sobre el sistema de <strong>{opcion.sistemaKw} kWp</strong>.
              Un asesor comercial se pondrá en contacto a la brevedad para enviarte el presupuesto personalizado.
            </p>
            <button className="btn btn-primary" onClick={onCerrar}>
              Entendido
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.desc}>
              Dejanos tus datos y un asesor te contactará con el presupuesto exacto para tu sistema.
            </p>

            {/* Resumen de la opción */}
            <div className={styles.resumenOpcion}>
              <div className={styles.resumenItem}>
                <span>Ahorro mensual est.</span>
                <strong>
                  {new Intl.NumberFormat("es-AR", {
                    style: "currency", currency: "ARS",
                    minimumFractionDigits: 0
                  }).format(opcion.ahorroMensual)}
                </strong>
              </div>
              <div className={styles.resumenItem}>
                <span>Retorno inversión</span>
                <strong>{opcion.retornoMinAnios}–{opcion.retornoMaxAnios} años</strong>
              </div>
              <div className={styles.resumenItem}>
                <span>CO₂ evitado/año</span>
                <strong>{opcion.cO2AnualTn} tn</strong>
              </div>
            </div>

            <div className={styles.campos}>
              <div className="form-group">
                <label className="form-label" htmlFor="cm_nombre">Nombre y apellido *</label>
                <input
                  type="text"
                  id="cm_nombre"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Juan García"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="cm_email">Email *</label>
                <input
                  type="email"
                  id="cm_email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="juan@ejemplo.com"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="cm_telefono">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  id="cm_telefono"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="+54 9 11 XXXX-XXXX"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="cm_ciudad">Ciudad</label>
                <input
                  type="text"
                  id="cm_ciudad"
                  name="ciudad"
                  value={form.ciudad}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Buenos Aires"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cm_mensaje">Mensaje (opcional)</label>
              <textarea
                id="cm_mensaje"
                name="mensaje"
                value={form.mensaje}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Contanos más sobre tu proyecto..."
                rows={3}
              />
            </div>

            {error && (
              <div className={styles.error}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={enviando}
            >
              {enviando ? "Enviando..." : "Quiero el presupuesto"}
            </button>

            <p className={styles.privacidad}>
              Tus datos son confidenciales. Solo los usamos para contactarte.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
