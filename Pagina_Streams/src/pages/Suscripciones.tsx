import { useMemo } from "react";

const LISTA_SUSCRIPTORES = [
  { nombre: "StreamerPro", plan: "Mensual", renovacion: "15/12/24", beneficios: "Emotes, insignias" },
  { nombre: "TechGuru", plan: "Trimestral", renovacion: "02/01/25", beneficios: "Emotes, insignias, sorteos" },
  { nombre: "ArtistLive", plan: "Anual", renovacion: "20/08/25", beneficios: "VIP en chat" },
];

export default function Suscripciones() {
  const resumen = useMemo(() => ({
    activas: LISTA_SUSCRIPTORES.length,
    gastoMensual: 24.99,
    regalosPendientes: 2,
  }), []);

  return (
    <div style={{ padding: 24, color: "white", backgroundColor: "#0e0e10", minHeight: "100vh" }}>
      <header style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, opacity: 0.8 }}>Resumen de soporte</p>
          <h1 style={{ margin: "6px 0" }}>Suscripciones</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>Consulta tus renovaciones y los beneficios activos.</p>
        </div>
        <div style={{ background: "#1f1f23", padding: 16, borderRadius: 10, minWidth: 220 }}>
          <p style={{ margin: 0, opacity: 0.8 }}>Activas</p>
          <p style={{ margin: "6px 0", fontSize: 26, fontWeight: 700 }}>{resumen.activas}</p>
          <p style={{ margin: 0 }}>Gasto mensual estimado: ${resumen.gastoMensual}</p>
          <p style={{ margin: 0 }}>Regalos por enviar: {resumen.regalosPendientes}</p>
        </div>
      </header>

      <section style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
        {LISTA_SUSCRIPTORES.map((item) => (
          <article key={item.nombre} style={{ background: "#1f1f23", padding: 14, borderRadius: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>{item.nombre}</h3>
              <span style={{ background: "#00b7ff", color: "white", padding: "4px 10px", borderRadius: 999, fontSize: 12 }}>
                {item.plan}
              </span>
            </div>
            <p style={{ margin: "6px 0", opacity: 0.8 }}>Renueva el {item.renovacion}</p>
            <p style={{ margin: 0, opacity: 0.9 }}>Beneficios: {item.beneficios}</p>
            <button
              style={{
                marginTop: 10,
                background: "#22c55e",
                border: "none",
                color: "white",
                padding: "8px 12px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Enviar un regalo ahora
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}