import { Link } from "react-router-dom";

export default function Usuario() {
  return (
    <div style={{ padding: 24, color: "white", backgroundColor: "#0e0e10", minHeight: "100vh" }}>
      <header style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, opacity: 0.8 }}>Bienvenido</p>
          <h1 style={{ margin: "6px 0" }}>Centro de usuario</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>Elige tu rol y navega a las funciones clave.</p>
        </div>
      </header>

      <section style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
        <article style={{ background: "#1f1f23", padding: 14, borderRadius: 10 }}>
          <h3>Streamer</h3>
          <p style={{ opacity: 0.8 }}>Gestiona tu dashboard, regalos y horas de transmisión.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link to="/dashboard" style={{ background: "#00b7ff", color: "white", padding: "8px 12px", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>Dashboard</Link>
            <Link to="/gestion-regalos" style={{ background: "#7c3aed", color: "white", padding: "8px 12px", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>Regalos</Link>
          </div>
        </article>

        <article style={{ background: "#1f1f23", padding: 14, borderRadius: 10 }}>
          <h3>Espectador</h3>
          <p style={{ opacity: 0.8 }}>Compra monedas, revisa niveles y participa en el chat.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link to="/panel" style={{ background: "#22c55e", color: "white", padding: "8px 12px", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>Panel</Link>
            <Link to="/suscripciones" style={{ background: "#00b7ff", color: "white", padding: "8px 12px", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>Suscripciones</Link>
          </div>
        </article>

        <article style={{ background: "#1f1f23", padding: 14, borderRadius: 10 }}>
          <h3>Cuenta</h3>
          <p style={{ opacity: 0.8 }}>Acceso rápido a autenticación y ajustes.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link to="/login" style={{ background: "#1d4ed8", color: "white", padding: "8px 12px", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>Login</Link>
            <Link to="/registro" style={{ background: "#f59e0b", color: "black", padding: "8px 12px", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>Registro</Link>
            <Link to="/ajustes" style={{ background: "#334155", color: "white", padding: "8px 12px", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>Ajustes</Link>
          </div>
        </article>
      </section>
    </div>
  );
}