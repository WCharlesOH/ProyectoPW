import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../components/AuthContext";

export default function Usuario() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const handleDesactivarCuenta = () => {
    setMostrarConfirmacion(true);
  };

  const confirmarDesactivacion = () => {
    logout();
    navigate("/");
  };
  return (
    <div style={{ padding: 24, color: "white", backgroundColor: "#0e0e10", minHeight: "100vh" }}>
      <header style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginBottom: 32 }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, opacity: 0.8, fontSize: 14 }}>Bienvenido</p>
          <h1 style={{ margin: "8px 0", fontSize: 32, fontWeight: 700 }}>Centro de Usuario</h1>
          <p style={{ margin: 0, opacity: 0.8, fontSize: 15 }}>Accede a todas las herramientas y funciones de tu cuenta.</p>
        </div>
      </header>

      {/* Transmisión */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: "#9147ff", display: "flex", alignItems: "center", gap: 8 }}>
          🎥 Transmisión
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <article style={{ background: "#1f1f23", padding: 20, borderRadius: 10, border: "1px solid #2e2e35" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #00b7ff, #0077ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                📊
              </div>
              <h3 style={{ margin: 0, fontSize: 18 }}>Dashboard</h3>
            </div>
            <p style={{ opacity: 0.8, fontSize: 14, marginBottom: 16, lineHeight: 1.5 }}>
              Controla tu transmisión en vivo, estadísticas, espectadores y más.
            </p>
            <Link to="/dashboard" style={{ background: "#00b7ff", color: "white", padding: "10px 16px", borderRadius: 8, textDecoration: "none", fontWeight: 600, display: "inline-block", fontSize: 14 }}>
              Ir al Dashboard
            </Link>
          </article>

          <article style={{ background: "#1f1f23", padding: 20, borderRadius: 10, border: "1px solid #2e2e35" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #5b21b6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                🎁
              </div>
              <h3 style={{ margin: 0, fontSize: 18 }}>Gestión de Regalos</h3>
            </div>
            <p style={{ opacity: 0.8, fontSize: 14, marginBottom: 16, lineHeight: 1.5 }}>
              Administra los obsequios que recibes durante tus transmisiones en vivo.
            </p>
            <Link to="/gestion-regalos" style={{ background: "#7c3aed", color: "white", padding: "10px 16px", borderRadius: 8, textDecoration: "none", fontWeight: 600, display: "inline-block", fontSize: 14 }}>
              Gestionar Regalos
            </Link>
          </article>
        </div>
      </section>

      {/* Comunidad */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: "#22c55e", display: "flex", alignItems: "center", gap: 8 }}>
          👥 Comunidad
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <article style={{ background: "#1f1f23", padding: 20, borderRadius: 10, border: "1px solid #2e2e35" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                💰
              </div>
              <h3 style={{ margin: 0, fontSize: 18 }}>Panel de Control</h3>
            </div>
            <p style={{ opacity: 0.8, fontSize: 14, marginBottom: 16, lineHeight: 1.5 }}>
              Compra monedas, revisa tu saldo y gestiona tus transacciones en tiempo real.
            </p>
            <Link to="/panel" style={{ background: "#22c55e", color: "white", padding: "10px 16px", borderRadius: 8, textDecoration: "none", fontWeight: 600, display: "inline-block", fontSize: 14 }}>
              Ir al Panel
            </Link>
          </article>

          <article style={{ background: "#1f1f23", padding: 20, borderRadius: 10, border: "1px solid #2e2e35" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #f59e0b, #d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                ⭐
              </div>
              <h3 style={{ margin: 0, fontSize: 18 }}>Suscripciones</h3>
            </div>
            <p style={{ opacity: 0.8, fontSize: 14, marginBottom: 16, lineHeight: 1.5 }}>
              Gestiona tus suscripciones a tus streamers favoritos.
            </p>
            <Link to="/suscripciones" style={{ background: "#f59e0b", color: "white", padding: "10px 16px", borderRadius: 8, textDecoration: "none", fontWeight: 600, display: "inline-block", fontSize: 14 }}>
              Ver Suscripciones
            </Link>
          </article>
        </div>
      </section>

      {/* Configuración */}
      <section>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: "#64748b", display: "flex", alignItems: "center", gap: 8 }}>
          ⚙️ CUENTA
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          

          <article style={{ background: "#1f1f23", padding: 20, borderRadius: 10, border: "1px solid #2e2e35" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #ef4444, #dc2626)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                🔒
              </div>
              <h3 style={{ margin: 0, fontSize: 18 }}>Desactivar Cuenta</h3>
            </div>
            <p style={{ opacity: 0.8, fontSize: 14, marginBottom: 16, lineHeight: 1.5 }}>
              Cierra tu sesión y desactiva temporalmente tu cuenta.
            </p>
            <button 
              onClick={handleDesactivarCuenta}
              style={{ background: "#ef4444", color: "white", padding: "10px 16px", borderRadius: 8, border: "none", fontWeight: 600, cursor: "pointer", fontSize: 14 }}
            >
              Desactivar
            </button>
          </article>
        </div>
      </section>

      {/* Modal de Confirmación */}
      {mostrarConfirmacion && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          }}
          onClick={() => setMostrarConfirmacion(false)}
        >
          <div
            style={{
              background: '#18181b',
              borderRadius: 12,
              padding: 32,
              width: '90%',
              maxWidth: '450px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16, color: '#ef4444' }}>
              ⚠️ Desactivar Cuenta
            </h2>
            <p style={{ fontSize: 15, color: '#adadb8', marginBottom: 24, lineHeight: 1.6 }}>
              ¿Estás seguro de que deseas cerrar sesión y desactivar tu cuenta? Esta acción cerrará tu sesión actual.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setMostrarConfirmacion(false)}
                style={{
                  padding: '10px 20px',
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 6,
                  border: '1px solid #444',
                  cursor: 'pointer',
                  background: 'transparent',
                  color: '#fff',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarDesactivacion}
                style={{
                  padding: '10px 20px',
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  background: '#ef4444',
                  color: '#fff',
                }}
              >
                Sí, desactivar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}