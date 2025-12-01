import React, { useEffect, useRef, useState } from 'react';
import { emitirActividad, emitirStream, suscribirActividad, suscribirStream } from '../datos/sincronizacion';
import { useAuth } from '../components/AuthContext';
import ChatBox from '../components/ChatBox';
import LivePlayer from '../components/LivePlayer';
import { API } from '../Comandosllamadas/llamadas';

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

interface ActividadMoneda {
  id: string;
  text: string;
  time: string;
  tipo: 'moneda' | 'normal';
  cantidad?: number;
}

const DashboardStreamer: React. FC<DashboardStreamerProps> = ({ monedas, setMonedas }) => {
  const [isLive, setIsLive] = useState(false);
  const [tiempoTransmision, setTiempoTransmision] = useState(0);
  const [actividades, setActividades] = useState<ActividadMoneda[]>([]);
  const [showSeguidoresModal, setShowSeguidoresModal] = useState(false);
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
  const nombreUsuario = (user as any)?.NombreUsuario || (user as any)?.name || "StreamerPrueba";
  const idUsuario = (user as any)?.ID;

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

  // Cargar historial de monedas al montar
  useEffect(() => {
    const cargarHistorialMonedas = async () => {
      if (! idUsuario) return;

      try {
        // Obtener datos actualizados del usuario
        const result = await API.ObtenerDatosUsuario(idUsuario);
        
        if (result.success && result.user) {
          // Actualizar monedas desde el backend
          const monedasActuales = result.user. Monedas || 0;
          setMonedas(monedasActuales);

          // Agregar actividad de carga inicial
          const actividadInicial: ActividadMoneda = {
            id: Date.now().toString(),
            text: `💰 Saldo actual: ${monedasActuales} monedas`,
            time: new Date().toLocaleTimeString(),
            tipo: 'moneda',
            cantidad: monedasActuales,
          };
          setActividades(prev => [actividadInicial, ...prev]. slice(0, 10));
        }
      } catch (error) {
        console. error("Error al cargar historial de monedas:", error);
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
      if (timerRef. current !== null) {
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
        tipo: mensaje.includes('💰') || mensaje.includes('💝') ? 'moneda' : 'normal',
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
      if (datos.tipo === 'regalo') {
        const ganancia = datos.valor || 0;
        const nuevasMonedas = monedas + ganancia;
        
        setMonedas(nuevasMonedas);

        // Actualizar monedas en el backend
        if (idUsuario) {
          API.ActualizarMonedas(idUsuario, nuevasMonedas);
        }

        // Agregar actividad de monedas
        const actividadRegalo: ActividadMoneda = {
          id: Date.now().toString(),
          text: `💝 Regalo recibido: ${datos.nombre} (+${ganancia} monedas)`,
          time: new Date(). toLocaleTimeString(),
          tipo: 'moneda',
          cantidad: ganancia,
        };
        
        setActividades((prev) => [actividadRegalo, ... prev].slice(0, 10));
        emitirActividad(`💝 Regalo recibido: ${datos.nombre} (+${ganancia} monedas)`);
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
          
          // Actualizar estado en vivo en el backend
          if (idUsuario) {
            await API.ActualizarEnVivo(idUsuario, "true");
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
        
        // Guardar horas de streaming
        if (idUsuario) {
          const horasTransmitidas = tiempoTransmision / 3600; // Convertir segundos a horas
          await API.ActualizarHorasStreaming(idUsuario, horasTransmitidas);
          await API.ActualizarEnVivo(idUsuario, "false");
        }

        setTiempoTransmision(0);
        emitirStream({ tipo: 'estado', en_vivo: false });
        emitirActividad('⚫ Transmisión finalizada');
        
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
        {stats. map((stat, i) => (
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
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
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

              <div style={{ fontSize: 13, color: '#adadb8', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⏱️ {formatearTiempo(tiempoTransmision)}</span>
                <span>•</span>
                <span>🆔 {roomId}</span>
              </div>
            </>
          )}
        </div>

        {/* Preview del Stream Integrado */}
        {isLive && (
          <div style={{ 
            marginTop: 24,
            border: '2px solid #eb0400',
            borderRadius: 12,
            overflow: 'hidden',
            background: '#0e0e10',
          }}>
            {/* Header del Preview */}
            <div style={{ 
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #eb0400 0%, #9147ff 100%)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#fff',
                  animation: 'pulse 2s infinite',
                }}></div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
                  🎥 Preview de tu Transmisión
                </h3>
              </div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>
                Vista en tiempo real
              </div>
            </div>

            {/* Contenedor del Stream y Chat */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 350px',
              gap: 0,
              background: '#0e0e10',
              minHeight: '600px',
            }}>
              {/* Video Player */}
              <div style={{ 
                background: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}>
                <LivePlayer 
                  streamerName={nombreUsuario}
                  autoRefresh={true}
                  refreshInterval={5000}
                />
                
                {/* Overlay de información */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '16px 20px',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                      {streamTitle || `Stream de ${nombreUsuario}`}
                    </div>
                    <div style={{ fontSize: 12, color: '#adadb8' }}>
                      {streamCategory}
                    </div>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    gap: 12,
                    fontSize: 13,
                    color: '#fff',
                    background: 'rgba(0,0,0,0.6)',
                    padding: '8px 12px',
                    borderRadius: 6,
                  }}>
                    <span>👁️ 23 espectadores</span>
                  </div>
                </div>
              </div>

              {/* ChatBox Integrado */}
              <div style={{ 
                borderLeft: '1px solid #2e2e35',
                background: '#18181b',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #2e2e35',
                  background: '#1a1a1d',
                  fontSize: 14,
                  fontWeight: 600,
                }}>
                  💬 Chat en Vivo
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <ChatBox 
                    monedas={monedas}
                    setMonedas={setMonedas}
                    streamerName={nombreUsuario}
                    roomId={roomId}
                  />
                </div>
              </div>
            </div>

            {/* Footer del Preview */}
            <div style={{ 
              padding: '12px 20px', 
              borderTop: '1px solid #2e2e35',
              background: '#1a1a1d',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 12,
              color: '#adadb8',
            }}>
              <div>
                📺 Vista previa - Así ven tu stream los espectadores en <strong style={{ color: '#9147ff' }}>/perfil/{nombreUsuario}</strong>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span>🔗 Room ID: {roomId}</span>
              </div>
            </div>
          </div>
        )}

        {roomId && ! isLive && (
          <div style={{ marginTop: 16, padding: 12, background: '#0e0e10', borderRadius: 6, fontSize: 13 }}>
            <p style={{ margin: '0 0 8px 0', color: '#adadb8' }}>
              <strong>Viewer URL:</strong>
            </p>
            <code style={{ color: '#9147ff', wordBreak: 'break-all' }}>{viewerUrl}</code>
          </div>
        )}
      </div>

      {/* Grid con Actividades y Seguidores */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 30 }}>
        {/* Actividades Recientes - Ahora con historial de monedas */}
        <div style={{ background: '#18181b', padding: 24, borderRadius: 8 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
            📋 Actividad Reciente
          </h2>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {actividades.length === 0 ?  (
              <div style={{ 
                textAlign: 'center', 
                color: '#adadb8', 
                fontSize: 14,
                padding: '40px 20px'
              }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>💰</div>
                <p>No hay actividad reciente</p>
                <p style={{ fontSize: 12, marginTop: 8 }}>
                  Los regalos y transacciones aparecerán aquí
                </p>
              </div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {actividades.map((act) => (
                  <li
                    key={act.id}
                    style={{
                      padding: '14px 12px',
                      borderBottom: '1px solid #2e2e35',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: act.tipo === 'moneda' ? 'rgba(245, 158, 11, 0.05)' : 'transparent',
                      borderLeft: act.tipo === 'moneda' ? '3px solid #f59e0b' : 'none',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 14, fontWeight: act.tipo === 'moneda' ? 600 : 400 }}>
                        {act.text}
                      </span>
                      {act.cantidad !== undefined && (
                        <div style={{ 
                          fontSize: 12, 
                          color: '#10b981', 
                          marginTop: 4,
                          fontWeight: 600,
                        }}>
                          +{act.cantidad} 💰
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: 12, color: '#adadb8', marginLeft: 12 }}>
                      {act.time}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Resumen de monedas */}
          <div style={{ 
            marginTop: 16,
            padding: '16px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
            borderRadius: 8,
            border: '1px solid rgba(245, 158, 11, 0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, color: '#adadb8', marginBottom: 4 }}>
                  Total de monedas
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}>
                  {monedas} 💰
                </div>
              </div>
              <div style={{ 
                fontSize: 40,
                opacity: 0.3,
              }}>
                💰
              </div>
            </div>
          </div>
        </div>

        {/* Seguidores */}
        <div style={{ background: '#18181b', padding: 24, borderRadius: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
              👥 Seguidores
            </h2>
            <button
              onClick={() => setShowSeguidoresModal(true)}
              style={{
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 6,
                border: '1px solid #9147ff',
                cursor: 'pointer',
                background: 'transparent',
                color: '#9147ff',
                transition: 'all 0. 2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget. style.background = '#9147ff';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style. background = 'transparent';
                e.currentTarget.style.color = '#9147ff';
              }}
            >
              Ver todos
            </button>
          </div>
          <div style={{ color: '#adadb8', fontSize: 14, textAlign: 'center', paddingTop: 80 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
            <p>Tus seguidores aparecerán aquí</p>
            <p style={{ fontSize: 12, marginTop: 8 }}>
              Haz click en "Ver todos" para ver la lista completa
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Seguidores */}
      {showSeguidoresModal && (
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
            zIndex: 10000,
          }}
          onClick={() => setShowSeguidoresModal(false)}
        >
          <div
            style={{
              background: '#18181b',
              borderRadius: 12,
              padding: 0,
              width: '90%',
              maxWidth: '700px',
              maxHeight: '80vh',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '20px 24px',
              borderBottom: '1px solid #2e2e35'
            }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
                👥 Mis Seguidores (1,234)
              </h3>
              <button
                onClick={() => setShowSeguidoresModal(false)}
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

            {/* Buscador */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #2e2e35' }}>
              <input
                type="text"
                placeholder="Buscar seguidor..."
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

            {/* Lista de Seguidores */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              padding: '16px 24px',
            }}>
              <div style={{ textAlign: 'center', color: '#adadb8', paddingTop: 60 }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>👥</div>
                <p style={{ fontSize: 16, marginBottom: 8 }}>No hay seguidores aún</p>
                <p style={{ fontSize: 13 }}>
                  Los seguidores que consigas aparecerán aquí
                </p>
              </div>
            </div>

            {/* Footer del Modal */}
            <div style={{ 
              padding: '16px 24px', 
              borderTop: '1px solid #2e2e35',
              background: '#1a1a1d',
              textAlign: 'center',
              fontSize: 13,
              color: '#adadb8'
            }}>
              Conecta con tus seguidores y haz crecer tu comunidad 🚀
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0. 3;
            }
          }
        `}
      </style>
    </div>
  );
};

export default DashboardStreamer;