import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

import vegeta from "../imagenes/Mirko.jpg";
import fork from "../imagenes/fork.jpg";
import grefg from "../imagenes/grefg.jpg";

const DEFAULT_AVATAR = vegeta;

type Seguido = {
  id: string;
  name: string;
  avatarUrl?: string;
};

interface SidebarProps {
  onToggle?: (isOpen: boolean) => void;
}


// 🔹 IDs corregidos y nombres únicos
const SEGUIDOS: Seguido[] = [
  { id: "1", name: "Vegeta", avatarUrl: vegeta },
  { id: "2", name: "Frok", avatarUrl: fork },
  { id: "3", name: "Zak", avatarUrl: grefg },
  { id: "4", name: "Staxx", avatarUrl: grefg },
  { id: "5", name: "AuronPlay", avatarUrl: grefg },
  { id: "6", name: "Grefg", avatarUrl: grefg },
];

export default function Sidebar({ onToggle }: SidebarProps) {
  const { isLogged } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  const titulo = isLogged ? "Seguidos" : "Canales en vivo";

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
     width: isOpen ? 250 : 40,
      transition: "width 0.3s",
      backgroundColor: "#0e0e10",
      color: "white",
      height: "calc(100vh - 60px)",
      overflow: "hidden",
      position: "fixed", 
      top: 60,              
      left: 0,
      zIndex: 100,
  }}
      >
        {/* 🔹 Encabezado del sidebar */}
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
            <span
              style={{
                color: "white",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              ▶
            </span>
          )}
        </div>

        {/* 🔹 Lista de streamers seguidos */}
        {isOpen && (
          <div style={{ padding: "12px" }}>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                marginTop: "12px",
              }}
            >
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
                    src={s.avatarUrl || DEFAULT_AVATAR}
                    alt={s.name}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <Link
                    to={`/perfil/${s.name}`}
                    style={{
                      color: "white",
                      marginLeft: "10px",
                      textDecoration: "none",
                    }}
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}