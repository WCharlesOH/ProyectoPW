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
interface Seguidor {
  ID_Viewer: number;
  NombreUsuario: string;
  ImagenPerfil: string;
  NivelViewer: number;
  Habilitado: boolean;
}

const DashboardStreamer: React. FC<DashboardStreamerProps> = ({ monedas, setMonedas }) => {
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
  // Estados para VDO.Ninja
  const [broadcasterUrl, setBroadcasterUrl] = useState<string>('');
  const [viewerUrl, setViewerUrl] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [streamTitle, setStreamTitle] = useState('');
  const [streamCategory, setStreamCategory] = useState('Just Chatting');
  const broadcasterWindowRef = useRef<Window | null>(null);

  // Estados para datos reales del backend
  const [espectadoresActuales, setEspectadoresActuales] = useState(0);
  const [seguidoresTotales, setSeguidoresTotales] = useState(0);
  const [seguidores, setSeguidores] = useState<Seguidor[]>([]);
  const [horasTransmitidasTotales, setHorasTransmitidasTotales] = useState(0);

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
    { 
      label: 'Espectadores actuales', 
      value: espectadoresActuales, 
      hint: isLive ? '👁️ Viendo ahora' : 'Inicia stream para ver',
      color: '#9147ff' 
    },
    { 
      label: 'Seguidores totales', 
      value: seguidoresTotales, 
      hint: '👥 Tu comunidad',
      color: '#00b7ff' 
    },
    { 
      label: 'Monedas', 
      value: monedas, 
      hint: '💰 Ganadas de regalos', 
      color: '#f59e0b' 
    },
    { 
      label: 'Tiempo transmitido', 
      value: formatearTiempoHoras(horasTransmitidasTotales), 
      hint: isLive ? `Sesión actual: ${formatearTiempo(tiempoTransmision)}` : 'Tiempo total histórico',
      color: '#10b981' 
    },
  ];

  // ============================================
  // FUNCIONES PARA CARGAR DATOS REALES
  // ============================================

  // Cargar datos del usuario (monedas, horas totales)
  const cargarDatosUsuario = async () => {
    if (!idUsuario) return;

    try {
      console.log('🔄 [Dashboard] Cargando datos del usuario...');
      const result = await API.ObtenerDatosUsuario(idUsuario);

      if (result.success && result.user) {
        const monedasActuales = result.user. Monedas || 0;
        const horasTotales = result.user. HorasTransmision || 0;

        setMonedas(monedasActuales);
        setHorasTransmitidasTotales(horasTotales);

        console.log(`✅ [Dashboard] Datos cargados: ${monedasActuales} monedas, ${horasTotales. toFixed(2)}h transmitidas`);
        
        // Agregar actividad inicial de monedas
        const actividadInicial: ActividadMoneda = {
          id: Date.now(). toString(),
          text: `💰 Saldo actual: ${monedasActuales} monedas`,
          time: new Date(). toLocaleTimeString(),
          tipo: 'moneda',
          cantidad: monedasActuales,
        };
        setActividades((prev) => {
          // Evitar duplicados
          if (prev.some(a => a.text. includes('Saldo actual'))) {
            return prev;
          }
          return [actividadInicial, ...prev].slice(0, 10);
        });
      }
    } catch (error) {
      console.error('❌ [Dashboard] Error al cargar datos del usuario:', error);
    }
  };

  // Cargar conteo de seguidores totales
  const cargarSeguidoresTotales = async () => {
    if (!idUsuario) return;

    try {
      console.log('🔄 [Dashboard] Cargando conteo de seguidores.. .');
      const result = await API.ContarSeguidoresTotales(idUsuario);

      if (result.success) {
        const totalSeguidores = result.seguidores || 0;
        setSeguidoresTotales(totalSeguidores);
        console.log(`✅ [Dashboard] ${totalSeguidores} seguidores totales`);
      }
    } catch (error) {
      console. error('❌ [Dashboard] Error al cargar seguidores totales:', error);
    }
  };

  // Cargar lista detallada de seguidores
  const cargarListaSeguidores = async () => {
    if (!idUsuario) return;

    try {
      console.log('🔄 [Dashboard] Cargando lista de seguidores...');
      const result = await API.SuscripcionesCanal(idUsuario);

      if (result.success && result.subscriptions) {
        const listaSeguidores: Seguidor[] = result.subscriptions.map((sub: any) => ({
          ID_Viewer: sub.ID_Viewer || 0,
          NombreUsuario: sub.viewerC?.NombreUsuario || 'Usuario',
          ImagenPerfil: sub.viewerC?.ImagenPerfil || `https://ui-avatars.com/api/? name=Usuario&background=9147ff&color=fff`,
          NivelViewer: sub. NivelViewer || 1,
          Habilitado: sub.Habilitado !== undefined ? sub.Habilitado : true,
        }));

        setSeguidores(listaSeguidores);
        console.log(`✅ [Dashboard] ${listaSeguidores.length} seguidores en lista detallada`);
      }
    } catch (error) {
      console.error('❌ [Dashboard] Error al cargar lista de seguidores:', error);
    }
  };

  // Obtener espectadores actuales viendo el stream
  const obtenerEspectadoresActuales = async () => {
    if (!idUsuario) {
      setEspectadoresActuales(0);
      return;
    }

    // Si no está en vivo, resetear a 0
    if (!isLive) {
      setEspectadoresActuales(0);
      return;
    }

    try {
      console.log('🔄 [Dashboard] Obteniendo espectadores actuales...');
      const result = await API.ContarEspectadoresActuales(idUsuario);

      if (result.success) {
        const espectadores = result.espectadores || 0;
        setEspectadoresActuales(espectadores);
        console.log(`✅ [Dashboard] ${espectadores} espectadores actuales`);
      } else {
        setEspectadoresActuales(0);
      }
    } catch (error) {
      console.error('❌ [Dashboard] Error al obtener espectadores actuales:', error);
      setEspectadoresActuales(0);
    }
  };

  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================

  function formatearTiempo(segundos: number): string {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function formatearTiempoHoras(horas: number): string {
    if (horas === 0) {
      return '0h 0m';
    }
    if (horas < 1) {
      const minutos = Math.floor(horas * 60);
      return `${minutos}m`;
    }
    const horasEnteras = Math.floor(horas);
    const minutos = Math.floor((horas % 1) * 60);
    return `${horasEnteras}h ${minutos}m`;
  }

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
        console.log(`✅ [VDO.Ninja] Sala obtenida: ${data.roomId}`);
        return data;
      } else {
        throw new Error("Error al obtener sala");
      }
    } catch (error) {
      console.error("Error al obtener sala:", error);
      console. error('❌ [VDO.Ninja] Error al obtener sala:', error);
      return null;
    }
  };

  const toggleLive = async () => {
    if (!isLive) {
      // ========== INICIAR TRANSMISIÓN ==========
      try {
        console.log('🔴 [Stream] Iniciando transmisión.. .');
        
        // Asegurar que tenemos la sala
        let salaData = broadcasterUrl ? { broadcasterUrl, viewerUrl, roomId } : await obtenerSalaStreamer();

        if (!salaData) {
          alert('Error al obtener la sala de transmisión');
          return;
        }

        // Notificar al backend que iniciamos
        const resp = await fetch('http://localhost:5000/api/stream/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            streamerName: nombreUsuario,
            title: streamTitle || `Stream de ${nombreUsuario}`,
            category: streamCategory,
          }),
        });

        if (resp.ok) {
          setIsLive(true);

          // Actualizar estado en vivo en la base de datos
          if (idUsuario) {
            await API.ActualizarEnVivo(idUsuario, 'true');
            console.log('✅ [BD] Estado EnVivo actualizado a true');
          }

          emitirStream({ tipo: 'estado', en_vivo: true });
          emitirActividad('🔴 Transmisión iniciada');

          // Abrir ventana del broadcaster
          if (salaData.broadcasterUrl) {
            broadcasterWindowRef.current = window.open(
              salaData.broadcasterUrl,
              'VDO_Broadcaster',
              'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no'
            );
          }

          console.log('✅ [Stream] Transmisión iniciada correctamente');
        }
      } catch (error) {
        console.error('❌ [Stream] Error al iniciar stream:', error);
        alert('Error al iniciar la transmisión');
      }
    } else {
      // ========== DETENER TRANSMISIÓN ==========
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
        console.log('⚫ [Stream] Deteniendo transmisión...');
        
        await fetch('http://localhost:5000/api/stream/stop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ streamerName: nombreUsuario }),
        });

        setIsLive(false);

        // Guardar horas de streaming
        if (idUsuario) {
          const horasSesion = tiempoTransmision / 3600;
          const nuevasHorasTotales = horasTransmitidasTotales + horasSesion;

          await API.ActualizarHorasStreaming(idUsuario, nuevasHorasTotales);
          await API.ActualizarEnVivo(idUsuario, 'false');

          setHorasTransmitidasTotales(nuevasHorasTotales);
          
          console.log(`✅ [BD] Horas guardadas: +${horasSesion.toFixed(2)}h (Total: ${nuevasHorasTotales.toFixed(2)}h)`);
          console.log('✅ [BD] Estado EnVivo actualizado a false');
        }

        setTiempoTransmision(0);
        setEspectadoresActuales(0);
        emitirStream({ tipo: 'estado', en_vivo: false });
        emitirActividad('⚫ Transmisión finalizada');

        // Cerrar ventana del broadcaster
        if (broadcasterWindowRef. current && ! broadcasterWindowRef.current.closed) {
          broadcasterWindowRef.current.close();
        }

        console.log('✅ [Stream] Transmisión detenida correctamente');
      } catch (error) {
        console.error("Error al cargar historial de monedas:", error);
        console.error('❌ [Stream] Error al detener stream:', error);
      }
    }
  };

  // ============================================
  // EFFECTS
  // ============================================

  // Cargar sala al montar componente
  useEffect(() => {
    if (nombreUsuario) {
      obtenerSalaStreamer();
    }
  }, [nombreUsuario]);

  // Cargar datos iniciales al montar
  useEffect(() => {
    if (idUsuario) {
      console.log('🚀 [Dashboard] Cargando datos iniciales...');
      
      // Cargar datos básicos del usuario
      cargarDatosUsuario();
      
      // Cargar conteo de seguidores
      cargarSeguidoresTotales();
      
      // Cargar lista detallada de seguidores
      cargarListaSeguidores();
    }
  }, [idUsuario]);

  // Actualizar espectadores cada 10 segundos cuando está en vivo
  useEffect(() => {
    if (isLive && idUsuario) {
      // Obtener inmediatamente
      obtenerEspectadoresActuales();
      
      // Luego cada 10 segundos
      const interval = setInterval(() => {
        obtenerEspectadoresActuales();
      }, 10000);

      return () => clearInterval(interval);
    } else {
      setEspectadoresActuales(0);
    }
  }, [isLive, idUsuario]);

  // Recargar seguidores cada 30 segundos
  useEffect(() => {
    if (idUsuario) {
      const interval = setInterval(() => {
        cargarSeguidoresTotales();
        cargarListaSeguidores();
      }, 30000); // 30 segundos

      return () => clearInterval(interval);
    }
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
      setActividades((prev) => [nueva, ...prev]. slice(0, 10));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Suscripción a eventos del stream (regalos)
  useEffect(() => {
    const subscription = suscribirStream((datos: any) => {
      if (datos.tipo === "regalo") {
        const ganancia = datos.valor || 0;
        const nuevasMonedas = monedas + ganancia;

        setMonedas(nuevasMonedas);

        // Actualizar monedas en el backend
        if (idUsuario) {
          API.ActualizarMonedas(idUsuario, nuevasMonedas);
          console.log(`💰 [Monedas] Actualizadas: ${nuevasMonedas} (+${ganancia})`);
        }

        // Agregar actividad de monedas
        const actividadRegalo: ActividadMoneda = {
          id: Date.now().toString(),
          text: `💝 Regalo recibido: ${datos.nombre} (+${ganancia} monedas)`,
          time: new Date().toLocaleTimeString(),
          tipo: "moneda",
          tipo: 'moneda',
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
  // ============================================
  // RENDER
  // ============================================

  return (
    <div style={{ padding: 30, color: '#fff', background: '#0e0e10', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
          Dashboard - {nombreUsuario}
        </h1>
        <div style={{ 
          padding: '8px 16px', 
          background: isLive ? '#eb0400' : '#18181b',
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          {isLive ? (
            <>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#fff',
                animation: 'pulse 2s infinite',
              }}></div>
              EN VIVO
            </>
          ) : (
            <>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#555',
              }}></div>
              OFFLINE
            </>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div
        style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 30 }}
      >
        {stats.map((stat, i) => (
          <StatCard key={i} stat={stat} />
        ))}
      </div>

      {/* Configuración del Stream */}
      {! isLive && (
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
            espectadoresActuales={espectadoresActuales}
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
        <FollowersPanel seguidores={seguidores} seguidoresTotales={seguidoresTotales} />
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
