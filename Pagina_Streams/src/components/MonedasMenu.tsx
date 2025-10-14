import React, { useEffect } from "react";

interface MonedasMenuProps {
  monedas: number;
  setMonedas: (nuevas: number) => void;
  abierto: boolean;
  setAbierto: (estado: boolean) => void;
}

export default function MonedasMenu({ monedas, setMonedas, abierto, setAbierto }: MonedasMenuProps) {
  const paquetes = [
    { monto: 100, precioUSD: 1.40, descuento: null },
    { monto: 500, precioUSD: 7.0, descuento: null },
    { monto: 1500, precioUSD: 19.95, descuento: "5 % de descuento" },
    { monto: 5000, precioUSD: 64.40, descuento: "8 % de descuento" },
    { monto: 10000, precioUSD: 126.0, descuento: "10 % de descuento" },
    { monto: 25000, precioUSD: 308.0, descuento: "12 % de descuento" },
  ];

  // Cerrar el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".menu-monedas")) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setAbierto]);

  const comprar = (cantidad: number) => {
    setMonedas(monedas + cantidad);
    setAbierto(false);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }} className="menu-monedas">
      {/* Botón principal */}
      <button
        onClick={() => setAbierto(!abierto)}
        style={{
          backgroundColor: "#1f1f23",
          color: "white",
          border: "1px solid #333",
          borderRadius: "4px",
          padding: "8px 12px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontWeight: "bold",
        }}
      >
        💰 {monedas}
      </button>

      {/* Menú desplegable */}
      {abierto && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            right: 0,
            width: "320px",
            backgroundColor: "#1f1f23",
            border: "1px solid #333",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
            color: "white",
            zIndex: 100,
            padding: "12px",
          }}
        >
          <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem" }}>Comprar Monedas</h3>
          <p style={{ margin: "0 0 12px", fontSize: "0.9rem", color: "#aaa" }}>
            Apoya a los streamers con monedas. Los precios se muestran en USD.
          </p>
          {paquetes.map((p) => (
            <div
              key={p.monto}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#2a2a2e",
                borderRadius: 6,
                padding: "8px 12px",
                marginBottom: 8,
              }}
            >
              <div>
                <div style={{ fontWeight: "bold" }}>{p.monto} Monedas</div>
                {p.descuento && (
                  <div style={{ fontSize: "0.85rem", color: "#00b7ff" }}>{p.descuento}</div>
                )}
              </div>
              <button
                onClick={() => comprar(p.monto)}
                style={{
                  backgroundColor: "#00b7ff",
                  border: "none",
                  borderRadius: 6,
                  color: "white",
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                USD {p.precioUSD.toFixed(2)}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}