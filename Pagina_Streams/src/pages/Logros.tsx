import React, { useState } from "react";
import Ranking from "./Ranking";
import vegeta from "../imagenes/Mirko.jpg";
import fork from "../imagenes/fork.jpg";
import grefg from "../imagenes/grefg.jpg";

interface Logro {
  id: number;
  nombre: string;
  descripcion: string;
  xp: number;
}

export default function Logros() {
  const logrosIniciales: Logro[] = [
    { id: 1, nombre: "Primer Stream", descripcion: "Iniciaste tu primer stream", xp: 25 },
    { id: 2, nombre: "100 Monedas", descripcion: "Has ganado 100 monedas", xp: 25 },
    { id: 3, nombre: "5 Seguidores", descripcion: "Alcanzaste 5 seguidores", xp: 25 },
    { id: 4, nombre: "Nivel 2", descripcion: "Subiste al nivel 2", xp: 25 },
    { id: 5, nombre: "10 Streams", descripcion: "Has transmitido 10 veces", xp: 25 },
  ];

  const [xpTotal, setXpTotal] = useState(0);

  const reclamar = (xp: number) => {
    setXpTotal(prev => prev + xp);
  };

  // Calcular nivel actual
  const nivel = 1 + Math.floor(xpTotal / 100);
  const xpParaNivelActual = xpTotal % 100; // XP restante para la barra
  const progreso = Math.min((xpParaNivelActual / 100) * 100, 100);

  const usuariosRanking = [
    { id: "1", name: "Vegeta", avatarUrl: vegeta, nivel: 5 },
    { id: "2", name: "Frok", avatarUrl: fork, nivel: 3 },
    { id: "3", name: "Zak", avatarUrl: grefg, nivel: 4 },
    { id: "4", name: "Staxx", avatarUrl: vegeta, nivel: 2 },
    { id: "5", name: "AuronPlay", avatarUrl: fork, nivel: 6 },
    { id: "6", name: "Grefg", avatarUrl: grefg, nivel: 7 },
  ];

  return (
    <div style={{ display: "flex", padding: "40px", backgroundColor: "#0e0e10", minHeight: "100vh", color: "white" }}>
      
      {/* Logros */}
      <div style={{ flex: 1 }}>
        <h2 style={{ color: "#00b7ff", marginBottom: "20px" }}>Mis Logros</h2>

        {/* Barra de experiencia */}
        <div style={{ margin: "0 auto 30px", width: "80%", maxWidth: "500px", backgroundColor: "#1f1f23", borderRadius: "12px", padding: "20px" }}>
          <h3>Nivel {nivel}</h3>
          <div style={{ height: "24px", backgroundColor: "#2a2a2e", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ width: `${progreso}%`, height: "100%", background: "linear-gradient(90deg, #00b7ff, #0077ff, #4a00ff)", transition: "width 0.6s" }} />
          </div>
          <p style={{ marginTop: "8px", fontSize: "14px", opacity: 0.8 }}>{xpParaNivelActual} XP / 100 XP</p>
        </div>

        {/* Lista de logros */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center", maxWidth: "600px", margin: "0 auto" }}>
          {logrosIniciales.map(l => (
            <div key={l.id} style={{ flex: "0 1 45%", backgroundColor: "#1f1f23", color: "white", padding: "15px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ textAlign: "left" }}>
                <h4 style={{ margin: 0 }}>{l.nombre}</h4>
                <p style={{ margin: "5px 0 0", fontSize: "14px", opacity: 0.8 }}>{l.descripcion}</p>
              </div>
              <button style={{ backgroundColor: "#00ff7f", border: "none", borderRadius: "6px", padding: "6px 12px", fontWeight: "bold", cursor: "pointer" }} onClick={() => reclamar(l.xp)}>
                Reclamar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Ranking al costado */}
      <Ranking usuarios={usuariosRanking} />
    </div>
  );
}
