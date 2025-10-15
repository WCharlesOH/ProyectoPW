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
    descripcion: "Torneos de shooters y contenido competitivo.",
    categoria: "Esports",
    seguidores: 5300,
    imagenUrl: "https://placehold.co/800x450?text=Zak+Streaming",
  },
  {
    username: "Staxx",
    descripcion: "Creador de contenido de variedad y desafíos locos.",
    categoria: "Variedad",
    seguidores: 4200,
    imagenUrl: "https://placehold.co/800x450?text=Staxx+Stream",
  },
  {
    username: "AuronPlay",
    descripcion: "Humor, juegos y charlas con la comunidad.",
    categoria: "Entretenimiento",
    seguidores: 9000,
    imagenUrl: "https://placehold.co/800x450?text=AuronPlay+Directo",
  },
  {
    username: "Grefg",
    descripcion: "Streamings de gaming y retos competitivos.",
    categoria: "Gaming",
    seguidores: 10000,
    imagenUrl: "https://placehold.co/800x450?text=Grefg+Live",
  },
];

export default function Perfil({ monedas, setMonedas }: PerfilProps) {
  const { username } = useParams<{ username: string }>();
  const streamer = STREAMERS.find(
    (s) => s.username.toLowerCase() === username?.toLowerCase()
  );

  if (!streamer) {
    return (
      <div
        style={{
          color: "white",
          textAlign: "center",
          padding: "2rem",
          marginLeft: 250, // espacio del sidebar
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
        minHeight: "calc(100vh - 60px)", // deja espacio al navbar superior
        backgroundColor: "#0e0e10",
        color: "white",
        marginLeft: 250, // 🔹 deja espacio fijo al sidebar
        transition: "margin-left 0.3s ease",
        padding: "20px",
      }}
    >
      {/* Contenido principal */}
      <div style={{ flex: 1, paddingRight: "20px" }}>
        {/* Imagen (simulación del stream) */}
        <div style={{ marginBottom: "20px" }}>
          <Player imagenUrl={streamer.imagenUrl} />
        </div>

        {/* Información dinámica */}
        <h1>{streamer.username}</h1>
        <p style={{ color: "#ccc" }}>{streamer.descripcion}</p>
        <p>
          <strong>Categoría:</strong> {streamer.categoria}
        </p>
        <p>
          <strong>Seguidores:</strong> {streamer.seguidores}
        </p>

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

      {/* ChatBox (mantiene monedas) */}
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