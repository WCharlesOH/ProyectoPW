import React from "react";

// Datos de ejemplo
interface Usuario {
  id: string;
  name: string;
  avatarUrl: string;
  nivel: number;
}

interface RankingProps {
  usuarios: Usuario[];
}

export default function Ranking({ usuarios }: RankingProps) {
  // Ordenar por nivel descendente
  const usuariosOrdenados = [...usuarios].sort((a, b) => b.nivel - a.nivel);

  return (
    <div style={{ width: "250px", backgroundColor: "#1f1f23", borderRadius: "12px", padding: "20px", color: "white", marginLeft: "20px" }}>
      <h3 style={{ color: "#00b7ff", marginBottom: "15px" }}>Ranking</h3>
      {usuariosOrdenados.map((u, index) => (
        <div key={u.id} style={{ display: "flex", alignItems: "center", marginBottom: "12px", gap: "10px" }}>
          <span style={{ width: "20px", fontWeight: "bold" }}>{index + 1}</span>
          <img src={u.avatarUrl} alt={u.name} style={{ width: "35px", height: "35px", borderRadius: "50%" }} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: "bold" }}>{u.name}</p>
            <p style={{ margin: 0, fontSize: "12px", opacity: 0.8 }}>Nivel {u.nivel}</p>
          </div>
        </div>
      ))}
    </div>
  );
}