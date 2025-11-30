import { useEffect, useState } from "react";
import Ranking from "./Ranking";
import type { Logro, Usuario } from "../components/types";
import type { ranking } from "../components/types";
import { API } from "../Comandosllamadas/llamadas";

export default function Logros() {
  const [logros, setLogros] = useState<Logro[]>([]);
  const [rankingUsuarios, setRankingUsuarios] = useState<ranking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [xpTotal, setXpTotal] = useState(0);
  
  const info: Usuario | null = JSON.parse(localStorage.getItem("user") || "null");
  const id = info ? Number(info.ID) : null;

  const todo = API;

  const SacarLogros = async () => {
    const data = await todo.ObtenerTodosLogros();
    if (data.success) {
      setLogros(data.logros); 
    } else {
      setError(data.error);
    }
  };

  const actualizarInfoUsuario = async () => {
    if (!id) {
      console.error("ID inválido, no se puede actualizar info del usuario");
      return;
    }

    const data = await todo.ObtenerDatosUsuario(id);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const SacarRanking = async () => {
    const data = await todo.ObtenerRanking();
    setRankingUsuarios(data.ranking); // <-- AHORA SI RENDERIZA
  };

  const ActualizarNivel = async () => {
    if(!id){
      console.error("ID inválido, no se puede actualizar info del usuario");
      return;
    }
    await todo.ActualizarNivelStreams(id, xpTotal)
    actualizarInfoUsuario()
  }

  useEffect(() => {
    SacarLogros();
    SacarRanking();
  }, []);



  const reclamar = (xp: number) => {
    setXpTotal(prev => prev + xp);
    ActualizarNivel()
    actualizarInfoUsuario()
  };

  // Calcular nivel actual
  const nivel = 1 + Math.floor(xpTotal / 100);
  const xpParaNivelActual = xpTotal % 100; // XP restante para la barra
  const progreso = Math.min((xpParaNivelActual / 100) * 100, 100);

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
          {logros.map(l => (
            <div key={l.ID} style={{ flex: "0 1 45%", backgroundColor: "#1f1f23", color: "white", padding: "15px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ textAlign: "left" }}>
                <h4 style={{ margin: 0 }}>{l.Nombre}</h4>
                <p style={{ margin: "5px 0 0", fontSize: "14px", opacity: 0.8 }}>{l.descripcion}</p>
              </div>
              <button style={{ backgroundColor: "#00ff7f", border: "none", borderRadius: "6px", padding: "6px 12px", fontWeight: "bold", cursor: "pointer" }} onClick={() => reclamar(l.Puntaje)}>
                Reclamar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Ranking al costado */}
      <Ranking usuarios={rankingUsuarios} />
    </div>
  );
}
