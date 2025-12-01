import React, { useState } from 'react';

const FollowersPanel: React.FC = () => {
  const [showSeguidoresModal, setShowSeguidoresModal] = useState(false);

  return (
    <>
      <div style={{ background: '#18181b', padding: 24, borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>👥 Seguidores</h2>
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
          <p style={{ fontSize: 12, marginTop: 8 }}>Haz click en "Ver todos" para ver la lista completa</p>
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
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 24px',
                borderBottom: '1px solid #2e2e35',
              }}
            >
              <h3 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>👥 Mis Seguidores (1,234)</h3>
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
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px 24px',
              }}
            >
              <div style={{ textAlign: 'center', color: '#adadb8', paddingTop: 60 }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>👥</div>
                <p style={{ fontSize: 16, marginBottom: 8 }}>No hay seguidores aún</p>
                <p style={{ fontSize: 13 }}>Los seguidores que consigas aparecerán aquí</p>
              </div>
            </div>

            {/* Footer del Modal */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid #2e2e35',
                background: '#1a1a1d',
                textAlign: 'center',
                fontSize: 13,
                color: '#adadb8',
              }}
            >
              Conecta con tus seguidores y haz crecer tu comunidad 🚀
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FollowersPanel;