import { useEffect, useState } from "react";

interface LivePlayerProps {
  streamerName: string; // Nombre del streamer (REQUERIDO)
  fallbackImage?: string; // Imagen cuando el stream está offline
  autoRefresh?: boolean; // Auto-refrescar estado del stream
  refreshInterval?: number; // Intervalo de refresh en ms (default: 10000)
}

interface StreamStatus {
  exists: boolean;
  isLive: boolean;
  roomId?: string;
  viewerUrl?: string;
  title?: string;
  category?: string;
  startedAt?: string;
}

export default function LivePlayer({ 
  streamerName,
  fallbackImage,
  autoRefresh = true,
  refreshInterval = 10000, // 10 segundos
}: LivePlayerProps) {
  const [streamStatus, setStreamStatus] = useState<StreamStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para verificar el estado del stream
  const checkStreamStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/stream/status/${streamerName}`);
      
      if (!response.ok) {
        throw new Error('Error al verificar estado del stream');
      }

      const data: StreamStatus = await response.json();
      setStreamStatus(data);
      setError(null);
      setIsLoading(false);
      
      return data;
    } catch (err) {
      console.error(`Error al verificar stream de ${streamerName}:`, err);
      setError('No se pudo conectar con el servidor');
      setIsLoading(false);
      return null;
    }
  };

  // Cargar estado inicial
  useEffect(() => {
    checkStreamStatus();
  }, [streamerName]);

  // Auto-refresh del estado
  useEffect(() => {
    if (! autoRefresh) return;

    const interval = setInterval(() => {
      checkStreamStatus();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [streamerName, autoRefresh, refreshInterval]);

  // Estado: Cargando
  if (isLoading) {
    return (
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "12px",
          gap: "16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            border: "5px solid rgba(145, 71, 255, 0.2)",
            borderTop: "5px solid #9147ff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ margin: 0, fontSize: "16px", opacity: 0.9, fontWeight: 600 }}>
          🎥 Verificando transmisión...
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

  // Estado: Error de conexión
  if (error) {
    return (
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          background: "#1a1a1d",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {fallbackImage && (
          <img
            src={fallbackImage}
            alt="Offline"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.4) blur(2px)",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0, 0, 0, 0.85)",
            color: "#fff",
            padding: "30px 50px",
            borderRadius: "12px",
            textAlign: "center",
            border: "2px solid #ef4444",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
          <p style={{ margin: "0 0 8px 0", fontSize: "20px", fontWeight: "bold" }}>
            Error de conexión
          </p>
          <p style={{ margin: "0 0 16px 0", fontSize: "14px", opacity: 0.8 }}>
            {error}
          </p>
          <button
            onClick={checkStreamStatus}
            style={{
              background: "#9147ff",
              border: "none",
              color: "white",
              padding: "10px 24px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Estado: Stream OFFLINE
  if (!streamStatus?. isLive) {
    return (
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          background: "#1a1a1d",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {fallbackImage && (
          <img
            src={fallbackImage}
            alt={`${streamerName} offline`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0. 5)",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0, 0, 0, 0.85)",
            color: "#fff",
            padding: "30px 50px",
            borderRadius: "12px",
            textAlign: "center",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>📡</div>
          <p style={{ margin: "0 0 8px 0", fontSize: "24px", fontWeight: "bold" }}>
            Stream Offline
          </p>
          <p style={{ margin: "0 0 16px 0", fontSize: "16px", opacity: 0.8 }}>
            {streamerName} no está transmitiendo ahora
          </p>
          {autoRefresh && (
            <p style={{ margin: 0, fontSize: "13px", opacity: 0.6 }}>
              Verificando automáticamente cada {refreshInterval / 1000}s... 
            </p>
          )}
        </div>
      </div>
    );
  }

  // Estado: Stream EN VIVO
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "16/9",
        background: "#000",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 8px 24px rgba(145, 71, 255, 0.3)",
      }}
    >
      {/* Badge EN VIVO */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          background: "#eb0400",
          color: "white",
          padding: "8px 16px",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          zIndex: 10,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <span
          style={{
            width: "10px",
            height: "10px",
            background: "#fff",
            borderRadius: "50%",
            animation: "pulse 2s infinite",
          }}
        />
        EN VIVO
      </div>

      {/* Información del stream */}
      {streamStatus. title && (
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            right: "16px",
            background: "rgba(0, 0, 0, 0.8)",
            padding: "12px 16px",
            borderRadius: "8px",
            backdropFilter: "blur(10px)",
            zIndex: 10,
          }}
        >
          <p style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "bold", color: "white" }}>
            {streamStatus.title}
          </p>
          {streamStatus.category && (
            <p style={{ margin: 0, fontSize: "13px", color: "#adadb8" }}>
              🎮 {streamStatus.category}
            </p>
          )}
        </div>
      )}

      {/* Iframe de VDO.Ninja */}
      <iframe
        src={streamStatus.viewerUrl}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        allow="camera; microphone; autoplay; fullscreen; picture-in-picture; display-capture; screen-wake-lock"
        allowFullScreen
        title={`Stream de ${streamerName}`}
      />

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `}
      </style>
    </div>
  );
}