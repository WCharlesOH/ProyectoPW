import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Regalo } from "../components/types";
import BotonRegalo from "../components/BotonRegalos";

const CANALES = {
  "1": { nombre: "Transmisión en directo", descripcion: "Sesión abierta con interacción en vivo" },
  "2": { nombre: "Jugando en línea", descripcion: "Partidas competitivas en comunidad" },
  "3": { nombre: "Charla comunitaria", descripcion: "Conversaciones y anuncios" },
};

export default function PaginaStreamer() {
  const { id } = useParams<{ id: string }>();
  const canalSeleccionado = id && Object.prototype.hasOwnProperty.call(CANALES, id)
    ? CANALES[id as keyof typeof CANALES]
    : null;
  const detalleCanal = canalSeleccionado ?? { nombre: "Canal en vivo", descripcion: "Sesión activa" };
  const [regalos, setRegalos] = useState<Regalo[]>([]);
  const [form, setForm] = useState<Regalo>({ id: 0, nombre: "", costo: 0, puntos: 0 });
  const [editando, setEditando] = useState<boolean>(false);

  // Cargar regalos desde localStorage al iniciar
  useEffect(() => {
    const guardados = localStorage.getItem("regalos");
    if (guardados) {
      try {
        const regalosParseados = JSON.parse(guardados);
        if (Array.isArray(regalosParseados)) {
          setRegalos(regalosParseados);
        }
      } catch (error) {
        console.error("Error al leer regalos desde localStorage", error);
      }
    }
  }, []);

  // Guardar regalos en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem("regalos", JSON.stringify(regalos));
  }, [regalos]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.name === "nombre" ? e.target.value : Number(e.target.value),
    });
  };

  const agregarRegalo = () => {
    setRegalos([...regalos, { ...form, id: Date.now() }]);
    setForm({ id: 0, nombre: "", costo: 0, puntos: 0 });
  };

  const editarRegalo = (regalo: Regalo) => {
    setForm(regalo);
    setEditando(true);
  };

  const guardarEdicion = () => {
    setRegalos(regalos.map((r) => (r.id === form.id ? form : r)));
    setForm({ id: 0, nombre: "", costo: 0, puntos: 0 });
    setEditando(false);
  };

  const eliminarRegalo = (id: number) => {
    setRegalos(regalos.filter((r) => r.id !== id));
  };

  return (
    <div
      style={{
        padding: "0px",
        marginTop: "0px",
        color: "white",
        textAlign: "center",
      }}
    >
      <h2 style={{ color: "#00b7ff" }}>{detalleCanal.nombre}</h2>
      <p style={{ opacity: 0.8 }}>{detalleCanal.descripcion}</p>

      <div
        style={{
          margin: "0px auto",
          width: "100%",
          maxWidth: "1000px",
          backgroundColor: "#1f1f23",
          borderRadius: "12px",
          padding: "0px",
          boxShadow: "0 0 15px rgba(0,0,0,0.4)",
        }}
      >
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre del regalo"
          style={{ margin: "5px", padding: "8px", width: "80%" }}
        />
        <input
          name="costo"
          type="number"
          value={form.costo}
          onChange={handleChange}
          placeholder="Costo"
          style={{ margin: "5px", padding: "8px", width: "80%" }}
        />
        <input
          name="puntos"
          type="number"
          value={form.puntos}
          onChange={handleChange}
          placeholder="Puntos"
          style={{ margin: "5px", padding: "8px", width: "80%" }}
        />
        <button
          onClick={editando ? guardarEdicion : agregarRegalo}
          style={{
            marginTop: "10px",
            backgroundColor: "#00b7ff",
            padding: "10px 20px",
            borderRadius: "8px",
            color: "white",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
          }}
        >
          {editando ? "Guardar cambios" : "Agregar regalo"}
        </button>

        <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
          {regalos.map((regalo) => (
            <li
              key={regalo.id}
              style={{
                backgroundColor: "#2a2a2e",
                margin: "10px 0",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <strong>{regalo.nombre}</strong> - ${regalo.costo} - {regalo.puntos}
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => editarRegalo(regalo)}
                  style={{
                    marginRight: "10px",
                    backgroundColor: "#ffaa00",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarRegalo(regalo.id)}
                  style={{
                    backgroundColor: "#ff4444",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    color: "white",
                  }}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: "40px" }}>
        <BotonRegalo regalos={regalos} />
      </div>
    </div>
  );
}
