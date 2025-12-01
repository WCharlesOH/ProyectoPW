import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../Comandosllamadas/llamadas";

interface Streamer {
  ID: number;
  NombreUsuario: string;
  ImagenPerfil: string;
  NivelStreams: number;
  TituloStream: string;
  Categoria: string;
}

export default function CategoriaDetalle() {
  const { nombreJuego } = useParams<{ nombreJuego: string }>();
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (nombreJuego) {
      cargarStreamers();
    }
  }, [nombreJuego]);

  const cargarStreamers = async () => {
    if (! nombreJuego) return;
    
    setCargando(true);
    const resultado = await API.StreamersPorJuego(decodeURIComponent(nombreJuego));
    
    if (resultado.success) {
      setStreamers(resultado.streamers || []);
    } else {
      console.error("Error al cargar streamers:", resultado.error);
    }
    setCargando(false);
  };

  const irAPerfil = (nombreUsuario: string) => {
    navigate(`/${nombreUsuario}`);
  };

  if (cargando) {
    return (
      <div style={{ 
        padding: "20px", 
        color: "#fff", 
        background: "#18181b", 
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
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
          <p style={{ color: "#adadb8" }}>Cargando streams...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "20px", 
      color: "#fff", 
      background: "#18181b", 
      minHeight: "100vh"
    }}>
      <button
        onClick={() => navigate("/explorar")}
        style={{
          background: "#2a2a2e",
          border: "1px solid #3a3a3e",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "20px",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          transition: "all 0.2s"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#353539";
        }}
        onMouseLeave={(e) => {
          e. currentTarget.style.background = "#2a2a2e";
        }}
      >
        ← Volver a Explorar
      </button>

      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "10px" }}>
          {nombreJuego ?  decodeURIComponent(nombreJuego) : "Categoría"}
        </h1>
        
        <p style={{ color: "#adadb8", fontSize: "14px" }}>
          {streamers.length === 0 
            ? "No hay streamers en vivo en este momento" 
            : `${streamers.length} ${streamers.length === 1 ? "streamer en vivo" : "streamers en vivo"}`
          }
        </p>
      </div>

      {streamers.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "60px 20px",
          color: "#adadb8",
          background: "#0e0e10",
          borderRadius: "12px",
          border: "1px solid #333"
        }}>
          <div style={{ fontSize: "60px", marginBottom: "20px" }}>📺</div>
          <p style={{ fontSize: "18px", marginBottom: "10px", fontWeight: "bold", color: "#fff" }}>
            No hay streamers en vivo
          </p>
          <p style={{ fontSize: "14px" }}>
            No hay transmisiones activas en <strong>{nombreJuego ?  decodeURIComponent(nombreJuego) : "esta categoría"}</strong> en este momento. 
          </p>
          <p style={{ fontSize: "13px", marginTop: "8px" }}>
            Vuelve más tarde o explora otras categorías
          </p>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
          gap: "20px" 
        }}>
          {streamers.map((streamer) => (
            <div
              key={streamer.ID}
              onClick={() => irAPerfil(streamer.NombreUsuario)}
              style={{
                background: "#0e0e10",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid #333",
                cursor: "pointer",
                transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style. transform = "translateY(-5px)";
                e.currentTarget.style.borderColor = "#9147ff";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(145, 71, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e. currentTarget.style.borderColor = "#333";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Thumbnail/Preview */}
              <div style={{
                height: "170px",
                background: "linear-gradient(135deg, #1f1f23 0%, #2a2a2e 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative"
              }}>
                {/* Badge EN VIVO */}
                <div style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  background: "rgba(255, 0, 0, 0.9)",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}>
                  <span style={{ 
                    width: "8px", 
                    height: "8px", 
                    background: "white", 
                    borderRadius: "50%",
                    animation: "pulse 2s infinite"
                  }}></span>
                  EN VIVO
                </div>
                
                <span style={{ fontSize: "60px" }}>🎮</span>
              </div>

              {/* Información del streamer */}
              <div style={{ padding: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  {/* Avatar */}
                  {streamer.ImagenPerfil ?  (
                    <img
                      src={streamer.ImagenPerfil}
                      alt={streamer.NombreUsuario}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #9147ff"
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style. display = "none";
                        if (target.nextElementSibling) {
                          (target.nextElementSibling as HTMLElement).style.display = "flex";
                        }
                      }}
                    />
                  ) : null}
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#9147ff",
                    display: streamer.ImagenPerfil ? "none" : "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    border: "2px solid #9147ff"
                  }}>
                    👤
                  </div>
                  
                  {/* Nombre y nivel */}
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      color: "#fff", 
                      fontWeight: "bold", 
                      fontSize: "14px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>
                      {streamer.NombreUsuario}
                    </div>
                    <div style={{ 
                      color: "#adadb8", 
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      ⭐ Nivel {streamer.NivelStreams}
                    </div>
                  </div>
                </div>

                {/* Título del stream */}
                <div style={{
                  color: "#e0e0e0",
                  fontSize: "13px",
                  marginBottom: "8px",
                  height: "38px",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  lineHeight: "1.4"
                }}>
                  {streamer.TituloStream || "Sin título"}
                </div>

                {/* Categoría/Tags */}
                {streamer.Categoria && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {streamer.Categoria.split(",").slice(0, 2).map((cat, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: "11px",
                          color: "#adadb8",
                          background: "#2e2e35",
                          padding: "4px 8px",
                          borderRadius: "4px"
                        }}
                      >
                        {cat. trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}