// Navbar.jsx
import { useState, useEffect, useRef } from "react";
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
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  const moreRef = useRef<HTMLDivElement | null>(null);

  // Cerrar el submenu si se hace click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const linkStyle: React.CSSProperties = {
    textDecoration: "none",
    color: "inherit",
    margin: "0 8px",
  };

  // Control dinámico del navbar con scroll
  useEffect(() => {
    let ticking = false;

    const updateNavbar = () => {
      const currentScrollY = window.scrollY;

      // Si estamos en el tope (primeros 50px), siempre mostrar
      if (currentScrollY < 50) {
        setIsVisible(true);
      }
      // Si scrolleamos hacia abajo más de 5px
      else if (currentScrollY > lastScrollY + 5) {
        setIsVisible(false);
      }
      // Si scrolleamos hacia arriba más de 5px
      else if (currentScrollY < lastScrollY - 5) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  // Manejar la búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buscar? q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Manejar Enter en el input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <header
      className={`navbar ${isVisible ? "navbar--visible" : "navbar--hidden"}`}
    >
      <div className="navbar__group">
        <h2 className="navbar__brand">
          <Link to="/">Tinamo</Link>
        </h2>
        <nav className="navbar__links">
          <NavLink to="/explorar" style={linkStyle}>
            Explorar
          </NavLink>
          <div className="navbar__more" ref={moreRef}>
            <button
              style={{ fontWeight: dropOpen ? "bold" : "normal" }}
              onClick={() => setDropOpen(!dropOpen)}
            >
              Más
            </button>
            {dropOpen && (
              <div className="navbar__more-menu">
                <Link
                  to="/nosotros"
                  onClick={() => {
                    setDropOpen(false);
                  }}
                >
                  Nosotros
                </Link>
                <Link
                  to="/terminos"
                  onClick={() => {
                    setDropOpen(false);
                  }}
                >
                  Términos
                </Link>
                <Link
                  to="/usuario"
                  onClick={() => {
                    setDropOpen(false);
                  }}
                >
                  Centro de usuario
                </Link>
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
        {!isLogged ? (
          <>
            <NavLink
              to="/login"
              style={linkStyle}
              className="navbar__button-link"
            >
              Login
            </NavLink>
            <NavLink
              to="/registro"
              style={linkStyle}
              className="navbar__button-link"
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
