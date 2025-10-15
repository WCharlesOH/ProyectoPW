import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Perfil_V() {
  // Estado de logros y experiencia
  const [logros, setLogros] = useState<number>(0);
  const [nivel, setNivel] = useState<number>(1);
  const [xpActual, setXpActual] = useState<number>(0);
  const [xpRequerida, setXpRequerida] = useState<number>(100);

  // Cargar datos simulados (puedes conectar a localStorage o API luego)
  useEffect(() => {
    // Supongamos que obtienes logros desde el almacenamiento
    const logrosGuardados = Number(localStorage.getItem("logros")) || 3;
    setLogros(logrosGuardados);

    // Cada logro da 25 XP (por ejemplo)
    const xpGanada = logrosGuardados * 25;
    setXpActual(xpGanada);

    // Calcular nivel (100 XP = subir nivel)
    const nuevoNivel = 1 + Math.floor(xpGanada / 100);
    setNivel(nuevoNivel);
    setXpRequerida(100 * nuevoNivel);
  }, []);

  // Porcentaje de llenado de la barra
  const progreso = Math.min((xpActual / xpRequerida) * 100, 100);

  return (
    <div
      style={{
        padding: "40px",
        color: "white",
        textAlign: "center",
        backgroundColor: "#0e0e10",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ color: "#00b7ff" }}>Perfil del Stremer</h2>

      <div
        style={{
          margin: "30px auto",
          width: "80%",
          maxWidth: "500px",
          backgroundColor: "#1f1f23",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 0 15px rgba(0,0,0,0.4)",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Nivel {nivel}</h3>
        <div
          style={{
            height: "24px",
            backgroundColor: "#2a2a2e",
            borderRadius: "12px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              width: `${progreso}%`,
              height: "100%",
              background:
                "linear-gradient(90deg, #00b7ff, #0077ff, #4a00ff)",
              transition: "width 0.6s ease",
            }}
          />
        </div>
        <p style={{ marginTop: "8px", fontSize: "14px", opacity: 0.8 }}>
          {xpActual} XP / {xpRequerida} XP
        </p>
      </div>

      <div style={{ marginTop: "30px" }}>
        <p>
          Logros obtenidos: <strong>{logros}</strong>
        </p>
        <Link
          to="/logros"
          style={{
            display: "inline-block",
            marginTop: "10px",
            backgroundColor: "#00b7ff",
            padding: "10px 20px",
            borderRadius: "8px",
            textDecoration: "none",
            color: "white",
            fontWeight: "bold",
            transition: "transform 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Ver logros
        </Link>
      </div>
    </div>
  );
}