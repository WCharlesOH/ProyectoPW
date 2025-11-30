import { useEffect, useState } from "react";

interface LivePlayerProps {
  fallbackImage?: string; // imagen cuando no haya stream
  roomId?: string; // ID opcional de sala personalizada
  streamerName?: string; // Nombre del streamer para sala dinámica
}

export default function LivePlayer({ 
  fallbackImage, 
  roomId, 
  streamerName 
}: LivePlayerProps) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargarUrl = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Si se proporciona streamerName, crear sala personalizada
        if (streamerName) {
          const resp = await fetch("http://localhost:5000/api/live-room/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ID_Usuario: 1, // Esto debería venir de tu contexto de autenticación
              NombreUsuario: streamerName,
            }),
          });

          if (! resp.ok) throw new Error("Error al crear sala personalizada");
          const data = await resp.json();
          setEmbedUrl(data.viewUrl);
        } else {
          // Usar sala predeterminada
          const resp = await fetch("http://localhost:5000/api/live-url");
          if (!resp.ok) throw new Error("Error al obtener la URL de la transmisión");
          const data = await resp.json();
          setEmbedUrl(data.url);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error cargando stream de VDO.Ninja:", err);
        setError("No se pudo cargar la transmisión en vivo");
        setIsLoading(false);
      }
    };

    cargarUrl();
  }, [streamerName, roomId]);

  // Si hay error y me pasaste una imagen de respaldo -> muestro imagen
  if (error && fallbackImage) {
    return (
      <div style={{ position: "relative", width: "100%", borderRadius: "10px", overflow: "hidden" }}>
        <img
          src={fallbackImage}
          alt="Stream offline"
          style={{ width: "100%", borderRadius: "10px", display: "block" }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0, 0, 0, 0.8)",
            color: "#fff",
            padding: "20px 40px",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>📡 Stream sin conexión</p>
          <p style={{ margin: "8px 0 0 0", fontSize: "14px", opacity: 0.9 }}>{error}</p>
        </div>
      </div>
    );
  }

  // Mientras cargamos la URL
  if (isLoading || !embedUrl) {
    return (
      <div
        style={{
          width: "100%",
          height: "450px",
          background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "4px solid rgba(255, 255, 255, 0.1)",
            borderTop: "4px solid #00b7ff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ margin: 0, fontSize: "16px", opacity: 0.9 }}>
          🎥 Cargando transmisión en vivo...
        </p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Cuando ya tenemos la URL del live con VDO.Ninja
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        background: "#000",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
        borderRadius: "10px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <iframe
        src={embedUrl}
        style={{ 
          width: "100%", 
          height: "450px", 
          border: "none",
          display: "block" 
        }}
        allow="camera; microphone; autoplay; fullscreen; picture-in-picture; display-capture; screen-wake-lock"
        allowFullScreen
        title="VDO.Ninja Live Stream"
      />
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "rgba(0, 183, 255, 0.9)",
          color: "white",
          padding: "6px 12px",
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span style={{ width: "8px", height: "8px", background: "#fff", borderRadius: "50%", animation: "pulse 2s infinite" }} />
        VDO.Ninja
      </div>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
}