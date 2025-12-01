import React, { useEffect, useRef, useState } from 'react';
import { emitirActividad, emitirStream, suscribirActividad, suscribirStream } from '../datos/sincronizacion';
import { useAuth } from '../components/AuthContext';

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
  
  // Estados para VDO.Ninja
  const [broadcasterUrl, setBroadcasterUrl] = useState<string>("");
  const [viewerUrl, setViewerUrl] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [showStreamPreview, setShowStreamPreview] = useState(false);
  const [streamTitle, setStreamTitle] = useState("");
  const [streamCategory, setStreamCategory] = useState("Just Chatting");
  const broadcasterWindowRef = useRef<Window | null>(null);

  // Usuario actual
  const { user } = useAuth();
  const nombreUsuario = (user as any)?.NombreUsuario || (user as any)?.name || "StreamerPrueba";

  const stats: Stat[] = [
    { label: 'Espectadores actuales', value: isLive ? '23' : '0', color: '#9147ff' },
    { label: 'Seguidores totales', value: '1,234', color: '#00b7ff' },
    { label: 'Monedas', value: monedas, hint: '💰 Ganadas de regalos', color: '#f59e0b' },
    { label: 'Tiempo transmitido', value: formatearTiempo(tiempoTransmision), color: '#10b981' },
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
        setBroadcasterUrl(data. broadcasterUrl);
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

  // Suscripción a actividades
  useEffect(() => {
    const subscription = suscribirActividad((mensaje: string) => {
      const nueva = {
        id: Date.now(). toString(),
        text: mensaje,
        time: new Date().toLocaleTimeString(),
      };
      setActividades((prev) => [nueva, ...prev]. slice(0, 10));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Suscripción a eventos del stream
  useEffect(() => {
    const subscription = suscribirStream((datos: any) => {
      if (datos.tipo === 'regalo') {
        const ganancia = datos.valor || 0;
        setMonedas((prev) => prev + ganancia);
        emitirActividad(`💝 Regalo recibido: ${datos.nombre} (+${ganancia} monedas)`);
      }
    });

    return () => {
      subscription.unsubscribe();
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
      // INICIAR transmisión
      try {
        // Asegurar que tenemos la sala
        let salaData = broadcasterUrl ?  { broadcasterUrl, viewerUrl, roomId } : await obtenerSalaStreamer();
        
        if (!salaData) {
          alert("Error al obtener la sala de transmisión");
          return;
        }

        // Notificar al backend que iniciamos
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

          // Mostrar preview después de 2 segundos
          setTimeout(() => {
            setShowStreamPreview(true);
          }, 2000);
        }
      } catch (error) {
        console.error("Error al iniciar stream:", error);
        alert("Error al iniciar la transmisión");
      }
    } else {
      // DETENER transmisión
      try {
        await fetch("http://localhost:5000/api/stream/stop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ streamerName: nombreUsuario }),
        });

        setIsLive(false);
        setTiempoTransmision(0);
        emitirStream({ tipo: 'estado', en_vivo: false });
        emitirActividad('⚫ Transmisión finalizada');
        setShowStreamPreview(false);
        
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
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }}>
        Dashboard - {nombreUsuario}
      </h1>

      {/* Estadísticas */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 30 }}>
        {stats.map((stat, i) => (
          <StatCard key={i} stat={stat} />
        ))}
      </div>

      {/* Configuración del Stream */}
      {! isLive && (
        <div style={{ 
          background: '#18181b', 
          padding: 24, 
          borderRadius: 8, 
          marginBottom: 20,
          border: '1px solid #333'
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
            ⚙️ Configuración del Stream
          </h2>
          <div style={{ display: 'grid', gap: 16, maxWidth: 600 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                Título del stream
              </label>
              <input
                type="text"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                placeholder={`Stream de ${nombreUsuario}`}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#0e0e10',
                  border: '1px solid #444',
                  borderRadius: 6,
                  color: '#fff',
                  fontSize: 14,
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                Categoría
              </label>
              <select
                value={streamCategory}
                onChange={(e) => setStreamCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#0e0e10',
                  border: '1px solid #444',
                  borderRadius: 6,
                  color: '#fff',
                  fontSize: 14,
                }}
              >
                <option value="Just Chatting">Just Chatting</option>
                <option value="Gaming">Gaming</option>
                <option value="Music">Music</option>
                <option value="Creative">Creative</option>
                <option value="IRL">IRL</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Controles de Transmisión */}
      <div style={{ 
        background: '#18181b', 
        padding: 24, 
        borderRadius: 8, 
        marginBottom: 30,
        border: isLive ? '2px solid #eb0400' : '2px solid #333'
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
          🎥 Control de Transmisión
        </h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={toggleLive}
            style={{
              padding: '14px 28px',
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
                padding: '10px 18px',
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
                onClick={() => setShowStreamPreview(true)}
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

              <div style={{ fontSize: 13, color: '#adadb8', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🆔 {roomId}</span>
              </div>
            </>
          )}
        </div>

        {roomId && (
          <div style={{ marginTop: 16, padding: 12, background: '#0e0e10', borderRadius: 6, fontSize: 13 }}>
            <p style={{ margin: '0 0 8px 0', color: '#adadb8' }}>
              <strong>Viewer URL:</strong>
            </p>
            <code style={{ color: '#9147ff', wordBreak: 'break-all' }}>{viewerUrl}</code>
          </div>
        )}
      </div>

      {/* Ventana Emergente Preview */}
      {showStreamPreview && isLive && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setShowStreamPreview(false)}
        >
          <div
            style={{
              background: '#18181b',
              borderRadius: 12,
              padding: 0,
              maxWidth: '95%',
              maxHeight: '95%',
              width: '1400px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '20px 24px',
              borderBottom: '1px solid #2e2e35'
            }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
                🎥 Preview de tu Stream
              </h3>
              <button
                onClick={() => setShowStreamPreview(false)}
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
              height: '800px',
              background: '#0e0e10',
              position: 'relative',
            }}>
              <iframe
                src={`/perfil/${nombreUsuario}`}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                title="Stream Preview"
              />
            </div>

            <div style={{ 
              padding: '16px 24px', 
              borderTop: '1px solid #2e2e35',
              background: '#1a1a1d'
            }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 13, 
                color: '#adadb8',
              }}>
                <div>
                  Vista de espectador: <strong style={{ color: '#9147ff' }}>/perfil/{nombreUsuario}</strong>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 6,
                    color: '#10b981'
                  }}>
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#10b981',
                      animation: 'pulse 2s infinite',
                    }}></div>
                    Transmitiendo
                  </div>
                  <div>⏱️ {formatearTiempo(tiempoTransmision)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actividades Recientes */}
      <div style={{ background: '#18181b', padding: 24, borderRadius: 8 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
          📋 Actividad Reciente
        </h2>
        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          {actividades.length === 0 ?  (
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