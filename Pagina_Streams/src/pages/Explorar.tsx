import { Link } from "react-router-dom";

interface Categoria {
  id: string;
  nombre: string;
  espectadores: string;
  etiquetas?: string[];
  imagenUrl: string;
}

// Estas categorías serán reemplazadas por llamadas al backend en el futuro
const CATEGORIAS: Categoria[] = [
  { 
    id: "1", 
    nombre: "Just Chatting", 
    espectadores: "245K", 
    etiquetas: ["IRL"],
    imagenUrl: "https://static-cdn.jtvnw.net/ttv-boxart/509658-285x380.jpg"
  },
  { 
    id: "2", 
    nombre: "League of Legends", 
    espectadores: "182K", 
    etiquetas: ["MOBA"],
    imagenUrl: "https://static-cdn.jtvnw.net/ttv-boxart/21779-285x380.jpg"
  },
  { 
    id: "3", 
    nombre: "Fortnite", 
    espectadores: "156K", 
    etiquetas: ["Battle Royale"],
    imagenUrl: "https://static-cdn.jtvnw.net/ttv-boxart/33214-285x380.jpg"
  },
  { 
    id: "4", 
    nombre: "Valorant", 
    espectadores: "134K", 
    etiquetas: ["FPS", "Competitivo"],
    imagenUrl: "https://static-cdn. jtvnw.net/ttv-boxart/516575-285x380.jpg"
  },
  { 
    id: "5", 
    nombre: "Minecraft", 
    espectadores: "98K", 
    etiquetas: ["Sandbox"],
    imagenUrl: "https://static-cdn.jtvnw.net/ttv-boxart/27471_IGDB-285x380.jpg"
  },
  { 
    id: "6", 
    nombre: "GTA V", 
    espectadores: "87K", 
    etiquetas: ["Acción", "Mundo Abierto"],
    imagenUrl: "https://static-cdn.jtvnw.net/ttv-boxart/32982_IGDB-285x380.jpg"
  },
  { 
    id: "7", 
    nombre: "Counter-Strike 2", 
    espectadores: "75K", 
    etiquetas: ["FPS"],
    imagenUrl: "https://static-cdn.jtvnw.net/ttv-boxart/32399_IGDB-285x380.jpg"
  },
  { 
    id: "8", 
    nombre: "Apex Legends", 
    espectadores: "62K", 
    etiquetas: ["Battle Royale", "FPS"],
    imagenUrl: "https://static-cdn.jtvnw.net/ttv-boxart/511224-285x380.jpg"
  },
];

interface ExplorarProps {
  sidebarAbierto?: boolean;
}

export default function Explorar({ sidebarAbierto = true }: ExplorarProps) {
  const paddingLeft = sidebarAbierto ? "0px" : "60px";
  
  // TODO: Reemplazar con llamada al backend
  // useEffect(() => {
  //   fetch('http://localhost:5000/api/categorias')
  //     .then(res => res.json())
  //     .then(data => setCategorias(data))
  //     .catch(err => console. error('Error al cargar categorías:', err));
  // }, []);
  
  return (
    <div 
      style={{ 
        padding: "20px", 
        paddingLeft, 
        color: "#fff", 
        background: "#18181b", 
        minHeight: "100vh", 
        transition: "padding-left 0.3s ease" 
      }}
    >
      <section style={{ marginBottom: "30px" }}>
        <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
          Explorar categorías
        </h1>
        <p style={{ color: "#adadb8", fontSize: "14px" }}>
          Descubre nuevas categorías y comunidades
        </p>
      </section>

      <section>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
          gap: "20px" 
        }}>
          {CATEGORIAS.map((categoria) => (
            <Link 
              key={categoria.id} 
              to={`/categoria/${categoria. id}`} 
              style={{ textDecoration: "none" }}
            >
              <div 
                style={{ 
                  background: "#0e0e10", 
                  borderRadius: "8px", 
                  overflow: "hidden", 
                  border: "1px solid #333", 
                  cursor: "pointer",
                  transition: "transform 0.2s, border-color 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style. borderColor = "#9147ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e. currentTarget.style.borderColor = "#333";
                }}
              >
                <div style={{ 
                  width: "100%", 
                  height: "270px", 
                  overflow: "hidden",
                  position: "relative"
                }}>
                  <img 
                    src={categoria.imagenUrl} 
                    alt={categoria.nombre}
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover"
                    }}
                    onError={(e) => {
                      // Fallback si la imagen no carga
                      const target = e.target as HTMLImageElement;
                      target.style. display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.style.background = "linear-gradient(135deg, #1f1f23 0%, #2a2a2e 100%)";
                        parent.innerHTML = `
                          <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                            <div style="width: 60px; height: 60px; borderRadius: 8px; background: rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: center; fontSize: 24px; color: #9147ff;">
                              🎮
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>

                <div style={{ padding: "12px" }}>
                  <div style={{ 
                    color: "#fff", 
                    fontWeight: "bold", 
                    fontSize: "14px", 
                    marginBottom: "6px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {categoria.nombre}
                  </div>
                  <div style={{ 
                    color: "#adadb8", 
                    fontSize: "13px", 
                    marginBottom: "8px" 
                  }}>
                    {categoria.espectadores} espectadores
                  </div>
                  {categoria.etiquetas && categoria.etiquetas.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {categoria. etiquetas.map((etiqueta, index) => (
                        <span 
                          key={index} 
                          style={{ 
                            fontSize: "11px", 
                            background: "#2e2e35", 
                            padding: "2px 8px", 
                            borderRadius: "12px", 
                            color: "#adadb8" 
                          }}
                        >
                          {etiqueta}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}