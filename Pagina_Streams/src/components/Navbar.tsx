import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";  // <- asume que creaste esto

export default function Navbar() {
  const { isLogged, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

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

      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
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

      <div
        style={{ display: "flex", alignItems: "center", gap: "20px", position: "relative" }}
      >
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
            <div
              style={{
                padding: "8px 12px",
                border: "1px solid #333",
                borderRadius: "4px",
                backgroundColor: "#1f1f23",
                color: "white",
                display: "flex",
                alignItems: "center",
              }}
            >
              Monedas:{" "}
              <span style={{ color: "#00b7ff", fontWeight: "bold", marginLeft: "4px" }}>
                120
              </span>
            </div>

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
                  style={{ width: 28, height: 28, backgroundColor: "white" }}
                />
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
                          logout();        // <--- usar logout del contexto
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
          </>
        )}
      </div>
    </header>
  );
}