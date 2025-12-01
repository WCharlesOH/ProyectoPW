import React from 'react';

export interface ActividadMoneda {
  id: string;
  text: string;
  time: string;
  tipo: 'moneda' | 'normal';
  cantidad?: number;
}

interface ActivityPanelProps {
  actividades: ActividadMoneda[];
  monedas: number;
}

const ActivityPanel: React.FC<ActivityPanelProps> = ({ actividades, monedas }) => {
  return (
    <div style={{ background: '#18181b', padding: 24, borderRadius: 8 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>📋 Actividad Reciente</h2>
      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        {actividades.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: '#adadb8',
              fontSize: 14,
              padding: '40px 20px',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>💰</div>
            <p>No hay actividad reciente</p>
            <p style={{ fontSize: 12, marginTop: 8 }}>Los regalos y transacciones aparecerán aquí</p>
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
                  <span style={{ fontSize: 14, fontWeight: act.tipo === 'moneda' ? 600 : 400 }}>{act.text}</span>
                  {act.cantidad !== undefined && (
                    <div
                      style={{
                        fontSize: 12,
                        color: '#10b981',
                        marginTop: 4,
                        fontWeight: 600,
                      }}
                    >
                      +{act.cantidad} 💰
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 12, color: '#adadb8', marginLeft: 12 }}>{act.time}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Resumen de monedas */}
      <div
        style={{
          marginTop: 16,
          padding: '16px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
          borderRadius: 8,
          border: '1px solid rgba(245, 158, 11, 0.3)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, color: '#adadb8', marginBottom: 4 }}>Total de monedas</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}>{monedas} 💰</div>
          </div>
          <div
            style={{
              fontSize: 40,
              opacity: 0.3,
            }}
          >
            💰
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPanel;