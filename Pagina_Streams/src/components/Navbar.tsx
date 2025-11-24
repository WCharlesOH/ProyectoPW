// Navbar.jsx
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import MonedasMenu from "./MonedasMenu";
import UserMenu from "./Usuario_Desplegable";
import algo from "../assets/zoom-svgrepo-com.svg";
import "./Navbar.css";

type NavbarProps = {
  monedas: any; // Replace 'any' with the actual type if known, e.g., number, string[], etc.
  setMonedas: (value: any) => void; // Replace 'any' with the actual type if known
};

export default function Navbar({ monedas, setMonedas }: NavbarProps) {  // ✅ Recibe props
  const { isLogged } = useAuth();
  const [dropOpen, setDropOpen] = useState(false);
  const [menuMonedasAbierto, setMenuMonedasAbierto] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar__group">
        <h2 className="navbar__brand">
          <Link to="/">Tinamo</Link>
        </h2>
        <nav className="navbar__links">
          <NavLink
            to="/explorar"
            className={({ isActive }) =>
              `navbar__link ${isActive ? "navbar__link--active" : ""}`
            }
          >
            Explorar
          </NavLink>
          <div
            className="navbar__more"
            onMouseEnter={() => setDropOpen(true)}
            onMouseLeave={() => setDropOpen(false)}
          >
            <button className={`navbar__more-toggle ${dropOpen ? "navbar__more-toggle--open" : ""}`}>
              Más
            </button>
            {dropOpen && (
              <div className="navbar__more-menu">
                <Link to="/nosotros">Nosotros</Link>
                <Link to="/terminos">Términos</Link>
                <Link to="/usuario" />
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
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `navbar__button-link ${isActive ? "navbar__link--active" : ""}`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/registro"
              className={({ isActive }) =>
                `navbar__button-link ${isActive ? "navbar__link--active" : ""}`
              }
            >
              Register
            </NavLink>
          </>
        ) : (
          <>
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