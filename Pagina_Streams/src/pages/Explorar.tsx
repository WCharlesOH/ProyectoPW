import { Link } from "react-router-dom";

interface Categoria {
  id: string;
  nombre: string;
  espectadores: string;
  etiquetas?: string[];
}

const CATEGORIAS: Categoria[] = [
  { id: "1", nombre: "Just Chatting", espectadores: "245K", etiquetas: ["IRL"] },
  { id: "2", nombre: "League of Legends", espectadores: "182K", etiquetas: ["MOBA"] },
  { id: "3", nombre: "Fortnite", espectadores: "156K", etiquetas: ["Battle Royale"] },
  { id: "4", nombre: "Valorant", espectadores: "134K", etiquetas: ["FPS", "Competitivo"] },
  { id: "5", nombre: "Minecraft", espectadores: "98K", etiquetas: ["Sandbox"] },
  { id: "6", nombre: "GTA V", espectadores: "87K", etiquetas: ["Acción", "Mundo Abierto"] },
];

interface ExplorarProps {
  sidebarAbierto?: boolean;
}

export default function Explorar({ sidebarAbierto = true }: ExplorarProps) {
  const paddingLeft = sidebarAbierto ? "0px" : "60px";
  
  return (
    <div 
    style={{ padding: "20px", paddingLeft, color: "#fff", background: "#18181b", minHeight: "100vh", transition: "padding-left 0.3s ease" }}>
      
      <section style={{ marginBottom: "30px" }}>
        <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>Explorar categorías</h1>
        <p style={{ color: "#adadb8", fontSize: "14px" }}>Descubre nuevas categorías y comunidades</p>
      </section>

      <section>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {CATEGORIAS.map((categoria) => (
            <div key={categoria.id} style={{ background: "#0e0e10", borderRadius: "8px", overflow: "hidden", border: "1px solid #333", cursor: "pointer" }}>
              <Link to={`/categoria/${categoria.id}`} style={{ textDecoration: "none" }}>
                <div style={{ height: "160px", background: "linear-gradient(135deg, #1f1f23 0%, #2a2a2e 100%)", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #333" }}>
                  <div style={{ width: "60px", height: "60px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", color: "#9147ff" }}>🎮</div>
                </div>

                <div style={{ padding: "16px" }}>
                  <div style={{ color: "#fff", fontWeight: "bold", fontSize: "16px", marginBottom: "8px" }}>{categoria.nombre}</div>
                  <div style={{ color: "#adadb8", fontSize: "14px", marginBottom: "8px" }}>{categoria.espectadores} espectadores</div>
                  {categoria.etiquetas && (
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {categoria.etiquetas.map((etiqueta) => (
                        <span key={etiqueta} style={{ fontSize: "12px", color: "#ddd", background: "rgba(83, 83, 95, 0.4)", padding: "4px 8px", borderRadius: "12px" }}>{etiqueta}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}