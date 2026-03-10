import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | SolAR Soluciones",
  robots: { index: false, follow: false },
};

// El panel admin tiene su propio layout sin header/footer públicos
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
