import React from "react";
import { useParams } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import Player from "../components/Player";

interface PerfilProps {
  monedas: number;
  setMonedas: (monedas: number) => void;
}

interface StreamerInfo {
  username: string;
  descripcion: string;
  categoria: string;
  seguidores: number;
  imagenUrl: string;
}

// Datos de ejemplo (puedes reemplazar por tu fetch/API)
const STREAMERS: StreamerInfo[] = [
  {
    username: "CanalUno",
    descripcion: "Streamer de juegos retro y charlas casuales.",
    categoria: "Retro Gaming",
    seguidores: 2500,
    imagenUrl: "https://placehold.co/800x450?text=CanalUno+Live",
  },
  {
    username: "CanalDos",
    descripcion: "Directos de arte y música en vivo 🎨🎵",
    categoria: "Arte y Música",
    seguidores: 1800,
    imagenUrl: "https://placehold.co/800x450?text=CanalDos+En+Vivo",
  },
  {
    username: "CanalTres",
    descripcion: "Torneos de shooters y contenido competitivo.",
    categoria: "Esports",
    seguidores: 5300,
    imagenUrl: "https://placehold.co/800x450?text=CanalTres+Streaming",
  },
];

const SIDEBAR_WIDTH = 250; // ancho del Sidebar existente (ajústalo si cambias tu Sidebar)

export default function Perfil({ monedas, setMonedas }: PerfilProps) {
  const { username } = useParams<{ username: string }>();
  const streamer = STREAMERS.find(
    (s) => s.username.toLowerCase() === username?.toLowerCase()
  );

  if (!streamer) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: "2rem", marginLeft: SIDEBAR_WIDTH }}>
        <h2>Streamer no encontrado</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#0e0e10",
        color: "white",
        // deja espacio al Sidebar fijo existente
        marginLeft: SIDEBAR_WIDTH,
      }}
    >
      {/* Contenido principal */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <div style={{ marginBottom: "20px" }}>
          <Player imagenUrl={streamer.imagenUrl} />
        </div>

        <h1>{streamer.username}</h1>
        <p style={{ color: "#ccc" }}>{streamer.descripcion}</p>
        <p><strong>Categoría:</strong> {streamer.categoria}</p>
        <p><strong>Seguidores:</strong> {streamer.seguidores}</p>

        {/* VODs */}
        <div style={{ marginTop: "30px" }}>
          <h2>Videos anteriores</h2>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#1e1e1e",
                  borderRadius: "10px",
                  width: "200px",
                  height: "120px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#888",
                }}
              >
                VOD #{i}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ChatBox a la derecha (mantiene monedas) */}
      <div
        style={{
          width: 380,
          backgroundColor: "#18181b",
          display: "flex",
          flexDirection: "column",
          borderLeft: "1px solid #2a2a2a",
        }}
      >
        <ChatBox monedas={monedas} setMonedas={setMonedas} />
      </div>
    </div>
  );
}