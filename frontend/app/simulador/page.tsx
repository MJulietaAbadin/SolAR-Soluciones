import type { Metadata } from "next";
import SimuladorContainer from "@/components/Simulador/SimuladorContainer";

export const metadata: Metadata = {
  title: "Simulador de Ahorro Solar | SolAR Soluciones",
  description:
    "Calculá cuánto podés ahorrar con paneles solares en tu hogar o empresa. Ingresá tu consumo mensual y provincia para ver las 3 opciones de sistema recomendado.",
};

export default function SimuladorPage() {
  return <SimuladorContainer />;
}
