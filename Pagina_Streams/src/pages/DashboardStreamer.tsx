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

const DashboardStreamer: React.FC<DashboardStreamerProps> = ({ monedas, setMonedas }) => {
  const [isLive, setIsLive] = useState(false);
  const [tiempoTransmision, setTiempoTransmision] = useState(0);
  const [actividades, setActividades] = useState<Array<{id: string; text: string; time: string}>>([]);
  const timerRef = useRef<number | null>(null);
  
  // 🎥 Estados para VDO. Ninja
  const [broadcasterUrl, setBroadcasterUrl] = useState<string>("");
  const [viewerUrl, setViewerUrl] = useState<string>("");
  const [showStream, setShowStream] = useState(false);
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
          const dataViewer = await respViewer.json();
          setViewerUrl(dataViewer.url);
        }
      } catch (error) {
        console.error("Error cargando URLs de VDO.Ninja:", error);
      }
    };

    cargarUrlsVDO();
  }, []);

  useEffect(() => {
    const manejarActividad = (e: MessageEvent) => {
      if (e.data?. tipo === 'actividad') {
        const hora = new Date(e.data. fecha).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        setActividades(prev => [
          { id: crypto.randomUUID(), text: e.data.texto, time: hora },
          ...prev. slice(0, 19),
        ]);
      }
    };

    const manejarStream = (e: MessageEvent) => {
      if (e.data?.tipo === 'stream') {
        setIsLive(e.data.activo);
        if (! e.data.activo && timerRef.current) {
          clearInterval(timerRef. current);
          setTiempoTransmision(0);
        }
      }
    };

    canalActividad.addEventListener('message', manejarActividad);
    canalStream.addEventListener('message', manejarStream);

    return () => {
      canalActividad.removeEventListener('message', manejarActividad);
      canalStream.removeEventListener('message', manejarStream);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const toggleTransmision = () => {
    if (isLive) {
      // 🛑 Detener transmisión
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Cerrar ventana del broadcaster si está abierta
      if (broadcasterWindowRef.current && ! broadcasterWindowRef.current.closed) {
        broadcasterWindowRef.current.close();
        broadcasterWindowRef.current = null;
      }
      
      setIsLive(false);
      setShowStream(false);
      setTiempoTransmision(0);
      emitirStream(false);
      emitirActividad('🟥 Transmisión detenida', 'stream');
    } else {
      // 🔴 Iniciar transmisión
      setIsLive(true);
      setShowStream(true);
      timerRef.current = window.setInterval(() => {
        setTiempoTransmision((prev) => prev + 1);
      }, 1000);
      emitirStream(true, Date.now());
      emitirActividad('🟢 Transmisión iniciada', 'stream');
      
      // 🎥 Abrir ventana del broadcaster
      if (broadcasterUrl) {
        broadcasterWindowRef.current = window.open(
          broadcasterUrl,
          'VDO_Ninja_Broadcaster',
          'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no'
        );
      }
    }
  };

  const abrirGestionRegalos = () => {
    setMostrarPopupRegalos(true);
  };

  const cerrarGestionRegalos = () => {
    setMostrarPopupRegalos(false);
  };

  function formatearTiempo(segundos: number): string {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0e0e10',
        color: 'white',
        padding: 20,
        marginLeft: 250,
        transition: 'margin-left 0.3s ease',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        background: '#0f1724',
        padding: 20,
        borderRadius: 8
      }}>
        <div>
          <h1 style={{ margin: 0 }}>Dashboard del Streamer</h1>
          <p style={{ marginTop: 6, opacity: 0.8 }}>
            {isLive
              ? `🔴 EN VIVO - ${formatearTiempo(tiempoTransmision)}`
              : '⏸️ Sin transmisión'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={toggleTransmision}
            style={{
              background: isLive ? '#ef4444' : '#00b7ff',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              minWidth: 140
            }}
          >
            {isLive ? '⏹️ Detener Live' : '🔴 Iniciar Live'}
          </button>

          <button
            onClick={abrirGestionRegalos}
            style={{
              background: '#9147ff',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              minWidth: 160
            }}
          >
            🎁 Gestión de Regalos
          </button>
        </div>
      </div>

      {/* 🎥 PREVIEW DEL STREAM (solo si está en vivo) */}
      {isLive && showStream && viewerUrl && (
        <div style={{ marginBottom: 30 }}>
          <div style={{
            background: '#18181b',
            padding: 20,
            borderRadius: 8,
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 15 
            }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>📺 Vista previa de tu transmisión</h2>
              <div style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #ef4444',
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 'bold',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <span style={{
                  width: 8,
                  height: 8,
                  background: '#ef4444',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }} />
                EN VIVO
              </div>
            </div>
            
            <div style={{
              background: '#000',
              borderRadius: 10,
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
            }}>
              <iframe
                src={viewerUrl}
                style={{
                  width: '100%',
                  height: '500px',
                  border: 'none',
                  display: 'block'
                }}
                allow="camera; microphone; autoplay; fullscreen; picture-in-picture; display-capture"
                allowFullScreen
                title="Stream Preview"
              />
              <div style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'rgba(0, 183, 255, 0.9)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 'bold'
              }}>
                VDO.Ninja
              </div>
            </div>

            <p style={{ 
              marginTop: 15, 
              fontSize: 14, 
              opacity: 0.7,
              textAlign: 'center' 
            }}>
              💡 Esto es lo que tus espectadores están viendo en este momento
            </p>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <section style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        {stats.map((s) => (
          <StatCard key={s.label} stat={s} />
        ))}
      </section>

      {/* Actividades + Economía */}
      <section style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <div style={{ flex: 1, background: '#18181b', padding: 20, borderRadius: 8 }}>
          <h2 style={{ marginBottom: 12 }}>📋 Actividad reciente</h2>
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {actividades.length === 0 && (
              <p style={{ opacity: 0.5, textAlign: 'center' }}>Sin actividad aún. </p>
            )}
            {actividades.map(act => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  background: 'rgba(255,255,255,0.02)',
                  padding: 8,
                  marginBottom: 6,
                  borderRadius: 6,
                }}
              >
                <span>{act.text}</span>
                <span style={{ opacity: 0.6, fontSize: 12 }}>{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, background: '#18181b', padding: 20, borderRadius: 8 }}>
          <h2 style={{ marginBottom: 12 }}>💰 Economía</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ padding: 12, background: 'rgba(245,158,11,0.1)', borderRadius: 6 }}>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Monedas actuales</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#f59e0b' }}>{monedas}</div>
            </div>
            <div style={{ padding: 12, background: 'rgba(16,185,129,0.1)', borderRadius: 6 }}>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Ganadas hoy</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#10b981' }}>+150</div>
            </div>
            <button
              style={{
                background: '#9147ff',
                border: 'none',
                color: 'white',
                padding: 10,
                borderRadius: 6,
                cursor: 'pointer',
                marginTop: 10,
              }}
              onClick={() => alert('Próximamente: Canjear monedas')}
            >
              Canjear monedas
            </button>
          </div>
        </div>
      </section>

      {/* Popup de gestión de regalos */}
      {mostrarPopupRegalos && (
        <div
          onClick={cerrarGestionRegalos}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#18181b',
              padding: 30,
              borderRadius: 12,
              width: '90%',
              maxWidth: 600,
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <h2 style={{ marginTop: 0 }}>🎁 Gestión de Regalos</h2>
            <p style={{ opacity: 0.7 }}>
              Aquí puedes configurar los regalos que tus espectadores pueden enviarte. 
            </p>
            <button
              onClick={cerrarGestionRegalos}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 6,
                cursor: 'pointer',
                marginTop: 20,
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Estilos para la animación */}
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
};

export default DashboardStreamer;