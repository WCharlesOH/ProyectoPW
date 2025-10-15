import React from 'react';
import PaginaStreamer from './PaginaStreamer'; // ajusta la ruta si está en otra carpeta

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

const DashboardStreamer: React.FC = () => {
  // Datos mock — reemplazar con llamadas reales según tu API
  const stats: Stat[] = [
    { label: 'Horas streameadas', value: 412, hint: 'Total desde inicio' },
    { label: 'Sesiones este mes', value: 28, hint: 'Streams realizados' },
    { label: 'Viewers promedio', value: 824, hint: 'Últimas 4 semanas' },
    { label: 'Seguidores', value: 24320, hint: '+320 este mes' },
  ];

  const econ = [
    { label: 'Ingresos estimados', value: '$1,240' },
    { label: 'Donaciones', value: '$420' },
    { label: 'Subs nuevas', value: 48 },
  ];

  const recent = [
    { id: 1, text: 'Nuevo seguidor: usuario_juan', time: '2m' },
    { id: 2, text: 'Donación: $5 - gracias!', time: '12m' },
    { id: 3, text: 'Clip creado por maria', time: '1h' },
  ];

  return (


    
    <div 
    style={{ padding: 20, color: 'white' }}>
      <div style={{ marginTop: 40 }}>
          <PaginaStreamer />
      </div>

      <h1 style={{ margin: 0 }}>Dashboard del streamer</h1>
      <p style={{ marginTop: 6, opacity: 0.8 }}>Resumen de actividad y métricas clave</p>

      <section style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        {stats.map((s) => (
          <StatCard key={s.label} stat={s} />
        ))}
      </section>

      <section style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 300, background: '#071029', padding: 12, borderRadius: 8 }}>
          <h3 style={{ margin: 0 }}>Actividad reciente</h3>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recent.map((r) => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: 8, borderRadius: 6 }}>
                <div>{r.text}</div>
                <div style={{ opacity: 0.7 }}>{r.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ width: 340, minWidth: 260, background: '#071029', padding: 12, borderRadius: 8 }}>
          <h3 style={{ margin: 0 }}>Economía</h3>
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {econ.map((e) => (
              <div key={e.label} style={{ background: '#0b1830', padding: 10, borderRadius: 6 }}>
                <div style={{ fontSize: 12, opacity: 0.85 }}>{e.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>{e.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardStreamer;
