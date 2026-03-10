"use client";

import styles from "./Simulador.module.css";
import type { SimulacionResult, OpcionSimulacion } from "@/types/simulador";

interface Props {
  resultado: SimulacionResult;
  onElegirOpcion: (opcion: OpcionSimulacion) => void;
}

const OPCIONES_CONFIG = {
  "100%": {
    label: "Ahorro total",
    descripcion: "Cubrís el 100% de tu consumo con energía solar",
    color: "var(--solar-amarillo)",
    bgColor: "rgba(245, 158, 11, 0.08)",
    borderColor: "rgba(245, 158, 11, 0.3)",
    destacado: true,
  },
  "50%": {
    label: "Ahorro intermedio",
    descripcion: "Cubrís la mitad de tu consumo con energía solar",
    color: "var(--solar-azul-claro)",
    bgColor: "rgba(37, 99, 235, 0.06)",
    borderColor: "rgba(37, 99, 235, 0.2)",
    destacado: false,
  },
  "25%": {
    label: "Ahorro inicial",
    descripcion: "Comenzás con un sistema solar compacto",
    color: "var(--solar-verde)",
    bgColor: "rgba(16, 185, 129, 0.06)",
    borderColor: "rgba(16, 185, 129, 0.2)",
    destacado: false,
  },
};

function formatPesos(valor: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
}

interface TarjetaProps {
  opcion: OpcionSimulacion;
  onElegir: () => void;
}

function TarjetaOpcion({ opcion, onElegir }: TarjetaProps) {
  const config = OPCIONES_CONFIG[opcion.porcentaje as keyof typeof OPCIONES_CONFIG];

  return (
    <div
      className={`${styles.tarjeta} ${config.destacado ? styles.tarjetaDestacada : ""}`}
      style={{
        background: config.bgColor,
        borderColor: config.borderColor,
      }}
    >
      {config.destacado && (
        <div className={styles.tarjetaBadgeRecomendado}>Recomendado</div>
      )}

      <div className={styles.tarjetaHeader}>
        <div
          className={styles.tarjetaPorcentaje}
          style={{ color: config.color }}
        >
          {opcion.porcentaje}
        </div>
        <div className={styles.tarjetaLabel}>{config.label}</div>
        <p className={styles.tarjetaDescripcion}>{config.descripcion}</p>
      </div>

      {/* Ahorro destacado */}
      <div className={styles.tarjetaAhorro}>
        <span className={styles.tarjetaAhorroLabel}>Ahorro mensual estimado</span>
        <span className={styles.tarjetaAhorroValor} style={{ color: config.color }}>
          {formatPesos(opcion.ahorroMensual)}
        </span>
        <span className={styles.tarjetaAhorroAnual}>
          {formatPesos(opcion.ahorroAnual)} / año
        </span>
      </div>

      {/* Datos técnicos */}
      <div className={styles.tarjetaDatos}>
        <div className={styles.tarjetaDato}>
          <span className={styles.tarjetaDatoLabel}>Sistema</span>
          <span className={styles.tarjetaDatoValor}>{opcion.sistemaKw} kWp</span>
        </div>
        <div className={styles.tarjetaDato}>
          <span className={styles.tarjetaDatoLabel}>Paneles</span>
          <span className={styles.tarjetaDatoValor}>{opcion.paneles} unidades</span>
        </div>
        <div className={styles.tarjetaDato}>
          <span className={styles.tarjetaDatoLabel}>Superficie techo</span>
          <span className={styles.tarjetaDatoValor}>{opcion.superficieM2} m²</span>
        </div>
        <div className={styles.tarjetaDato}>
          <span className={styles.tarjetaDatoLabel}>Retorno inversión</span>
          <span className={styles.tarjetaDatoValor}>
            {opcion.retornoMinAnios} – {opcion.retornoMaxAnios} años
          </span>
        </div>
      </div>

      {/* Impacto ambiental */}
      <div className={styles.tarjetaAmbiental}>
        <div className={styles.tarjetaAmbientalItem}>
          <svg width="16" height="16" fill="none" stroke="var(--solar-verde)" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
          </svg>
          <span>{opcion.cO2AnualTn} tn CO₂/año</span>
        </div>
        <div className={styles.tarjetaAmbientalItem}>
          <svg width="16" height="16" fill="none" stroke="var(--solar-verde)" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>≡ {opcion.arboles} árboles</span>
        </div>
      </div>

      <button
        className={`btn ${config.destacado ? "btn-primary" : "btn-secondary"} ${styles.tarjetaBtn}`}
        onClick={onElegir}
      >
        Quiero este sistema
      </button>
    </div>
  );
}

export default function SimuladorResultados({ resultado, onElegirOpcion }: Props) {
  const opciones: OpcionSimulacion[] = [
    resultado.opcion100,
    resultado.opcion50,
    resultado.opcion25,
  ];

  return (
    <div className={styles.resultados}>
      <div className={styles.resultadosHeader}>
        <h2 className={styles.resultadosTitulo}>
          Resultados para <span>{resultado.provincia}</span>
        </h2>
        <p className={styles.resultadosSubtitulo}>
          Consumo mensual: <strong>{resultado.consumoMensualKwh} kWh</strong> —
          Elegí la opción que más te conviene. Un asesor te contactará con el presupuesto exacto.
        </p>
      </div>

      <div className={styles.tarjetasGrid}>
        {opciones.map((op) => (
          <TarjetaOpcion
            key={op.porcentaje}
            opcion={op}
            onElegir={() => onElegirOpcion(op)}
          />
        ))}
      </div>

      <p className={styles.resultadosNota}>
        * Los valores son estimaciones orientativas. El precio del sistema no se muestra aquí —
        nuestro asesor lo calculará de forma personalizada según tu caso.
      </p>
    </div>
  );
}
