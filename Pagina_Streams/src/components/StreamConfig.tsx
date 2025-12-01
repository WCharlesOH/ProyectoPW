import React from 'react';

interface StreamConfigProps {
  streamTitle: string;
  setStreamTitle: (title: string) => void;
  streamCategory: string;
  setStreamCategory: (category: string) => void;
  nombreUsuario: string;
}

const StreamConfig: React.FC<StreamConfigProps> = ({
  streamTitle,
  setStreamTitle,
  streamCategory,
  setStreamCategory,
  nombreUsuario,
}) => {
  return (
    <div
      style={{
        background: '#18181b',
        padding: 24,
        borderRadius: 8,
        marginBottom: 20,
        border: '1px solid #333',
      }}
    >
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
  );
};

export default StreamConfig;