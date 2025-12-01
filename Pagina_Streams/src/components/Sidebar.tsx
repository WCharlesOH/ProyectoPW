import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { API } from "../Comandosllamadas/llamadas";
import type { Usuario } from "./types";

const DEFAULT_AVATAR = "https://placehold.co/40x40? text=User";

type StreamerEnVivo = {
  ID?: number;
  NombreUsuario: string;
  ImagenPerfil?: string;
  EnVivo?: boolean;
};

interface SidebarProps {
  onToggle?: (isOpen: boolean) => void;
}

export default function Sidebar({ onToggle }: SidebarProps) {
  const { isLogged } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [streamersEnVivo, setStreamersEnVivo] = useState<StreamerEnVivo[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  // Obtener usuario logueado
  const getUserData = (): Usuario | null => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON. parse(user) : null;
    } catch {
      return null;
    }
  };

  // Obtener streamers en vivo
  useEffect(() => {
    const fetchStreamersEnVivo = async () => {
      setLoading(true);
      try {
        const userData = getUserData();
        
        if (isLogged && userData?. ID) {
          // Si está logueado, obtener seguidos en vivo usando API.MisSuscripciones
          const result = await API.MisSuscripciones(userData.ID);
          
          if (result.success && result.subscriptions) {
            // Filtrar solo los streamers que están en vivo
            const seguidos = result.subscriptions
              .filter((sub: any) => sub.streamer?. EnVivo === true)
              .map((sub: any) => ({
                ID: sub.streamer?.ID || sub.ID_Streamer,
                NombreUsuario: sub.streamer?.NombreUsuario || "Usuario",
                ImagenPerfil: sub.streamer?.ImagenPerfil,
                EnVivo: true,
              }));
            
            setStreamersEnVivo(seguidos);
          } else {
            setStreamersEnVivo([]);
          }
        } else {
          // Si no está logueado, obtener todos los streams activos
          const response = await fetch("http://localhost:5000/api/streams/live");

          if (response.ok) {
            const data = await response.json();
            const streams = data.streams?. map((stream: any) => ({
              NombreUsuario: stream.streamerName,
              ImagenPerfil: undefined,
              EnVivo: true,
            })) || [];
            setStreamersEnVivo(streams);
          } else {
            setStreamersEnVivo([]);
          }
        }
      } catch (error) {
        console.error("Error obteniendo streamers en vivo:", error);
        setStreamersEnVivo([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamersEnVivo();
    
    // Refrescar cada 30 segundos
    const interval = setInterval(fetchStreamersEnVivo, 30000);
    
    return () => clearInterval(interval);
  }, [isLogged]);

  const titulo = isLogged ? "Seguidos en vivo" : "Canales en vivo";

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
        {/* Encabezado del sidebar */}
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

        {/* Lista de streamers en vivo */}
        {isOpen && (
          <div style={{ padding: "12px" }}>
            {loading ? (
              <p style={{ color: "#aaa", fontSize: "14px" }}>Cargando... </p>
            ) : streamersEnVivo.length === 0 ? (
              <p style={{ color: "#aaa", fontSize: "14px" }}>
                {isLogged ?  "No hay seguidos en vivo" : "No hay canales en vivo"}
              </p>
            ) : (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  marginTop: "12px",
                }}
              >
                {streamersEnVivo.map((streamer, index) => (
                  <li
                    key={streamer.ID || index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <img
                      src={streamer. ImagenPerfil || DEFAULT_AVATAR}
                      alt={streamer.NombreUsuario}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <Link
                      to={`/perfil/${streamer.NombreUsuario}`}
                      style={{
                        color: "white",
                        marginLeft: "10px",
                        textDecoration: "none",
                        flex: 1,
                      }}
                    >
                      {streamer.NombreUsuario}
                    </Link>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#e91916",
                        marginLeft: "8px",
                      }}
                      title="En vivo"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}