import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Usuario } from "../components/types";

export default function Perfil_V() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const titi: Usuario | null = user ? JSON.parse(user) : null;
  const nombre = titi?.NombreUsuario;
  let funcion: number | null = null;
  if (titi) {
    funcion = 1 + Math.floor(titi.NivelStreams / 100);
  }

  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [mostrarEstado, setMostrarEstado] = useState(false);
  const [mostrarCanjear, setMostrarCanjear] = useState(false);

  return (
    <div
      style={{
        padding: "40px",
        color: "white",
        textAlign: "center",
        backgroundColor: "#0e0e10",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <h2 style={{ color: "#00b7ff", marginBottom: "20px", fontSize: "28px" }}>
        Mi Perfil de Streamer
      </h2>

      {/* Imagen central con información */}
      <div
        style={{
          margin: "20px auto",
          position: "relative",
          display: "inline-block",
        }}
      >
        <img
          src={
            titi?.ImagenPerfil ||
            "https://ui-avatars.com/api/?name=User&background=9147ff&color=fff&size=200"
          }
          alt="Streamer"
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: "4px solid #00b7ff",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            background: "#9147ff",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: "bold",
            border: "3px solid #0e0e10",
          }}
        >
          {titi?.NivelStreams || 1}
        </div>
      </div>

      {/* Información del usuario */}
      <div style={{ marginBottom: "30px" }}>
        <h3 style={{ fontSize: "24px", margin: "10px 0" }}>
          {nombre || "Usuario"}
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            fontSize: "14px",
            color: "#adadb8",
          }}
        >
          <span>🎮 Nivel {titi?.NivelStreams || 1}</span>
          <span>⭐ {titi?.Puntos || 0} pts</span>
          <span>🪙 {titi?.Monedas || 0} monedas</span>
          <span>⏱️ {titi?.HorasTransmision || 0}h transmitidas</span>
        </div>
      </div>

      {/* Opciones con funcionalidad */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
          marginTop: "30px",
        }}
      >
        <button
          onClick={() => setMostrarInfo(true)}
          style={{
            width: "300px",
            padding: "14px",
            backgroundColor: "#1f1f23",
            border: "2px solid #00b7ff",
            borderRadius: "8px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.2s",
            fontSize: "15px",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#00b7ff")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#1f1f23")
          }
        >
          📋 Información sobre mí
        </button>

        <button
          onClick={() => setMostrarEstado(true)}
          style={{
            width: "300px",
            padding: "14px",
            backgroundColor: "#1f1f23",
            border: "2px solid #00b7ff",
            borderRadius: "8px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.2s",
            fontSize: "15px",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#00b7ff")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#1f1f23")
          }
        >
          📊 Estado actual
        </button>

        <button
          onClick={() => setMostrarCanjear(true)}
          style={{
            width: "300px",
            padding: "14px",
            backgroundColor: "#1f1f23",
            border: "2px solid #f59e0b",
            borderRadius: "8px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.2s",
            fontSize: "15px",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#f59e0b")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#1f1f23")
          }
        >
          💰 Canjear monedas
        </button>

        <button
          onClick={() => navigate(`/Logros/${nombre}`)}
          style={{
            width: "300px",
            padding: "14px",
            backgroundColor: "#1f1f23",
            border: "2px solid #9147ff",
            borderRadius: "8px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.2s",
            fontSize: "15px",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#9147ff")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#1f1f23")
          }
        >
          🏆 Ver mis logros
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            width: "300px",
            padding: "14px",
            backgroundColor: "#1f1f23",
            border: "2px solid #10b981",
            borderRadius: "8px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.2s",
            fontSize: "15px",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#10b981")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#1f1f23")
          }
        >
          🎥 Dashboard Streamer
        </button>
      </div>

      {/* POPUP: Información sobre mí */}
      {mostrarInfo && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setMostrarInfo(false)}
        >
          <div
            style={{
              background: "#1f1f23",
              borderRadius: "12px",
              padding: "30px",
              maxWidth: "500px",
              width: "90%",
              border: "2px solid #00b7ff",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                color: "#00b7ff",
                marginBottom: "20px",
                fontSize: "22px",
              }}
            >
              📋 Información del perfil
            </h3>
            <div style={{ textAlign: "left", lineHeight: "1.8" }}>
              <p>
                <strong>Usuario:</strong> {nombre}
              </p>
              <p>
                <strong>Nivel:</strong> {funcion || 1}
              </p>
              <p>
                <strong>Puntos:</strong> {titi?.Puntos || 0}
              </p>
              <p>
                <strong>Monedas:</strong> {titi?.Monedas || 0}
              </p>
              <p>
                <strong>Horas transmitidas:</strong>{" "}
                {titi?.HorasTransmision || 0} horas
              </p>
              <p>
                <strong>ID de usuario:</strong> {titi?.ID}
              </p>
            </div>
            <button
              onClick={() => setMostrarInfo(false)}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "12px",
                background: "#00b7ff",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* POPUP: Estado actual */}
      {mostrarEstado && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setMostrarEstado(false)}
        >
          <div
            style={{
              background: "#1f1f23",
              borderRadius: "12px",
              padding: "30px",
              maxWidth: "500px",
              width: "90%",
              border: "2px solid #00b7ff",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                color: "#00b7ff",
                marginBottom: "20px",
                fontSize: "22px",
              }}
            >
              📊 Tu estado actual
            </h3>
            <div style={{ textAlign: "left" }}>
              <div style={{ marginBottom: "20px" }}>
                <p style={{ marginBottom: "8px" }}>
                  Progreso al siguiente nivel:
                </p>
                <div
                  style={{
                    background: "#0e0e10",
                    borderRadius: "8px",
                    overflow: "hidden",
                    height: "20px",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(
                        ((titi?.Puntos || 0) /
                          ((titi?.NivelStreams || 1) * 500)) *
                          100,
                        100
                      )}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #9147ff, #00b7ff)",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    marginTop: "4px",
                    color: "#adadb8",
                  }}
                >
                  {titi?.Puntos || 0} / {(titi?.NivelStreams || 1) * 500} puntos
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                }}
              >
                <div
                  style={{
                    background: "#0e0e10",
                    padding: "15px",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "28px" }}>🎯</div>
                  <p
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      margin: "8px 0",
                    }}
                  >
                    {titi?.NivelStreams || 1}
                  </p>
                  <p style={{ fontSize: "12px", color: "#adadb8" }}>Nivel</p>
                </div>

                <div
                  style={{
                    background: "#0e0e10",
                    padding: "15px",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "28px" }}>⏱️</div>
                  <p
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      margin: "8px 0",
                    }}
                  >
                    {titi?.HorasTransmision || 0}h
                  </p>
                  <p style={{ fontSize: "12px", color: "#adadb8" }}>
                    Transmitidas
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setMostrarEstado(false)}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "12px",
                background: "#00b7ff",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* POPUP: Canjear monedas */}
      {mostrarCanjear && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setMostrarCanjear(false)}
        >
          <div
            style={{
              background: "#1f1f23",
              borderRadius: "12px",
              padding: "30px",
              maxWidth: "500px",
              width: "90%",
              border: "2px solid #f59e0b",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                color: "#f59e0b",
                marginBottom: "20px",
                fontSize: "22px",
              }}
            >
              💰 Canjear monedas
            </h3>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <p
                style={{
                  fontSize: "36px",
                  fontWeight: "bold",
                  color: "#f59e0b",
                }}
              >
                🪙 {titi?.Monedas || 0}
              </p>
              <p style={{ fontSize: "14px", color: "#adadb8" }}>
                Monedas disponibles
              </p>
            </div>

            <div style={{ display: "grid", gap: "12px" }}>
              <div
                style={{
                  background: "#0e0e10",
                  padding: "15px",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontWeight: "bold", marginBottom: "4px" }}>
                    🎁 Regalo Premium
                  </p>
                  <p style={{ fontSize: "12px", color: "#adadb8" }}>
                    Desbloquea contenido exclusivo
                  </p>
                </div>
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#f59e0b",
                  }}
                >
                  500 🪙
                </p>
              </div>

              <div
                style={{
                  background: "#0e0e10",
                  padding: "15px",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontWeight: "bold", marginBottom: "4px" }}>
                    ⭐ Destacado en home
                  </p>
                  <p style={{ fontSize: "12px", color: "#adadb8" }}>
                    Aparece en la página principal
                  </p>
                </div>
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#f59e0b",
                  }}
                >
                  1000 🪙
                </p>
              </div>

              <div
                style={{
                  background: "#0e0e10",
                  padding: "15px",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontWeight: "bold", marginBottom: "4px" }}>
                    🚀 Boost de canal
                  </p>
                  <p style={{ fontSize: "12px", color: "#adadb8" }}>
                    Aumenta tu visibilidad x2
                  </p>
                </div>
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#f59e0b",
                  }}
                >
                  2000 🪙
                </p>
              </div>
            </div>

            <button
              onClick={() => setMostrarCanjear(false)}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "12px",
                background: "#f59e0b",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
