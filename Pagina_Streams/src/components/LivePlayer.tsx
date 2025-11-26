import { useEffect, useState } from "react";

interface LivePlayerProps {
  fallbackImage?: string; // imagen cuando no haya stream
}

export default function LivePlayer({ fallbackImage }: LivePlayerProps) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarUrl = async () => {
      try {
        const resp = await fetch("http://localhost:5020/api/live-url");
        if (!resp.ok) throw new Error("Error al obtener la URL de la transmisión");
        const data = await resp.json();
        setEmbedUrl(data.url);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la transmisión en vivo");
      }
    };

    cargarUrl();
  }, []);

  // Si hay error y me pasaste una imagen de respaldo -> muestro imagen
  if (error && fallbackImage) {
    return (
      <img
        src={fallbackImage}
        alt="Stream offline"
        style={{ width: "100%", borderRadius: "10px" }}
      />
    );
  }

  // Mientras cargamos la URL
  if (!embedUrl) {
    return (
      <div
        style={{
          width: "100%",
          height: "450px",
          background: "#000",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
        }}
      >
        Cargando transmisión en vivo...
      </div>
    );
  }

  // Cuando ya tenemos la URL del live
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        background: "#000",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <iframe
        src={embedUrl}
        style={{ width: "100%", height: "450px", border: "none" }}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}