import React from 'react';

interface StreamControlsProps {
  isLive: boolean;
  toggleLive: () => void;
  tiempoTransmision: number;
  roomId: string;
  viewerUrl: string;
}

const StreamControls: React. FC<StreamControlsProps> = ({
  isLive,
  toggleLive,
  tiempoTransmision,
  roomId,
  viewerUrl,
}) => {
  function formatearTiempo(segundos: number): string {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  return (
    <>
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
            e. currentTarget.style.transform = 'scale(1)';
          }}
        >
          {isLive ? '⚫ Detener Stream' : '🔴 Iniciar Stream'}
        </button>

        {isLive && (
          <>
            <div
              style={{
                padding: '10px 18px',
                background: '#eb0400',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#fff',
                  animation: 'pulse 2s infinite',
                }}
              ></div>
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

      {roomId && ! isLive && (
        <div style={{ marginTop: 16, padding: 12, background: '#0e0e10', borderRadius: 6, fontSize: 13 }}>
          <p style={{ margin: '0 0 8px 0', color: '#adadb8' }}>
            <strong>Viewer URL:</strong>
          </p>
          <code style={{ color: '#9147ff', wordBreak: 'break-all' }}>{viewerUrl}</code>
        </div>
      )}
    </>
  );
};

export default StreamControls;