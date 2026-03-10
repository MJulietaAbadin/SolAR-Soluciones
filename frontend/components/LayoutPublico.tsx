"use client";

import { usePathname } from "next/navigation";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import WhatsAppButton from "./WhatsAppButton/WhatsAppButton";

export default function LayoutPublico({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const esAdmin = pathname.startsWith("/admin");

  if (esAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main style={{ paddingTop: "72px" }}>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
