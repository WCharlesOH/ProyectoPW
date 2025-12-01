import { useParams } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import LivePlayer from "../components/LivePlayer";
import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import { API } from "../Comandosllamadas/llamadas";
import type { Usuario } from "../components/types";

interface PerfilProps {
  monedas: number;
  setMonedas: React.Dispatch<React.SetStateAction<number>>;
}

interface StreamerInfo {
  ID: number;
  NombreUsuario: string;
  ImagenPerfil?: string;
  NivelStreams: number;
  HorasTransmision: number;
  EnVivo: boolean;
}

export default function Perfil({ monedas, setMonedas }: PerfilProps) {
  const { username } = useParams<{ username: string }>();
  const { isLogged } = useAuth();
  
  const [streamer, setStreamer] = useState<StreamerInfo | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener datos del usuario logueado
  const getUserData = (): Usuario | null => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  };

  // Obtener información del streamer usando API. ObtenerDatosUsuarioNombre
  useEffect(() => {
    const fetchStreamerInfo = async () => {
      if (!username) return;

      setLoading(true);
      setError(null);

      try {
        // Usar la función ObtenerDatosUsuarioNombre del API
        const result = await API.ObtenerDatosUsuarioNombre(username);

        if (! result.success || !result.user) {
          setError(result.error || "Streamer no encontrado");
          setStreamer(null);
          return;
        }

        setStreamer({
          ID: result.user. ID,
          NombreUsuario: result.user.NombreUsuario,
          ImagenPerfil: result.user. ImagenPerfil,
          NivelStreams: result.user.NivelStreams || 1,
          HorasTransmision: result.user.HorasTransmision || 0,
          EnVivo: result. user.EnVivo || false,
        });
      } catch (err) {
        console.error("Error obteniendo información del streamer:", err);
        setError("Error al cargar el perfil del streamer");
        setStreamer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamerInfo();
  }, [username]);

  // Verificar si el usuario está siguiendo al streamer usando API.MisSuscripciones
  useEffect(() => {
    const checkFollowing = async () => {
      if (!isLogged || !streamer) return;

      const userData = getUserData();
      if (! userData?. ID) return;

      try {
        // Usar la función MisSuscripciones que ya existe
        const result = await API. MisSuscripciones(userData.ID);
        
        if (result.success && result.subscriptions) {
          // Verificar si el streamer está en la lista de suscripciones
          const siguiendo = result.subscriptions.some(
            (sub: any) => sub.ID_Streamer === streamer.ID
          );
          setIsFollowing(siguiendo);
        }
      } catch (err) {
        console.error("Error verificando seguimiento:", err);
      }
    };

    checkFollowing();
  }, [isLogged, streamer]);

  // Seguir/Dejar de seguir al streamer usando API.NuevaSuscripcion y API.EliminarSuscripcion
  const toggleFollow = async () => {
    if (!isLogged) {
      alert("Debes iniciar sesión para seguir a un streamer");
      return;
    }

    if (!streamer) return;

    const userData = getUserData();
    if (!userData?.ID) {
      alert("Error: No se pudo obtener información del usuario");
      return;
    }

    try {
      let result;
      if (isFollowing) {
        // Usar la función EliminarSuscripcion que ya existe
        result = await API.EliminarSuscripcion(userData.ID, streamer.ID);
        if (result.success) {
          setIsFollowing(false);
        } else {
          alert(result.error || "Error al dejar de seguir al streamer");
        }
      } else {
        // Usar la función NuevaSuscripcion que ya existe
        result = await API.NuevaSuscripcion(userData.ID, streamer.ID);
        if (result.success) {
          setIsFollowing(true);
        } else {
          alert(result.error || "Error al seguir al streamer");
        }
      }
    } catch (err) {
      console.error("Error al actualizar seguimiento:", err);
      alert("Error de conexión con el servidor");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          color: "white",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h2>Cargando perfil... </h2>
      </div>
    );
  }

  if (error || !streamer) {
    return (
      <div
        style={{
          color: "white",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h2>{error || "Streamer no encontrado"}</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "calc(100vh - 60px)",
        backgroundColor: "#0e0e10",
        color: "white",
        transition: "margin-left 0.3s ease",
        padding: "20px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Contenido principal */}
      <div style={{ flex: 1, paddingRight: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <LivePlayer
            fallbackImage={
              streamer.ImagenPerfil || "https://placehold.co/800x450? text=Stream"
            }
            streamerName={streamer.NombreUsuario}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 style={{ margin: 0 }}>{streamer.NombreUsuario}</h1>
          <button
            onClick={toggleFollow}
            style={{
              padding: "8px 20px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
              background: isFollowing ? "#555" : "#9147ff",
              color: "white",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {isFollowing ? "✔ Siguiendo" : "+ Seguir"}
          </button>
          {streamer.EnVivo && (
            <span
              style={{
                padding: "4px 12px",
                background: "#e91916",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              🔴 EN VIVO
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "15px",
            fontSize: "14px",
          }}
        >
          <span>
            <strong>Nivel:</strong> {streamer.NivelStreams}
          </span>
          <span>
            <strong>Horas de transmisión:</strong>{" "}
            {streamer.HorasTransmision. toLocaleString()}h
          </span>
        </div>
      </div>

      {/* Chat */}
      <div style={{ width: "340px", flexShrink: 0 }}>
        <ChatBox monedas={monedas} setMonedas={setMonedas} />
      </div>
    </div>
  );
}