import { useState } from "react";
import { Routes, Link, Route } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

import Perfil from "../pages/Perfil";


interface Seguido {
  id: string;
  name: string;
  avatarUrl: string;
}

const SEGUIDOS: Seguido[] = [
  { id: "1", name: "CanalUno", avatarUrl: "#" },
  { id: "2", name: "CanalDos", avatarUrl: "#" },
  { id: "3", name: "CanalTres", avatarUrl: "#" },
];

export default function Sidebar() {
  const { isLogged } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const titulo = isLogged ? "Seguidos" : "Canales en vivo";

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          width: isOpen ? 250 : 40,  // ancho cuando está cerrado
          transition: "width 0.3s",
          backgroundColor: "#0e0e10",
          color: "white",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "12px",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={toggleSidebar}
        >
          {isOpen ? (
            <>
              <h3 style={{ margin: 0, color: "white", flex: 1 }}>{titulo}</h3>
              <span style={{ color: "white", marginLeft: "8px" }}>◀</span>
            </>
          ) : (
            <span style={{ color: "white", marginLeft: "auto", marginRight: "auto" }}>
              ▶
            </span>
          )}
        </div>

        {isOpen && (
          <div style={{ padding: "12px" }}>
            <ul style={{ listStyle: "none", padding: 0, marginTop: "12px" }}>
              {SEGUIDOS.map((s) => (
                <li
                  key={s.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <img
                    src={s.avatarUrl}
                    alt={s.name}
                    style={{ width: 40, height: 40, borderRadius: "50%" }}
                  />
                  <Link
                    to={"/perfil/"}
                    style={{
                      color: "white",
                      marginLeft: "10px",
                      textDecoration: "none",
                    }}>
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div style={{ flex: 1 }}>
        {/* Aquí va tu contenido principal o rutas */}
      </div>
    </div>
  );
}