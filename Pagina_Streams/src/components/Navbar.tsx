import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  const [isLogged, setIsLogged] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
          {isLogged && (
            <NavLink to="/live" style={linkStyle}>
              Iniciar Live
            </NavLink>
          )}
        </nav>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <img src="./src/assets/zoom-svgrepo-com.svg" alt="Buscar" style={{width: 20, height: 20}}/>
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

      <div style={{ display: "flex", alignItems: "center", gap: "20px", position: "relative" }}>
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
              <img src="./src/assets/accessibility-svgrepo-com.svg" alt="Usuario" style={{width: 28, height: 28, backgroundColor:"white"}}/>
            </button>

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
                <div style={{ padding: "8px 12px", borderBottom: "1px solid #333" }}>
                  Monedas: <span style={{ color: "#00b7ff", fontWeight: "bold" }}>120</span>
                </div>
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  <li>
                    <Link
                      to="/perfil/usuario"
                      style={{ display: "block", padding: "8px 12px", textDecoration: "none", color: "white" }}
                    >
                      Canal
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/panel"
                      style={{ display: "block", padding: "8px 12px", textDecoration: "none", color: "white" }}
                    >
                      Panel de Control
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/suscripciones"
                      style={{ display: "block", padding: "8px 12px", textDecoration: "none", color: "white" }}
                    >
                      Suscripciones
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/ajustes"
                      style={{ display: "block", padding: "8px 12px", textDecoration: "none", color: "white" }}
                    >
                      Ajustes
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setIsLogged(false);
                        setMenuOpen(false);
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
        )}
      </div>
    </header>
  );
}