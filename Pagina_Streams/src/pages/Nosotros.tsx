import React from "react";
import Mirkos from "../imagenes/Mirko.jpg";
import Felipes from "../imagenes/Felipe.jpg";
import Franciscos from "../imagenes/fancisco.jpg";
import Wiliams from "../imagenes/William.jpg";
import Andress from "../imagenes/Andres.jpg";

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
    <div
      style={{
        backgroundColor: "#0e0e10",
        minHeight: "100vh",
        color: "white",
        padding: "40px 0",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#00b7ff", marginBottom: "40px" }}>Nuestro Equipo</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "40px",
          padding: "0 20px",
        }}
      >
        {integrantes.map((persona, index) => (
          <div key={index} className="card">
            <div className="card-img-container">
              <img src={persona.imagen} alt={persona.nombre} className="card-img" />
            </div>
            <h3 style={{color:"white"}}>{persona.nombre}</h3>
            <p className="rol" style={{color:"white"}}>{persona.rol}</p>
            <div className="descripcion" style={{color:"white"}}>{persona.descripcion}</div>
          </div>
        ))}
      </div>

      <style>
        {`
          .card {
            background-color: #1f1f23;
            border-radius: 15px;
            width: 220px;
            padding: 20px;
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }

          .card-img-container {
            width: 120px;
            height: 120px;
            margin: 0 auto 15px;
            border-radius: 50%;
            overflow: hidden;
            border: 3px solid #00b7ff;
            transition: transform 0.3s ease;
          }

          .card-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }

          .card h3 {
            margin: 10px 0 5px;
            color: #00b7ff;
          }

          .rol {
            margin: 0;
            font-style: italic;
            opacity: 0.9;
          }

          .descripcion {
            margin-top: 10px;
            font-size: 14px;
            line-height: 1.4;
            opacity: 0;
            max-height: 0;
            overflow: hidden;
            transition: all 0.4s ease;
          }

          .card:hover {
            transform: translateY(-8px);
            box-shadow: 0 0 20px rgba(0, 183, 255, 0.4);
          }

          .card:hover .card-img-container {
            transform: scale(1.1);
          }

          .card:hover .descripcion {
            opacity: 1;
            max-height: 100px;
            margin-top: 15px;
          }
        `}
      </style>
    </div>
  );
}
