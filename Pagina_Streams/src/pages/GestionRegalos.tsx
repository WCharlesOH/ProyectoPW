import React, { useState } from "react";
import { emitirActividad } from "../datos/sincronizacion";
import React, { useState, useEffect } from 'react';
import { emitirActividad } from '../datos/sincronizacion';
import { API } from '../Comandosllamadas/llamadas';
import type { Usuario } from '../components/types';

type Regalo = {
  ID_Regalo?: number;
  NombreRegalo: string;
  PrecioRegalo: number;
  icono: string;
  DescripcionRegalo: string;
  ID_Usuario?: number;
};

const GestionRegalos: React.FC = () => {
  const [regalos, setRegalos] = useState<Regalo[]>(() => {
    const guardados = localStorage.getItem("regalosGlobales");
    return guardados
      ? JSON.parse(guardados)
      : [
          {
            id: "r1",
            nombre: "Corazón",
            costo: 10,
            icono: "❤️",
            descripcion: "Envía amor al streamer",
          },
          {
            id: "r2",
            nombre: "Rayo",
            costo: 50,
            icono: "⚡",
            descripcion: "Energiza el stream",
          },
          {
            id: "r3",
            nombre: "Trofeo",
            costo: 100,
            icono: "🏆",
            descripcion: "Reconoce su esfuerzo",
          },
          {
            id: "r4",
            nombre: "Cohete",
            costo: 200,
            icono: "🚀",
            descripcion: "Impulsa el canal",
          },
        ];
  });

  const [nuevoRegalo, setNuevoRegalo] = useState({
    nombre: "",
    costo: 0,
    icono: "🎁",
    descripcion: "",
  const info: Usuario | null = JSON.parse(localStorage.getItem("user") || "null");
  const idUsuario = info ? Number(info.ID) : null;

  const [regalos, setRegalos] = useState<Regalo[]>([]);
  const [cargando, setCargando] = useState(true);

  const [nuevoRegalo, setNuevoRegalo] = useState({
    NombreRegalo: '',
    PrecioRegalo: 0,
    icono: '🎁',
    DescripcionRegalo: ''
  });

  const [regaloEditando, setRegaloEditando] = useState<Regalo | null>(null);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [regaloAEliminar, setRegaloAEliminar] = useState<string>('');
  const [error, setError] = useState<string>('');

  const iconosDisponibles = [
    "❤️",
    "⚡",
    "🏆",
    "🚀",
    "🎁",
    "⭐",
    "🎯",
    "💎",
    "👑",
    "🔥",
  ];

  const guardarRegalos = (nuevosRegalos: Regalo[]) => {
    setRegalos(nuevosRegalos);
    localStorage.setItem("regalosGlobales", JSON.stringify(nuevosRegalos));
    emitirActividad("🔄 Lista de regalos actualizada", "regalo");
  };

  const agregarRegalo = () => {
    if (!nuevoRegalo.nombre || nuevoRegalo.costo <= 0) {
      alert("Completa nombre y costo válido");
      return;
    }

    const regaloCompleto: Regalo = {
      id: `r${Date.now()}`,
      nombre: nuevoRegalo.nombre,
      costo: nuevoRegalo.costo,
      icono: nuevoRegalo.icono,
      descripcion: nuevoRegalo.descripcion || "Nuevo regalo especial",
    };
  useEffect(() => {
    cargarRegalos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarRegalos = async () => {
    if (!idUsuario) {
      console.log('No hay ID de usuario');
      setCargando(false);
      return;
    }

    setCargando(true);
    console.log('Cargando regalos para usuario ID:', idUsuario);
    const data = await API.ObtenerRegalos(idUsuario);
    console.log('Respuesta de ObtenerRegalos:', data);
    
    if (data.success && data.data) {
      console.log('Regalos cargados:', data.data);
      setRegalos(data.data);
    } else {
      console.log('No se encontraron regalos o hubo un error:', data);
    }
    setCargando(false);
  };

  const agregarRegalo = async () => {
    // Validación de seguridad
    if (!idUsuario) {
      setError('Error: No estás identificado como usuario');
      return;
    }

    if (!nuevoRegalo.NombreRegalo || nuevoRegalo.PrecioRegalo <= 0) {
      setError('Completa nombre y costo válido');
      return;
    }

    console.log('Enviando regalo al backend...');
    
    // LLAMADA CORREGIDA
    const result = await API.CrearRegalo(
      nuevoRegalo.NombreRegalo,
      nuevoRegalo.PrecioRegalo,
      nuevoRegalo.DescripcionRegalo || 'Regalo especial',
      nuevoRegalo.icono,
      idUsuario // <--- Pasamos TU ID (que es el ID de la tabla Usuario)
    );

    setNuevoRegalo({ nombre: "", costo: 0, icono: "🎁", descripcion: "" });
  };

  const eliminarRegalo = (id: string) => {
    if (window.confirm("¿Eliminar este regalo?")) {
      guardarRegalos(regalos.filter((r) => r.id !== id));
    if (result.success) {
      emitirActividad("🎁 Nuevo regalo creado", "regalo");
      await cargarRegalos(); // Recargamos la lista para ver el nuevo
      setNuevoRegalo({ NombreRegalo: '', PrecioRegalo: 0, icono: '🎁', DescripcionRegalo: '' });
      setError(''); // Limpiamos errores
    } else {
      setError('Error del servidor: ' + result.error);
    }
};

  const confirmarEliminarRegalo = (nombre: string) => {
    setRegaloAEliminar(nombre);
    setMostrarModalEliminar(true);
  };

  const eliminarRegalo = async () => {
    if (!idUsuario) return;

    console.log('Eliminando regalo:', regaloAEliminar);
    const result = await API.EliminarRegalo(regaloAEliminar);
    console.log('Resultado de EliminarRegalo:', result);
    
    if (result.success) {
      emitirActividad("🗑️ Regalo eliminado", "regalo");
      await cargarRegalos();
    } else {
      setError('Error al eliminar regalo: ' + result.error);
      setTimeout(() => setError(''), 3000);
    }
    
    setMostrarModalEliminar(false);
    setRegaloAEliminar('');
  };

  const guardarEdicion = async () => {
    if (!regaloEditando || !regaloEditando.ID_Regalo || !idUsuario) return;

    const actualizados = regalos.map((r) =>
      r.id === regaloEditando.id ? regaloEditando : r
    console.log('Actualizando regalo:', regaloEditando);
    const result = await API.ActualizarRegalo(
      regaloEditando.ID_Regalo,
      regaloEditando.NombreRegalo,
      regaloEditando.PrecioRegalo,
      regaloEditando.DescripcionRegalo,
      regaloEditando.icono
    );

    console.log('Resultado de ActualizarRegalo:', result);
    if (result.success) {
      emitirActividad("✏️ Regalo actualizado", "regalo");
      await cargarRegalos();
      setRegaloEditando(null);
    } else {
      setError('Error al actualizar regalo: ' + result.error);
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div
      style={{
        padding: 20,
        color: "white",
        background: "#0e0e10",
        minHeight: "100vh",
      }}
    >
      <h1>🎁 Gestión de Regalos</h1>
      <p style={{ opacity: 0.8 }}>Modifica los regalos disponibles en la plataforma</p>

      {/* Mensaje de error */}
      {error && (
        <div style={{ background: '#ef4444', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* AGREGAR NUEVO */}
      <div
        style={{
          background: "#1f1f23",
          padding: 15,
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <h3>Agregar Nuevo Regalo</h3>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          <input
            placeholder="Nombre"
            value={nuevoRegalo.nombre}
            onChange={(e) =>
              setNuevoRegalo({ ...nuevoRegalo, nombre: e.target.value })
            }
            style={{
              padding: 8,
              background: "#0e0e10",
              border: "1px solid #333",
              color: "white",
              borderRadius: 4,
            }}
            value={nuevoRegalo.NombreRegalo}
            onChange={(e) => setNuevoRegalo({ ...nuevoRegalo, NombreRegalo: e.target.value })}
            style={{ padding: 8, background: '#0e0e10', border: '1px solid #333', color: 'white', borderRadius: 4 }}
          />
          <input
            type="number"
            placeholder="Costo"
            value={nuevoRegalo.costo}
            onChange={(e) =>
              setNuevoRegalo({
                ...nuevoRegalo,
                costo: parseInt(e.target.value) || 0,
              })
            }
            style={{
              padding: 8,
              background: "#0e0e10",
              border: "1px solid #333",
              color: "white",
              borderRadius: 4,
            }}
            value={nuevoRegalo.PrecioRegalo}
            onChange={(e) => setNuevoRegalo({ ...nuevoRegalo, PrecioRegalo: parseInt(e.target.value) || 0 })}
            style={{ padding: 8, background: '#0e0e10', border: '1px solid #333', color: 'white', borderRadius: 4 }}
          />
          <select
            value={nuevoRegalo.icono}
            onChange={(e) =>
              setNuevoRegalo({ ...nuevoRegalo, icono: e.target.value })
            }
            style={{
              padding: 8,
              background: "#0e0e10",
              border: "1px solid #333",
              color: "white",
              borderRadius: 4,
            }}
          >
            {iconosDisponibles.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
          <input
            placeholder="Descripción"
            value={nuevoRegalo.descripcion}
            onChange={(e) =>
              setNuevoRegalo({ ...nuevoRegalo, descripcion: e.target.value })
            }
            style={{
              padding: 8,
              background: "#0e0e10",
              border: "1px solid #333",
              color: "white",
              borderRadius: 4,
            }}
            value={nuevoRegalo.DescripcionRegalo}
            onChange={(e) => setNuevoRegalo({ ...nuevoRegalo, DescripcionRegalo: e.target.value })}
            style={{ padding: 8, background: '#0e0e10', border: '1px solid #333', color: 'white', borderRadius: 4 }}
          />
        </div>
        <button
          onClick={agregarRegalo}
          style={{
            marginTop: 10,
            background: "#00b7ff",
            border: "none",
            color: "white",
            padding: "10px 20px",
            borderRadius: 6,
            cursor: "pointer",
            width: "100%",
          }}
        >
          Agregar Regalo
        </button>
      </div>

      {/* LISTA DE REGALOS */}
      <div>
        <h3>Regalos Disponibles ({regalos.length})</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {regalos.map((regalo) => {
            const editando = regaloEditando?.id === regalo.id;

            return (
              <div
                key={regalo.id}
                style={{
                  background: "#1f1f23",
                  padding: 15,
                  borderRadius: 8,
                  border: "1px solid #333",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {/* Vista normal */}
                {!editando && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 15 }}
                    >
                      <span style={{ fontSize: 24 }}>{regalo.icono}</span>
                      <div>
                        <div style={{ fontWeight: "bold" }}>
                          {regalo.nombre}
                        </div>
                        <div style={{ fontSize: 14, opacity: 0.7 }}>
                          {regalo.descripcion}
                        </div>
        {cargando ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#adadb8' }}>
            <p>Cargando regalos...</p>
          </div>
        ) : regalos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#adadb8' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎁</div>
            <p>No hay regalos disponibles</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {regalos.map(regalo => {
              const editando = regaloEditando?.ID_Regalo === regalo.ID_Regalo;

              return (
                <div
                  key={regalo.ID_Regalo}
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
                        <span style={{ fontSize: 32 }}>{regalo.icono}</span>
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: 16 }}>{regalo.NombreRegalo}</div>
                          <div style={{ fontSize: 14, opacity: 0.7 }}>{regalo.DescripcionRegalo}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                        <span style={{ fontWeight: 'bold', fontSize: 18 }}>{regalo.PrecioRegalo} 🪙</span>
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
                          onClick={() => confirmarEliminarRegalo(regalo.NombreRegalo)}
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
                  {editando && regaloEditando && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <input
                        value={regaloEditando.NombreRegalo}
                        onChange={(e) => setRegaloEditando({ ...regaloEditando, NombreRegalo: e.target.value })}
                        style={{ padding: 8, background: '#0e0e10', border: '1px solid #333', color: 'white', borderRadius: 4 }}
                      />
                      <input
                        type="number"
                        value={regaloEditando.PrecioRegalo}
                        onChange={(e) => setRegaloEditando({ ...regaloEditando, PrecioRegalo: parseInt(e.target.value) || 0 })}
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
                        value={regaloEditando.DescripcionRegalo}
                        onChange={(e) => setRegaloEditando({ ...regaloEditando, DescripcionRegalo: e.target.value })}
                        style={{ padding: 8, background: '#0e0e10', border: '1px solid #333', color: 'white', borderRadius: 4 }}
                      />

                    <div
                      style={{ display: "flex", alignItems: "center", gap: 15 }}
                    >
                      <span style={{ fontWeight: "bold" }}>
                        {regalo.costo} 🪙
                      </span>
                      <button
                        onClick={guardarEdicion}
                        style={{
                          background: "#3b82f6",
                          border: "none",
                          color: "white",
                          padding: "8px 12px",
                          gridColumn: 'span 2',
                          background: '#22c55e',
                          border: 'none',
                          color: 'white',
                          padding: '10px',
                          borderRadius: 6,
                          cursor: "pointer",
                        }}
                      >
                        Guardar cambios
                      </button>

                      <button
                        onClick={() => setRegaloEditando(null)}
                        style={{
                          background: "#ef4444",
                          border: "none",
                          color: "white",
                          padding: "8px 12px",
                          gridColumn: 'span 2',
                          background: '#6b7280',
                          border: 'none',
                          color: 'white',
                          padding: '10px',
                          borderRadius: 6,
                          cursor: "pointer",
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* Modo edición */}
                {editando && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                    }}
                  >
                    <input
                      value={regaloEditando.nombre}
                      onChange={(e) =>
                        setRegaloEditando({
                          ...regaloEditando,
                          nombre: e.target.value,
                        })
                      }
                      style={{
                        padding: 8,
                        background: "#0e0e10",
                        border: "1px solid #333",
                        color: "white",
                        borderRadius: 4,
                      }}
                    />
                    <input
                      type="number"
                      value={regaloEditando.costo}
                      onChange={(e) =>
                        setRegaloEditando({
                          ...regaloEditando,
                          costo: parseInt(e.target.value) || 0,
                        })
                      }
                      style={{
                        padding: 8,
                        background: "#0e0e10",
                        border: "1px solid #333",
                        color: "white",
                        borderRadius: 4,
                      }}
                    />
                    <select
                      value={regaloEditando.icono}
                      onChange={(e) =>
                        setRegaloEditando({
                          ...regaloEditando,
                          icono: e.target.value,
                        })
                      }
                      style={{
                        padding: 8,
                        background: "#0e0e10",
                        border: "1px solid #333",
                        color: "white",
                        borderRadius: 4,
                      }}
                    >
                      {iconosDisponibles.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                    <input
                      value={regaloEditando.descripcion}
                      onChange={(e) =>
                        setRegaloEditando({
                          ...regaloEditando,
                          descripcion: e.target.value,
                        })
                      }
                      style={{
                        padding: 8,
                        background: "#0e0e10",
                        border: "1px solid #333",
                        color: "white",
                        borderRadius: 4,
                      }}
                    />

                    <button
                      onClick={guardarEdicion}
                      style={{
                        gridColumn: "span 2",
                        background: "#22c55e",
                        border: "none",
                        color: "white",
                        padding: "10px",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      Guardar cambios
                    </button>

                    <button
                      onClick={() => setRegaloEditando(null)}
                      style={{
                        gridColumn: "span 2",
                        background: "#6b7280",
                        border: "none",
                        color: "white",
                        padding: "10px",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {mostrarModalEliminar && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: '#1f1f23',
            padding: 24,
            borderRadius: 12,
            maxWidth: 400,
            width: '90%'
          }}>
            <h3 style={{ margin: '0 0 12px 0' }}>¿Eliminar regalo?</h3>
            <p style={{ margin: '0 0 20px 0', opacity: 0.8 }}>
              ¿Estás seguro de que deseas eliminar el regalo "{regaloAEliminar}"? Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  setMostrarModalEliminar(false);
                  setRegaloAEliminar('');
                }}
                style={{
                  flex: 1,
                  background: '#6b7280',
                  border: 'none',
                  color: 'white',
                  padding: '10px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Cancelar
              </button>
              <button
                onClick={eliminarRegalo}
                style={{
                  flex: 1,
                  background: '#ef4444',
                  border: 'none',
                  color: 'white',
                  padding: '10px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionRegalos;
