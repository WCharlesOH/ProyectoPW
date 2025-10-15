import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();
  const  navigate  = useNavigate()

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <img
          src="./src/assets/accessibility-svgrepo-com.svg"
          alt="Usuario"
          style={{ width: 28, height: 28, backgroundColor: "white", borderRadius: "50%" }}
        />
      </button>

      {/* Menú desplegable */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            right: 0,
            marginTop: "8px",
            width: "220px",
            backgroundColor: "#1f1f23",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
            border: "1px solid #333",
            color: "white",
            zIndex: 20,
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            <li>
              <Link
                to="/perfil/usuario"
                style={{
                  display: "block",
                  padding: "8px 12px",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                Canal
              </Link>
            </li>
            <li>
              <Link
                to="/panel"
                style={{
                  display: "block",
                  padding: "8px 12px",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                Panel de Control
              </Link>
            </li>
            <li>
              <Link
                to="/suscripciones"
                style={{
                  display: "block",
                  padding: "8px 12px",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                Suscripciones
              </Link>
            </li>
            <li>
              <Link
                to="/ajustes"
                style={{
                  display: "block",
                  padding: "8px 12px",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                Ajustes
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                  navigate("/")
                }}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  color: "red",
                  cursor: "pointer",
                }}
              >
                Cerrar sesión
              </button>
            </li>
          </ul>

          {/* Opciones adicionales */}
          <div style={{ borderTop: "1px solid #333", marginTop: "8px" }}>
            <button
              style={{
                display: "block",
                width: "100%",
                padding: "8px 12px",
                background: "none",
                border: "none",
                textAlign: "left",
                color: "white",
                cursor: "pointer",
              }}
            >
              Cambiar idioma
            </button>
            <button
              style={{
                display: "block",
                width: "100%",
                padding: "8px 12px",
                background: "none",
                border: "none",
                textAlign: "left",
                color: "white",
                cursor: "pointer",
              }}
            >
              Cambiar aspecto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}