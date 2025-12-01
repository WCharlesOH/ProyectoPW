import { useMemo, useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import type { Usuario } from "../components/types";

interface PanelControlProps {
  monedas: number;
  setMonedas: (valor: number) => void;
}

export default function PanelControl({
  monedas,
  setMonedas,
}: PanelControlProps) {
  const { user } = useAuth();
  const [userData, setUserData] = useState<Usuario | null>(null);
  const [bonoActivo, setBonoActivo] = useState(false);

  useEffect(() => {
    // Obtener datos del usuario desde localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
      } catch (error) {
        console.error("Error al parsear usuario:", error);
      }
    }
  }, [user]);

  const puntos = useMemo(() => {
    if (userData) {
      return {
        nivelActual: userData.NivelStreams || 1,
        puntosActuales: userData.Puntos || 0,
        puntosSiguiente: (userData.NivelStreams || 1) * 500,
      };
    }
    return {
      nivelActual: 1,
      puntosActuales: 0,
      puntosSiguiente: 500,
    };
  }, [userData]);

  const progresoNivel = useMemo(() => {
    return Math.min(
      (puntos.puntosActuales / puntos.puntosSiguiente) * 100,
      100
    );
  }, [puntos]);

  const BARRAS_NIVEL = useMemo(() => {
    const horasTransmision = userData?.HorasTransmision || 0;
    const progresoHoras = Math.min((horasTransmision / 100) * 100, 100);

    return [
      {
        titulo: "Progreso de nivel",
        progreso: progresoNivel,
        descripcion: `${puntos.puntosActuales} / ${puntos.puntosSiguiente} puntos`,
      },
      {
        titulo: "Horas de transmisión",
        progreso: progresoHoras,
        descripcion: `${horasTransmision} horas transmitidas`,
      },
      {
        titulo: "Objetivo de monedas",
        progreso: Math.min((monedas / 1000) * 100, 100),
        descripcion: `${monedas} / 1000 monedas`,
      },
    ];
  }, [userData, monedas, puntos, progresoNivel]);

  const comprarMonedas = (cantidad: number) => {
    const nuevoSaldo = monedas + cantidad;
    setMonedas(nuevoSaldo);

    // Actualizar en localStorage
    if (userData) {
      const updatedUser = { ...userData, Monedas: nuevoSaldo };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUserData(updatedUser);
    }
  };

  const activarBono = () => {
    if (!bonoActivo) {
      const bonificacion = 50;
      comprarMonedas(bonificacion);
      setBonoActivo(true);
      setTimeout(() => setBonoActivo(false), 86400000);
    }
  };

  return (
    <div
      style={{
        padding: 24,
        color: "white",
        backgroundColor: "#0e0e10",
        minHeight: "100vh",
      }}
    >
      {/* Header con información del usuario */}
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div style={{ flex: 1, minWidth: "300px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <img
              src={
                userData?.ImagenPerfil ||
                "https://ui-avatars.com/api/? name=User&background=9147ff&color=fff&size=80"
              }
              alt="Perfil"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: "3px solid #9147ff",
                objectFit: "cover",
              }}
            />
            <div>
              <h1 style={{ margin: "0 0 8px 0", fontSize: "28px" }}>
                {userData?.NombreUsuario || "Usuario"}
              </h1>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  fontSize: "14px",
                  color: "#adadb8",
                }}
              >
                <span>🎮 Nivel {puntos.nivelActual}</span>
                <span>⭐ {puntos.puntosActuales} pts</span>
                <span>⏱️ {userData?.HorasTransmision || 0}h</span>
              </div>
            </div>
          </div>
          <p style={{ margin: 0, opacity: 0.8, fontSize: "14px" }}>
            Centro de control - Gestiona tu perfil, monedas y progreso
          </p>
        </div>

        {/* Card de Monedas */}
        <div
          style={{
            background: "#1f1f23",
            padding: 20,
            borderRadius: 10,
            minWidth: 260,
            border: "2px solid #333",
          }}
        >
          <p style={{ margin: "0 0 8px 0", opacity: 0.8, fontSize: "14px" }}>
            💰 Saldo disponible
          </p>
          <p
            style={{
              margin: "0 0 16px 0",
              fontSize: 32,
              fontWeight: 700,
              color: "#f59e0b",
            }}
          >
            🪙 {userData?.Monedas || monedas}
          </p>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {[100, 250, 500].map((monto) => (
              <button
                key={monto}
                onClick={() => comprarMonedas(monto)}
                style={{
                  flex: 1,
                  background: "#9147ff",
                  border: "none",
                  color: "white",
                  borderRadius: 6,
                  padding: "10px",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "14px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#7c3aed")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#9147ff")
                }
              >
                +{monto}
              </button>
            ))}
          </div>
          <button
            onClick={activarBono}
            disabled={bonoActivo}
            style={{
              width: "100%",
              background: bonoActivo ? "#555" : "#10b981",
              border: "none",
              color: "white",
              borderRadius: 6,
              padding: "10px",
              cursor: bonoActivo ? "not-allowed" : "pointer",
              fontWeight: 700,
              fontSize: "13px",
            }}
          >
            {bonoActivo ? "✓ Bono activado" : "🎁 Bono diario (+50)"}
          </button>
        </div>
      </header>

      {/* Barras de progreso */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
          📊 Tu Progreso
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {BARRAS_NIVEL.map((item) => (
            <div
              key={item.titulo}
              style={{
                background: "#1f1f23",
                padding: 16,
                borderRadius: 10,
                border: "1px solid #333",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px 0",
                  fontWeight: 700,
                  fontSize: "15px",
                }}
              >
                {item.titulo}
              </p>
              <p
                style={{ margin: "0 0 12px 0", opacity: 0.7, fontSize: "13px" }}
              >
                {item.descripcion}
              </p>
              <div
                style={{
                  background: "#0e0e10",
                  borderRadius: 8,
                  overflow: "hidden",
                  height: 12,
                }}
              >
                <div
                  style={{
                    width: `${item.progreso}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, #9147ff, #7c3aed)`,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
              <p
                style={{
                  margin: "6px 0 0 0",
                  textAlign: "right",
                  fontSize: "12px",
                  color: "#9147ff",
                  fontWeight: 700,
                }}
              >
                {Math.round(item.progreso)}%
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Estadísticas adicionales */}
      <section>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
          📈 Estadísticas
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          <div
            style={{
              background: "#1f1f23",
              padding: 16,
              borderRadius: 10,
              border: "1px solid #333",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
            <p style={{ margin: "0 0 4px 0", fontSize: 24, fontWeight: 700 }}>
              {puntos.nivelActual}
            </p>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>
              Nivel actual
            </p>
          </div>

          <div
            style={{
              background: "#1f1f23",
              padding: 16,
              borderRadius: 10,
              border: "1px solid #333",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>⭐</div>
            <p style={{ margin: "0 0 4px 0", fontSize: 24, fontWeight: 700 }}>
              {puntos.puntosActuales}
            </p>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>
              Puntos totales
            </p>
          </div>

          <div
            style={{
              background: "#1f1f23",
              padding: 16,
              borderRadius: 10,
              border: "1px solid #333",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>⏰</div>
            <p style={{ margin: "0 0 4px 0", fontSize: 24, fontWeight: 700 }}>
              {userData?.HorasTransmision || 0}
            </p>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>
              Horas transmitidas
            </p>
          </div>

          <div
            style={{
              background: "#1f1f23",
              padding: 16,
              borderRadius: 10,
              border: "1px solid #333",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>💰</div>
            <p style={{ margin: "0 0 4px 0", fontSize: 24, fontWeight: 700 }}>
              {userData?.Monedas || monedas}
            </p>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>
              Monedas acumuladas
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
