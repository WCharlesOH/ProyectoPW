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
    if (!nombreJuego) return;
    
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
          fontSize: "14px"
        }}
      >
        ← Volver a Explorar
      </button>

      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "10px" }}>
        {nombreJuego ?  decodeURIComponent(nombreJuego) : "Categoría"}
      </h1>
      
      <p style={{ color: "#adadb8", fontSize: "14px", marginBottom: "30px" }}>
        {streamers.length} {streamers.length === 1 ? "streamer en vivo" : "streamers en vivo"}
      </p>

      {streamers.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "60px 20px",
          color: "#adadb8"
        }}>
          <p style={{ fontSize: "18px", marginBottom: "10px" }}>
            No hay streamers en vivo en esta categoría
          </p>
          <p style={{ fontSize: "14px" }}>
            Vuelve más tarde para ver streams
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
                transition: "transform 0.2s, border-color 0.2s"
              }}
              onMouseEnter={(e) => {
                e. currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.borderColor = "#9147ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style. borderColor = "#333";
              }}
            >
              <div style={{
                height: "170px",
                background: "linear-gradient(135deg, #1f1f23 0%, #2a2a2e 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative"
              }}>
                <div style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  background: "rgba(255, 0, 0, 0.9)",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "bold"
                }}>
                  🔴 EN VIVO
                </div>
                <span style={{ fontSize: "60px" }}>🎮</span>
              </div>

              <div style={{ padding: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  {streamer.ImagenPerfil ?  (
                    <img
                      src={streamer.ImagenPerfil}
                      alt={streamer.NombreUsuario}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <div style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "#9147ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px"
                    }}>
                      👤
                    </div>
                  )}
                  <div>
                    <div style={{ 
                      color: "#fff", 
                      fontWeight: "bold", 
                      fontSize: "14px" 
                    }}>
                      {streamer.NombreUsuario}
                    </div>
                    <div style={{ 
                      color: "#adadb8", 
                      fontSize: "12px" 
                    }}>
                      Nivel {streamer.NivelStreams}
                    </div>
                  </div>
                </div>

                <div style={{
                  color: "#e0e0e0",
                  fontSize: "13px",
                  marginBottom: "6px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  {streamer.TituloStream || "Sin título"}
                </div>

                {streamer.Categoria && (
                  <div style={{
                    fontSize: "11px",
                    color: "#adadb8",
                    background: "#2e2e35",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    display: "inline-block"
                  }}>
                    {streamer.Categoria}
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
      `}</style>
    </div>
  );
}