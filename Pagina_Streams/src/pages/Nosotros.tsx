import Mirkos from "../imagenes/Mirko.jpg";
import Felipes from "../imagenes/Felipe.jpg";
import Franciscos from "../imagenes/fancisco.jpg";
import Wiliams from "../imagenes/William.jpg";
import Andress from "../imagenes/Andres.jpg";
import "./Nosotros.css";

const integrantes = [
  {
    nombre: "Mirko",
    rol: "Mejor un 20",
    descripcion: "No sabe cómo acabó el trabajo",
    imagen: Mirkos,
  },
  {
    nombre: "Felipe",
    rol: "Maestro maestro",
    descripcion: "Demasiada maestría",
    imagen: Felipes,
  },
  {
    nombre: "Francisco",
    rol: "Maestro ingeniero",
    descripcion: "Avance magistral",
    imagen: Franciscos,
  },
  {
    nombre: "William",
    rol: "Esfuerzo sobrehumano",
    descripcion: "Mucha sabiduría en una persona",
    imagen: Wiliams,
  },
  {
    nombre: "Andres",
    rol: "Chambeador débil",
    descripcion: "¿Para cuándo chambea?",
    imagen: Andress,
  },
];

export default function Nosotros() {
  return (
    <div className="nosotros-page">
      <div className="nosotros-container">
        <h1 className="nosotros-title">Nuestro Equipo</h1>

        <div className="nosotros-grid">
          {integrantes.map((persona, index) => (
            <div key={index} className="nosotros-card" tabIndex={0}>
              <div className="card-img-container">
                <img
                  src={persona.imagen}
                  alt={persona.nombre}
                  className="card-img"
                />
              </div>
              <h3>{persona.nombre}</h3>
              <p className="rol">{persona.rol}</p>
              <div className="descripcion">{persona.descripcion}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
