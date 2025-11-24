
import { useMemo, useState } from "react";

interface PanelControlProps {
  monedas: number;
  setMonedas: (valor: number) => void;
}

const BARRAS_NIVEL = [
  { titulo: "Progreso de espectador", progreso: 65, descripcion: "Puntos por mensajes y regalos" },
  { titulo: "Horas para siguiente nivel", progreso: 40, descripcion: "Horas transmitidas esta semana" },
  { titulo: "Objetivo de comunidad", progreso: 80, descripcion: "Meta de apoyo al streamer" },
];

export default function PanelControl({ monedas, setMonedas }: PanelControlProps) {
  const [bonoActivo, setBonoActivo] = useState(false);

  const puntos = useMemo(() => ({
    nivelActual: 7,
    puntosActuales: 1250,
    puntosSiguiente: 1600,
  }), []);

  const comprarMonedas = (cantidad: number) => {
    const nuevoSaldo = monedas + cantidad;
    setMonedas(nuevoSaldo);
  };

  return (
    <div style={{ padding: 24, color: "white", backgroundColor: "#0e0e10", minHeight: "100vh" }}>
      <header style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, opacity: 0.8 }}>Centro de control</p>
          <h1 style={{ margin: "6px 0" }}>Panel general</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>Gestiona tu rol, revisa monedas y tus progresos rápidos.</p>
        </div>
        <div style={{ background: "#1f1f23", padding: 16, borderRadius: 10, minWidth: 220 }}>
          <p style={{ margin: 0, opacity: 0.8 }}>Saldo disponible</p>
          <p style={{ margin: "6px 0", fontSize: 26, fontWeight: 700 }}>🪙 {monedas}</p>
          <div style={{ display: "flex", gap: 8 }}>
            {[100, 250, 500].map((monto) => (
              <button
                key={monto}
                onClick={() => comprarMonedas(monto)}
                style={{
                  flex: 1,
                  background: "#00b7ff",
                  border: "none",
                  color: "white",
                  borderRadius: 8,
                  padding: "8px 10px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                +{monto}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        {BARRAS_NIVEL.map((item) => (
          <div key={item.titulo} style={{ background: "#1f1f23", padding: 14, borderRadius: 10 }}>
            <p style={{ margin: 0, fontWeight: 700 }}>{item.titulo}</p>
            <p style={{ margin: "6px 0", opacity: 0.7 }}>{item.descripcion}</p>
            <div style={{ background: "#0e0e10", height: 10, borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${item.progreso}%`, height: "100%", background: "linear-gradient(90deg, #00b7ff, #7c3aed)" }} />
            </div>
            <p style={{ marginTop: 6, textAlign: "right", fontWeight: 700 }}>{item.progreso}%</p>
          </div>
        ))}
      </section>

      <section style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
        <div style={{ background: "#1f1f23", padding: 16, borderRadius: 10 }}>
          <p style={{ margin: 0, opacity: 0.8 }}>Progreso del espectador</p>
          <h3 style={{ margin: "6px 0" }}>Nivel {puntos.nivelActual}</h3>
          <p style={{ margin: 0 }}>Puntos: {puntos.puntosActuales}/{puntos.puntosSiguiente}</p>
          <p style={{ marginTop: 10, opacity: 0.8 }}>
            Te faltan {puntos.puntosSiguiente - puntos.puntosActuales} puntos para el siguiente nivel.
          </p>
        </div>

        <div style={{ background: "#1f1f23", padding: 16, borderRadius: 10 }}>
          <p style={{ margin: 0, opacity: 0.8 }}>Monetización rápida</p>
          <h3 style={{ margin: "6px 0" }}>Prueba de packs</h3>
          <p style={{ marginTop: 4, opacity: 0.8 }}>Simula la compra de monedas para validar el flujo.</p>
          <button
            onClick={() => comprarMonedas(50)}
            style={{
              background: "#22c55e",
              border: "none",
              color: "white",
              padding: "10px 12px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 700,
              marginTop: 8,
            }}
          >
            Añadir 50 monedas de prueba
          </button>
        </div>

        <div style={{ background: "#1f1f23", padding: 16, borderRadius: 10 }}>
          <p style={{ margin: 0, opacity: 0.8 }}>Sorpresa</p>
          <h3 style={{ margin: "6px 0" }}>Modo celebración</h3>
          <p style={{ marginTop: 4, opacity: 0.8 }}>
            Activa un borde dinámico que resalta cuando subes de nivel o recibes apoyo.
          </p>
          <button
            onClick={() => setBonoActivo(!bonoActivo)}
            style={{
              background: bonoActivo ? "#ef4444" : "#00b7ff",
              border: "none",
              color: "white",
              padding: "10px 12px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 700,
              marginTop: 8,
              boxShadow: bonoActivo ? "0 0 0 4px rgba(239,68,68,0.25)" : "0 0 0 4px rgba(0,183,255,0.25)",
            }}
          >
            {bonoActivo ? "Celebración activa" : "Activar celebración"}
          </button>
        </div>
      </section>
    </div>
  );
}