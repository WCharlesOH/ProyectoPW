// Navbar.jsx
import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import MonedasMenu from "./MonedasMenu";
import UserMenu from "./Usuario_Desplegable";
import algo from "../assets/zoom-svgrepo-com.svg";
import "./Navbar.css";

type NavbarProps = {
  monedas: any;
  setMonedas: (value: any) => void;
};

export default function Navbar({ monedas, setMonedas }: NavbarProps) {
  const { isLogged } = useAuth();
  const [dropOpen, setDropOpen] = useState(false);
  const [menuMonedasAbierto, setMenuMonedasAbierto] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const linkStyle: React.CSSProperties = {
    textDecoration: "none",
    color: "inherit",
    margin: "0 8px"
  };

  // Manejar la búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buscar? q=${encodeURIComponent(searchQuery. trim())}`);
    }
  };

  // Manejar Enter en el input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
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
            <button style={{ fontWeight: dropOpen ?  "bold" : "normal" }}>
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

      <form className="navbar__search" onSubmit={handleSearch}>
        <img
          src={algo}
          alt="Buscar"
          className="navbar__search-icon"
          onClick={handleSearch}
          style={{ cursor: "pointer" }}
        />
        <input
          type="text"
          placeholder="Buscar transmisiones o canales"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </form>

      <div className="navbar__actions">
        {! isLogged ? (
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