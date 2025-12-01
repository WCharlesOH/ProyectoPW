import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../Comandosllamadas/llamadas";

interface Juego {
  ID_Juego: number;
  Nombre: string;
}

interface ExplorarProps {
  sidebarAbierto?: boolean;
}

export default function Explorar({ sidebarAbierto = true }: ExplorarProps) {
  const [juegos, setJuegos] = useState<Juego[]>([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  const paddingLeft = sidebarAbierto ?  "0px" : "60px";

  useEffect(() => {
    cargarJuegos();
  }, []);

  const cargarJuegos = async () => {
    setCargando(true);
    const resultado = await API.ObtenerJuegos();
    
    if (resultado.success) {
      setJuegos(resultado.juegos || []);
    } else {
      console.error("Error al cargar juegos:", resultado.error);
    }
    setCargando(false);
  };

  const handleCategoriaClick = (nombreJuego: string) => {
    // Redirigir a la página de categoría con el nombre del juego
    navigate(`/categoria/${encodeURIComponent(nombreJuego)}`);
  };

  if (cargando) {
    return (
      <div 
        style={{ 
          padding: "20px", 
          paddingLeft, 
          color: "#fff", 
          background: "#18181b", 
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{
            border: "4px solid #2a2a2e",
            borderTop: "4px solid #9147ff",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px"
          }}></div>
          <p style={{ color: "#adadb8" }}>Cargando categorías...</p>
        </div>
      </div>
    );
  }

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
          Descubre nuevas categorías y comunidades ({juegos.length} categorías disponibles)
        </p>
      </section>

      <section>
        {juegos.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "60px 20px",
            color: "#adadb8"
          }}>
            <p style={{ fontSize: "18px", marginBottom: "10px" }}>
              No hay categorías disponibles
            </p>
            <p style={{ fontSize: "14px" }}>
              Agrega juegos en la base de datos para verlos aquí
            </p>
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
            gap: "20px" 
          }}>
            {juegos.map((juego) => (
              <div 
                key={juego.ID_Juego}
                onClick={() => handleCategoriaClick(juego.Nombre)}
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
                  e.currentTarget.style.borderColor = "#9147ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.borderColor = "#333";
                }}
              >
                <div style={{ 
                  width: "100%", 
                  height: "270px", 
                  background: "linear-gradient(135deg, #1f1f23 0%, #2a2a2e 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative"
                }}>
                  <div style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "12px",
                    background: "rgba(145, 71, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "40px"
                  }}>
                    🎮
                  </div>
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
                    {juego.Nombre}
                  </div>
                  <div style={{ 
                    color: "#adadb8", 
                    fontSize: "13px", 
                    marginBottom: "8px" 
                  }}>
                    Ver streams en vivo
                  </div>
                  <div style={{
                    fontSize: "11px",
                    color: "#9147ff",
                    background: "rgba(145, 71, 255, 0.2)",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    display: "inline-block"
                  }}>
                    Categoría
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}