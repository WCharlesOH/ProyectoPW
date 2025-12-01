import React from 'react';
import ChatBox from './ChatBox';
import LivePlayer from './LivePlayer';

interface StreamPreviewProps {
  nombreUsuario: string;
  streamTitle: string;
  streamCategory: string;
  roomId: string;
  monedas: number;
  setMonedas: React.Dispatch<React.SetStateAction<number>>;
  espectadoresActuales?: number; // Nuevo prop
}

const StreamPreview: React.FC<StreamPreviewProps> = ({
  nombreUsuario,
  streamTitle,
  streamCategory,
  roomId,
  monedas,
  setMonedas,
  espectadoresActuales = 0, // Valor por defecto
}) => {
  return (
    <div
      style={{
        marginTop: 24,
        border: '2px solid #eb0400',
        borderRadius: 12,
        overflow: 'hidden',
        background: '#0e0e10',
      }}
    >
      {/* Header del Preview */}
      <div
        style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #eb0400 0%, #9147ff 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#fff',
              animation: 'pulse 2s infinite',
            }}
          ></div>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>🎥 Preview de tu Transmisión</h3>
        </div>
        <div style={{ fontSize: 13, opacity: 0.9 }}>Vista en tiempo real</div>
      </div>

      {/* Contenedor del Stream y Chat */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 350px',
          gap: 0,
          background: '#0e0e10',
          minHeight: '600px',
        }}
      >
        {/* Video Player */}
        <div
          style={{
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <LivePlayer streamerName={nombreUsuario} autoRefresh={true} refreshInterval={5000} />

          {/* Overlay de información */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px 20px',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                {streamTitle || `Stream de ${nombreUsuario}`}
              </div>
              <div style={{ fontSize: 12, color: '#adadb8' }}>{streamCategory}</div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 12,
                fontSize: 13,
                color: '#fff',
                background: 'rgba(0,0,0,0.6)',
                padding: '8px 12px',
                borderRadius: 6,
              }}
            >
              <span>👁️ {espectadoresActuales} {espectadoresActuales === 1 ? 'espectador' : 'espectadores'}</span>
            </div>
          </div>
        </div>

        {/* ChatBox Integrado */}
        <div
          style={{
            borderLeft: '1px solid #2e2e35',
            background: '#18181b',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #2e2e35',
              background: '#1a1a1d',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            💬 Chat en Vivo
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <ChatBox monedas={monedas} setMonedas={setMonedas} streamerName={nombreUsuario} roomId={roomId} />
          </div>
        </div>
      </div>

      {/* Footer del Preview */}
      <div
        style={{
          padding: '12px 20px',
          borderTop: '1px solid #2e2e35',
          background: '#1a1a1d',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
          color: '#adadb8',
        }}
      >
        <div>
          📺 Vista previa - Así ven tu stream los espectadores en{' '}
          <strong style={{ color: '#9147ff' }}>/perfil/{nombreUsuario}</strong>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span>🔗 Room ID: {roomId}</span>
        </div>
      </div>
    </div>
  );
};

export default StreamPreview;