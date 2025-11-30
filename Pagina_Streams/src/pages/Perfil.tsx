import { useParams } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import LivePlayer from "../components/LivePlayer";
import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";

interface PerfilProps {
  monedas: number;
  setMonedas: React.Dispatch<React.SetStateAction<number>>;
}

interface StreamerInfo {
  username: string;
  descripcion: string;
  categoria: string;
  seguidores: number;
  imagenUrl: string;
}

const STREAMERS: StreamerInfo[] = [
  {
    username: "Vegeta",
    descripcion: "Streamer de juegos retro y charlas casuales.",
    categoria: "Retro Gaming",
    seguidores: 2500,
    imagenUrl: "https://placehold.co/800x450?text=Vegeta+Live",
  },
  {
    username: "Frok",
    descripcion: "Directos de arte y música en vivo 🎨🎵",
    categoria: "Arte y Música",
    seguidores: 1800,
    imagenUrl: "https://placehold.co/800x450?text=Frok+En+Vivo",
  },
  {
    username: "Zak",
    descripcion: "Speedruns y desafíos épicos",
    categoria: "Speedrunning",
    seguidores: 3200,
    imagenUrl: "https://placehold.co/800x450?text=Zak+Streaming",
  },
];

export default function Perfil({ monedas, setMonedas }: PerfilProps) {
  const { username } = useParams<{ username: string }>();
  const streamer = STREAMERS.find(
    (s) => s.username.toLowerCase() === username?.toLowerCase()
  );

  // Estado local para seguimiento
  const { isLogged } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!streamer) return;
    try {
      const stored = localStorage.getItem("following");
      const following: string[] = stored ? JSON.parse(stored) : [];
      setIsFollowing(following.includes(streamer.username));
    } catch {
      setIsFollowing(false);
    }
  }, [streamer]);

  const toggleFollow = () => {
    if (! isLogged) {
      alert("Debes iniciar sesión para seguir a un streamer");
      return;
    }

    if (! streamer) return;

    try {
      const stored = localStorage. getItem("following");
      const following: string[] = stored ? JSON.parse(stored) : [];

      if (isFollowing) {
        const updated = following.filter((u) => u !== streamer.username);
        localStorage.setItem("following", JSON.stringify(updated));
        setIsFollowing(false);
      } else {
        const updated = [...following, streamer.username];
        localStorage.setItem("following", JSON.stringify(updated));
        setIsFollowing(true);
      }
    } catch (err) {
      console.error("Error al actualizar seguimiento:", err);
    }
  };

  if (! streamer) {
    return (
      <div
        style={{
          color: "white",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h2>Streamer no encontrado</h2>
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
        transition: "margin-left 0. 3s ease",
        padding: "20px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Contenido principal */}
      <div style={{ flex: 1, paddingRight: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          {/* 🎥 LivePlayer ahora usa VDO.Ninja con sala personalizada por streamer */}
          <LivePlayer 
            fallbackImage={streamer.imagenUrl} 
            streamerName={streamer.username}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 style={{ margin: 0 }}>{streamer.username}</h1>
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
        </div>

        <p style={{ color: "#aaa", marginTop: "10px" }}>
          {streamer.descripcion}
        </p>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "15px",
            fontSize: "14px",
          }}
        >
          <span>
            <strong>Categoría:</strong> {streamer. categoria}
          </span>
          <span>
            <strong>Seguidores:</strong> {streamer.seguidores. toLocaleString()}
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