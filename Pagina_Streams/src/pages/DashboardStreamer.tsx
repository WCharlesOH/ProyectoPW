import React, { useEffect, useRef, useState } from "react";
import {
  emitirActividad,
  emitirStream,
  suscribirActividad,
  suscribirStream,
} from "../datos/sincronizacion";
import { useAuth } from "../components/AuthContext";
import { API } from "../Comandosllamadas/llamadas";

// Importar componentes
import StatCard from "../components/StatCard";
import StreamConfig from "../components/StreamConfig";
import StreamControls from "../components/StreamControls";
import StreamPreview from "../components/StreamPreview";
import ActivityPanel, {
  type ActividadMoneda,
} from "../components/ActivityPanel";
import FollowersPanel from "../components/FollowersPanel";

interface Stat {
  label: string;
  value: string | number;
  hint?: string;
  color?: string;
}

interface DashboardStreamerProps {
  monedas: number;
  setMonedas: React.Dispatch<React.SetStateAction<number>>;
}

const DashboardStreamer: React.FC<DashboardStreamerProps> = ({
  monedas,
  setMonedas,
}) => {
  const [isLive, setIsLive] = useState(false);
  const [tiempoTransmision, setTiempoTransmision] = useState(0);
  const [actividades, setActividades] = useState<ActividadMoneda[]>([]);
  const timerRef = useRef<number | null>(null);

  // Estados para VDO. Ninja
  const [broadcasterUrl, setBroadcasterUrl] = useState<string>("");
  const [viewerUrl, setViewerUrl] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [streamTitle, setStreamTitle] = useState("");
  const [streamCategory, setStreamCategory] = useState("Just Chatting");
  const broadcasterWindowRef = useRef<Window | null>(null);

  // Usuario actual
  const { user } = useAuth();
  const nombreUsuario =
    (user as any)?.NombreUsuario || (user as any)?.name || "StreamerPrueba";
  const idUsuario = (user as any)?.ID;

  const stats: Stat[] = [
    {
      label: "Espectadores actuales",
      value: isLive ? "23" : "0",
      color: "#9147ff",
    },
    { label: "Seguidores totales", value: "1,234", color: "#00b7ff" },
    {
      label: "Monedas",
      value: monedas,
      hint: "💰 Ganadas de regalos",
      color: "#f59e0b",
    },
    {
      label: "Tiempo transmitido",
      value: formatearTiempo(tiempoTransmision),
      color: "#10b981",
    },
  ];

  // Crear/Obtener sala del streamer
  const obtenerSalaStreamer = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/stream/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          streamerName: nombreUsuario,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBroadcasterUrl(data.broadcasterUrl);
        setViewerUrl(data.viewerUrl);
        setRoomId(data.roomId);
        return data;
      } else {
        throw new Error("Error al obtener sala");
      }
    } catch (error) {
      console.error("Error al obtener sala:", error);
      return null;
    }
  };

  // Cargar sala al montar componente
  useEffect(() => {
    obtenerSalaStreamer();
  }, [nombreUsuario]);

  // Cargar historial de monedas al montar
  useEffect(() => {
    const cargarHistorialMonedas = async () => {
      if (!idUsuario) return;

      try {
        const result = await API.ObtenerDatosUsuario(idUsuario);

        if (result.success && result.user) {
          const monedasActuales = result.user.Monedas || 0;
          setMonedas(monedasActuales);

          const actividadInicial: ActividadMoneda = {
            id: Date.now().toString(),
            text: `💰 Saldo actual: ${monedasActuales} monedas`,
            time: new Date().toLocaleTimeString(),
            tipo: "moneda",
            cantidad: monedasActuales,
          };
          setActividades((prev) => [actividadInicial, ...prev].slice(0, 10));
        }
      } catch (error) {
        console.error("Error al cargar historial de monedas:", error);
      }
    };

    cargarHistorialMonedas();
  }, [idUsuario]);

  // Timer de transmisión
  useEffect(() => {
    if (isLive) {
      timerRef.current = window.setInterval(() => {
        setTiempoTransmision((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [isLive]);

  // Suscripción a actividades
  useEffect(() => {
    const subscription = suscribirActividad((mensaje: string) => {
      const nueva: ActividadMoneda = {
        id: Date.now().toString(),
        text: mensaje,
        time: new Date().toLocaleTimeString(),
        tipo:
          mensaje.includes("💰") || mensaje.includes("💝")
            ? "moneda"
            : "normal",
      };
      setActividades((prev) => [nueva, ...prev].slice(0, 10));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Suscripción a eventos del stream
  useEffect(() => {
    const subscription = suscribirStream((datos: any) => {
      if (datos.tipo === "regalo") {
        const ganancia = datos.valor || 0;
        const nuevasMonedas = monedas + ganancia;

        setMonedas(nuevasMonedas);

        if (idUsuario) {
          API.ActualizarMonedas(idUsuario, nuevasMonedas);
        }

        const actividadRegalo: ActividadMoneda = {
          id: Date.now().toString(),
          text: `💝 Regalo recibido: ${datos.nombre} (+${ganancia} monedas)`,
          time: new Date().toLocaleTimeString(),
          tipo: "moneda",
          cantidad: ganancia,
        };

        setActividades((prev) => [actividadRegalo, ...prev].slice(0, 10));
        emitirActividad(
          `💝 Regalo recibido: ${datos.nombre} (+${ganancia} monedas)`
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setMonedas, monedas, idUsuario]);

  function formatearTiempo(segundos: number): string {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  const toggleLive = async () => {
    if (!isLive) {
      try {
        let salaData = broadcasterUrl
          ? { broadcasterUrl, viewerUrl, roomId }
          : await obtenerSalaStreamer();

        if (!salaData) {
          alert("Error al obtener la sala de transmisión");
          return;
        }

        const resp = await fetch("http://localhost:5000/api/stream/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            streamerName: nombreUsuario,
            title: streamTitle || `Stream de ${nombreUsuario}`,
            category: streamCategory,
          }),
        });

        if (resp.ok) {
          setIsLive(true);

          if (idUsuario) {
            await API.ActualizarEnVivo(idUsuario, "true");
          }

          emitirStream({ tipo: "estado", en_vivo: true });
          emitirActividad("🔴 Transmisión iniciada");

          if (salaData.broadcasterUrl) {
            broadcasterWindowRef.current = window.open(
              salaData.broadcasterUrl,
              "VDO_Broadcaster",
              "width=1280,height=720,menubar=no,toolbar=no,location=no,status=no"
            );
          }
        }
      } catch (error) {
        console.error("Error al iniciar stream:", error);
        alert("Error al iniciar la transmisión");
      }
    } else {
      try {
        await fetch("http://localhost:5000/api/stream/stop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ streamerName: nombreUsuario }),
        });

        setIsLive(false);

        if (idUsuario) {
          const horasTransmitidas = tiempoTransmision / 3600;
          await API.ActualizarHorasStreaming(idUsuario, horasTransmitidas);
          await API.ActualizarEnVivo(idUsuario, "false");
        }

        setTiempoTransmision(0);
        emitirStream({ tipo: "estado", en_vivo: false });
        emitirActividad("⚫ Transmisión finalizada");

        if (
          broadcasterWindowRef.current &&
          !broadcasterWindowRef.current.closed
        ) {
          broadcasterWindowRef.current.close();
        }
      } catch (error) {
        console.error("Error al detener stream:", error);
      }
    }
  };

  return (
    <div
      style={{
        padding: 30,
        color: "#fff",
        background: "#0e0e10",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }}>
        Dashboard - {nombreUsuario}
      </h1>

      {/* Estadísticas */}
      <div
        style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 30 }}
      >
        {stats.map((stat, i) => (
          <StatCard key={i} stat={stat} />
        ))}
      </div>

      {/* Configuración del Stream */}
      {!isLive && (
        <StreamConfig
          streamTitle={streamTitle}
          setStreamTitle={setStreamTitle}
          streamCategory={streamCategory}
          setStreamCategory={setStreamCategory}
          nombreUsuario={nombreUsuario}
        />
      )}

      {/* Controles de Transmisión */}
      <div
        style={{
          background: "#18181b",
          padding: 24,
          borderRadius: 8,
          marginBottom: 30,
          border: isLive ? "2px solid #eb0400" : "2px solid #333",
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
          🎥 Control de Transmisión
        </h2>

        <StreamControls
          isLive={isLive}
          toggleLive={toggleLive}
          tiempoTransmision={tiempoTransmision}
          roomId={roomId}
          viewerUrl={viewerUrl}
        />

        {/* Preview del Stream */}
        {isLive && (
          <StreamPreview
            nombreUsuario={nombreUsuario}
            streamTitle={streamTitle}
            streamCategory={streamCategory}
            roomId={roomId}
            monedas={monedas}
            setMonedas={setMonedas}
          />
        )}
      </div>

      {/* Grid con Actividades y Seguidores */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <ActivityPanel actividades={actividades} monedas={monedas} />
        <FollowersPanel />
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.3;
            }
          }
        `}
      </style>
    </div>
  );
};

export default DashboardStreamer;
