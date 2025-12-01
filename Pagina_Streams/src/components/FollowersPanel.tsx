import React, { useState } from 'react';

interface Seguidor {
  ID_Viewer: number;
  NombreUsuario: string;
  ImagenPerfil: string;
  NivelViewer: number;
  Habilitado: boolean;
}

interface FollowersPanelProps {
  seguidores: Seguidor[];
  seguidoresTotales: number;
}

const FollowersPanel: React.FC<FollowersPanelProps> = ({ seguidores, seguidoresTotales }) => {
  const [showSeguidoresModal, setShowSeguidoresModal] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  // Filtrar seguidores por búsqueda
  const seguidoresFiltrados = seguidores. filter((seg) =>
    seg.NombreUsuario.toLowerCase().includes(busqueda.toLowerCase())
  );

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
              e.currentTarget.style.background = '#9147ff';
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

        {seguidores.length === 0 ? (
          <div style={{ color: '#adadb8', fontSize: 14, textAlign: 'center', paddingTop: 80 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
            <p>Tus seguidores aparecerán aquí</p>
            <p style={{ fontSize: 12, marginTop: 8 }}>Consigue tus primeros seguidores transmitiendo</p>
          </div>
        ) : (
          <div>
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
              }}
            >
              <div style={{ fontSize: 64, marginBottom: 12, color: '#9147ff' }}>{seguidoresTotales}</div>
              <p style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px 0' }}>Seguidores totales</p>
              <p style={{ fontSize: 13, color: '#adadb8' }}>Haz click en "Ver todos" para ver la lista completa</p>
            </div>

            {/* Preview de últimos 3 seguidores */}
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 12, color: '#adadb8', marginBottom: 12 }}>Últimos seguidores:</p>
              {seguidores.slice(0, 3).map((seg) => (
                <div
                  key={seg.ID_Viewer}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 12px',
                    background: '#0e0e10',
                    borderRadius: 6,
                    marginBottom: 8,
                  }}
                >
                  <img
                    src={seg. ImagenPerfil}
                    alt={seg.NombreUsuario}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{seg.NombreUsuario}</div>
                    <div style={{ fontSize: 11, color: '#adadb8' }}>Nivel {seg.NivelViewer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
              <h3 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
                👥 Mis Seguidores ({seguidoresTotales})
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
                value={busqueda}
                onChange={(e) => setBusqueda(e. target.value)}
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
              {seguidoresFiltrados.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#adadb8', paddingTop: 60 }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
                  <p style={{ fontSize: 16, marginBottom: 8 }}>No se encontraron seguidores</p>
                  <p style={{ fontSize: 13 }}>Intenta con otro término de búsqueda</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {seguidoresFiltrados.map((seg) => (
                    <div
                      key={seg. ID_Viewer}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px',
                        background: seg. Habilitado ? '#0e0e10' : 'rgba(235, 4, 0, 0.05)',
                        borderRadius: 8,
                        border: seg. Habilitado ? 'none' : '1px solid rgba(235, 4, 0, 0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget. style.background = seg.Habilitado
                          ? '#1a1a1d'
                          : 'rgba(235, 4, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = seg.Habilitado
                          ? '#0e0e10'
                          : 'rgba(235, 4, 0, 0.05)';
                      }}
                    >
                      <img
                        src={seg.ImagenPerfil}
                        alt={seg.NombreUsuario}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{seg.NombreUsuario}</div>
                        <div style={{ fontSize: 12, color: '#adadb8' }}>Nivel {seg. NivelViewer} en tu chat</div>
                      </div>
                      {! seg.Habilitado && (
                        <div
                          style={{
                            padding: '4px 8px',
                            background: '#eb0400',
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          Bloqueado
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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