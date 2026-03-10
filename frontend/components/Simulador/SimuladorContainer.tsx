"use client";

import { useState } from "react";
import SimuladorForm from "./SimuladorForm";
import SimuladorResultados from "./SimuladorResultados";
import ContactoModal from "../ContactoModal/ContactoModal";
import styles from "./Simulador.module.css";
import type { SimulacionResult, OpcionSimulacion } from "@/types/simulador";

export default function SimuladorContainer() {
  const [resultado, setResultado] = useState<SimulacionResult | null>(null);
  const [opcionModal, setOpcionModal] = useState<OpcionSimulacion | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const handleResultado = (data: SimulacionResult) => {
    setResultado(data);
    // Scroll a resultados
    setTimeout(() => {
      document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleElegirOpcion = (opcion: OpcionSimulacion) => {
    setOpcionModal(opcion);
    setModalAbierto(true);
  };

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroBadge}>Simulador gratuito</div>
          <h1 className={styles.heroTitulo}>
            Calculá tu ahorro solar
          </h1>
          <p className={styles.heroSubtitulo}>
            Ingresá tu consumo mensual y provincia. En segundos te mostramos las 3 opciones
            de sistema solar recomendado para tu caso, con ahorro, paneles y retorno de inversión.
          </p>
        </div>
      </section>

      {/* Formulario */}
      <section className={styles.formSection}>
        <div className="container">
          <SimuladorForm onResultado={handleResultado} />
        </div>
      </section>

      {/* Resultados */}
      {resultado && (
        <section className={styles.resultadosSection} id="resultados">
          <div className="container">
            <SimuladorResultados
              resultado={resultado}
              onElegirOpcion={handleElegirOpcion}
            />
          </div>
        </section>
      )}

      {/* Modal de contacto */}
      {modalAbierto && opcionModal && resultado && (
        <ContactoModal
          opcion={opcionModal}
          simulacionId={resultado.simulacionId}
          provincia={resultado.provincia}
          consumo={resultado.consumoMensualKwh}
          onCerrar={() => setModalAbierto(false)}
        />
      )}
    </>
  );
}
