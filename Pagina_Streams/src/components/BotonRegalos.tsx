
import React from 'react';
import type { Regalo } from './types';

interface Props {
  regalos: Regalo[];
}

const BotonRegalo: React.FC<Props> = ({ regalos }) => {
  return (
    <div>
      <h3>Regalos disponibles</h3>
      {regalos.length === 0 ? (
        <p>No hay regalos aún.</p>
      ) : (
        <ul>
          {regalos.map(regalo => (
            <li key={regalo.id}>
              {regalo.nombre} - ${regalo.costo} - {regalo.puntos}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BotonRegalo;
