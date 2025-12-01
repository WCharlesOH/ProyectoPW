import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Home.css";
import { API } from '../Comandosllamadas/llamadas';

interface StreamerData {
  NombreUsuario: string;
  ImagenPerfil: string;
  NivelStreams: number;
  ViendoCount: number;
  TotalChats: number;
}

interface InicioLogeadoProps {
  sidebarAbierto?: boolean;
}

export default function InicioLogeado({ sidebarAbierto = true }: InicioLogeadoProps) {
  const [streamerDestacado, setStreamerDestacado] = useState<StreamerData | null>(null);
  const [streamersRecomendados, setStreamersRecomendados] = useState<StreamerData[]>([]);
  const [cargandoDestacado, setCargandoDestacado] = useState(true);
  const [cargandoRecomendados, setCargandoRecomendados] = useState(true);

  // Ajustar el padding según si el sidebar está abierto o cerrado
  const paddingLeft = sidebarAbierto ? "0px" : "60px";

  // Cargar streamer más visto desde el backend
  useEffect(() => {
    const cargarStreamerDestacado = async () => {
      setCargandoDestacado(true);
      try {
        console.log("🔄 [Home] Cargando streamer más visto...");
        
        const result = await API.MasVisto();
        
        if (result.success && result.data && result.data.length > 0) {
          setStreamerDestacado(result. data[0]);
          console. log(`✅ [Home] Streamer destacado: ${result.data[0].NombreUsuario}`);
        } else {
          console.log("⚠️ [Home] No hay streamers en vivo");
          setStreamerDestacado(null);
        }
      } catch (error) {
        console. error("❌ [Home] Error cargando streamer destacado:", error);
        setStreamerDestacado(null);
      } finally {
        setCargandoDestacado(false);
      }
    };

    cargarStreamerDestacado();
  }, []);

  // Cargar streamers más vistos desde el backend
  useEffect(() => {
    const cargarStreamersRecomendados = async () => {
      setCargandoRecomendados(true);
      try {
        console.log("🔄 [Home] Cargando streamers más vistos...");
        
        const result = await API.MasVistos();
        
        if (result.success && result.streamers) {
          setStreamersRecomendados(result.streamers);
          console.log(`✅ [Home] ${result.streamers.length} streamers cargados`);
        } else {
          console.log("⚠️ [Home] No hay streamers disponibles");
          setStreamersRecomendados([]);
        }
      } catch (error) {
        console.error("❌ [Home] Error cargando streamers:", error);
        setStreamersRecomendados([]);
      } finally {
        setCargandoRecomendados(false);
      }
    };

    cargarStreamersRecomendados();
  }, []);

  return (
    <div className="home-page" style={{ paddingLeft }}>

      {/* Sección principal - Streamer más visto */}
      <section className="hero-grid">
        <div className="hero-grid__featured">
          {cargandoDestacado ? (
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              height: "100%",
              color: "#adadb8" 
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                border: "4px solid #333",
                borderTop: "4px solid #9147ff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }} />
            </div>
          ) : streamerDestacado ? (
            <>
              <div style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "16px",
                color: "#fff"
              }}>
                🔥 Más visto ahora
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "20px",
                background: "linear-gradient(135deg, #9147ff 0%, #6441a5 100%)",
                borderRadius: "12px",
              }}>
                <img
                  src={streamerDestacado.ImagenPerfil || `https://ui-avatars.com/api/? name=${streamerDestacado. NombreUsuario}&background=9147ff&color=fff&size=80`}
                  alt={streamerDestacado.NombreUsuario}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    border: "3px solid #fff",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: "28px", 
                    fontWeight: "bold", 
                    color: "#fff",
                    marginBottom: "8px"
                  }}>
                    {streamerDestacado.NombreUsuario}
                  </div>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "16px",
                    color: "#fff"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "20px" }}>👁️</span>
                      <span style={{ fontSize: "18px", fontWeight: "600" }}>
                        {streamerDestacado.ViendoCount} espectadores
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "20px" }}>⭐</span>
                      <span style={{ fontSize: "16px" }}>
                        Nivel {streamerDestacado.NivelStreams}
                      </span>
                    </div>
                  </div>
                  <Link 
                    to={`/canal/${streamerDestacado.NombreUsuario}`}
                    style={{
                      display: "inline-block",
                      marginTop: "12px",
                      padding: "10px 24px",
                      backgroundColor: "#fff",
                      color: "#9147ff",
                      borderRadius: "6px",
                      fontWeight: "bold",
                      textDecoration: "none",
                      transition: "transform 0.2s",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseOut={(e) => e.currentTarget.style. transform = "scale(1)"}
                  >
                    Ver stream →
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div style={{ 
              textAlign: "center", 
              padding: "40px", 
              color: "#adadb8" 
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📺</div>
              <div style={{ fontSize: "18px" }}>
                No hay streamers en vivo en este momento
              </div>
            </div>
          )}
        </div>

        {streamerDestacado && (
          <div className="hero-grid__card">
            <div className="hero-grid__card-top">
              <img
                src={streamerDestacado.ImagenPerfil || `https://ui-avatars. com/api/?name=${streamerDestacado.NombreUsuario}&background=random&size=50`}
                alt={streamerDestacado.NombreUsuario}
                className="hero-grid__avatar"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                }}
              />
              <div>
                <div style={{ color: "#00b7ff", fontWeight: "bold", fontSize: "16px" }}>
                  {streamerDestacado.NombreUsuario}
                </div>
                <div style={{ color: "#e91916", fontSize: "14px", fontWeight: "600" }}>
                  🔴 EN VIVO
                </div>
                <div style={{ color: "#aaa", fontSize: "13px" }}>
                  {streamerDestacado.ViendoCount} espectadores
                </div>
                <div style={{ color: "#aaa", fontSize: "12px" }}>
                  Nivel {streamerDestacado. NivelStreams}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Sección recomendados - Streamers más vistos */}
      <section>
        <h2 className="section-title">
          🎯 Canales más vistos
        </h2>

        {cargandoRecomendados ? (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            padding: "60px",
            color: "#adadb8" 
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              border: "4px solid #333",
              borderTop: "4px solid #9147ff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }} />
          </div>
        ) : streamersRecomendados.length > 0 ? (
          <>
            <div className="recommendations">
              {streamersRecomendados.map((streamer, index) => (
                <div key={`${streamer.NombreUsuario}-${index}`} className="recommendations__item">
                  <Link to={`/canal/${streamer.NombreUsuario}`}>
                    <div 
                      className="recommendations__thumb"
                      style={{
                        backgroundImage: `url(${streamer.ImagenPerfil || `https://ui-avatars.com/api/?name=${streamer.NombreUsuario}&background=random&size=200`})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        position: "relative",
                      }}
                    >
                      <div style={{
                        position: "absolute",
                        top: "8px",
                        left: "8px",
                        backgroundColor: "#e91916",
                        color: "#fff",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}>
                        🔴 EN VIVO
                      </div>
                      <div style={{
                        position: "absolute",
                        bottom: "8px",
                        left: "8px",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        color: "#fff",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}>
                        👁️ {streamer. ViendoCount}
                      </div>
                    </div>
                  </Link>

                  <div className="recommendations__body">
                    <div className="recommendations__meta">
                      <img
                        src={streamer. ImagenPerfil || `https://ui-avatars.com/api/?name=${streamer.NombreUsuario}&background=random&size=40`}
                        alt={streamer.NombreUsuario}
                        className="recommendations__author-avatar"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <Link 
                          to={`/canal/${streamer.NombreUsuario}`} 
                          className="recommendations__title"
                          style={{
                            fontWeight: "bold",
                            color: "#fff",
                            textDecoration: "none",
                          }}
                        >
                          {streamer.NombreUsuario}
                        </Link>
                        <div className="recommendations__channel" style={{ color: "#adadb8" }}>
                          Nivel {streamer.NivelStreams}
                        </div>
                        <div className="recommendations__details" style={{ color: "#adadb8" }}>
                          {streamer.ViendoCount} espectadores · {streamer.TotalChats} chats totales
                        </div>
                        <div className="recommendations__tags">
                          <span className="recommendations__tag">
                            🔴 En vivo
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="home-page__footer">
              <Link to="/explorar" style={{ color: "#00b7ff", textDecoration: "none", fontWeight: "600" }}>
                Ver todos los canales →
              </Link>
            </div>
          </>
        ) : (
          <div style={{ 
            textAlign: "center", 
            padding: "60px", 
            color: "#adadb8" 
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>😴</div>
            <div style={{ fontSize: "18px" }}>
              No hay canales disponibles en este momento
            </div>
          </div>
        )}
      </section>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}