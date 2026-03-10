"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";
import { fetchApi } from "@/lib/api";

interface LoginResponse {
  token: string;
  nombre: string;
  email: string;
  rol: string;
  expiracion: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError("");

    try {
      const data = await fetchApi<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      localStorage.setItem("solar_token", data.token);
      localStorage.setItem("solar_user", JSON.stringify({ nombre: data.nombre, rol: data.rol }));
      router.push("/admin/dashboard");
    } catch {
      setError("Email o contraseña incorrectos");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginLogo}>
          <span className={styles.logoSol}>Sol</span>
          <span className={styles.logoAR}>AR</span>
          <span> Soluciones</span>
        </div>
        <h1 className={styles.loginTitulo}>Panel de Administración</h1>
        <p className={styles.loginSub}>Acceso restringido al equipo interno</p>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="form-input"
              placeholder="admin@solar.com"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={`btn btn-primary ${styles.loginBtn}`} disabled={cargando}>
            {cargando ? "Ingresando..." : "Ingresar al panel"}
          </button>
        </form>
      </div>
    </div>
  );
}
