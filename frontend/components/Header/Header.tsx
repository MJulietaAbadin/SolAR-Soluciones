"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./Header.module.css";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/simulador", label: "Simulador" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/financiamiento", label: "Financiamiento" },
  { href: "/blog", label: "Blog" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoSol}>Sol</span>
          <span className={styles.logoAR}>AR</span>
          <span className={styles.logoTexto}> Soluciones</span>
        </Link>

        {/* Nav desktop */}
        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link href="/simulador" className={`btn btn-primary ${styles.ctaBtn}`}>
          Simulá tu ahorro
        </Link>

        {/* Hamburguesa */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Menú"
        >
          <span className={`${styles.hamLine} ${menuAbierto ? styles.hamOpen : ""}`} />
          <span className={`${styles.hamLine} ${menuAbierto ? styles.hamOpen : ""}`} />
          <span className={`${styles.hamLine} ${menuAbierto ? styles.hamOpen : ""}`} />
        </button>
      </div>

      {/* Menú móvil */}
      <div className={`${styles.mobileMenu} ${menuAbierto ? styles.mobileOpen : ""}`}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={styles.mobileLink}
            onClick={() => setMenuAbierto(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/simulador"
          className={`btn btn-primary ${styles.mobileCta}`}
          onClick={() => setMenuAbierto(false)}
        >
          Simulá tu ahorro gratis
        </Link>
      </div>
    </header>
  );
}
