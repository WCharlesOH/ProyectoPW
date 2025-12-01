import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../Comandosllamadas/llamadas";

interface Streamer {
  ID: number;
  NombreUsuario: string;
  ImagenPerfil: string;
  NivelStreams: number;
  TituloStream: string;
  Categoria: string;
}

interface CategoriaPaginaProps {
  sidebarAbierto?: boolean;
}

export default function CategoriaPagina({ sidebarAbierto = true }: CategoriaPaginaProps) {
  const { categoriaId } = useParams<{ categoriaId: string }>();
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [nombreCategoria, setNombreCategoria] = useState<string>("");
  const [cargando, setCargando] = useState(true);
  const paddingLeft = sidebarAbierto ? "0px" : "60px";
  const navigate = useNavigate();

  useEffect(() => {
    if (categoriaId) {
      cargarStreamers();
    }
  }, [categoriaId]);

  const cargarStreamers = async () => {
    if (!categoriaId) return;
    
    setCargando(true);
    
    // Decodificar el nombre del juego desde la URL
    const nombreJuego = decodeURIComponent(categoriaId);
    setNombreCategoria(nombreJuego);
    
    // Llamar al backend para obtener streamers con ese juego
    const resultado = await API.StreamersPorJuego(nombreJuego);
    
    if (resultado.success) {
      setStreamers(resultado.streamers || []);
    } else {
      console.error("Error al cargar streamers:", resultado.error);
      setStreamers([]);
    }
    
    setCargando(false);
  };

  const irAPerfil = (nombreUsuario: string) => {
    navigate(`/${nombreUsuario}`);
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
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              border: "4px solid #2a2a2e",
              borderTop: "4px solid #9147ff",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          ></div>
          <p style={{ color: "#adadb8" }}>Cargando streams...</p>
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
        transition: "padding-left 0. 3s ease",
      }}
    >
      <section style={{ marginBottom: "30px" }}>
        <Link
          to="/explorar"
          style={{
            color: "#9147ff",
            textDecoration: "none",
            fontSize: "14px",
            display: "inline-flex",
            alignItems: "center",
            marginBottom: "10px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget. style.color = "#b794f6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style. color = "#9147ff";
          }}
        >
          ← Volver a Explorar
        </Link>
        <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "bold", marginBottom: "10px" }}>
          {nombreCategoria}
        </h1>
        <p style={{ color: "#adadb8", fontSize: "14px" }}>
          {streamers.length === 0
            ? "No hay canales transmitiendo en este momento"
            : `${streamers.length} ${streamers.length === 1 ? "canal transmitiendo" : "canales transmitiendo"} en vivo`}
        </p>
      </section>

      <section>
        {streamers.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#adadb8",
              background: "#0e0e10",
              borderRadius: "12px",
              border: "1px solid #333",
            }}
          >
            <div style={{ fontSize: "60px", marginBottom: "20px" }}>📺</div>
            <h2 style={{ fontSize: "20px", marginBottom: "10px", color: "#fff" }}>
              No hay canales transmitiendo en este momento
            </h2>
            <p style={{ fontSize: "14px" }}>
              No hay transmisiones activas en <strong>{nombreCategoria}</strong> ahora mismo.
            </p>
            <p style={{ fontSize: "13px", marginTop: "8px" }}>
              Intenta explorar otras categorías o vuelve más tarde
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {streamers.map((streamer) => (
              <div
                key={streamer.ID}
                onClick={() => irAPerfil(streamer.NombreUsuario)}
                style={{
                  background: "#0e0e10",
                  borderRadius: "8px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.2s, border 0.2s, box-shadow 0.2s",
                  border: "1px solid #333",
                }}
                onMouseEnter={(e) => {
                  e. currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style. border = "1px solid #9147ff";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(145, 71, 255, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e. currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style. border = "1px solid #333";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Thumbnail/Preview del stream */}
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      width: "100%",
                      height: "180px",
                      background: "linear-gradient(135deg, #1f1f23 0%, #2a2a2e 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: "60px" }}>🎮</span>
                  </div>

                  {/* Badge EN VIVO */}
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      background: "#eb0400",
                      color: "#fff",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        background: "white",
                        borderRadius: "50%",
                        animation: "pulse 2s infinite",
                      }}
                    ></span>
                    EN VIVO
                  </div>

                  {/* Nivel del streamer */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      background: "rgba(0, 0, 0, 0. 8)",
                      color: "#00b7ff",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    ⭐ Nivel {streamer.NivelStreams}
                  </div>
                </div>

                {/* Información del canal */}
                <div style={{ padding: "12px", display: "flex", gap: "10px" }}>
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
                        border: "2px solid #9147ff",
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        if (target.nextElementSibling) {
                          (target.nextElementSibling as HTMLElement).style.display = "flex";
                        }
                      }}
                    />
                  ) : null}
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "#9147ff",
                      display: streamer.ImagenPerfil ? "none" : "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      border: "2px solid #9147ff",
                    }}
                  >
                    👤
                  </div>

                  {/* Detalles */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Título del stream */}
                    <div
                      style={{
                        color: "#fff",
                        fontSize: "14px",
                        fontWeight: "500",
                        marginBottom: "4px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {streamer.TituloStream || "Sin título"}
                    </div>

                    {/* Nombre del streamer */}
                    <div
                      style={{
                        color: "#adadb8",
                        fontSize: "13px",
                        marginBottom: "4px",
                      }}
                    >
                      {streamer.NombreUsuario}
                    </div>

                    {/* Categoría/Tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {streamer.Categoria ? (
                        streamer.Categoria.split(",")
                          .slice(0, 2)
                          .map((cat, idx) => (
                            <span
                              key={idx}
                              style={{
                                color: "#adadb8",
                                fontSize: "11px",
                                background: "#2e2e35",
                                padding: "2px 6px",
                                borderRadius: "4px",
                              }}
                            >
                              {cat. trim()}
                            </span>
                          ))
                      ) : (
                        <span
                          style={{
                            color: "#adadb8",
                            fontSize: "11px",
                            background: "#2e2e35",
                            padding: "2px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          {nombreCategoria}
                        </span>
                      )}
                    </div>
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
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}