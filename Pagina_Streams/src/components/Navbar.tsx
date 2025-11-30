// Navbar.jsx
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import MonedasMenu from "./MonedasMenu";
import UserMenu from "./Usuario_Desplegable";
import algo from "../assets/zoom-svgrepo-com.svg"
import "./Navbar.css"
import type {dataprops} from "../pages/Login"


export default function Navbar( usuario : dataprops) {  // ✅ Recibe props
  const { isLogged } = useAuth();
  const [dropOpen, setDropOpen] = useState(false);
  const [menuMonedasAbierto, setMenuMonedasAbierto] = useState(false);

  const linkStyle: React.CSSProperties = {
    textDecoration: "none",
    color: "inherit",
    margin: "0 8px"
  };

  return (
    <header className="navbar">
      <div className="navbar__group">
        <h2 className="navbar__brand">
          <Link to="/">Tinamo</Link>
        </h2>
        <nav className="navbar__links">
          <NavLink to="/explorar" style={linkStyle}>
            Explorar
          </NavLink>
          <div
            className="navbar__more"
            onMouseEnter={() => setDropOpen(true)}
            onMouseLeave={() => setDropOpen(false)}
          >
            <button style={{ fontWeight: dropOpen ? "bold" : "normal" }}>
              Más
            </button>
            {dropOpen && (
              <div className="navbar__more-menu">
                <Link to="/nosotros">Nosotros</Link>
                <Link to="/terminos">Términos</Link>
                <Link to="/usuario">Centro de usuario</Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="navbar__search">
        <img
          src={algo}
          alt="Buscar"
          className="navbar__search-icon"
        />
        <input
          type="text"
          placeholder="Buscar transmisiones o canales"
        />
      </div>

      <div className="navbar__actions">
        {!isLogged ? (
          <>
            <NavLink to="/login" style={linkStyle} className="navbar__button-link">
              Login
            </NavLink>
            <NavLink to="/registro" style={linkStyle} className="navbar__button-link">
              Register
            </NavLink>
          </>
        ) : (
          <>
            
            
            <MonedasMenu
              monedas={usuario.monedasNumber}
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