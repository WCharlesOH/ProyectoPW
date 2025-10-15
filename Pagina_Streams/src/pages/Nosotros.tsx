import React from "react";

const integrantes = [
  {
    nombre: "Mirko",
    rol: "Mejor un 20",
    descripcion:
      "No sabe como acabo el trabajo",
    imagen: "https://via.placeholder.com/150",
  },
  {
    nombre: "Felipe",
    rol: "Maestro maestro",
    descripcion:
      "Demasiada maestria",
    imagen: "https://via.placeholder.com/150",
  },
  {
    nombre: "Francisco",
    rol: "Maestro ingeniero",
    descripcion:
      "Avance magistral",
    imagen: "https://via.placeholder.com/150",
  },
  {
    nombre: "William",
    rol: "Esfuerzo sobrehumano",
    descripcion:
      "Mucha sabiduria en una persona",
    imagen: "https://via.placeholder.com/150",
  },
  {
    nombre: "Andres",
    rol: "Chambeador debil",
    descripcion:
      "Para cuando chambea",
    imagen: "https://via.placeholder.com/150",
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
          gap: "30px",
          padding: "0 20px",
        }}
      >
        {integrantes.map((persona, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#1f1f23",
              borderRadius: "15px",
              width: "220px",
              padding: "20px",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "pointer",
              overflow: "hidden",
            }}
            className="card"
          >
            <div
              style={{
                width: "120px",
                height: "120px",
                margin: "0 auto",
                borderRadius: "50%",
                overflow: "hidden",
                border: "3px solid #00b7ff",
                marginBottom: "15px",
              }}
            >
              <img
                src={persona.imagen}
                alt={persona.nombre}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
                className="card-img"
              />
            </div>
            <h3 style={{ margin: "10px 0 5px", color: "#00b7ff" }}>
              {persona.nombre}
            </h3>
            <p style={{ margin: 0, fontStyle: "italic" }}>{persona.rol}</p>
            <p
              style={{
                marginTop: "10px",
                fontSize: "14px",
                lineHeight: "1.4",
                opacity: 0.8,
                display: "none",
              }}
              className="descripcion"
            >
              {persona.descripcion}
            </p>
          </div>
        ))}
      </div>

      {/* Efectos de hover */}
      <style>
        {`
          .card:hover {
            transform: scale(1.1);
            box-shadow: 0 0 20px rgba(0, 183, 255, 0.4);
          }

          .card:hover .card-img {
            transform: scale(1.1);
          }

          .card:hover .descripcion {
            display: block;
            animation: fadeIn 0.4s ease-in-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}