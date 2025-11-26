import React, { useState } from 'react';
import { emitirActividad } from '../datos/sincronizacion';

type Regalo = {
  id: string;
  nombre: string;
  costo: number;
  icono: string;
  descripcion: string;
};

const GestionRegalos: React.FC = () => {
  const [regalos, setRegalos] = useState<Regalo[]>(() => {
    const guardados = localStorage.getItem('regalosGlobales');
    return guardados ? JSON.parse(guardados) : [
      { id: "r1", nombre: "Corazón", costo: 10, icono: "❤️", descripcion: "Envía amor al streamer" },
      { id: "r2", nombre: "Rayo", costo: 50, icono: "⚡", descripcion: "Energiza el stream" },
      { id: "r3", nombre: "Trofeo", costo: 100, icono: "🏆", descripcion: "Reconoce su esfuerzo" },
      { id: "r4", nombre: "Cohete", costo: 200, icono: "🚀", descripcion: "Impulsa el canal" },
    ];
  });

  const [nuevoRegalo, setNuevoRegalo] = useState({
    nombre: '',
    costo: 0,
    icono: '🎁',
    descripcion: ''
  });

  const [regaloEditando, setRegaloEditando] = useState<Regalo | null>(null);

  const iconosDisponibles = ["❤️", "⚡", "🏆", "🚀", "🎁", "⭐", "🎯", "💎", "👑", "🔥"];

  const guardarRegalos = (nuevosRegalos: Regalo[]) => {
    setRegalos(nuevosRegalos);
    localStorage.setItem('regalosGlobales', JSON.stringify(nuevosRegalos));
    emitirActividad("🔄 Lista de regalos actualizada", "regalo");
  };

  const agregarRegalo = () => {
    if (!nuevoRegalo.nombre || nuevoRegalo.costo <= 0) {
      alert('Completa nombre y costo válido');
      return;
    }

    const regaloCompleto: Regalo = {
      id: `r${Date.now()}`,
      nombre: nuevoRegalo.nombre,
      costo: nuevoRegalo.costo,
      icono: nuevoRegalo.icono,
      descripcion: nuevoRegalo.descripcion || 'Nuevo regalo especial'
    };

    guardarRegalos([...regalos, regaloCompleto]);

    setNuevoRegalo({ nombre: '', costo: 0, icono: '🎁', descripcion: '' });
  };

  const eliminarRegalo = (id: string) => {
    if (window.confirm('¿Eliminar este regalo?')) {
      guardarRegalos(regalos.filter(r => r.id !== id));
    }
  };

  const guardarEdicion = () => {
    if (!regaloEditando) return;

    const actualizados = regalos.map(r =>
      r.id === regaloEditando.id ? regaloEditando : r
    );

    guardarRegalos(actualizados);
    setRegaloEditando(null);
  };

  return (
    <div style={{ padding: 20, color: 'white', background: '#0e0e10', minHeight: '100vh' }}>
      <h1>🎁 Gestión de Regalos</h1>
      <p style={{ opacity: 0.8 }}>Modifica los regalos disponibles</p>

      {/* AGREGAR NUEVO */}
      <div style={{ background: '#1f1f23', padding: 15, borderRadius: 8, marginBottom: 20 }}>
        <h3>Agregar Nuevo Regalo</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <input
            placeholder="Nombre"
            value={nuevoRegalo.nombre}
            onChange={(e) => setNuevoRegalo({ ...nuevoRegalo, nombre: e.target.value })}
            style={{ padding: 8, background: '#0e0e10', border: '1px solid #333', color: 'white', borderRadius: 4 }}
          />
          <input
            type="number"
            placeholder="Costo"
            value={nuevoRegalo.costo}
            onChange={(e) => setNuevoRegalo({ ...nuevoRegalo, costo: parseInt(e.target.value) || 0 })}
            style={{ padding: 8, background: '#0e0e10', border: '1px solid #333', color: 'white', borderRadius: 4 }}
          />
          <select
            value={nuevoRegalo.icono}
            onChange={(e) => setNuevoRegalo({ ...nuevoRegalo, icono: e.target.value })}
            style={{ padding: 8, background: '#0e0e10', border: '1px solid #333', color: 'white', borderRadius: 4 }}
          >
            {iconosDisponibles.map(icon => (
              <option key={icon} value={icon}>{icon}</option>
            ))}
          </select>
          <input
            placeholder="Descripción"
            value={nuevoRegalo.descripcion}
            onChange={(e) => setNuevoRegalo({ ...nuevoRegalo, descripcion: e.target.value })}
            style={{ padding: 8, background: '#0e0e10', border: '1px solid #333', color: 'white', borderRadius: 4 }}
          />
        </div>
        <button
          onClick={agregarRegalo}
          style={{
            marginTop: 10,
            background: '#00b7ff',
            border: 'none',
            color: 'white',
            padding: '10px 20px',
            borderRadius: 6,
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Agregar Regalo
        </button>
      </div>

      {/* LISTA DE REGALOS */}
      <div>
        <h3>Regalos Disponibles ({regalos.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {regalos.map(regalo => {
            const editando = regaloEditando?.id === regalo.id;

            return (
              <div
                key={regalo.id}
                style={{
                  background: '#1f1f23',
                  padding: 15,
                  borderRadius: 8,
                  border: '1px solid #333',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                {/* Vista normal */}
                {!editando && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                      <span style={{ fontSize: 24 }}>{regalo.icono}</span>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{regalo.nombre}</div>
                        <div style={{ fontSize: 14, opacity: 0.7 }}>{regalo.descripcion}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                      <span style={{ fontWeight: 'bold' }}>{regalo.costo} 🪙</span>
                      <button
                        onClick={() => setRegaloEditando(regalo)}
                        style={{
                          background: '#3b82f6',
                          border: 'none',
                          color: 'white',
                          padding: '8px 12px',
                          borderRadius: 6,
                          cursor: 'pointer'
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarRegalo(regalo.id)}
                        style={{
                          background: '#ef4444',
                          border: 'none',
                          color: 'white',
                          padding: '8px 12px',
                          borderRadius: 6,
                          cursor: 'pointer'
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}

                {/* Modo edición */}
                {editando && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <input
                      value={regaloEditando.nombre}
                      onChange={(e) => setRegaloEditando({ ...regaloEditando, nombre: e.target.value })}
                      style={{ padding: 8, background: '#0e0e10', border: '1px solid #333', color: 'white', borderRadius: 4 }}
                    />
                    <input
                      type="number"
                      value={regaloEditando.costo}
                      onChange={(e) => setRegaloEditando({ ...regaloEditando, costo: parseInt(e.target.value) || 0 })}
                      style={{ padding: 8, background: '#0e0e10', border: '1px solid #333', color: 'white', borderRadius: 4 }}
                    />
                    <select
                      value={regaloEditando.icono}
                      onChange={(e) => setRegaloEditando({ ...regaloEditando, icono: e.target.value })}
                      style={{ padding: 8, background: '#0e0e10', border: '1px solid #333', color: 'white', borderRadius: 4 }}
                    >
                      {iconosDisponibles.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                    <input
                      value={regaloEditando.descripcion}
                      onChange={(e) => setRegaloEditando({ ...regaloEditando, descripcion: e.target.value })}
                      style={{ padding: 8, background: '#0e0e10', border: '1px solid #333', color: 'white', borderRadius: 4 }}
                    />

                    <button
                      onClick={guardarEdicion}
                      style={{
                        gridColumn: 'span 2',
                        background: '#22c55e',
                        border: 'none',
                        color: 'white',
                        padding: '10px',
                        borderRadius: 6,
                        cursor: 'pointer'
                      }}
                    >
                      Guardar cambios
                    </button>

                    <button
                      onClick={() => setRegaloEditando(null)}
                      style={{
                        gridColumn: 'span 2',
                        background: '#6b7280',
                        border: 'none',
                        color: 'white',
                        padding: '10px',
                        borderRadius: 6,
                        cursor: 'pointer'
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default  GestionRegalos 

