import { useMemo, useEffect, useState } from "react";
import { API } from "../Comandosllamadas/llamadas";
import type { Usuario } from "../components/types";

const Todo = API;

export default function Suscripciones() {
  // Obtener usuario desde localStorage
  const info: Usuario | null = JSON.parse(localStorage.getItem("user") || "null");
  const id = info ? Number(info.ID) : null;

  const [suscripciones, setSuscripciones] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);


  useEffect(() => {
    const cargarSuscripciones = async () => {
      if (id === null) {
        console.log("No hay ID de usuario");
        setCargando(false);
        return;
      }

      console.log("Cargando suscripciones para ID:", id);
      const data = await Todo.MisSuscripciones(id);
      console.log("Respuesta completa del backend:", data);
      
      if (data.success && data.subscriptions) {
        console.log("Suscripciones encontradas:", data.subscriptions);
        setSuscripciones(data.subscriptions);
      } else {
        console.log("No se encontraron suscripciones o hubo un error:", data);
      }
      setCargando(false);
    };

    cargarSuscripciones();
  }, [id]);

  const resumen = useMemo(() => ({
    activas: suscripciones.length,
    gastoMensual: suscripciones.length * 4.99,
    regalosPendientes: 0,
  }), [suscripciones.length]);


 

  return (
    <div style={{ padding: 24, color: "white", backgroundColor: "#0e0e10", minHeight: "100vh" }}>
      <header style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, opacity: 0.8 }}>Resumen de soporte</p>
          <h1 style={{ margin: "6px 0" }}>Suscripciones</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>Consulta tus renovaciones y los beneficios activos.</p>
        </div>
        <div style={{ background: "#1f1f23", padding: 16, borderRadius: 10, minWidth: 220 }}>
          <p style={{ margin: 0, opacity: 0.8, fontSize: 14 }}>Siguiendo a</p>
          <p style={{ margin: "6px 0", fontSize: 32, fontWeight: 700 }}>{resumen.activas}</p>
          <p style={{ margin: "8px 0 0 0", fontSize: 14, opacity: 0.7 }}>
            {resumen.activas === 1 ? "streamer" : "streamers"}
          </p>
        </div>
      </header>

      <section style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
        {cargando ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40, color: "#adadb8" }}>
            <p>Cargando suscripciones...</p>
          </div>
        ) : suscripciones.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40, color: "#adadb8" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
            <p style={{ fontSize: 18, marginBottom: 8 }}>No tienes suscripciones activas</p>
            <p style={{ fontSize: 14 }}>Busca streamers y suscríbete para apoyarlos</p>
          </div>
        ) : (
          suscripciones.map((item, index) => (
            <article key={item.ID_Streamer || index} style={{ background: "#1f1f23", padding: 14, borderRadius: 10 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <img 
                  src={item.streamer?.ImagenPerfil || "https://via.placeholder.com/60"} 
                  alt={item.streamer?.NombreUsuario || "Usuario"}
                  style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: 0 }}>{item.streamer?.NombreUsuario || "Usuario"}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {item.streamer?.EnVivo && (
                        <span style={{ background: "#eb0400", color: "white", padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }}></div>
                          EN VIVO
                        </span>
                      )}
                    </div>
                  </div>
                  <p style={{ margin: "6px 0 0 0", opacity: 0.8, fontSize: 14 }}>
                    Nivel: {item.streamer?.NivelStreams || 0}
                  </p>
                </div>
              </div>
              <div style={{ background: "#18181b", padding: 10, borderRadius: 8, marginBottom: 10 }}>
                <p style={{ margin: 0, fontSize: 13, opacity: 0.9 }}>
                  Beneficios: Emotes exclusivos, insignias, sin anuncios
                </p>
              </div>
              
            </article>
          ))
        )}
      </section>
    </div>
  );
}