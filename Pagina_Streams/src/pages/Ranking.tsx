import type { ranking } from "../components/types";

interface RankingProps {
  usuarios: ranking[];
}

export default function Ranking({ usuarios }: RankingProps) {
  // Ordenar por nivel descendente
  const usuariosOrdenados = [...usuarios].sort(
    (a, b) => b.NivelStreams - a.NivelStreams
  );
  return (
    <div
      style={{
        width: "250px",
        backgroundColor: "#1f1f23",
        borderRadius: "12px",
        padding: "20px",
        color: "white",
        marginLeft: "20px",
      }}
    >
      <h3 style={{ color: "#00b7ff", marginBottom: "15px" }}>Ranking</h3>
      {usuariosOrdenados.map((u, index) => (
        <div
          key={u.ID}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "12px",
            gap: "10px",
          }}
        >
          <span style={{ width: "20px", fontWeight: "bold" }}>{index + 1}</span>
          <img
            src={u.ImagenPerfil}
            alt={u.NombreUsuario}
            style={{ width: "35px", height: "35px", borderRadius: "50%" }}
          />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: "bold" }}>{u.NombreUsuario}</p>
            <p style={{ margin: 0, fontSize: "12px", opacity: 0.8 }}>
              Nivel {1 + Math.floor(u.NivelStreams / 100)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
