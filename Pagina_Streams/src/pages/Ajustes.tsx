import { useState } from "react";

export default function Ajustes() {
  const [notificaciones, setNotificaciones] = useState(true);
  const [tema, setTema] = useState("oscuro");
  const [recordar, setRecordar] = useState(true);

  return (
    <div style={{ padding: 24, color: "white", backgroundColor: "#0e0e10", minHeight: "100vh" }}>
      <header style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, opacity: 0.8 }}>Preferencias</p>
          <h1 style={{ margin: "6px 0" }}>Ajustes rápidos</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>Controla el comportamiento de la plataforma.</p>
        </div>
      </header>

      <section style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
        <article style={{ background: "#1f1f23", padding: 14, borderRadius: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: 0 }}>Notificaciones</h3>
              <p style={{ margin: "6px 0", opacity: 0.8 }}>Recibe avisos de subidas de nivel y compras.</p>
            </div>
            <input
              aria-label="Activar notificaciones"
              type="checkbox"
              checked={notificaciones}
              onChange={(e) => setNotificaciones(e.target.checked)}
            />
          </div>
        </article>

        <article style={{ background: "#1f1f23", padding: 14, borderRadius: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: 0 }}>Tema</h3>
              <p style={{ margin: "6px 0", opacity: 0.8 }}>Elige el modo de visualización.</p>
            </div>
            <select value={tema} onChange={(e) => setTema(e.target.value)}>
              <option value="oscuro">Oscuro</option>
              <option value="claro">Claro</option>
              <option value="automatico">Automático</option>
            </select>
          </div>
        </article>

        <article style={{ background: "#1f1f23", padding: 14, borderRadius: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: 0 }}>Mantener sesión</h3>
              <p style={{ margin: "6px 0", opacity: 0.8 }}>Permite seguir conectado en este dispositivo.</p>
            </div>
            <input
              aria-label="Mantener sesión"
              type="checkbox"
              checked={recordar}
              onChange={(e) => setRecordar(e.target.checked)}
            />
          </div>
        </article>
      </section>
    </div>
  );
}