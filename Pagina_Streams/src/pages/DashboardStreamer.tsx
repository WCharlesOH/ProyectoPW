import React, { useEffect, useRef, useState } from 'react';
import {
  emitirActividad,
  emitirStream,
  canalActividad,
  canalStream,
} from '../datos/sincronizacion';

type Stat = {
  label: string;
  value: string | number;
  hint?: string;
};

const StatCard: React.FC<{ stat: Stat }> = ({ stat }) => {
  return (
    <div style={{ background: '#0f1724', padding: 12, borderRadius: 8, minWidth: 160 }}>
      <div style={{ fontSize: 12, opacity: 0.85 }}>{stat.label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>{stat.value}</div>
      {stat.hint && <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>{stat.hint}</div>}
    </div>
  );
};

interface DashboardStreamerProps {
  monedas: number;
}

const DashboardStreamer: React.FC<DashboardStreamerProps> = ({ monedas }) => {
  // 🔥 Estado del stream sincronizado
  const [isLive, setIsLive] = useState(false);
  const [tiempoTransmision, setTiempoTransmision] = useState(0);
  const [actividades, setActividades] = useState<Array<{id: string; text: string; time: string}>>([]);
  const timerRef = useRef<number | null>(null);

  // 🔥 Datos mock actualizados
  const stats: Stat[] = [
    { label: 'Horas streameadas', value: `${Math.floor(tiempoTransmision / 3600)}h`, hint: 'Tiempo en vivo actual' },
    { label: 'Sesiones este mes', value: 28, hint: 'Streams realizados' },
    { label: 'Viewers promedio', value: 824, hint: 'Últimas 4 semanas' },
    { label: 'Seguidores', value: 24320, hint: '+320 este mes' },
  ];

  const econ = [
    { label: 'Ingresos estimados', value: '$1,240' },
    { label: 'Donaciones', value: '$420' },
    { label: 'Subs nuevas', value: 48 },
  ];

  // 🔥 Sincronización entre pestañas
  useEffect(() => {
    const manejarActividad = (e: MessageEvent) => {
      if (e.data?.tipo === "actividad") {
        const hora = new Date(e.data.fecha).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        setActividades(prev => [
          { id: crypto.randomUUID(), text: e.data.texto, time: hora },
          ...prev.slice(0, 19), // Mantener últimas 20 actividades
        ]);
      }
    };

    const manejarStream = (e: MessageEvent) => {
      if (e.data?.tipo === "stream") {
        setIsLive(e.data.activo);
        if (!e.data.activo && timerRef.current) {
          clearInterval(timerRef.current);
          setTiempoTransmision(0);
        }
      }
    };

    canalActividad.addEventListener("message", manejarActividad);
    canalStream.addEventListener("message", manejarStream);

    return () => {
      canalActividad.removeEventListener("message", manejarActividad);
      canalStream.removeEventListener("message", manejarStream);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // 🔥 Función para iniciar/detener transmisión
  const toggleTransmision = () => {
  if (isLive) {
    // Detener transmisión
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    emitirActividad("🟥 Transmisión detenida", "stream", { duracion: tiempoTransmision });
    emitirStream(false);
    setTiempoTransmision(0);
  } else {
    // Iniciar transmisión
    emitirActividad("🟢 Transmisión iniciada", "stream");
    emitirStream(true, Date.now());
    
    timerRef.current = setInterval(() => {
      setTiempoTransmision(prev => prev + 1);
    }, 1000);

    // 🔥 Abrir nueva pestaña con LiveStart
    window.open('/live-start', '_blank', 'width=800,height=600');
  }
    setIsLive(!isLive);
  };

  // 🔥 Función para abrir gestión de regalos en nueva pestaña
  const abrirGestionRegalos = () => {
    const ventanaRegalos = window.open('/gestion-regalos', '_blank', 'width=600,height=700');
    
    // Enviar datos iniciales a la nueva ventana
    setTimeout(() => {
      if (ventanaRegalos) {
        emitirActividad("🎁 Gestión de regalos abierta", "regalo");
      }
    }, 1000);
  };

  // 🔥 Formatear tiempo de transmisión
  const formatearTiempo = (segundos: number) => {
    const h = String(Math.floor(segundos / 3600)).padStart(2, "0");
    const m = String(Math.floor((segundos % 3600) / 60)).padStart(2, "0");
    const s = String(segundos % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div style={{ padding: 20, color: 'white' }}>
      {/* 🔥 Header con controles de transmisión */}
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
              : "⏸️ Sin transmisión"
            }
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {/* 🔥 Botón Iniciar/Detener Live */}
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

          {/* 🔥 Botón Gestión de Regalos */}
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

      {/* Estadísticas */}
      <section style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        {stats.map((s) => (
          <StatCard key={s.label} stat={s} />
        ))}
      </section>

      {/* Contenido principal */}
      <section style={{ display: 'flex', gap: 20, marginTop: 30, flexWrap: 'wrap' }}>
        {/* Actividad reciente Sincronizada */}
        <div style={{ flex: 1, minWidth: 300, background: '#071029', padding: 16, borderRadius: 8 }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Actividad Reciente Sincronizada</h3>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {actividades.map((actividad) => (
              <div 
                key={actividad.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  background: 'rgba(255,255,255,0.02)', 
                  padding: 12, 
                  borderRadius: 6,
                  marginBottom: 8,
                  borderLeft: `3px solid ${
                    actividad.text.includes('🟢') ? '#00b7ff' : 
                    actividad.text.includes('🟥') ? '#ef4444' :
                    actividad.text.includes('🎁') ? '#9147ff' :
                    actividad.text.includes('💬') ? '#00b7ff' : '#333'
                  }`
                }}
              >
                <div style={{ flex: 1 }}>{actividad.text}</div>
                <div style={{ opacity: 0.7, fontSize: '12px', minWidth: 50, textAlign: 'right' }}>
                  {actividad.time}
                </div>
              </div>
            ))}
            {actividades.length === 0 && (
              <div style={{ textAlign: 'center', opacity: 0.5, padding: 40 }}>
                No hay actividad reciente. Las actividades se sincronizarán entre pestañas.
              </div>
            )}
          </div>
        </div>

        {/* Economía */}
        <div style={{ width: 340, minWidth: 260, background: '#071029', padding: 16, borderRadius: 8 }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Economía</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {econ.map((e) => (
              <div key={e.label} style={{ background: '#0b1830', padding: 12, borderRadius: 6 }}>
                <div style={{ fontSize: 12, opacity: 0.85 }}>{e.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>{e.value}</div>
              </div>
            ))}
            {/* Monedas actuales */}
            <div style={{ background: '#0b1830', padding: 12, borderRadius: 6 }}>
              <div style={{ fontSize: 12, opacity: 0.85 }}>Monedas Actuales</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>🪙 {monedas}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardStreamer;