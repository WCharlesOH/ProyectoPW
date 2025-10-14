// Navbar.jsx
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import MonedasMenu from "./MonedasMenu";
import UserMenu from "./Usuario_Desplegable";

type NavbarProps = {
  monedas: any; // Replace 'any' with the actual type if known, e.g., number, string[], etc.
  setMonedas: (value: any) => void; // Replace 'any' with the actual type if known
};

export default function Navbar({ monedas, setMonedas }: NavbarProps) {  // ✅ Recibe props
  const { isLogged, logout } = useAuth();
  const [dropOpen, setDropOpen] = useState(false);
  const [menuMonedasAbierto, setMenuMonedasAbierto] = useState(false);

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? "#00b7ff" : "#fff",
    textDecoration: "none",
    fontWeight: isActive ? "bold" : "normal",
  });

  return (
    <header
      style={{
        backgroundColor: "#0e0e10",
        color: "white",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* ---- IZQUIERDA ---- */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <h2 style={{ margin: 0 }}>
          <Link to="/" style={{ color: "#00b7ff", textDecoration: "none" }}>
            Streams
          </Link>
        </h2>
        <nav style={{ display: "flex", gap: "18px" }}>
          <NavLink to="/explorar" style={linkStyle}>
            Explorar
          </NavLink>
          <div
            onMouseEnter={() => setDropOpen(true)}
            onMouseLeave={() => setDropOpen(false)}
            style={{ position: "relative" }}
          >
            <button
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontWeight: dropOpen ? "bold" : "normal",
              }}
            >
              Más
            </button>
            {dropOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  backgroundColor: "#1f1f23",
                  border: "1px solid #333",
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
                  overflow: "hidden",
                  zIndex: 20,
                }}
              >
                <Link
                  to="/nosotros"
                  style={{
                    display: "block",
                    padding: "8px 12px",
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  Nosotros
                </Link>
                <Link
                  to="/terminos"
                  style={{
                    display: "block",
                    padding: "8px 12px",
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  Términos
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="./src/assets/zoom-svgrepo-com.svg"
          alt="Buscar"
          style={{ width: 20, height: 20, backgroundColor: "white" }}
        />
        <input
          type="text"
          placeholder="Buscar transmisiones o canales"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "white",
            marginLeft: "8px",
            flex: 1,
          }}
        />
      </div>

      {/* ---- DERECHA ---- */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {!isLogged ? (
          <>
            <NavLink to="/login" style={linkStyle}>
              Login
            </NavLink>
            <NavLink to="/registro" style={linkStyle}>
              Register
            </NavLink>
          </>
        ) : (
          <>
            {/* 🔹 Menú de monedas con las props */}
            <MonedasMenu
              monedas={monedas}
              setMonedas={setMonedas}
              abierto={menuMonedasAbierto}
              setAbierto={setMenuMonedasAbierto}
            />
            <UserMenu />
          </>
        )}
      </div>
    </header>
  );
}