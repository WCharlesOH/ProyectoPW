// PaginaStreamer.tsx
import React, { useState } from 'react';
import type { Regalo } from '../components/types';
import BotonRegalo from '../components/BotonRegalos';

const PaginaStreamer: React.FC = () => {
  const [regalos, setRegalos] = useState<Regalo[]>([]);
  const [form, setForm] = useState<Regalo>({ id: 0, nombre: '', costo: 0, puntos: 0 });
  const [editando, setEditando] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.name === 'nombre' ? e.target.value : Number(e.target.value) });
  };

  const agregarRegalo = () => {
    setRegalos([...regalos, { ...form, id: Date.now() }]);
    setForm({ id: 0, nombre: '', costo: 0, puntos: 0 });
  };

  const editarRegalo = (regalo: Regalo) => {
    setForm(regalo);
    setEditando(true);
  };

  const guardarEdicion = () => {
    setRegalos(regalos.map(r => (r.id === form.id ? form : r)));
    setForm({ id: 0, nombre: '', costo: 0, puntos: 0 });
    setEditando(false);
  };

  const eliminarRegalo = (id: number) => {
    setRegalos(regalos.filter(r => r.id !== id));
  };

  return (
    <div>
      <h2>🎁 Gestión de Regalos</h2>
      <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" />
      <input name="costo" type="number" value={form.costo} onChange={handleChange} placeholder="Costo" />
      <input name="puntos" type="number" value={form.puntos} onChange={handleChange} placeholder="Puntos" />
      <button onClick={editando ? guardarEdicion : agregarRegalo}>
        {editando ? 'Guardar cambios' : 'Agregar regalo'}
      </button>

      <ul>
        {regalos.map(regalo => (
          <li key={regalo.id}>
            {regalo.nombre} - ${regalo.costo} - ⭐ {regalo.puntos}
            <button onClick={() => editarRegalo(regalo)}>Editar</button>
            <button onClick={() => eliminarRegalo(regalo.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <BotonRegalo regalos={regalos} />
    </div>
  );
};

export default PaginaStreamer;
