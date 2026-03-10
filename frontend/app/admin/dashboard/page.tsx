"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./dashboard.module.css";
import { fetchApi, getAuthHeaders } from "@/lib/api";

interface Lead {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  provincia: string;
  opcionSimuladorElegida?: string;
  origen: string;
  estado: string;
  fechaCreacion: string;
}

const ESTADOS = ["Nuevo", "Contactado", "EnProceso", "Cerrado", "Descartado"];
const ESTADO_COLOR: Record<string, string> = {
  Nuevo: "#F59E0B",
  Contactado: "#3B82F6",
  EnProceso: "#8B5CF6",
  Cerrado: "#10B981",
  Descartado: "#94A3B8",
};

function formatFecha(f: string) {
  return new Date(f).toLocaleDateString("es-AR", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<string | undefined>(undefined);
  const [usuario, setUsuario] = useState<{ nombre: string; rol: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("solar_token");
    if (!token) { router.push("/admin"); return; }
    const u = localStorage.getItem("solar_user");
    if (u) setUsuario(JSON.parse(u));
    cargarLeads();
  }, [filtroEstado]);

  const cargarLeads = async () => {
    setCargando(true);
    try {
      const params = filtroEstado ? `?estado=${filtroEstado}` : "";
      const data = await fetchApi<Lead[]>(`/api/leads${params}`, {
        headers: getAuthHeaders(),
      });
      setLeads(data);
    } catch {
      router.push("/admin");
    } finally {
      setCargando(false);
    }
  };

  const actualizarEstado = async (id: number, estado: string) => {
    try {
      await fetchApi(`/api/leads/${id}/estado`, {
        method: "PATCH",
        body: JSON.stringify({ estado }),
        headers: getAuthHeaders(),
      });
      setLeads(prev => prev.map(l => l.id === id ? { ...l, estado } : l));
    } catch {
      alert("Error al actualizar el estado");
    }
  };

  const salir = () => {
    localStorage.removeItem("solar_token");
    localStorage.removeItem("solar_user");
    router.push("/admin");
  };

  const nuevoCount = leads.filter(l => l.estado === "Nuevo").length;
  const totalCount = leads.length;

  return (
    <div className={styles.dashboard}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span style={{ color: "var(--solar-amarillo)" }}>Sol</span>
          <span style={{ color: "#7DD3FC" }}>AR</span>
        </div>
        <nav className={styles.sidebarNav}>
          <Link href="/admin/dashboard" className={`${styles.navItem} ${styles.navActivo}`}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
            Leads
          </Link>
          <Link href="/admin/blog" className={styles.navItem}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h7"/>
            </svg>
            Blog
          </Link>
          <Link href="/admin/parametros" className={styles.navItem}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.07 4.93l-1.41 1.41M6.34 17.66l-1.41 1.41M3 12H1M23 12h-2M19.07 19.07l-1.41-1.41M6.34 6.34L4.93 4.93M12 3V1M12 23v-2"/>
            </svg>
            Parámetros
          </Link>
        </nav>
        <div className={styles.sidebarBottom}>
          {usuario && (
            <div className={styles.sidebarUser}>
              <div className={styles.sidebarAvatar}>{usuario.nombre.charAt(0)}</div>
              <div>
                <p className={styles.sidebarNombre}>{usuario.nombre}</p>
                <p className={styles.sidebarRol}>{usuario.rol}</p>
              </div>
            </div>
          )}
          <button className={styles.salirBtn} onClick={salir}>Cerrar sesión</button>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.headerTitulo}>Panel Comercial</h1>
            <p className={styles.headerSub}>Gestión de leads y consultas</p>
          </div>
        </div>

        {/* Métricas */}
        <div className={styles.metricas}>
          <div className={styles.metricaCard}>
            <div className={styles.metricaNum}>{totalCount}</div>
            <div className={styles.metricaLabel}>Total de leads</div>
          </div>
          <div className={`${styles.metricaCard} ${styles.metricaDestacada}`}>
            <div className={styles.metricaNum}>{nuevoCount}</div>
            <div className={styles.metricaLabel}>Nuevos sin contactar</div>
          </div>
          <div className={styles.metricaCard}>
            <div className={styles.metricaNum}>
              {leads.filter(l => l.opcionSimuladorElegida === "100%").length}
            </div>
            <div className={styles.metricaLabel}>Eligieron 100% ahorro</div>
          </div>
          <div className={styles.metricaCard}>
            <div className={styles.metricaNum}>
              {leads.filter(l => l.estado === "Cerrado").length}
            </div>
            <div className={styles.metricaLabel}>Cerrados</div>
          </div>
        </div>

        {/* Filtros */}
        <div className={styles.filtros}>
          <button
            className={`${styles.filtroBtn} ${!filtroEstado ? styles.filtroActivo : ""}`}
            onClick={() => setFiltroEstado(undefined)}
          >
            Todos
          </button>
          {ESTADOS.map(e => (
            <button
              key={e}
              className={`${styles.filtroBtn} ${filtroEstado === e ? styles.filtroActivo : ""}`}
              onClick={() => setFiltroEstado(e)}
            >
              {e}
            </button>
          ))}
        </div>

        {/* Tabla de leads */}
        {cargando ? (
          <div className={styles.cargando}>Cargando leads...</div>
        ) : (
          <div className={styles.tablaWrapper}>
            <table className={styles.tabla}>
              <thead>
                <tr>
                  <th>Contacto</th>
                  <th>Provincia</th>
                  <th>Opción elegida</th>
                  <th>Origen</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.tablaVacia}>
                      No hay leads en este estado
                    </td>
                  </tr>
                ) : (
                  leads.map(lead => (
                    <tr key={lead.id} className={styles.tablaFila}>
                      <td>
                        <div className={styles.contacto}>
                          <div className={styles.contactoAvatar}>
                            {lead.nombre.charAt(0)}
                          </div>
                          <div>
                            <div className={styles.contactoNombre}>{lead.nombre}</div>
                            <div className={styles.contactoEmail}>{lead.email}</div>
                            <div className={styles.contactoTel}>{lead.telefono}</div>
                          </div>
                        </div>
                      </td>
                      <td>{lead.provincia}</td>
                      <td>
                        {lead.opcionSimuladorElegida ? (
                          <span className="badge badge-amarillo">{lead.opcionSimuladorElegida}</span>
                        ) : (
                          <span className={styles.sinOpcion}>–</span>
                        )}
                      </td>
                      <td>
                        <span className="badge badge-verde">{lead.origen}</span>
                      </td>
                      <td>{formatFecha(lead.fechaCreacion)}</td>
                      <td>
                        <select
                          value={lead.estado}
                          onChange={e => actualizarEstado(lead.id, e.target.value)}
                          className={styles.estadoSelect}
                          style={{ borderColor: ESTADO_COLOR[lead.estado] }}
                        >
                          {ESTADOS.map(e => (
                            <option key={e} value={e}>{e}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
