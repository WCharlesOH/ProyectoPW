import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Regalo } from "../components/types";
import BotonRegalo from "../components/BotonRegalos";
import "./PaginaStreamer.css"; // ← IMPORTANTE

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
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    const guardados = localStorage.getItem("regalos");
    if (guardados) {
      try {
        const parsed = JSON.parse(guardados);
        if (Array.isArray(parsed)) setRegalos(parsed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("regalos", JSON.stringify(regalos));
  }, [regalos]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.name === "nombre" ? e.target.value : Number(e.target.value)
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
    setRegalos(regalos.map(r => (r.id === form.id ? form : r)));
    setForm({ id: 0, nombre: "", costo: 0, puntos: 0 });
    setEditando(false);
  };

  const eliminarRegalo = (id: number) => {
    setRegalos(regalos.filter(r => r.id !== id));
  };

  return (
    <div className="streamer-page">

      <div className="streamer-header">
        <h2 className="streamer-title">{detalleCanal.nombre}</h2>
        <p className="streamer-description">{detalleCanal.descripcion}</p>
      </div>

      <div className="streamer-content-wrapper">

        <div id="streamer-root" className="streamer-box">

          <div className="streamer-form">
            <input
              className="streamer-input"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre del regalo"
            />

            <input
              className="streamer-input"
              name="costo"
              type="number"
              value={form.costo}
              onChange={handleChange}
              placeholder="Costo"
            />

            <input
              className="streamer-input"
              name="puntos"
              type="number"
              value={form.puntos}
              onChange={handleChange}
              placeholder="Puntos"
            />

            <button
              className="streamer-button"
              onClick={editando ? guardarEdicion : agregarRegalo}
            >
              {editando ? "Guardar cambios" : "Agregar regalo"}
            </button>
          </div>

          <ul className="streamer-list">
            {regalos.map((regalo) => (
              <li key={regalo.id} className="streamer-item">
                <strong>{regalo.nombre}</strong> — ${regalo.costo} — {regalo.puntos}

                <div className="streamer-actions">
                  <button className="streamer-edit" onClick={() => editarRegalo(regalo)}>
                    Editar
                  </button>

                  <button className="streamer-delete" onClick={() => eliminarRegalo(regalo.id)}>
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>

        </div>
      </div>

      <div className="streamer-gifts-wrapper">
        <BotonRegalo regalos={regalos} />
      </div>

    </div>
  );
}