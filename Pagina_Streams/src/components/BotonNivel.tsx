import React, { useState, useEffect } from "react";

interface BotonNivelProps {
  nivel: number;
  progreso: number; // porcentaje (0-100)
}

export default function BotonNivel({ nivel, progreso }: BotonNivelProps) {
  const [abierto, setAbierto] = useState(false);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".boton-nivel")) setAbierto(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="boton-nivel" style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setAbierto(!abierto)}
        style={{
          backgroundColor: "#1f1f23",
          color: "white",
          border: "1px solid #333",
          borderRadius: "4px",
          padding: "6px 10px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        ⭐ Nivel {nivel}
      </button>

      {abierto && (
        <div
          style={{
            position: "absolute",
            bottom: "110%",
            right: 0,
            width: "220px",
            backgroundColor: "#1f1f23",
            border: "1px solid #333",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
            color: "white",
            zIndex: 100,
            padding: "12px",
          }}
        >
          <h4 style={{ margin: "0 0 8px", fontSize: "0.9rem" }}>Progreso de nivel</h4>
          <div
            style={{
              height: "10px",
              background: "#2a2a2e",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.min(progreso, 100)}%`,
                height: "100%",
                background: "linear-gradient(90deg,#00b7ff,#00f0b4)",
              }}
            />
          </div>
          <div style={{ marginTop: "8px", fontSize: "0.8rem", color: "#b3b3b3" }}>
            {progreso}% completado
          </div>
        </div>
      )}
    </div>
  );
}