"use client";

import { useState, useEffect } from "react";
import styles from "./Simulador.module.css";
import { fetchApi } from "@/lib/api";
import type { SimulacionResult } from "@/types/simulador";

const TIPOS_PROPIEDAD = ["Casa", "Departamento", "Comercio", "Industria", "Agro", "Otro"];

interface Props {
  onResultado: (data: SimulacionResult) => void;
}

export default function SimuladorForm({ onResultado }: Props) {
  const [provincias, setProvincias] = useState<string[]>([]);
  const [form, setForm] = useState({
    provincia: "",
    consumoMensualKwh: "",
    tipoPropiedad: "Casa",
    montoFacturaMensual: "",
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApi<string[]>("/api/simulador/provincias")
      .then(setProvincias)
      .catch(() => setError("No se pudieron cargar las provincias."));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.provincia) {
      setError("Seleccioná tu provincia");
      return;
    }
    const kwh = parseFloat(form.consumoMensualKwh);
    if (!kwh || kwh <= 0) {
      setError("Ingresá un consumo mensual válido en kWh");
      return;
    }

    setCargando(true);
    setError("");

    try {
      const data = await fetchApi<SimulacionResult>("/api/simulador/calcular", {
        method: "POST",
        body: JSON.stringify({
          provincia: form.provincia,
          consumoMensualKwh: kwh,
          tipoPropiedad: form.tipoPropiedad,
          montoFacturaMensual: form.montoFacturaMensual
            ? parseFloat(form.montoFacturaMensual)
            : null,
        }),
      });
      onResultado(data);
    } catch {
      setError("Ocurrió un error al calcular. Verificá tu conexión y reintentá.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles.formCard}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitulo}>Datos de tu instalación</h2>
        <p className={styles.formSubtitulo}>
          Solo necesitamos tu consumo y provincia para calcular las opciones.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Provincia */}
          <div className="form-group">
            <label className="form-label" htmlFor="provincia">
              Provincia *
            </label>
            <select
              id="provincia"
              name="provincia"
              value={form.provincia}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Seleccioná tu provincia</option>
              {provincias.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Consumo */}
          <div className="form-group">
            <label className="form-label" htmlFor="consumoMensualKwh">
              Consumo mensual (kWh) *
            </label>
            <input
              type="number"
              id="consumoMensualKwh"
              name="consumoMensualKwh"
              value={form.consumoMensualKwh}
              onChange={handleChange}
              className="form-input"
              placeholder="Ej: 350"
              min="10"
              max="50000"
              required
            />
            <span className={styles.formHint}>
              Lo encontrás en tu factura de luz como "energía activa"
            </span>
          </div>

          {/* Tipo propiedad */}
          <div className="form-group">
            <label className="form-label" htmlFor="tipoPropiedad">
              Tipo de propiedad
            </label>
            <select
              id="tipoPropiedad"
              name="tipoPropiedad"
              value={form.tipoPropiedad}
              onChange={handleChange}
              className="form-select"
            >
              {TIPOS_PROPIEDAD.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Monto factura (opcional) */}
          <div className="form-group">
            <label className="form-label" htmlFor="montoFacturaMensual">
              Monto de tu factura (opcional)
            </label>
            <input
              type="number"
              id="montoFacturaMensual"
              name="montoFacturaMensual"
              value={form.montoFacturaMensual}
              onChange={handleChange}
              className="form-input"
              placeholder="Ej: 25000"
              min="0"
            />
            <span className={styles.formHint}>En pesos argentinos, para mayor precisión</span>
          </div>
        </div>

        {error && (
          <div className={styles.formError}>
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
          className={`btn btn-primary ${styles.formSubmit}`}
          disabled={cargando}
        >
          {cargando ? (
            <>
              <span className={styles.spinner} />
              Calculando...
            </>
          ) : (
            <>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              Calcular mi ahorro solar
            </>
          )}
        </button>
      </form>
    </div>
  );
}
