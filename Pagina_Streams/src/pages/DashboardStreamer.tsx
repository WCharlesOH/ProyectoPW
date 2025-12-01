import React, { useEffect, useRef, useState } from 'react';
import { canalActividad, canalStream, emitirActividad, emitirStream } from '../datos/sincronizacion';

interface Stat {
  label: string;
  value: string | number;
  hint?: string;
  color?: string;
}

const StatCard: React.FC<{ stat: Stat }> = ({ stat }) => {
  return (
    <div
      style={{
        flex: '1 1 200px',
        background: '#18181b',
        padding: '20px',
        borderRadius: 8,
        borderLeft: `4px solid ${stat.color || '#00b7ff'}`,
      }}
    >
      <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 8 }}>{stat.label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>{stat.value}</div>
      {stat.hint && <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>{stat.hint}</div>}
    </div>
  );
};

interface DashboardStreamerProps {
  monedas: number;
  setMonedas: React.Dispatch<React.SetStateAction<number>>;
}

const DashboardStreamer: React. FC<DashboardStreamerProps> = ({ monedas, setMonedas }) => {
  const [isLive, setIsLive] = useState(false);
  const [tiempoTransmision, setTiempoTransmision] = useState(0);
  const [actividades, setActividades] = useState<Array<{id: string; text: string; time: string}>>([]);
  const timerRef = useRef<number | null>(null);
  
  // 🎥 Estados para VDO. Ninja
  const [broadcasterUrl, setBroadcasterUrl] = useState<string>("");
  const [viewerUrl, setViewerUrl] = useState<string>("");
  const [showPreviewPopup, setShowPreviewPopup] = useState(false);
  const broadcasterWindowRef = useRef<Window | null>(null);

  const [mostrarPopupRegalos, setMostrarPopupRegalos] = useState(false);

  const stats: Stat[] = [
    { label: 'Espectadores actuales', value: isLive ? '23' : '0', color: '#9147ff' },
    { label: 'Seguidores totales', value: '1,234', color: '#00b7ff' },
    { label: 'Monedas', value: monedas, hint: '💰 Ganadas de regalos', color: '#f59e0b' },
    { label: 'Tiempo transmitido (hoy)', value: formatearTiempo(tiempoTransmision), color: '#10b981' },
  ];

  // 🎥 Cargar URLs de VDO.Ninja al montar el componente
  useEffect(() => {
    const cargarUrlsVDO = async () => {
      try {
        // Obtener URL del broadcaster
        const respBroadcaster = await fetch("http://localhost:5000/api/live-broadcaster");
        if (respBroadcaster.ok) {
          const dataBroadcaster = await respBroadcaster.json();
          setBroadcasterUrl(dataBroadcaster.broadcasterUrl);
        }

        // Obtener URL del viewer
        const respViewer = await fetch("http://localhost:5000/api/live-url");
        if (respViewer.ok) {
          const dataViewer = await respViewer. json();
          setViewerUrl(dataViewer.url);
        }
      } catch (error) {
        console. error("Error al cargar URLs de VDO.Ninja:", error);
      }
    };

    cargarUrlsVDO();
  }, []);

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
      if (timerRef. current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [isLive]);

  // Canal de actividades
  useEffect(() => {
    const handleActividadMessage = (event: MessageEvent) => {
      const mensaje = event.data;
      const nueva = {
        id: Date.now().toString(),
        text: mensaje,
        time: new Date().toLocaleTimeString(),
      };
      setActividades((prev) => [nueva, ...prev].slice(0, 10));
    };

    canalActividad.addEventListener('message', handleActividadMessage);

    return () => {
      canalActividad.removeEventListener('message', handleActividadMessage);
    };
  }, []);

  // Canal de stream para recibir regalos
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const datos = event.data;
      if (datos && datos.tipo === 'regalo') {
        const ganancia = datos.valor || 0;
        setMonedas((prev) => prev + ganancia);
        emitirActividad(`💝 Regalo recibido: ${datos.nombre} (+${ganancia} monedas)`);
      }
    };

    canalStream.addEventListener('message', handleMessage);

    return () => {
      canalStream.removeEventListener('message', handleMessage);
    };
  }, [setMonedas]);

  function formatearTiempo(segundos: number): string {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  const toggleLive = async () => {
    if (! isLive) {
      // Iniciar transmisión
      try {
        const resp = await fetch("http://localhost:5000/api/live", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            streamerName: "NombreStreamer",
            title: "Mi transmisión en vivo" 
          }),
        });

        if (resp.ok) {
          setIsLive(true);
          emitirStream(true);
          emitirActividad('🔴 Transmisión iniciada');
          
          // Mostrar popup con preview
          setShowPreviewPopup(true);
          
          // Abrir ventana del broadcaster
          if (broadcasterUrl) {
            broadcasterWindowRef.current = window.open(
              broadcasterUrl,
              'VDO_Broadcaster',
              'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no'
            );
          }
        }
      } catch (error) {
        console.error("Error al iniciar stream:", error);
      }
    } else {
      // Detener transmisión
      try {
        await fetch("http://localhost:5000/api/live", { method: "DELETE" });
        setIsLive(false);
        setTiempoTransmision(0);
        emitirStream(false);
        emitirActividad('⚫ Transmisión finalizada');
        setShowPreviewPopup(false);
        
        // Cerrar ventana del broadcaster
        if (broadcasterWindowRef.current && ! broadcasterWindowRef.current.closed) {
          broadcasterWindowRef.current.close();
        }
      } catch (error) {
        console.error("Error al detener stream:", error);
      }
    }
  };

  return (
    <div style={{ padding: 30, color: '#fff', background: '#0e0e10', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }}>Dashboard del Streamer</h1>

      {/* Estadísticas */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 30 }}>
        {stats.map((stat, i) => (
          <StatCard key={i} stat={stat} />
        ))}
      </div>

      {/* Controles de Transmisión */}
      <div style={{ 
        background: '#18181b', 
        padding: 24, 
        borderRadius: 8, 
        marginBottom: 30,
        border: isLive ? '2px solid #eb0400' : '2px solid #333'
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
          Control de Transmisión
        </h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={toggleLive}
            style={{
              padding: '12px 24px',
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              background: isLive ? '#eb0400' : '#9147ff',
              color: '#fff',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {isLive ? '⚫ Detener Stream' : '🔴 Iniciar Stream'}
          </button>
          
          {isLive && (
            <>
              <div style={{
                padding: '8px 16px',
                background: '#eb0400',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#fff',
                  animation: 'pulse 2s infinite',
                }}></div>
                EN VIVO
              </div>
              
              <button
                onClick={() => setShowPreviewPopup(true)}
                style={{
                  padding: '12px 24px',
                  fontSize: 14,
                  borderRadius: 6,
                  border: '1px solid #9147ff',
                  cursor: 'pointer',
                  background: 'transparent',
                  color: '#9147ff',
                  fontWeight: 600,
                }}
              >
                👁️ Ver Preview
              </button>
            </>
          )}
        </div>
      </div>

      {/* Popup de Preview del Stream */}
      {showPreviewPopup && isLive && viewerUrl && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setShowPreviewPopup(false)}
        >
          <div
            style={{
              background: '#18181b',
              borderRadius: 12,
              padding: 20,
              maxWidth: '90%',
              maxHeight: '90%',
              width: '1280px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 600 }}>
                🎥 Preview de tu Stream
              </h3>
              <button
                onClick={() => setShowPreviewPopup(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: 24,
                  cursor: 'pointer',
                  padding: '0 10px',
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ 
              width: '100%', 
              height: '720px',
              background: '#000',
              borderRadius: 8,
              overflow: 'hidden',
            }}>
              <iframe
                src={viewerUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                allow="camera; microphone; display-capture"
                title="Stream Preview"
              />
            </div>
            <div style={{ 
              marginTop: 12, 
              fontSize: 13, 
              color: '#adadb8',
              textAlign: 'center' 
            }}>
              Esto es lo que tus espectadores están viendo
            </div>
          </div>
        </div>
      )}

      {/* Actividades Recientes */}
      <div style={{ background: '#18181b', padding: 24, borderRadius: 8 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
          Actividad Reciente
        </h2>
        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          {actividades.length === 0 ? (
            <p style={{ color: '#adadb8', fontSize: 14 }}>
              No hay actividad reciente
            </p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {actividades.map((act) => (
                <li
                  key={act.id}
                  style={{
                    padding: '12px',
                    borderBottom: '1px solid #2e2e35',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: 14 }}>{act.text}</span>
                  <span style={{ fontSize: 12, color: '#adadb8' }}>{act.time}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
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