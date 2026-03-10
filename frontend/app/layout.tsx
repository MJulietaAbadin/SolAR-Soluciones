import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import LayoutPublico from "@/components/LayoutPublico";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SolAR Soluciones | Energía Solar Fotovoltaica en Argentina",
  description:
    "Instalamos sistemas solares fotovoltaicos para hogares y empresas en Argentina. Ahorrá hasta un 100% en tu factura de luz. Cotizá gratis hoy.",
  keywords:
    "paneles solares, energía solar, fotovoltaica, Argentina, ahorro energético, instalación solar",
  openGraph: {
    title: "SolAR Soluciones | Energía Solar Fotovoltaica",
    description:
      "Instalamos sistemas solares fotovoltaicos en Argentina. ¡Simulá tu ahorro gratis!",
    type: "website",
    locale: "es_AR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR">
      <body className={geistSans.variable}>
        <LayoutPublico>{children}</LayoutPublico>
      </body>
    </html>
  );
}
